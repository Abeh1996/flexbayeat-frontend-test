// src/features/Vendor/services/menuFetchEngine.ts
import { api } from '@/lib/api'; // Corrected import path
import { API_ROUTES } from "@/lib/endpoints";
import {
  MenuCategory,
  MenuItem,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
} from "../types/menu.types";

const itemToFormData = (
  payload: CreateMenuItemPayload | UpdateMenuItemPayload,
): FormData => {
  const form = new FormData();
  if ("menuCategoryId" in payload && payload.menuCategoryId)
    form.append("menuCategoryId", payload.menuCategoryId);
  if (payload.name) form.append("name", payload.name);
  if (payload.description) form.append("description", payload.description);
  if (payload.price !== undefined) form.append("price", String(payload.price));
  if (payload.stockCount !== undefined)
    form.append("stockCount", String(payload.stockCount));
  if (payload.preparationTimeMin !== undefined)
    form.append("preparationTimeMin", String(payload.preparationTimeMin));

  // Fix #1 — only send boolean flags when true, omit when false.
  // Sending String(false) = "false" which NestJS treats as truthy.
  if (payload.isSpicy === true) form.append("isSpicy", "true");
  if (payload.isVegetarian === true) form.append("isVegetarian", "true");
  // Booleans must be sent as strings.
  if (payload.isSpicy !== undefined) form.append('isSpicy', String(payload.isSpicy));
  if (payload.isVegetarian !== undefined) form.append('isVegetarian', String(payload.isVegetarian));

  if (payload.sortOrder !== undefined)
    form.append("sortOrder", String(payload.sortOrder));
  if ("status" in payload && payload.status)
    form.append("status", payload.status);
  if (payload.image) form.append("image", payload.image);

  return form;
};

export const menuFetchEngine = {
  // ── Categories ──────────────────────────────────────────────────────────

  getCategories: async (): Promise<MenuCategory[]> => {
    const res = await api.get<MenuCategory[]>(API_ROUTES.vendor.categories);
    return res.data;
  },

  createCategory: async (
    payload: CreateCategoryPayload,
  ): Promise<MenuCategory> => {
    const res = await api.post<MenuCategory>(
      API_ROUTES.vendor.categories,
      payload,
    );
    return res.data;
  },

  updateCategory: async (
    id: string,
    payload: UpdateCategoryPayload,
  ): Promise<MenuCategory> => {
    const res = await api.patch<MenuCategory>(
      API_ROUTES.vendor.category(id),
      payload,
    );
    return res.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(API_ROUTES.vendor.category(id));
  },

  // ── Items ────────────────────────────────────────────────────────────────
  // GET /vendor/item doesn't exist — items come nested in categories response.
  // Fix #2 — filter out soft-deleted items client-side (deletedAt !== null).

  createItem: async (payload: CreateMenuItemPayload): Promise<MenuItem> => {
    const res = await api.post<MenuItem>(
      API_ROUTES.vendor.items,
      itemToFormData(payload),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return res.data;
  },

  updateItem: async (
    id: string,
    payload: UpdateMenuItemPayload,
  ): Promise<MenuItem> => {
    const res = await api.patch<MenuItem>(
      API_ROUTES.vendor.item(id),
      itemToFormData(payload),
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      },
    );
    return res.data;
  },

  deleteItem: async (id: string): Promise<void> => {
    await api.delete(API_ROUTES.vendor.item(id));
  },
};
