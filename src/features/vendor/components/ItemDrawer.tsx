// src/features/Vendor/components/ItemDrawer.tsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  X,
  Loader2,
  ImageIcon,
  Flame,
  Leaf,
  Clock,
  Package,
} from "lucide-react";
import {
  MenuCategory,
  MenuItem,
  CreateMenuItemPayload,
  MenuItemStatus,
} from "../types/menu.types";

const STATUS_OPTIONS: { value: MenuItemStatus; label: string }[] = [
  { value: "AVAILABLE", label: "Available" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "HIDDEN", label: "Hidden" },
];

const schema = z.object({
  menuCategoryId: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Item name is required"),
  description: z.string().optional(),
  //price: z.preprocess(
    //(val) => Number(val),
   // z.number({ invalid_type_error: "Price is required" }).min(0),
  price: z.preprocess(
  (val) => Number(val),
  z.number().min(0, "Price must be at least 0"),
  ),
  stockCount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional(),
  ),
  preparationTimeMin: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().optional(),
  ),
  isSpicy: z.boolean().default(false),
  isVegetarian: z.boolean().default(false),
  status: z.enum(["AVAILABLE", "OUT_OF_STOCK", "HIDDEN"]).default("AVAILABLE"),
  image: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof schema>;

const inputCls = (err?: boolean) =>
  `w-full px-4 py-3 bg-white border rounded-md text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors ${
    err
      ? "border-red-400 focus:border-red-400"
      : "border-zinc-200 focus:border-amber-500"
  }`;
const labelCls =
  "block text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1.5";
const errorCls = "text-xs text-red-500 font-medium mt-1";

interface ItemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateMenuItemPayload) => void;
  isLoading: boolean;
  categories: MenuCategory[];
  editingItem?: MenuItem | null;
  defaultCategoryId?: string;
}

export function ItemDrawer({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  categories,
  editingItem,
  defaultCategoryId,
}: ItemDrawerProps) {
  const isEditing = !!editingItem;
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      isSpicy: false,
      isVegetarian: false,
      status: "AVAILABLE",
    },
  });

  const isSpicy = watch("isSpicy");
  const isVegetarian = watch("isVegetarian");

  useEffect(() => {
    if (editingItem) {
      reset({
        menuCategoryId: editingItem.menuCategoryId,
        name: editingItem.name,
        description: editingItem.description ?? "",
        price: editingItem.price,
        stockCount: editingItem.stockCount ?? undefined,
        preparationTimeMin: editingItem.preparationTimeMin ?? undefined,
        isSpicy: editingItem.isSpicy,
        isVegetarian: editingItem.isVegetarian,
        status: editingItem.status,
      });
      setImagePreview(editingItem.imageUrl ?? null);
    } else {
      reset({
        menuCategoryId: defaultCategoryId ?? "",
        name: "",
        description: "",
        price: undefined,
        isSpicy: false,
        isVegetarian: false,
        status: "AVAILABLE",
      });
      setImagePreview(null);
    }
  }, [editingItem, defaultCategoryId, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("image", file, { shouldValidate: true });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      menuCategoryId: values.menuCategoryId,
      name: values.name,
      description: values.description,
      price: values.price, // Now a number
      stockCount: values.stockCount, // Now a number or undefined
      preparationTimeMin: values.preparationTimeMin, // Now a number or undefined
      isSpicy: values.isSpicy,
      isVegetarian: values.isVegetarian,
      ...(isEditing && { status: values.status }), // Conditionally add status only when editing
      sortOrder: undefined,
      image: values.image,
    });

    console.log("image we sending", values.image);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 bottom-0 z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 shrink-0">
          <h2 className="text-sm font-black uppercase tracking-tight text-zinc-900">
            {isEditing ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="item-form"
            onSubmit={handleSubmit(handleFormSubmit)}
            className="space-y-5"
          >
            {/* Image upload */}
            <div>
              <label className={labelCls}>Photo</label>
              <div
                onClick={() => imageInputRef.current?.click()}
                className="relative border-2 border-dashed border-zinc-200 hover:border-amber-400 rounded-xl overflow-hidden cursor-pointer transition-colors bg-zinc-50 aspect-video flex items-center justify-center"
              >
                {imagePreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-zinc-400 py-8">
                    <ImageIcon size={28} />
                    <p className="text-xs font-semibold">
                      Click to upload photo
                    </p>
                    <p className="text-xs text-zinc-300">PNG, JPG, WEBP</p>
                  </div>
                )}
                {imagePreview && (
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold bg-black/50 px-3 py-1.5 rounded-lg">
                      Change photo
                    </span>
                  </div>
                )}
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>

            {/* Category */}
            <div>
              <label className={labelCls}>
                Category <span className="text-red-400">*</span>
              </label>
              <select
                {...register("menuCategoryId")}
                className={inputCls(!!errors.menuCategoryId)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.menuCategoryId && (
                <p className={errorCls}>{errors.menuCategoryId.message}</p>
              )}
            </div>

            {/* Name */}
            <div>
              <label className={labelCls}>
                Item Name <span className="text-red-400">*</span>
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Grilled Chicken Sandwich"
                className={inputCls(!!errors.name)}
              />
              {errors.name && <p className={errorCls}>{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>
                Description{" "}
                <span className="normal-case tracking-normal font-normal text-zinc-400">
                  (optional)
                </span>
              </label>
              <textarea
                {...register("description")}
                rows={2}
                placeholder="Ingredients, preparation notes, what makes it special…"
                className={`${inputCls()} resize-none`}
              />
            </div>

            {/* Price + Prep time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>
                  Price (XAF) <span className="text-red-400">*</span>
                </label>
                <input
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0"
                  className={inputCls(!!errors.price)}
                />
                {errors.price && (
                  <p className={errorCls}>{errors.price.message}</p>
                )}
              </div>
              <div>
                <label className={labelCls}>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    Prep Time (min)
                  </span>
                </label>
                <input
                  {...register("preparationTimeMin", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  placeholder="e.g. 15"
                  className={inputCls()}
                />
              </div>
            </div>

            {/* Stock + Status */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>
                  <span className="flex items-center gap-1">
                    <Package size={11} />
                    Stock Count
                  </span>
                </label>
                <input
                  {...register("stockCount", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  placeholder="e.g. 50"
                  className={inputCls()}
                />
              </div>
              {isEditing && (
                <div>
                  <label className={labelCls}>Status</label>
                  <select {...register("status")} className={inputCls()}>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Dietary flags */}
            <div>
              <label className={labelCls}>Dietary Tags</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setValue("isSpicy", !isSpicy)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-colors ${
                    isSpicy
                      ? "border-red-400 bg-red-50 text-red-600"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  <Flame size={14} />
                  Spicy
                </button>
                <button
                  type="button"
                  onClick={() => setValue("isVegetarian", !isVegetarian)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 text-sm font-semibold transition-colors ${
                    isVegetarian
                      ? "border-emerald-400 bg-emerald-50 text-emerald-600"
                      : "border-zinc-200 text-zinc-500 hover:border-zinc-300"
                  }`}
                >
                  <Leaf size={14} />
                  Vegetarian
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer — sticky submit */}
        <div className="px-6 py-4 border-t border-zinc-100 shrink-0 bg-white">
          <button
            type="submit"
            form="item-form"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-colors"
          >
            {isLoading && <Loader2 size={15} className="animate-spin" />}
            {isEditing ? "Save Changes" : "Add to Menu"}
          </button>
        </div>
      </div>
    </>
  );
}
