import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { MOCK_CATEGORIES } from '../../services/mock/mockData';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Plus
} from 'lucide-react';
import { Product } from '../../types';

export const ShopperExploreScreen: React.FC = () => {
  const {
    products,
    setSelectedProductForDetail,
    addToCart,
    selectedCategoryFilter,
    setSelectedCategoryFilter
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating'>('popularity');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const categories = ['All', ...MOCK_CATEGORIES.map(c => c.name)];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategoryFilter === 'All' || p.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
      const matchesQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStock = !inStockOnly || (p.isAvailable && p.stockQuantity > 0);
      return matchesCategory && matchesQuery && matchesStock;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return (b.sellerRating || 0) - (a.sellerRating || 0);
      return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
    });
  }, [products, selectedCategoryFilter, searchQuery, inStockOnly, sortBy]);

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Explore Nigerian Marketplace" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4">
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1 flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3 py-2 shadow-xs">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search gadgets, laptops, vehicles, fashion, services, groceries..."
              className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            onClick={() => setShowFilterDrawer(prev => !prev)}
            className={`p-2.5 rounded-2xl border transition ${
              showFilterDrawer || inStockOnly || sortBy !== 'popularity'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
            }`}
            title="Filter and Sort"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Drawer / Expanded controls */}
        {showFilterDrawer && (
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 text-xs animate-in slide-in-from-top-2 duration-150">
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-200 block mb-1.5">Sort by:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'popularity', label: 'Popular' },
                  { id: 'price_asc', label: 'Price: Low to High' },
                  { id: 'price_desc', label: 'Price: High to Low' },
                  { id: 'rating', label: 'Top Rated Sellers' }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setSortBy(s.id as any)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition ${
                      sortBy === s.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={e => setInStockOnly(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                In Stock Items Only
              </label>

              <button
                onClick={() => {
                  setSortBy('popularity');
                  setInStockOnly(false);
                  setSelectedCategoryFilter('All');
                  setSearchQuery('');
                }}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                Reset All
              </button>
            </div>
          </div>
        )}

        {/* Category Scrollable Tab List */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => {
            const isSelected = selectedCategoryFilter === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Product Count & Active Filters Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-0.5">
          <span>{filteredProducts.length} Nigerian products found</span>
          {selectedCategoryFilter !== 'All' && (
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              In: {selectedCategoryFilter}
            </span>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 pt-1">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between group"
              >
                {/* Image and Badges */}
                <div
                  onClick={() => setSelectedProductForDetail(product)}
                  className="relative w-full h-32 bg-slate-100 dark:bg-slate-700/50 cursor-pointer overflow-hidden"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
                    {product.unit}
                  </div>
                </div>

                {/* Info & Add to Cart button */}
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div
                    onClick={() => setSelectedProductForDetail(product)}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 line-clamp-1">
                      {product.sellerName} · {product.sellerLocation}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                        <NigerianCurrency amount={product.price} />
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] text-slate-400 line-through block">
                          <NigerianCurrency amount={product.originalPrice} />
                        </span>
                      )}
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        addToCart(product, 1);
                      }}
                      className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition active:scale-95 shadow-xs"
                      title="Add to cart"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="py-16 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              No products found
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              We couldn't find any products matching "{searchQuery}". Try searching for iPhones, laptops, Toyota, Agbada, solar systems, or groceries.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('All');
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs transition"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
