import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { shoppingRequestRepository } from '../../services/mock/MockServices';
import {
  Plus,
  Trash2,
  ClipboardList,
  MapPin,
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { ShoppingListItem } from '../../types';

export const ShoppingListCreatorScreen: React.FC = () => {
  const {
    currentUser,
    defaultAddress,
    setIsLocationModalOpen,
    setActiveShoppingRequest,
    navigateTo,
    showSnackbar
  } = useApp();

  const [listTitle, setListTitle] = useState('Weekend Grocery Shopping');
  const [targetMarket, setTargetMarket] = useState('Mile 12 International Market / Ketu');
  const [priority, setPriority] = useState<'NORMAL' | 'HIGH' | 'URGENT'>('NORMAL');

  // Pre-filled realistic Nigerian sample items
  const [items, setItems] = useState<Omit<ShoppingListItem, 'id'>[]>([
    { name: 'Mama Gold Rice', quantity: '10kg bag', preferredBrand: 'Mama Gold or Royal Stallion', estimatedPriceNaira: 14500 },
    { name: 'Brown Honey Beans (Oloyin)', quantity: '5kg', notes: 'Please inspect for cleanliness and no weevils', estimatedPriceNaira: 8500 },
    { name: 'King\'s Vegetable Oil', quantity: '2 Bottles (2L each)', preferredBrand: 'King\'s Pure Oil', estimatedPriceNaira: 7200 },
    { name: 'Fresh Red Peppers (Atarodo)', quantity: '1 Medium Basket', notes: 'Firm red peppers from fresh produce section', estimatedPriceNaira: 12000 },
    { name: 'Crate of Eggs', quantity: '30 pieces', preferredBrand: 'Farm fresh jumbo eggs', estimatedPriceNaira: 4800 }
  ]);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemBrand, setNewItemBrand] = useState('');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedItemsBudget = items.reduce((sum, item) => sum + (item.estimatedPriceNaira || 0), 0);
  const helperFee = Math.round(estimatedItemsBudget * 0.08) + 1500;
  const totalEstimatedCost = estimatedItemsBudget + helperFee;

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemQty.trim()) {
      showSnackbar('Item name and quantity are required');
      return;
    }

    setItems(prev => [
      ...prev,
      {
        name: newItemName.trim(),
        quantity: newItemQty.trim(),
        preferredBrand: newItemBrand.trim() || undefined,
        notes: newItemNotes.trim() || undefined,
        estimatedPriceNaira: newItemPrice ? Number(newItemPrice) : undefined
      }
    ]);

    setNewItemName('');
    setNewItemQty('');
    setNewItemBrand('');
    setNewItemNotes('');
    setNewItemPrice('');
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRequest = async () => {
    if (!currentUser || !defaultAddress) {
      showSnackbar('Please ensure your delivery address is selected');
      return;
    }
    if (items.length === 0) {
      showSnackbar('Please add at least one item to your shopping list');
      return;
    }

    setIsSubmitting(true);
    try {
      const newRequest = await shoppingRequestRepository.createRequest({
        shopperId: currentUser.id,
        shopperName: currentUser.name,
        shopperPhone: currentUser.phone,
        title: listTitle,
        items,
        targetMarketArea: targetMarket,
        deliveryAddressId: defaultAddress.id,
        estimatedBudgetNaira: estimatedItemsBudget,
        priority
      });

      setActiveShoppingRequest(newRequest);
      showSnackbar('Shopping request created! Finding available Helpers.');
      navigateTo('SHOPPER_TRACKING');
    } catch {
      showSnackbar('Failed to create shopping request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Create Shopping List" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-4">
        {/* Banner Explainer */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
              Hire a Nigerian Shopping Helper for Anything
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
              List any items you need from any market or store (Computer Village gadgets, Ladipo auto parts, Balogun fashion, Mile 12 groceries, repair errands). A verified Shopping Helper inspects quality, bargains on your behalf, and delivers to your doorstep.
            </p>
          </div>
        </div>

        {/* List Title & Destination Settings */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3 shadow-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              List Name
            </label>
            <input
              type="text"
              value={listTitle}
              onChange={e => setListTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              placeholder="e.g. Computer Village Gadgets / Ladipo Auto Parts / Foodstuffs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
              Target Market / Shopping Hub
            </label>
            <select
              value={targetMarket}
              onChange={e => setTargetMarket(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Computer Village, Ikeja (Gadgets, Laptops & Tech Repairs)">Computer Village, Ikeja (Gadgets, Laptops, Phones & Tech Repairs)</option>
              <option value="Ladipo Auto Spare Parts Market, Mushin (Vehicles & Parts)">Ladipo Market, Mushin (Vehicles, Auto Spare Parts & Batteries)</option>
              <option value="Balogun / Idumota Market, Lagos Island (Fashion & Fabrics)">Balogun Market, Lagos Island (Fashion, Lace, Shoes & Wears)</option>
              <option value="Alaba International Market, Ojo (Electronics & Appliances)">Alaba International Market, Ojo (Electronics & Appliances)</option>
              <option value="Mile 12 International Market / Ketu (Foodstuffs & Produce)">Mile 12 Market (Fresh food, grains & farm produce)</option>
              <option value="Tejuosho Ultra Modern Market, Surulere">Tejuosho Market, Surulere (Clothing & provisions)</option>
              <option value="Oyingbo Ultra Modern Market, Yaba">Oyingbo Market, Yaba (Seafood, grains & condiments)</option>
              <option value="Ikeja Central Stores & Local Supermarkets">Ikeja Central Stores & GRA</option>
              <option value="Wuse 2 & Wuse Market, Abuja (Gadgets & Fashion)">Wuse Market, Abuja (Gadgets, Fashion & Groceries)</option>
              <option value="Utako Ultra Modern Market, Abuja">Utako Market, Abuja (Produce & Provisions)</option>
            </select>
          </div>

          {/* Delivery Address */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-400 block font-semibold">Delivery To:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{defaultAddress?.title} ({defaultAddress?.area})</span>
              </div>
            </div>
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="text-emerald-600 font-semibold text-xs hover:underline"
            >
              Change
            </button>
          </div>
        </div>

        {/* Current Items Checklist */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              Items on List ({items.length})
            </span>
            <span className="text-xs text-slate-400">
              Est. Budget: <NigerianCurrency amount={estimatedItemsBudget} />
            </span>
          </div>

          <div className="space-y-2">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-start justify-between gap-3 shadow-xs"
              >
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-md border-2 border-emerald-500 flex items-center justify-center text-[10px] font-bold text-emerald-600 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.name} — <span className="text-emerald-600 dark:text-emerald-400 font-medium">{item.quantity}</span>
                    </h4>
                    {item.preferredBrand && (
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Brand: <span className="text-slate-700 dark:text-slate-300 font-medium">{item.preferredBrand}</span>
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-[10px] text-amber-600 dark:text-amber-400 italic mt-0.5">
                        Note: {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {item.estimatedPriceNaira && (
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      <NigerianCurrency amount={item.estimatedPriceNaira} />
                    </span>
                  )}
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition"
                    title="Remove item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Item Form */}
        <form onSubmit={handleAddItem} className="p-3.5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
            Add Another Item
          </span>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={newItemName}
              onChange={e => setNewItemName(e.target.value)}
              placeholder="Item name (e.g. Tomatoes)"
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text"
              value={newItemQty}
              onChange={e => setNewItemQty(e.target.value)}
              placeholder="Quantity (e.g. 1 basket)"
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={newItemBrand}
              onChange={e => setNewItemBrand(e.target.value)}
              placeholder="Preferred Brand (optional)"
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="number"
              value={newItemPrice}
              onChange={e => setNewItemPrice(e.target.value)}
              placeholder="Est. Price (₦)"
              className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <input
            type="text"
            value={newItemNotes}
            onChange={e => setNewItemNotes(e.target.value)}
            placeholder="Special instructions for helper (e.g. check for firmness)"
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            className="w-full py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" /> Add Item to List
          </button>
        </form>

        {/* Cost Estimation Summary */}
        <div className="p-4 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Estimated Shopping Budget</span>
            <NigerianCurrency amount={estimatedItemsBudget} />
          </div>
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1">
              Helper Shopping Fee <Info className="w-3 h-3 text-slate-400" />
            </span>
            <NigerianCurrency amount={helperFee} />
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Total Estimated
            </span>
            <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
              <NigerianCurrency amount={totalEstimatedCost} />
            </span>
          </div>
        </div>

        {/* Submit Request CTA Button */}
        <button
          onClick={handleSubmitRequest}
          disabled={isSubmitting || items.length === 0}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-900/15 transition active:scale-98 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting Request...' : 'Submit Shopping Request to Helpers'}
        </button>
      </div>
    </div>
  );
};
