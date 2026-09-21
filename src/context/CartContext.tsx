'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CoffeeProduct, CartItem } from '@/types/coffee';
import { soundscape } from '@/lib/audio';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  activeProductIndex: number;
  setActiveProductIndex: (index: number) => void;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: CoffeeProduct, grind: string, size: string, isSubscription: boolean) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  totalCount: number;
  subtotal: number;
  shippingThreshold: number;
  freeShippingProgress: number;
  soundEnabled: boolean;
  toggleSound: () => Promise<void>;
  currentChapter: number;
  setCurrentChapter: (ch: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);

  // Load initial cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem('roast27_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem('roast27_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const openCart = () => {
    soundscape.playClick(950);
    setIsOpen(true);
  };

  const closeCart = () => {
    soundscape.playClick(600);
    setIsOpen(false);
  };

  const addItem = (
    product: CoffeeProduct,
    grind: string,
    size: string,
    isSubscription: boolean
  ) => {
    soundscape.playPourChime();
    const multiplier = size === '500g' ? 1.85 : size === '1kg' ? 3.4 : 1.0;
    const discount = isSubscription ? 0.85 : 1.0;
    const unitPrice = Math.round(product.price * multiplier * discount);
    const itemId = `${product.id}-${grind}-${size}-${isSubscription ? 'sub' : 'one'}`;

    setItems((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          product,
          grind,
          size,
          quantity: 1,
          pricePerUnit: unitPrice,
          isSubscription,
          frequency: isSubscription ? 'Every 2 Weeks' : undefined,
        },
      ];
    });

    setIsOpen(true);
  };

  const removeItem = (id: string) => {
    soundscape.playClick(400);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    soundscape.playClick(750);
    if (qty <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
    );
  };

  const toggleSound = async () => {
    const isPlaying = await soundscape.toggleAmbience();
    setSoundEnabled(isPlaying);
  };

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.pricePerUnit * item.quantity,
    0
  );
  const shippingThreshold = 60;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        activeProductIndex,
        setActiveProductIndex,
        openCart,
        closeCart,
        addItem,
        removeItem,
        updateQuantity,
        totalCount,
        subtotal,
        shippingThreshold,
        freeShippingProgress,
        soundEnabled,
        toggleSound,
        currentChapter,
        setCurrentChapter,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
