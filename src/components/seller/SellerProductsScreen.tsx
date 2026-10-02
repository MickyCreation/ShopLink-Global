import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { productRepository } from '../../services/mock/MockServices';
import { GROCERIES_IMAGE, FRESH_FOOD_IMAGE } from '../../services/mock/mockData';
import {
  Plus,
  Trash2,
  Edit2,
  Package,
  CheckCircle2,
  XCircle,
  X,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '../../types';

export const SellerProductsScreen: React.FC = () => {
  const { products, refreshProducts, showSnackbar } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [unit, setUnit] = useState('Bag');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(GROCERIES_IMAGE);

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Groceries');
    setPrice('');
    setStockQuantity('50');
    setUnit('Bag / Pack');
    setDescription('');
    setImageUrl(GROCERIES_IMAGE);
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(String(p.price));
    setStockQuantity(String(p.stockQuantity));
    setUnit(p.unit);
    setDescription(p.description);
    setImageUrl(p.imageUrl);
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      showSnackbar('Name and price are required');
      return;
    }

    try {
      if (editingProduct) {
        await productRepository.updateProduct(editingProduct.id, {
          name: name.trim(),
          category,
          price: Number(price),
          stockQuantity: Number(stockQuantity) || 1,
          unit,
          description: description.trim(),
          imageUrl
        });
        showSnackbar('Product updated successfully');
      } else {
        await productRepository.addProduct({
          name: name.trim(),
          category,
          price: Number(price),
          stockQuantity: Number(stockQuantity) || 1,
          unit,
          description: description.trim() || 'Quality Nigerian grocery item.',
          imageUrl,
          sellerId: 'user_seller_01',
          sellerName: 'Basirat Super Provisions',
          sellerRating: 4.8,
          sellerLocation: 'Allen Avenue, Ikeja',
          isAvailable: true
        });
        showSnackbar('New product listed on ShopLink!');
      }

      await refreshProducts();
      setIsAddModalOpen(false);
    } catch {
      showSnackbar('Error saving product');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this product from your inventory?')) {
      await productRepository.deleteProduct(id);
      await refreshProducts();
      showSnackbar('Product removed from catalog');
    }
  };

  const handleToggleStock = async (p: Product) => {
    await productRepository.toggleProductStock(p.id, !p.isAvailable);
    await refreshProducts();
    showSnackbar(`${p.name} stock availability toggled`);
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Store Products Inventory" showLocation={false} />

      <div className="px-4 py-3 space-y-4">
        {/* Header Action */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Catalog Items ({products.length})
          </span>
          <button
            onClick={handleOpenAdd}
            className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" /> Add Product
          </button>
        </div>

        {/* Product Items List */}
        <div className="space-y-3">
          {products.map(p => (
            <div
              key={p.id}
              className="p-3.5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between gap-3"
            >
              <img
                src={p.imageUrl}
                alt={p.name}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-2xl object-cover bg-slate-100 dark:bg-slate-700 shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {p.name}
                  </h4>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    p.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {p.isAvailable ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {p.category} · {p.unit} · {p.stockQuantity} in stock
                </p>
                <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
                  <NigerianCurrency amount={p.price} />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggleStock(p)}
                  className={`p-2 rounded-xl text-xs transition ${
                    p.isAvailable ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'
                  }`}
                  title="Toggle active status"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  title="Edit details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 transition"
                  title="Delete product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {editingProduct ? 'Edit Product' : 'Add New Nigerian Product'}
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Mama Gold Superior Rice 25kg"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Groceries">Groceries</option>
                    <option value="Food & Staples">Food & Staples</option>
                    <option value="Fresh Market">Fresh Market</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Household">Household</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unit Specification
                  </label>
                  <input
                    type="text"
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    placeholder="e.g. 50kg bag, 2L"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Price in Naira (₦)
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="e.g. 25000"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={e => setStockQuantity(e.target.value)}
                    placeholder="e.g. 40"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Description
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Details about quality, source, storage..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Photo preview select */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Photo Asset
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageUrl(GROCERIES_IMAGE)}
                    className={`flex-1 p-2 rounded-xl border text-center text-[10px] font-semibold ${
                      imageUrl === GROCERIES_IMAGE ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200'
                    }`}
                  >
                    Packaged Staples
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUrl(FRESH_FOOD_IMAGE)}
                    className={`flex-1 p-2 rounded-xl border text-center text-[10px] font-semibold ${
                      imageUrl === FRESH_FOOD_IMAGE ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200'
                    }`}
                  >
                    Fresh Produce
                  </button>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
