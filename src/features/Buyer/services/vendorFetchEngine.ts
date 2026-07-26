// src/features/Buyer/services/vendorFetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import { Vendor, MenuCategory, MenuItem } from '../types/vendor.types';

const dev = process.env.NODE_ENV === 'development';

// Backend response envelope for GET /product/vendor/:id/menu as of the
// 2026-07-17 redeploy. Was previously a bare MenuCategory[] — if this
// shape changes again, this is the only interface that needs updating.
interface VendorMenuResponse {
  categoryCount: number;
  mealCount: number;
  categories: MenuCategory[];
}

function checkMenuShape(categories: MenuCategory[]) {
  if (!dev) return;
  if (!Array.isArray(categories)) {
    console.warn('[VendorMenu] Expected categories to be an array, got:', categories);
    return;
  }
  categories.forEach((cat) => {
    cat.menuItems?.forEach((item: MenuItem) => {
      if (item.variants && item.variants.length > 0) {
        console.warn(
          '[VendorMenu] Non-empty variants encountered — confirm shape before relying on it:',
          item.variants
        );
      }
    });
  });
}

export const vendorFetchEngine = {
  getAllVendors: async (): Promise<Vendor[]> => {
    const res = await api.get<Vendor[]>(API_ROUTES.product.vendors);
    return res.data;
  },

  getVendorMenu: async (vendorId: string): Promise<MenuCategory[]> => {
    const res = await api.get<VendorMenuResponse>(API_ROUTES.product.vendorMenu(vendorId));
    const categories = res.data?.categories ?? [];
    checkMenuShape(categories);
    return categories;
  },
};