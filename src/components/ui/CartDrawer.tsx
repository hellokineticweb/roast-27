'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { soundscape } from '@/lib/audio';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Truck,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    totalCount,
    subtotal,
    shippingThreshold,
    freeShippingProgress,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const discountAmount = discountApplied ? Math.round(subtotal * 0.15) : 0;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 7;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'ROAST27' || promoCode.trim().toUpperCase() === 'CINEMA') {
      soundscape.playPourChime();
      setDiscountApplied(true);
    } else {
      soundscape.playClick(350);
    }
  };

  const handleCheckout = () => {
    soundscape.playPourChime();
    setIsCheckingOut(true);

    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#e09f67', '#f3c77c', '#c85a32', '#f5f0eb'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsCheckingOut(false);
      setOrderComplete(true);
    }, 1200);
  };

  const resetAndClose = () => {
    setOrderComplete(false);
    closeCart();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-[#060504]/80 backdrop-blur-md"
          />

          {/* Slide-out Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-[#130e0b] border-l border-[#2e2117] flex flex-col shadow-2xl"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-[#291e15] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#201812] border border-[#3e2e21] flex items-center justify-center text-[#e09f67]">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#f5f0eb]">
                    Atelier Cart
                  </h3>
                  <span className="text-[11px] font-mono text-[#8b7e71]">
                    {totalCount} {totalCount === 1 ? 'Batch Item' : 'Batch Items'}
                  </span>
                </div>
              </div>

              <button
                onClick={closeCart}
                className="p-2 rounded-full bg-[#1e1611] text-[#9d8e80] hover:text-[#f5f0eb] transition-colors cursor-pointer"
                aria-label="Close cart"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="p-4 bg-[#1a130f] border-b border-[#291e15]">
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="flex items-center gap-1.5 text-[#d5c5b5]">
                  <Truck className="w-3.5 h-3.5 text-[#e09f67]" />
                  {subtotal >= shippingThreshold ? (
                    <strong className="text-[#f3c77c]">Complimentary Priority Shipping Unlocked!</strong>
                  ) : (
                    <span>
                      Add <strong className="text-[#e09f67]">${shippingThreshold - subtotal}</strong> for Free Shipping
                    </span>
                  )}
                </span>
                <span className="text-[#8e8174]">{freeShippingProgress}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#271d15] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#e09f67] to-[#f3c77c] transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Items Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {orderComplete ? (
                <div className="py-16 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#2a1e16] border border-[#e09f67] text-[#e09f67] flex items-center justify-center mx-auto animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-serif font-bold text-[#f5f0eb]">
                    Order Reserved
                  </h4>
                  <p className="text-xs text-[#a09487] font-mono max-w-xs mx-auto">
                    Your micro-batch allocation #R27-9942 has been dispatched to the roast master.
                  </p>
                  <button
                    onClick={resetAndClose}
                    className="mt-4 px-6 py-3 rounded-full bg-[#e09f67] text-[#0d0a08] font-bold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Return to Atelier
                  </button>
                </div>
              ) : items.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#1a130e] border border-[#302318] flex items-center justify-center mx-auto text-[#6f6256]">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-serif text-[#9d8e80]">
                    Your atelier cart is currently empty.
                  </p>
                  <button
                    onClick={closeCart}
                    className="text-xs font-mono text-[#e09f67] hover:underline uppercase tracking-wider cursor-pointer"
                  >
                    Explore Signature Roasts →
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-[#19130f] border border-[#2d2016] space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-[#e09f67] uppercase tracking-wider block">
                          {item.product.subtitle}
                        </span>
                        <h4 className="text-base font-serif font-bold text-[#f5f0eb]">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-[#8e8174] font-mono mt-0.5">
                          <span>{item.grind}</span>
                          <span>•</span>
                          <span>{item.size}</span>
                          {item.isSubscription && (
                            <>
                              <span>•</span>
                              <span className="text-[#f3c77c]">Subscribed</span>
                            </>
                          )}
                        </div>
                      </div>

                      <span className="text-base font-serif font-bold text-[#f5f0eb]">
                        ${item.pricePerUnit * item.quantity}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#261b13]">
                      {/* Quantity Toggles */}
                      <div className="flex items-center gap-3 bg-[#241a13] px-3 py-1 rounded-full border border-[#3c2c1f]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-[#a09487] hover:text-[#f5f0eb] cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-[#f5f0eb] w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="text-[#a09487] hover:text-[#f5f0eb] cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#716458] hover:text-[#c85a32] transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Drawer Footer & Checkout */}
            {!orderComplete && items.length > 0 && (
              <div className="p-6 border-t border-[#291e15] bg-[#17110d] space-y-4">
                {/* Promo Code Form */}
                <form onSubmit={handleApplyPromo} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="PROMO: 'ROAST27'"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[#201711] border border-[#3b2b1e] text-xs font-mono text-[#f5f0eb] uppercase placeholder:text-[#6a5e53] focus:outline-hidden focus:border-[#e09f67]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#2b1e15] border border-[#4a3627] text-xs font-mono text-[#e09f67] font-bold hover:bg-[#3d2b1f] cursor-pointer"
                  >
                    Apply
                  </button>
                </form>

                {discountApplied && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#f3c77c]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Specialty Connoisseur 15% VIP Discount Applied</span>
                  </div>
                )}

                {/* Subtotal Calculation */}
                <div className="space-y-1.5 text-xs font-mono text-[#9d8e80]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="text-[#f5f0eb]">${subtotal}</span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-[#f3c77c]">
                      <span>VIP Discount</span>
                      <span>-${discountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Priority Courier</span>
                    <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-serif font-bold text-[#f5f0eb] pt-2 border-t border-[#2c2016]">
                    <span>Total Due</span>
                    <span className="text-[#e09f67]">${finalTotal}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#e09f67] via-[#f3c77c] to-[#c85a32] text-[#0d0a08] font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  data-cursor="PAY"
                >
                  {isCheckingOut ? (
                    <span>Allocating Batch...</span>
                  ) : (
                    <>
                      <span>Secure Atelier Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-[#716458]">
                  <ShieldCheck className="w-3 h-3 text-[#e09f67]" />
                  <span>256-Bit Encrypted Roast Reservation</span>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
