// src/features/Addresses/services/fetchEngine.ts
import { api } from '@/lib/api';
import { API_ROUTES } from '@/lib/endpoints';
import { Address, AddressPayload } from '../types';

export const addressFetchEngine = {
  getAll: async (): Promise<Address[]> => {
    const res = await api.get<Address[]>(API_ROUTES.addresses.getAll);
    return res.data;
  },

  getOne: async (id: string): Promise<Address> => {
    const res = await api.get<Address>(API_ROUTES.addresses.getOne(id));
    return res.data;
  },

  create: async (payload: AddressPayload): Promise<Address> => {
    const res = await api.post<Address>(API_ROUTES.addresses.create, payload);
    return res.data;
  },

  update: async (id: string, payload: Partial<AddressPayload>): Promise<Address> => {
    const res = await api.patch<Address>(API_ROUTES.addresses.update(id), payload);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(API_ROUTES.addresses.delete(id));
  },
};