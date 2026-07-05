// src/app/vendor/(dashboard)/dashboard/menu/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  UtensilsCrossed,
  Flame,
  Leaf,
  Clock,
  Package,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react";
import { useCategoriesQuery } from "@/features/vendor/hooks/useMenuQuery";
import {
  useCategoryMutation,
  useItemMutation,
} from "@/features/vendor/hooks/useMenuMutation";
import { CategoryModal } from "@/features/vendor/components/CategoryModal";
import { ItemDrawer } from "@/features/vendor/components/ItemDrawer";
import {
  MenuCategory,
  MenuItem,
  CreateCategoryPayload,
  CreateMenuItemPayload,
  MenuItemStatus,
} from "@/features/vendor/types/menu.types";

// ── Status badge ─────────────────────────────────────────────────────────────
const STATUS_STYLES: Record<MenuItemStatus, string> = {
  AVAILABLE: "bg-emerald-100 text-emerald-700",
  OUT_OF_STOCK: "bg-red-100 text-red-600",
  HIDDEN: "bg-zinc-100 text-zinc-500",
};

function StatusBadge({ status }: { status: MenuItemStatus }) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}
    >
      {status === "OUT_OF_STOCK"
        ? "Out of Stock"
        : status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

// ── Item card ─────────────────────────────────────────────────────────────────
function ItemCard({
  item,
  onEdit,
  onDelete,
  isDeleting,
}: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}) {
  // console.log("Menu item")
  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-amber-200 transition-all duration-200 flex overflow-hidden">
      {/* Image */}
      <div className="w-28 sm:w-36 shrink-0 bg-zinc-100 relative">
        {item.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed size={22} className="text-zinc-300" />
          </div>
        )}
        {/* Dietary badges on image */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {item.isSpicy && (
            <span className="bg-red-500 rounded-full p-1">
              <Flame size={9} className="text-white" />
            </span>
          )}
          {item.isVegetarian && (
            <span className="bg-emerald-500 rounded-full p-1">
              <Leaf size={9} className="text-white" />
            </span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 p-4 flex flex-col justify-between gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-zinc-900 truncate">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            )}
          </div>
          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              title="Edit item"
            >
              <Pencil size={13} />
            </button>
            <button
              onClick={() => onDelete(item.id)}
              disabled={isDeleting}
              className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
              title="Delete item"
            >
              {isDeleting ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
            </button>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-base font-black text-zinc-900">
            {Number(item.price).toLocaleString()} XAF
          </span>
          <div className="flex items-center gap-2">
            {item.preparationTimeMin && (
              <span className="flex items-center gap-1 text-xs text-zinc-400">
                <Clock size={11} />
                {item.preparationTimeMin}min
              </span>
            )}
            {item.stockCount !== null && item.stockCount !== undefined && (
              <span className="flex items-center gap-1 text-xs text-zinc-400">
                <Package size={11} />
                {item.stockCount}
              </span>
            )}
            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
function VendorMenuPageInner() {
  const { categories, allItems, isLoadingCategories, isErrorCategories } =
    useCategoriesQuery();

  const {
    createCategory,
    isCreatingCategory,
    updateCategory,
    isUpdatingCategory,
    deleteCategory,
    isDeletingCategory,
  } = useCategoryMutation();
  const {
    createItem,
    isCreatingItem,
    updateItem,
    isUpdatingItem,
    deleteItem,
    isDeletingItem,
  } = useItemMutation();

  console.log("Categories", categories);
  console.log("All items", allItems);

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams.get("category");
  const [categoryModal, setCategoryModal] = useState<{
    open: boolean;
    editing: MenuCategory | null;
  }>({
    open: false,
    editing: null,
  });
  const [itemDrawer, setItemDrawer] = useState<{
    open: boolean;
    editing: MenuItem | null;
  }>({
    open: false,
    editing: null,
  });
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null,
  );
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Set first category in URL if none selected
  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("category", categories[0].id);
      router.replace(`?${params.toString()}`);
    }
  }, [categories, activeCategoryId]);

  const activeCategory =
    categories.find((c) => c.id === activeCategoryId) ?? null;
  const activeItems = allItems.filter(
    (item) => item.menuCategoryId === activeCategoryId,
  );
  

  const handleCreateCategory = (payload: CreateCategoryPayload) => {
    createCategory(payload, {
      onSuccess: () => setCategoryModal({ open: false, editing: null }),
    });
  };

  const handleUpdateCategory = (payload: CreateCategoryPayload) => {
    if (!categoryModal.editing) return;
    updateCategory(
      { id: categoryModal.editing.id, payload },
      { onSuccess: () => setCategoryModal({ open: false, editing: null }) },
    );
  };

  const handleDeleteCategory = (id: string) => {
    setDeletingCategoryId(id);
    deleteCategory(id, { onSettled: () => setDeletingCategoryId(null) });
  };

  const handleCreateItem = (payload: CreateMenuItemPayload) => {
    createItem(payload, {
      onSuccess: () => setItemDrawer({ open: false, editing: null }),
    });
  };

  const handleUpdateItem = (payload: CreateMenuItemPayload) => {
    if (!itemDrawer.editing) return;
    updateItem(
      { id: itemDrawer.editing.id, payload },
      { onSuccess: () => setItemDrawer({ open: false, editing: null }) },
    );
  };

  const handleDeleteItem = (id: string) => {
    setDeletingItemId(id);
    deleteItem(id, { onSettled: () => setDeletingItemId(null) });
  };

  // ── Loading ────────────────────────────────────────────────────────────────
  if (isLoadingCategories) {
    return (
      <div className="p-6 lg:p-10 space-y-4">
        <div className="h-8 w-48 bg-zinc-100 rounded-lg animate-pulse" />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-10 w-28 bg-zinc-100 rounded-full animate-pulse"
            />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-zinc-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (isErrorCategories) {
    return (
      <div className="p-6 lg:p-10">
        <p className="text-sm text-red-500 font-medium">
          Failed to load menu. Try refreshing.
        </p>
      </div>
    );
  }

  // ── Empty — no categories yet ───────────────────────────────────────────────
  if (categories.length === 0) {
    return (
      <div className="p-6 lg:p-10">
        <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
          <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mb-4">
            <UtensilsCrossed size={26} className="text-amber-500" />
          </div>
          <h3 className="text-base font-black text-zinc-900">
            Your menu is empty
          </h3>
          <p className="text-sm text-zinc-500 mt-1 max-w-xs">
            Start by creating a category like "Main Courses" or "Beverages",
            then add your items.
          </p>
          <button
            onClick={() => setCategoryModal({ open: true, editing: null })}
            className="mt-6 flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-colors"
          >
            <Plus size={15} />
            Create First Category
          </button>
        </div>

        <CategoryModal
          isOpen={categoryModal.open}
          onClose={() => setCategoryModal({ open: false, editing: null })}
          onSubmit={handleCreateCategory}
          isLoading={isCreatingCategory}
          editingCategory={null}
        />
      </div>
    );
  }

  // ── Main menu view ─────────────────────────────────────────────────────────
  return (
    <div className="p-6 lg:p-10 space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black uppercase tracking-tight text-zinc-900">
            Menu
          </h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {categories.length} categor{categories.length === 1 ? "y" : "ies"} ·{" "}
            {allItems.length} item{allItems.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCategoryModal({ open: true, editing: null })}
            className="flex items-center gap-1.5 border border-zinc-200 hover:border-amber-400 text-zinc-600 hover:text-amber-600 text-xs font-bold uppercase tracking-widest px-3 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={13} />
            Category
          </button>
          <button
            onClick={() => setItemDrawer({ open: true, editing: null })}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={13} />
            Add Item
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                params.set("category", cat.id);
                router.push(`?${params.toString()}`);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
                activeCategoryId === cat.id
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white border border-zinc-200 text-zinc-600 hover:border-amber-300 hover:text-amber-600"
              }`}
            >
              {cat.name}
              {!cat.isActive && <EyeOff size={11} className="opacity-60" />}
              <span
                className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                  activeCategoryId === cat.id
                    ? "bg-white/20 text-white"
                    : "bg-zinc-100 text-zinc-500"
                }`}
              >
                {allItems.filter((i) => i.menuCategoryId === cat.id).length}
              </span>
            </button>
          </div>
        ))}
      </div>

      {/* Active category header + actions */}
      {activeCategory && (
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-zinc-900">
                {activeCategory.name}
              </h3>
              {!activeCategory.isActive && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                  Hidden
                </span>
              )}
            </div>
            {activeCategory.description && (
              <p className="text-xs text-zinc-500 mt-0.5">
                {activeCategory.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() =>
                setCategoryModal({ open: true, editing: activeCategory })
              }
              className="p-2 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
              title="Edit category"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => handleDeleteCategory(activeCategory.id)}
              disabled={
                isDeletingCategory && deletingCategoryId === activeCategory.id
              }
              className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
              title="Delete category"
            >
              {isDeletingCategory &&
              deletingCategoryId === activeCategory.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Items grid */}
      {isLoadingCategories ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 bg-zinc-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : activeItems.length === 0 ? (
        <div
          onClick={() => setItemDrawer({ open: true, editing: null })}
          className="flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-colors group"
        >
          <Plus
            size={22}
            className="text-zinc-300 group-hover:text-amber-400 transition-colors mb-2"
          />
          <p className="text-sm font-semibold text-zinc-500 group-hover:text-amber-600 transition-colors">
            No items yet — click to add the first one
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {activeItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={(item) => setItemDrawer({ open: true, editing: item })}
              onDelete={handleDeleteItem}
              isDeleting={isDeletingItem && deletingItemId === item.id}
            />
          ))}
          {/* Add more items */}
          <button
            onClick={() => setItemDrawer({ open: true, editing: null })}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-zinc-200 hover:border-amber-400 text-zinc-400 hover:text-amber-500 rounded-xl py-4 text-sm font-semibold transition-colors"
          >
            <Plus size={15} />
            Add another item
          </button>
        </div>
      )}

      {/* Category modal */}
      <CategoryModal
        isOpen={categoryModal.open}
        onClose={() => setCategoryModal({ open: false, editing: null })}
        onSubmit={
          categoryModal.editing ? handleUpdateCategory : handleCreateCategory
        }
        isLoading={
          categoryModal.editing ? isUpdatingCategory : isCreatingCategory
        }
        editingCategory={categoryModal.editing}
      />

      {/* Item drawer */}
      <ItemDrawer
        isOpen={itemDrawer.open}
        onClose={() => setItemDrawer({ open: false, editing: null })}
        onSubmit={itemDrawer.editing ? handleUpdateItem : handleCreateItem}
        isLoading={itemDrawer.editing ? isUpdatingItem : isCreatingItem}
        categories={categories}
        editingItem={itemDrawer.editing}
        defaultCategoryId={activeCategoryId ?? undefined}
      />
    </div>
  );
}

// useSearchParams requires Suspense boundary in Next.js app router
export default function VendorMenuPage() {
  return (
    <React.Suspense
      fallback={
        <div className="p-6 lg:p-10">
          <div className="h-8 w-48 bg-zinc-100 rounded-lg animate-pulse mb-4" />
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-10 w-28 bg-zinc-100 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>
      }
    >
      <VendorMenuPageInner />
    </React.Suspense>
  );
}
