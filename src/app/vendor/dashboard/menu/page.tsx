"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  UtensilsCrossed,
  Flame,
  Leaf,
  Menu, // Added for hamburger menu
  X, // Added for close button
  ChevronDown
} from "lucide-react";
import { useCategoriesQuery } from "@/features/vendor/hooks/useMenuQuery";
import { useCategoryMutation, useItemMutation } from "@/features/vendor/hooks/useMenuMutation";
import { CategoryModal } from "@/features/vendor/components/CategoryModal";
import { ItemDrawer } from "@/features/vendor/components/ItemDrawer";
import { MenuCategory, MenuItem, CreateCategoryPayload, CreateMenuItemPayload, MenuItemStatus } from "@/features/vendor/types/menu.types";

const statusConfig = {
  AVAILABLE: { label: 'Available', color: 'bg-green-100 text-green-700' },
  OUT_OF_STOCK: { label: 'Sold Out', color: 'bg-red-100 text-red-700' },
  HIDDEN: { label: 'Hidden', color: 'bg-stone-100 text-stone-500' },
};

const MenuItemCard = ({ item, onEdit, onStatusChange, isUpdating }: { item: MenuItem, onEdit:()=>void, onStatusChange:(s:MenuItemStatus)=>void, isUpdating: boolean }) => (
  <div className="bg-white rounded-xl shadow-sm border border-stone-200/80 group">
    <div className="relative h-40">
      <Image src={item.imageUrl || '/public/images/meals/pepper-burger.png'} alt={item.name} layout="fill" objectFit="cover" className="rounded-t-xl" />
      <div className="absolute top-2 right-2">
        <StatusToggle currentStatus={item.status} onChange={onStatusChange} isLoading={isUpdating} />
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-bold text-stone-800 truncate">{item.name}</h3>
      <p className="text-xs text-stone-500 h-8 line-clamp-2 mt-1">{item.description}</p>
      <div className="flex justify-between items-center mt-4">
        <p className="font-extrabold text-lg text-stone-800">{Number(item.price).toLocaleString()} XAF</p>
        <button onClick={onEdit} className="bg-stone-100 group-hover:bg-amber-100 text-stone-600 group-hover:text-amber-700 p-2 rounded-lg transition-all">
          <Pencil size={16} />
        </button>
      </div>
    </div>
  </div>
);

const StatusToggle = ({ currentStatus, onChange, isLoading }: { currentStatus: MenuItemStatus, onChange: (s:MenuItemStatus)=>void, isLoading: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const statuses: MenuItemStatus[] = ['AVAILABLE', 'OUT_OF_STOCK', 'HIDDEN'];
  const currentConf = statusConfig[currentStatus];

  if (isLoading) return <div className="p-2 bg-white/80 rounded-full shadow-md"><Loader2 className="animate-spin text-stone-500" size={16}/></div>

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className={`flex items-center gap-2 text-xs font-bold py-1.5 px-3 rounded-full shadow-md transition-all ${currentConf.color} bg-white/80 backdrop-blur-sm`}>
        {currentConf.label} <ChevronDown size={14} className={`${isOpen ? 'rotate-180' : ''} transition-transform`} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-stone-200/80 p-1 z-10">
          {statuses.map(status => (
            <button
              key={status}
              onClick={() => { onChange(status); setIsOpen(false); }}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-stone-100 ${status === currentStatus ? 'font-bold text-amber-600' : 'text-stone-700'}`}
            >
              {statusConfig[status].label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function VendorMenuPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategoryId = searchParams.get("category");

  const { categories, allItems, isLoadingCategories, isErrorCategories } = useCategoriesQuery();
  const { createCategory, isCreatingCategory, updateCategory, isUpdatingCategory, deleteCategory, isDeletingCategory } = useCategoryMutation();
  const { createItem, isCreatingItem, updateItem, isUpdatingItem, updateItemStatus, isUpdatingStatus, updatingStatusId, deleteItem, isDeletingItem } = useItemMutation();

  const [categoryModal, setCategoryModal] = useState<{ open: boolean, editing: MenuCategory | null }>({ open: false, editing: null });
  const [itemDrawer, setItemDrawer] = useState<{ open: boolean, editing: MenuItem | null }>({ open: false, editing: null });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false); // New state for mobile sidebar

  useEffect(() => {
    if (categories.length > 0 && !activeCategoryId) {
      router.replace(`?category=${categories[0].id}`);
    }
  }, [categories, activeCategoryId, router]);

  const activeCategory = categories.find(c => c.id === activeCategoryId) ?? categories[0] ?? null;
  const activeItems = allItems.filter(item => item.menuCategoryId === activeCategory?.id);

  const handleUpdateItemStatus = (itemId: string, status: MenuItemStatus) => {
    updateItemStatus({ id: itemId, payload: { status }});
  }

  if (isLoadingCategories) return <div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={32}/></div>;
  if (isErrorCategories) return <div className="p-8"><p className="text-red-500">Failed to load menu data.</p></div>;

  return (
    <div className="flex flex-col sm:flex-row h-full bg-stone-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden p-4 bg-white border-b border-stone-200/80 flex justify-between items-center">
        <h2 className="text-lg font-bold text-stone-800">{activeCategory?.name || 'Menu'}</h2>
        <button onClick={() => setMobileSidebarOpen(true)} className="flex items-center gap-2 bg-amber-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-all shadow-sm">
          <Menu size={18}/> Show Categories
        </button>
      </div>

      {/* Left Pane: Categories */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-white border-r border-stone-200/80 flex flex-col p-4 z-40 transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex justify-between items-center lg:hidden mb-4">
          <h2 className="text-lg font-bold text-stone-800 px-2">Categories</h2>
          <button onClick={() => setMobileSidebarOpen(false)} className="p-2 rounded-lg hover:bg-stone-100">
            <X size={20}/>
          </button>
        </div>
        <h2 className="hidden lg:block text-lg font-bold text-stone-800 px-2">Categories</h2> {/* Show on desktop */}
        <div className="mt-4 flex-grow space-y-1 overflow-y-auto">
          {categories.map(cat => (
            <button key={cat.id} onClick={() => {router.push(`?category=${cat.id}`); setMobileSidebarOpen(false);}}
              className={`w-full flex justify-between items-center px-3 py-2.5 text-sm font-semibold rounded-lg transition-colors text-left ${activeCategory?.id === cat.id ? 'bg-amber-100 text-amber-700' : 'text-stone-600 hover:bg-stone-100'}`}>
              <span>{cat.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${activeCategory?.id === cat.id ? 'bg-amber-200' : 'bg-stone-200'}`}>
                {allItems.filter(i => i.menuCategoryId === cat.id).length}
              </span>
            </button>
          ))}
        </div>
        <button onClick={() => setCategoryModal({ open: true, editing: null })} className="w-full mt-4 flex items-center justify-center gap-2 bg-stone-800 text-white font-bold py-3 rounded-lg hover:bg-stone-900 transition-all">
          <Plus size={16}/> New Category
        </button>
      </aside>

      {/* Backdrop for mobile sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setMobileSidebarOpen(false)}></div>
      )}

      {/* Right Pane: Menu Items */}
      <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
        <header className="hidden lg:flex justify-between items-center mb-8"> {/* Hide on mobile, show on desktop */}
            <div>
                <h1 className="text-3xl font-bold text-stone-800">{activeCategory?.name || 'Menu'}</h1>
                <p className="text-stone-500 mt-1">{activeCategory?.description || 'Manage your items and categories.'}</p>
            </div>
            <button onClick={() => setItemDrawer({ open: true, editing: null })} className="flex items-center gap-2 bg-amber-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-amber-600 transition-all shadow-sm">
                <Plus size={18}/> Add Item
            </button>
        </header>

        {activeItems.length === 0 ? (
          <div className="text-center py-20 lg:py-32 rounded-xl bg-white border-2 border-dashed border-stone-200">
            <UtensilsCrossed size={32} className="mx-auto text-stone-300"/>
            <h3 className="mt-4 text-lg font-semibold text-stone-700">No items in this category</h3>
            <p className="mt-1 text-sm text-stone-500">Click "Add Item" to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {activeItems.map(item => (
              <MenuItemCard 
                key={item.id} 
                item={item} 
                onEdit={() => setItemDrawer({ open: true, editing: item })}
                onStatusChange={(status) => handleUpdateItemStatus(item.id, status)}
                isUpdating={isUpdatingStatus && updatingStatusId === item.id}
              />
            ))}
          </div>
        )}
      </main>
      
      <CategoryModal isOpen={categoryModal.open} onClose={() => setCategoryModal({ open: false, editing: null })}
        onSubmit={categoryModal.editing ? (p) => updateCategory({id: categoryModal.editing!.id, payload: p}) : createCategory}
        isLoading={isCreatingCategory || isUpdatingCategory}
        editingCategory={categoryModal.editing}
      />
      <ItemDrawer isOpen={itemDrawer.open} onClose={() => setItemDrawer({ open: false, editing: null })}
        onSubmit={itemDrawer.editing ? (p) => updateItem({id: itemDrawer.editing!.id, payload: p}) : createItem}
        isLoading={isCreatingItem || isUpdatingItem}
        categories={categories}
        editingItem={itemDrawer.editing}
        defaultCategoryId={activeCategory?.id ?? undefined}
      />
    </div>
  );
}

export default function VendorMenuPage() {
  return (
    <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Loader2 className="animate-spin text-amber-500" size={32}/></div>}>
      <VendorMenuPageInner />
    </Suspense>
  );
}
