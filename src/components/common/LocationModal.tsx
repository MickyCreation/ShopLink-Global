import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';
import {
  MapPin,
  Plus,
  Check,
  Building,
  Navigation,
  Shield,
  AlertCircle
} from 'lucide-react';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    currentLocationArea,
    setCurrentLocationArea,
    savedAddresses,
    defaultAddress,
    setDefaultAddress,
    addNewAddress,
    locationPermission,
    requestLocationPermission,
    showSnackbar
  } = useApp();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newFullAddress, setNewFullAddress] = useState('');
  const [newArea, setNewArea] = useState('Ikeja');
  const [newCity, setNewCity] = useState('Lagos');
  const [newState, setNewState] = useState('Lagos State');
  const [newPhone, setNewPhone] = useState('+234 80');
  const [isNewDefault, setIsNewDefault] = useState(false);

  const popularNigerianAreas = [
    { name: 'Ikeja GRA, Lagos', type: 'Residential & Commercial Hub' },
    { name: 'Allen Avenue, Ikeja', type: 'Central Retail District' },
    { name: 'Mile 12 International Market', type: 'Fresh Farm Produce Hub' },
    { name: 'Tejuosho Market, Surulere', type: 'Foodstuffs & Apparel' },
    { name: 'Lekki Phase 1, Lagos', type: 'Island Premium Zone' },
    { name: 'Wuse 2 & Wuse Market, Abuja', type: 'FCT Central Market' },
    { name: 'Utako Ultra Modern Market, Abuja', type: 'FCT Produce Depot' }
  ];

  const handleSelectSavedAddress = (id: string, area: string) => {
    setDefaultAddress(id);
    setCurrentLocationArea(area);
    setIsLocationModalOpen(false);
  };

  const handleSelectArea = (areaName: string) => {
    setCurrentLocationArea(areaName);
    showSnackbar(`Location set to ${areaName}`);
    setIsLocationModalOpen(false);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newFullAddress.trim()) {
      showSnackbar('Please enter title and full address');
      return;
    }

    await addNewAddress({
      title: newTitle.trim(),
      fullAddress: newFullAddress.trim(),
      area: newArea,
      city: newCity,
      state: newState,
      isDefault: isNewDefault,
      contactPhone: newPhone
    });

    setIsAddingNew(false);
    setNewTitle('');
    setNewFullAddress('');
  };

  return (
    <AndroidBottomSheet
      isOpen={isLocationModalOpen}
      onClose={() => {
        setIsLocationModalOpen(false);
        setIsAddingNew(false);
      }}
      title="Choose Shopping Location"
    >
      <div className="space-y-5 pb-6">
        {/* Permission status card */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">
                {locationPermission === 'GRANTED' ? 'GPS Location Enabled' : 'GPS Permission Needed'}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {locationPermission === 'GRANTED' ? `Active: ${currentLocationArea}` : 'Enable GPS for accurate delivery'}
              </p>
            </div>
          </div>

          {locationPermission !== 'GRANTED' && (
            <button
              onClick={requestLocationPermission}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-semibold shadow-xs transition"
            >
              Enable GPS
            </button>
          )}
        </div>

        {/* Saved Addresses Section */}
        {!isAddingNew ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Saved Delivery Addresses
              </span>
              <button
                onClick={() => setIsAddingNew(true)}
                className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add New
              </button>
            </div>

            <div className="space-y-2">
              {savedAddresses.map(addr => {
                const isSelected = defaultAddress?.id === addr.id;
                return (
                  <button
                    key={addr.id}
                    onClick={() => handleSelectSavedAddress(addr.id, addr.area)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/30 ring-1 ring-emerald-500'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-xl mt-0.5 ${isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                        <Building className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {addr.title}
                          </span>
                          {addr.isDefault && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-1">
                          {addr.fullAddress}
                        </p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          {addr.contactPhone}
                        </p>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Popular Nigerian Markets & Hubs */}
            <div className="mt-5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-2">
                Popular Markets & Operational Hubs
              </span>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                {popularNigerianAreas.map(item => (
                  <button
                    key={item.name}
                    onClick={() => handleSelectArea(item.name)}
                    className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-between transition"
                  >
                    <div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">
                        {item.type}
                      </p>
                    </div>
                    <MapPin className="w-4 h-4 text-slate-400 hover:text-emerald-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Add New Address Form */
          <form onSubmit={handleSaveAddress} className="space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                New Address Details
              </h3>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Label (e.g. Home, Office, Mum's Place)
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Home"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Full Street Address
              </label>
              <textarea
                value={newFullAddress}
                onChange={e => setNewFullAddress(e.target.value)}
                placeholder="Plot number, street name, landmarks..."
                rows={2}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Area / Neighborhood
                </label>
                <input
                  type="text"
                  value={newArea}
                  onChange={e => setNewArea(e.target.value)}
                  placeholder="e.g. Ikeja GRA"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  City & State
                </label>
                <input
                  type="text"
                  value={`${newCity}, ${newState}`}
                  onChange={e => {
                    const parts = e.target.value.split(',');
                    setNewCity(parts[0]?.trim() || 'Lagos');
                    setNewState(parts[1]?.trim() || 'Lagos State');
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                Contact Phone for Delivery
              </label>
              <input
                type="tel"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
                placeholder="+234 80..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="defaultAddrCheck"
                checked={isNewDefault}
                onChange={e => setIsNewDefault(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <label htmlFor="defaultAddrCheck" className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                Set as default delivery address
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm active:scale-98 mt-2"
            >
              Save Address
            </button>
          </form>
        )}

        {/* Privacy footnote */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Shield className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>ShopLink secures your exact address. Only assigned delivery helpers receive directions for active runs.</span>
        </div>
      </div>
    </AndroidBottomSheet>
  );
};
