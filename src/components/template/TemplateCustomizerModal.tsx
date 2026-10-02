import React from 'react';
import { useApp } from '../../context/AppContext';
import { TemplateType, ColorTheme, UserRole } from '../../types';
import {
  LayoutTemplate,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  X,
  Palette,
  Sun,
  Moon,
  Users,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';

export const TemplateCustomizerModal: React.FC = () => {
  const {
    isTemplateModalOpen,
    setIsTemplateModalOpen,
    templateType,
    setTemplateType,
    colorTheme,
    setColorTheme,
    isDarkMode,
    toggleDarkMode,
    userRole,
    currentUser,
    isMergedSellerHelper,
    showSnackbar
  } = useApp();

  if (!isTemplateModalOpen) return null;

  const templates: {
    id: TemplateType;
    title: string;
    description: string;
    icon: React.ElementType;
    tag: string;
  }[] = [
    {
      id: 'responsive',
      title: 'Modern Responsive Super-App',
      description: 'Fluid edge-to-edge layout that adapts seamlessly to desktop, tablet, and mobile with expansive grids, desktop headers, and rich analytics.',
      icon: Monitor,
      tag: 'Recommended'
    },
    {
      id: 'pixel9',
      title: 'Google Pixel 9 Pro (Android 14)',
      description: 'Authentic native Android smartphone frame with 5G status bar, punch-hole camera, and gesture navigation bar.',
      icon: Smartphone,
      tag: 'Native Simulation'
    },
    {
      id: 'minimal',
      title: 'Minimalist Clean Mobile',
      description: 'A distraction-free centered mobile canvas without plastic phone bezels or fake physical buttons.',
      icon: LayoutTemplate,
      tag: 'Clean View'
    },
    {
      id: 'tablet',
      title: 'Tablet & POS Operations Kiosk',
      description: 'Spacious dual-pane view optimized for store managers, market runners, and regional dispatchers.',
      icon: Tablet,
      tag: 'Wide Split'
    }
  ];

  const themes: {
    id: ColorTheme;
    name: string;
    label: string;
    primaryHex: string;
    accentHex: string;
    bgClass: string;
    ringClass: string;
  }[] = [
    {
      id: 'emerald',
      name: 'Nigerian Emerald',
      label: 'Lagos Green · Fresh & Trusted',
      primaryHex: '#059669',
      accentHex: '#10B981',
      bgClass: 'bg-emerald-600',
      ringClass: 'ring-emerald-500'
    },
    {
      id: 'sunset',
      name: 'Naija Sunset & Market',
      label: 'Warm Amber & Tangerine',
      primaryHex: '#D97706',
      accentHex: '#F97316',
      bgClass: 'bg-amber-600',
      ringClass: 'ring-amber-500'
    },
    {
      id: 'cobalt',
      name: 'Marina FinTech',
      label: 'Precision Cobalt & Electric Cyan',
      primaryHex: '#2563EB',
      accentHex: '#06B6D4',
      bgClass: 'bg-blue-600',
      ringClass: 'ring-blue-500'
    },
    {
      id: 'purple',
      name: 'Lekki Luxury',
      label: 'Regal African Purple & Gold',
      primaryHex: '#7C3AED',
      accentHex: '#EAB308',
      bgClass: 'bg-purple-600',
      ringClass: 'ring-purple-500'
    }
  ];

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'SHOPPER', label: 'Shopper', desc: 'Browse, buy & order helper runs' },
    { role: 'SELLER', label: 'Seller', desc: 'Store inventory & incoming orders' },
    { role: 'SHOPPING_HELPER', label: 'Helper', desc: 'Market runner & delivery workflow' },
    { role: 'SUB_ADMIN', label: 'Sub-Admin', desc: 'Zonal dispatch & conflict resolution' },
    { role: 'ADMIN', label: 'Main Admin', desc: 'Platform financials & governance' }
  ];

  const handleSelectTemplate = (t: TemplateType) => {
    setTemplateType(t);
    showSnackbar(`Template switched to ${templates.find(item => item.id === t)?.title}`);
  };

  const handleSelectTheme = (c: ColorTheme) => {
    setColorTheme(c);
    showSnackbar(`Brand color theme updated to ${themes.find(item => item.id === c)?.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border transition-colors duration-200 ${
          isDarkMode
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight">App Template & Theme Studio</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Customize presentation layout, device shell, and brand palette
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {/* 1. Layout Template Selection */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-500" />
                1. Select Application Layout Template
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Active: {templates.find(t => t.id === templateType)?.title}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map(tpl => {
                const Icon = tpl.icon;
                const isSelected = templateType === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-200 relative group cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                            isSelected
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isSelected
                                ? 'bg-emerald-500 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {tpl.tag}
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {tpl.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        {tpl.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 2. Color Theme Presets */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-emerald-500" />
                2. Select Brand Color Theme
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Active: {themes.find(c => c.id === colorTheme)?.name}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map(th => {
                const isSelected = colorTheme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => handleSelectTheme(th.id)}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center -space-x-1">
                        <div
                          className="w-6 h-6 rounded-full shadow-xs border border-white dark:border-slate-800"
                          style={{ backgroundColor: th.primaryHex }}
                        />
                        <div
                          className="w-5 h-5 rounded-full shadow-xs border border-white dark:border-slate-800"
                          style={{ backgroundColor: th.accentHex }}
                        />
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {th.name}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{th.label}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. Appearance & Role Quick Switching */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
            {/* Dark Mode Toggle */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Color Mode
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isDarkMode ? 'Dark Theme (Night Shift)' : 'Clean Light Theme'}
                </span>
              </div>
              <button
                onClick={toggleDarkMode}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-xs flex items-center gap-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200 active:scale-95 transition"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Light
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-600" /> Dark
                  </>
                )}
              </button>
            </div>

            {/* Active User Category Preview */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 dark:text-white block">
                  Active Account Category
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Signed in as: <strong className="text-emerald-600 dark:text-emerald-400">{currentUser?.name}</strong>
                </span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {isMergedSellerHelper ? 'Seller + Helper (Merged)' : userRole.replace('_', ' ')}
              </span>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span>Changes take effect immediately and are saved locally</span>
          </div>
          <button
            onClick={() => setIsTemplateModalOpen(false)}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition flex items-center gap-2"
          >
            Done & Apply
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
