// src/app/buyer/account/addresses/page.tsx
'use client';
import React, { useState } from 'react';
import { Plus, MapPin, Star, Trash2, Pencil, Loader2, AlertCircle, X } from 'lucide-react';
import { useAddressesQuery } from '@/features/Addresses/hooks/useAddressesQuery';
import { useAddressMutation } from '@/features/Addresses/hooks/useAddressMutation';
import { AddressForm } from '@/features/Addresses/components/AddressForm';
import { Address, AddressPayload } from '@/features/Addresses/types';

type DrawerMode = 'add' | 'edit' | null;

export default function AddressesPage() {
  const { addresses, isLoadingAddresses, isErrorAddresses, refetchAddresses } =
    useAddressesQuery();
  const { createAddress, isCreating, updateAddress, isUpdating, deleteAddress, isDeleting } =
    useAddressMutation();

  const [drawerMode, setDrawerMode] = useState<DrawerMode>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => {
    setEditingAddress(null);
    setDrawerMode('add');
  };

  const openEdit = (address: Address) => {
    setEditingAddress(address);
    setDrawerMode('edit');
  };

  const closeDrawer = () => {
    setDrawerMode(null);
    setEditingAddress(null);
  };

  const handleCreate = (payload: AddressPayload) => {
    createAddress(payload, { onSuccess: closeDrawer });
  };

  const handleUpdate = (payload: AddressPayload) => {
    if (!editingAddress) return;
    updateAddress(
      { id: editingAddress.id, payload },
      { onSuccess: closeDrawer }
    );
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteAddress(id, {
      onSettled: () => setDeletingId(null),
    });
  };

  // ─── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoadingAddresses) {
    return (
      <div className="p-6 lg:p-10 space-y-4">
        <div className="h-6 w-48 bg-zinc-100 animate-pulse" />
        <div className="h-4 w-72 bg-zinc-100 animate-pulse" />
        {[1, 2].map((i) => (
          <div key={i} className="border border-zinc-200 p-5 space-y-3">
            <div className="h-4 w-32 bg-zinc-100 animate-pulse" />
            <div className="h-3 w-56 bg-zinc-100 animate-pulse" />
            <div className="h-3 w-40 bg-zinc-100 animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // ─── Error state ─────────────────────────────────────────────────────────────
  if (isErrorAddresses) {
    return (
      <div className="p-6 lg:p-10">
        <div className="flex items-start gap-3 border border-red-200 bg-red-50 px-5 py-4">
          <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700">Failed to load addresses</p>
            <p className="text-xs text-red-600">
              Something went wrong.{' '}
              <button
                onClick={() => refetchAddresses()}
                className="underline font-semibold"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-4 lg:p-10">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-normal text-zinc-900">
            Saved Addresses
          </h1>
          
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-md tracking-widest px-4 py-2.5 transition-colors duration-150"
        >
          <Plus size={14} />
          <span className="hidden md:inline">Add Address</span>
        </button>
      </div>

      {/* Empty state */}
      {addresses.length === 0 && (
        <div className="border border-dashed border-zinc-200 px-6 py-12 flex flex-col items-center text-center gap-4">
          <div className="w-12 h-12 bg-amber-50 flex items-center justify-center">
            <MapPin size={22} className="text-amber-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-zinc-900">No saved addresses</p>
            <p className="text-xs text-zinc-500 mt-1">
              Add an address to speed up checkout
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs rounded-md tracking-widest px-5 py-2.5 transition-colors"
          >
            <Plus size={13} />
            Add First Address
          </button>
        </div>
      )}

      {/* Address list */}
      {addresses.length > 0 && (
        <div className="space-y-3">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border p-5 transition-colors ${
                address.isDefault ? 'border-amber-300 bg-amber-50' : 'border-zinc-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <MapPin
                    size={15}
                    className={`mt-0.5 shrink-0 ${
                      address.isDefault ? 'text-amber-500' : 'text-zinc-400'
                    }`}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-zinc-900">{address.label}</span>
                      {address.isDefault && (
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">
                          <Star size={9} />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 mt-0.5 leading-snug">
                      {address.addressLine1}
                      {address.addressLine2 ? `, ${address.addressLine2}` : ''}
                    </p>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {address.city}, {address.region}
                    </p>
                    {address.deliveryInstructions && (
                      <p className="text-xs text-zinc-400 mt-1 italic">
                        &ldquo;{address.deliveryInstructions}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEdit(address)}
                    title="Edit address"
                    className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={isDeleting && deletingId === address.id}
                    title="Remove address"
                    className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                  >
                    {isDeleting && deletingId === address.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drawer */}
      {drawerMode && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30"
            onClick={closeDrawer}
          />

          {/* Slide-in panel */}
          <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white flex flex-col shadow-xl">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-200">
              <h2 className="text-sm font-black uppercase tracking-widest text-zinc-900">
                {drawerMode === 'add' ? 'Add New Address' : 'Edit Address'}
              </h2>
              <button
                onClick={closeDrawer}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Drawer body — scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <AddressForm
                onSuccess={drawerMode === 'add' ? handleCreate : handleUpdate}
                isLoading={drawerMode === 'add' ? isCreating : isUpdating}
                submitLabel={drawerMode === 'add' ? 'Save Address' : 'Update Address'}
                defaultValues={
                  editingAddress
                    ? {
                        label: editingAddress.label,
                        addressLine1: editingAddress.addressLine1,
                        addressLine2: editingAddress.addressLine2,
                        city: editingAddress.city,
                        region: editingAddress.region,
                        country: editingAddress.country,
                        latitude: editingAddress.latitude,
                        longitude: editingAddress.longitude,
                        deliveryInstructions: editingAddress.deliveryInstructions,
                        isDefault: editingAddress.isDefault,
                      }
                    : undefined
                }
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}