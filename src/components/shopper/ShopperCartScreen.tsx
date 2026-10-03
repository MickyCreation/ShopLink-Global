import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AndroidTopAppBar } from '../android/AndroidTopAppBar';
import { NigerianCurrency } from '../common/NigerianCurrency';
import { AndroidBottomSheet } from '../android/AndroidBottomSheet';
import { orderRepository } from '../../services/mock/MockServices';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  CreditCard,
  Building2,
  PhoneCall,
  CheckCircle2,
  Store,
  Fingerprint,
  Bike,
  Star,
  KeyRound
} from 'lucide-react';

export const ShopperCartScreen: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartSubtotal,
    defaultAddress,
    setIsLocationModalOpen,
    navigateTo,
    currentUser,
    setActiveOrder,
    showSnackbar,
    requestBiometricAuth,
    openKycModal,
    availableHelpers,
    openHelperProfile
  } = useApp();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'STANDARD' | 'HELPER_PICKUP'>('STANDARD');
  const [selectedHelperId, setSelectedHelperId] = useState<string>(availableHelpers[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'CARD_PAYSTACK' | 'BANK_TRANSFER' | 'USSD' | 'CASH_ON_DELIVERY'>('CARD_PAYSTACK');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const selectedHelper = availableHelpers.find(h => h.id === selectedHelperId) || availableHelpers[0];

  const deliveryFee = cart.length > 0 ? (deliveryOption === 'HELPER_PICKUP' ? 2500 : 2000) : 0;
  const grandTotal = cartSubtotal + deliveryFee;

  // Group cart items by seller
  const sellerGroups = cart.reduce((acc, item) => {
    const seller = item.product.sellerName;
    if (!acc[seller]) acc[seller] = [];
    acc[seller].push(item);
    return acc;
  }, {} as Record<string, typeof cart>);

  const executeOrderCreation = async () => {
    setIsPlacingOrder(true);
    try {
      const createdOrders = await orderRepository.createOrder({
        shopperId: currentUser!.id,
        shopperName: currentUser!.name,
        cartItems: cart,
        deliveryAddress: defaultAddress!,
        paymentMethod,
        deliveryType: deliveryOption === 'HELPER_PICKUP' ? 'HELPER_PICKUP' : 'STANDARD_SHIPPING',
        pickupHelper: deliveryOption === 'HELPER_PICKUP' && selectedHelper ? {
          id: selectedHelper.id,
          name: selectedHelper.name,
          phone: selectedHelper.phone,
          rating: selectedHelper.rating,
          vehicleType: selectedHelper.vehicleType,
          isSeller: selectedHelper.isSeller,
          sellerStoreName: selectedHelper.sellerStoreName
        } : undefined
      });

      if (createdOrders.length > 0) {
        setActiveOrder(createdOrders[0]);
      }

      clearCart();
      setOrderSuccess(true);
      setTimeout(() => {
        setIsCheckoutOpen(false);
        setOrderSuccess(false);
        navigateTo('SHOPPER_ORDERS');
        showSnackbar(
          deliveryOption === 'HELPER_PICKUP'
            ? `Payment verified! Courier Helper ${selectedHelper?.name} dispatched to pick up from seller.`
            : 'Payment authorized via biometrics! Order placed in Escrow.'
        );
      }, 1500);
    } catch {
      showSnackbar('Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handlePlaceOrder = () => {
    if (!currentUser || !defaultAddress) {
      showSnackbar('Please ensure delivery address is set');
      return;
    }

    // Require biometric fingerprint / face unlock authorization for sensitive payment
    requestBiometricAuth({
      title: 'Authorize Escrow Payment',
      subtitle: `Verify biometric credentials to authorize payment of ₦${grandTotal.toLocaleString()} for ${cart.length} marketplace items`,
      amountNaira: grandTotal,
      actionType: 'PAYMENT',
      onSuccess: () => {
        executeOrderCreation();
      }
    });
  };

  return (
    <div className="flex flex-col min-h-full pb-20">
      <AndroidTopAppBar title="Shopping Cart" showLocation={false} />

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 flex flex-col">
        {cart.length > 0 ? (
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Delivery Destination banner */}
              <div className="p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      Delivering To
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                      {defaultAddress?.title} ({defaultAddress?.area})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Change
                </button>
              </div>

              {/* Grouped Cart Items */}
              {Object.entries(sellerGroups).map(([sellerName, items]) => (
                <div
                  key={sellerName}
                  className="p-3.5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3"
                >
                  {/* Seller Header */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {sellerName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Items in this store */}
                  <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {items.map(item => (
                      <div key={item.product.id} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover bg-slate-100 dark:bg-slate-700 shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.product.name}
                          </h4>
                          <span className="text-[10px] text-slate-400 block">
                            {item.product.unit}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 block">
                            <NigerianCurrency amount={item.product.price * item.quantity} />
                          </span>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 active:scale-95 shadow-xs"
                          >
                            {item.quantity === 1 ? <Trash2 className="w-3 h-3 text-rose-500" /> : <Minus className="w-3 h-3" />}
                          </button>
                          <span className="text-xs font-bold px-1 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-white dark:bg-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-200 active:scale-95 shadow-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown & Checkout Button */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span>
                  <NigerianCurrency amount={cartSubtotal} />
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Estimated Delivery Fee</span>
                  <NigerianCurrency amount={deliveryFee} />
                </div>
                <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span>Total</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    <NigerianCurrency amount={grandTotal} />
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-900/15 active:scale-98 transition"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Empty Cart State */
          <div className="my-auto py-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <ShoppingCart className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Your cart is empty
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                Explore authentic Nigerian foodstuffs, grains, and provisions from local sellers.
              </p>
            </div>
            <button
              onClick={() => navigateTo('SHOPPER_EXPLORE')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold shadow-sm transition active:scale-95 inline-flex items-center gap-1.5"
            >
              Start Shopping <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Checkout Bottom Sheet */}
      <AndroidBottomSheet
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title="Complete Your Order"
      >
        <div className="space-y-4 pb-6">
          {orderSuccess ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Order Placed Successfully!
              </h3>
              <p className="text-xs text-slate-500">
                Directing you to your order status...
              </p>
            </div>
          ) : (
            <>
              {/* Delivery Address summary */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-slate-700 dark:text-slate-300">Deliver To:</span>
                  <button onClick={() => setIsLocationModalOpen(true)} className="text-emerald-600 font-semibold">Change</button>
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  {defaultAddress?.fullAddress}
                </p>
                <p className="text-[11px] text-slate-500">
                  Recipient: {currentUser?.name} · {defaultAddress?.contactPhone}
                </p>
              </div>

              {/* Delivery & Fulfillment Method Selection */}
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2 uppercase tracking-wider">
                  Fulfillment & Delivery Method
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  <div
                    onClick={() => setDeliveryOption('STANDARD')}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                      deliveryOption === 'STANDARD'
                        ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-600'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryTypeSelection"
                      checked={deliveryOption === 'STANDARD'}
                      onChange={() => setDeliveryOption('STANDARD')}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          Standard Delivery
                        </span>
                        <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                          ₦2,000
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Seller ships via their in-house courier.
                      </p>
                    </div>
                  </div>

                  <div
                    onClick={() => setDeliveryOption('HELPER_PICKUP')}
                    className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-2.5 ${
                      deliveryOption === 'HELPER_PICKUP'
                        ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryTypeSelection"
                      checked={deliveryOption === 'HELPER_PICKUP'}
                      onChange={() => setDeliveryOption('HELPER_PICKUP')}
                      className="mt-0.5 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                          <Bike className="w-3.5 h-3.5 text-indigo-600" />
                          Storefront Pickup & Dispatch
                        </span>
                        <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400">
                          ₦2,500
                        </span>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
                          Courier to Store
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Courier goes to seller stall, inspects goods, releases PIN.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Courier Helper Selector (when Helper Pickup chosen) */}
                {deliveryOption === 'HELPER_PICKUP' && (
                  <div className="p-3.5 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 space-y-2.5 mb-3 animate-in fade-in duration-150">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1">
                        <Bike className="w-3.5 h-3.5 text-indigo-600" />
                        Select Pickup Courier
                      </span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold">
                        {availableHelpers.length} available
                      </span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {availableHelpers.map(helper => {
                        const isChosen = selectedHelperId === helper.id;
                        return (
                          <div
                            key={helper.id}
                            onClick={() => setSelectedHelperId(helper.id)}
                            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-start justify-between gap-2 ${
                              isChosen
                                ? 'bg-white dark:bg-slate-800 border-indigo-600 ring-1 ring-indigo-600'
                                : 'bg-white/80 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:bg-white'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <img
                                src={helper.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                                alt={helper.name}
                                className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                                    {helper.name}
                                  </span>
                                  <div className="flex items-center text-[10px] text-amber-500 font-bold">
                                    <Star className="w-3 h-3 fill-current mr-0.5" />
                                    {helper.rating}
                                  </div>
                                </div>
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                                  {helper.vehicleType} · {helper.completedJobsCount} trips
                                </span>

                                {/* DUAL ROLE BADGE: Helper who is also a Seller */}
                                {helper.isSeller && (
                                  <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-200 text-[9px] font-extrabold border border-amber-300 dark:border-amber-700">
                                    <Store className="w-2.5 h-2.5" />
                                    <span>Also Seller: {helper.sellerStoreName}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <input
                              type="radio"
                              name="checkoutHelperSelection"
                              checked={isChosen}
                              onChange={() => setSelectedHelperId(helper.id)}
                              className="mt-1 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5 cursor-pointer shrink-0"
                            />
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] text-indigo-800 dark:text-indigo-300 pt-1 border-t border-indigo-200/60 dark:border-indigo-800/60">
                      <KeyRound className="w-3 h-3 text-indigo-600 shrink-0" />
                      <span>A 4-digit pickup code will be generated to authorize store release upon payment.</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2 uppercase tracking-wider">
                  Payment Method
                </span>

                <div className="space-y-2">
                  {[
                    { id: 'CARD_PAYSTACK', label: 'Debit Card (Paystack)', icon: CreditCard, desc: 'Mastercard, Visa, Verve' },
                    { id: 'BANK_TRANSFER', label: 'Bank Transfer (Instant)', icon: Building2, desc: 'Direct settlement into dedicated ShopLink escrow' },
                    { id: 'USSD', label: 'USSD Code Banking', icon: PhoneCall, desc: '*737#, *901#, *894# etc.' },
                    { id: 'CASH_ON_DELIVERY', label: 'Cash / Pay on Delivery', icon: ShieldCheck, desc: 'Inspect items before paying courier' }
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition ${
                        paymentMethod === method.id
                          ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 ring-1 ring-emerald-600'
                          : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <method.icon className={`w-5 h-5 ${paymentMethod === method.id ? 'text-emerald-600' : 'text-slate-500'}`} />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {method.label}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {method.desc}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="checkoutPayment"
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id as any)}
                        className="text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                      />
                    </label>
                  ))}
                </div>
              </div>

              {/* KYC Security Status Reminder */}
              {currentUser?.kyc?.status !== 'VERIFIED' ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                    <span className="text-[11px] text-amber-900 dark:text-amber-200">
                      Unverified Account: Submit your ID & update profile for CBN escrow compliance.
                    </span>
                  </div>
                  <button
                    onClick={openKycModal}
                    className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold hover:underline shrink-0 ml-2 cursor-pointer"
                  >
                    Submit ID ➔
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px] font-medium">
                    KYC Tier 2 Verified Buyer · Instant Escrow Protection Enabled
                  </span>
                </div>
              )}

              {/* Escrow badge */}
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ShopLink Escrow guarantees safe delivery or 100% money back.</span>
              </div>

              {/* Total & Confirm Button */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold uppercase">Grand Total</span>
                  <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    <NigerianCurrency amount={grandTotal} />
                  </span>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-900/10 transition active:scale-95 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>{isPlacingOrder ? 'Processing...' : 'Authorize & Pay'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </AndroidBottomSheet>
    </div>
  );
};
