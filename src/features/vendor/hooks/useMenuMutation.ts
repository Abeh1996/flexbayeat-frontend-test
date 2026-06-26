// src/features/Vendor/hooks/useMenuMutation.ts
'use client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { menuFetchEngine } from '../services/menuFetchEngine';
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
} from '../types/menu.types';

const dev = process.env.NODE_ENV === 'development';

export function useCategoryMutation() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['vendor-categories'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateCategoryPayload) => menuFetchEngine.createCategory(payload),
    onSuccess: () => {
      toast.success('Category created', { duration: 3000 });
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[createCategory]', error);
      toast.error('Failed to create category', { description: error.message, duration: 5000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCategoryPayload }) =>
      menuFetchEngine.updateCategory(id, payload),
    onSuccess: () => {
      toast.success('Category updated', { duration: 3000 });
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[updateCategory]', error);
      toast.error('Failed to update category', { description: error.message, duration: 5000 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuFetchEngine.deleteCategory(id),
    onSuccess: () => {
      toast.success('Category deleted', { duration: 3000 });
      invalidate();
    },
    onError: (error: Error) => {
      if (dev) console.error('[deleteCategory]', error);
      toast.error('Failed to delete category', { description: error.message, duration: 5000 });
    },
  });

  return {
    createCategory: createMutation.mutate,
    createCategoryAsync: createMutation.mutateAsync,
    isCreatingCategory: createMutation.isPending,

    updateCategory: updateMutation.mutate,
    isUpdatingCategory: updateMutation.isPending,

    deleteCategory: deleteMutation.mutate,
    isDeletingCategory: deleteMutation.isPending,
  };
}

export function useItemMutation() {
  const queryClient = useQueryClient();

  // Fix #4 — await refetch directly instead of invalidate to avoid stale cache race
  const refetchCategories = () =>
    queryClient.refetchQueries({ queryKey: ['vendor-categories'] });

  const createMutation = useMutation({
    mutationFn: (payload: CreateMenuItemPayload) => menuFetchEngine.createItem(payload),
    onSuccess: async () => {
      toast.success('Item added to menu', { duration: 3000 });
      await refetchCategories();
    },
    onError: (error: Error) => {
      if (dev) console.error('[createItem]', error);
      toast.error('Failed to add item', { description: error.message, duration: 5000 });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMenuItemPayload }) =>
      menuFetchEngine.updateItem(id, payload),
    onSuccess: async () => {
      toast.success('Item updated', { duration: 3000 });
      await refetchCategories();
    },
    onError: (error: Error) => {
      if (dev) console.error('[updateItem]', error);
      toast.error('Failed to update item', { description: error.message, duration: 5000 });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => menuFetchEngine.deleteItem(id),
    onSuccess: async () => {
      toast.success('Item removed', { duration: 3000 });
      await refetchCategories();
    },
    onError: (error: Error) => {
      if (dev) console.error('[deleteItem]', error);
      toast.error('Failed to remove item', { description: error.message, duration: 5000 });
    },
  });

  return {
    createItem: createMutation.mutate,
    createItemAsync: createMutation.mutateAsync,
    isCreatingItem: createMutation.isPending,

    updateItem: updateMutation.mutate,
    isUpdatingItem: updateMutation.isPending,

    deleteItem: deleteMutation.mutate,
    isDeletingItem: deleteMutation.isPending,
  };
}