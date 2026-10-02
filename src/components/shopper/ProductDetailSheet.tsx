import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';
import { NigerianCurrency } from '../common/NigerianCurrency';
import {
  Star,
  Store,
  ShieldCheck,
  Plus,
  Minus,
  ShoppingCart,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';

export const ProductDetailSheet: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    openChatWith
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Swipe & Drag Gesture State
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState<number>(0);

  const product = selectedProductForDetail;

  // Resolve multiple product images (with graceful fallback to primary imageUrl)
  const images: string[] = useMemo(() => {
    if (!product) return [];
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    return [product.imageUrl];
  }, [product]);

  // Reset active image index and quantity when product changes
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setQuantity(1);
      setTouchDeltaX(0);
      setIsDragging(false);
    }
  }, [product?.id]);

  if (!product) return null;

  const totalPrice = product.price * quantity;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setSelectedProductForDetail(null);
    setQuantity(1);
  };

  // Carousel Navigation Handlers
  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
  };

  // Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchDeltaX(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    setTouchDeltaX(currentX - touchStartX);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    const threshold = 45;
    if (touchDeltaX < -threshold) {
      // Swiped Left -> Next image
      handleNextImage();
    } else if (touchDeltaX > threshold) {
      // Swiped Right -> Prev image
      handlePrevImage();
    }
    setTouchStartX(null);
    setTouchDeltaX(0);
  };

  // Mouse Drag Handlers (for desktop testing)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setTouchDeltaX(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setTouchDeltaX(e.clientX - dragStartX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    const threshold = 45;
    if (touchDeltaX < -threshold) {
      handleNextImage();
    } else if (touchDeltaX > threshold) {
      handlePrevImage();
    }
    setIsDragging(false);
    setTouchDeltaX(0);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTouchDeltaX(0);
    }
  };

  return (
    <>
      <AndroidBottomSheet
        isOpen={!!selectedProductForDetail}
        onClose={() => {
          setSelectedProductForDetail(null);
          setQuantity(1);
          setIsLightboxOpen(false);
        }}
        title=""
        maxHeight="max-h-[92vh]"
      >
        <div className="space-y-4 pb-8">
          {/* ======================================================== */}
          {/* SWIPEABLE IMAGE CAROUSEL SECTION */}
          {/* ======================================================== */}
          <div className="space-y-2">
            <div
              className="relative w-full h-64 sm:h-72 rounded-3xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner select-none cursor-grab active:cursor-grabbing group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
            >
              {/* Carousel Slides Track */}
              <div
                className={`flex w-full h-full ${
                  isDragging || touchStartX !== null ? 'transition-none' : 'transition-transform duration-300 ease-out'
                }`}
                style={{
                  transform: `translateX(calc(-${activeImageIndex * 100}% + ${touchDeltaX}px))`
                }}
              >
                {images.map((imgSrc, idx) => (
                  <div
                    key={`${imgSrc}-${idx}`}
                    className="w-full h-full shrink-0 relative flex items-center justify-center bg-slate-900/90"
                    onClick={() => setIsLightboxOpen(true)}
                  >
                    <img
                      src={imgSrc}
                      alt={`${product.name} view ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover pointer-events-none"
                      onError={e => {
                        (e.target as HTMLElement).style.opacity = '0.3';
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Top-Left Category Badge */}
              <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-white/10 z-10 shadow-xs pointer-events-none">
                {product.category}
              </div>

              {/* Top-Right Badges & Fullscreen Action */}
              <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                {product.originalPrice && product.originalPrice > product.price && (
                  <div className="bg-rose-600/90 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-lg shadow-sm border border-rose-400/20">
                    Save <NigerianCurrency amount={product.originalPrice - product.price} />
                  </div>
                )}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    setIsLightboxOpen(true);
                  }}
                  className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md flex items-center justify-center transition shadow-md active:scale-90 border border-white/10 cursor-pointer"
                  title="Expand to Fullscreen View"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Navigation Arrows (shown if multiple images) */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition shadow-md active:scale-90 z-10 opacity-80 group-hover:opacity-100 cursor-pointer border border-white/10"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition shadow-md active:scale-90 z-10 opacity-80 group-hover:opacity-100 cursor-pointer border border-white/10"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Bottom Photo Counter & Pagination Dots */}
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
                {/* Photo Counter Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold border border-white/10">
                  <Camera className="w-3 h-3 text-emerald-400" />
                  <span>
                    {activeImageIndex + 1} / {images.length}
                  </span>
                </div>

                {/* Animated Pagination Capsule Dots */}
                {images.length > 1 && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 pointer-events-auto">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setActiveImageIndex(i);
                        }}
                        className={`transition-all duration-300 rounded-full cursor-pointer ${
                          i === activeImageIndex
                            ? 'w-5 h-1.5 bg-emerald-400 shadow-xs'
                            : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/80'
                        }`}
                        aria-label={`Go to photo ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Thumbnail Preview Strip */}
            {images.length > 1 && (
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
                  {images.map((imgSrc, idx) => {
                    const isSelected = idx === activeImageIndex;
                    return (
                      <button
                        key={`thumb-${idx}`}
                        type="button"
                        onClick={() => setActiveImageIndex(idx)}
                        className={`relative shrink-0 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl overflow-hidden border-2 transition-all active:scale-95 cursor-pointer ${
                          isSelected
                            ? 'border-emerald-500 ring-2 ring-emerald-500/30 scale-102 shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgSrc}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-emerald-500/10 pointer-events-none" />
                        )}
                      </button>
                    );
                  })}
                </div>
                <span className="text-[10px] text-slate-400 font-medium shrink-0 hidden sm:inline">
                  Swipe or tap to preview
                </span>
              </div>
            )}
          </div>

          {/* Title, Unit, Price */}
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>{product.unit}</span>
              <span>·</span>
              <span
                className={
                  product.stockQuantity > 5
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-amber-600 font-semibold'
                }
              >
                {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h2>

            <div className="flex items-baseline gap-2.5 mt-2">
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <NigerianCurrency amount={product.price} />
              </span>
              {product.originalPrice && (
                <span className="text-sm text-slate-400 line-through">
                  <NigerianCurrency amount={product.originalPrice} />
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Verified Seller Box */}
          <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {product.sellerName}
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="flex items-center gap-0.5 text-amber-500 font-semibold">
                    <Star className="w-3 h-3 fill-current" /> {product.sellerRating}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-2.5 h-2.5" /> {product.sellerLocation}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedProductForDetail(null);
                openChatWith({
                  id: product.sellerId,
                  name: product.sellerName,
                  role: 'SELLER'
                });
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Chat
            </button>
          </div>

          {/* Quality Guarantee Guarantee Box */}
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 dark:text-slate-400">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-[11px]">Same-Day Local Delivery</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="text-[11px]">Escrow Payment Protection</span>
            </div>
          </div>

          {/* Sticky Action Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-95 shadow-xs"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-sm min-w-[20px] text-center tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 active:scale-95 shadow-xs"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-between shadow-md shadow-emerald-900/10 active:scale-98 transition"
            >
              <span className="flex items-center gap-1.5">
                <ShoppingCart className="w-4 h-4" /> Add to Cart
              </span>
              <span>
                <NigerianCurrency amount={totalPrice} />
              </span>
            </button>
          </div>
        </div>
      </AndroidBottomSheet>

      {/* ======================================================== */}
      {/* FULLSCREEN LIGHTBOX PREVIEW MODAL */}
      {/* ======================================================== */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Lightbox Header */}
          <div className="flex items-center justify-between text-white z-10 pt-2 px-2">
            <div>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">
                {product.category}
              </span>
              <h3 className="text-sm font-bold truncate max-w-[250px] sm:max-w-md">
                {product.name}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-white/10 px-3 py-1 rounded-full font-bold">
                {activeImageIndex + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition active:scale-90 cursor-pointer"
                aria-label="Close fullscreen view"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Fullscreen Main Image & Navigation Arrows */}
          <div
            className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
            onClick={e => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition shadow-lg active:scale-90 z-20 cursor-pointer border border-white/20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            <img
              src={images[activeImageIndex]}
              alt={`${product.name} fullscreen view ${activeImageIndex + 1}`}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl transition duration-200 select-none"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center transition shadow-lg active:scale-90 z-20 cursor-pointer border border-white/20"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Lightbox Footer Thumbnail Row */}
          {images.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar z-10"
              onClick={e => e.stopPropagation()}
            >
              {images.map((imgSrc, idx) => (
                <button
                  key={`lightbox-thumb-${idx}`}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === activeImageIndex
                      ? 'border-emerald-400 ring-2 ring-emerald-400/40 scale-105'
                      : 'border-white/20 opacity-50 hover:opacity-100'
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
