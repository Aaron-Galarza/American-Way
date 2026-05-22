'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Product, CartItem, CartAddon, Coupon } from '@/types';

interface CartState {
  items: CartItem[];
  deliveryType: 'pickup' | 'delivery';
  paymentMethod: 'cash' | 'transfer' | 'mercadopago' | null;
  coupon: Coupon | null;
  deliveryAddress: string;
  deliveryCoordinates: { lat: number; lng: number } | null;
  distanceKm: number;
  deliveryCost: number;

  addItem: (product: Product, quantity: number, addons: CartAddon[]) => void;
  removeItem: (index: number) => void;
  updateQuantity: (index: number, quantity: number) => void;
  clearCart: () => void;

  setDeliveryType: (type: 'pickup' | 'delivery') => void;
  setPaymentMethod: (method: 'cash' | 'transfer' | 'mercadopago' | null) => void;
  setCoupon: (coupon: Coupon) => void;
  clearCoupon: () => void;

  setDeliveryAddress: (address: string, coords: { lat: number; lng: number }) => void;
  setDeliveryCost: (cost: number, distanceKm: number) => void;
  clearDelivery: () => void;

  getTotals: () => {
    subtotal: number;
    discount: number;
    total: number;
    itemCount: number;
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      deliveryType: 'pickup',
      paymentMethod: null,
      coupon: null,
      deliveryAddress: '',
      deliveryCoordinates: null,
      distanceKm: 0,
      deliveryCost: 0,

      addItem: (product, quantity, addons) => {
        set((state) => {
          const areSameAddons = (addonsA: CartAddon[], addonsB: CartAddon[]) => {
            if (addonsA.length !== addonsB.length) return false;
            const sortedA = [...addonsA].sort((a, b) => a.addon.id.localeCompare(b.addon.id));
            const sortedB = [...addonsB].sort((a, b) => a.addon.id.localeCompare(b.addon.id));
            return sortedA.every(
              (a, i) => a.addon.id === sortedB[i].addon.id && a.quantity === sortedB[i].quantity
            );
          };

          const existingItemIndex = state.items.findIndex(
            (item) => item.product.id === product.id && areSameAddons(item.addons, addons)
          );

          const addonsTotal = addons.reduce((sum, a) => sum + a.addon.price * a.quantity, 0);
          const unitPrice = product.price + addonsTotal;

          if (existingItemIndex >= 0) {
            const newItems = [...state.items];
            const item = newItems[existingItemIndex];
            const newQuantity = item.quantity + quantity;
            newItems[existingItemIndex] = {
              ...item,
              quantity: newQuantity,
              itemTotal: newQuantity * unitPrice,
            };
            return { items: newItems };
          }

          const newItem: CartItem = {
            product,
            quantity,
            addons,
            itemTotal: quantity * unitPrice,
          };

          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (index) =>
        set((state) => ({
          items: state.items.filter((_, i) => i !== index),
        })),

      updateQuantity: (index, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((_, i) => i !== index) };
          }

          const newItems = [...state.items];
          const item = newItems[index];
          const addonsTotal = item.addons.reduce((sum, a) => sum + a.addon.price * a.quantity, 0);
          const unitPrice = item.product.price + addonsTotal;

          newItems[index] = {
            ...item,
            quantity,
            itemTotal: quantity * unitPrice,
          };

          return { items: newItems };
        });
      },

      clearCart: () => set({ items: [], coupon: null }),

      setDeliveryType: (type) => set({ deliveryType: type }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      setCoupon: (coupon) => set({ coupon }),
      clearCoupon: () => set({ coupon: null }),
      setDeliveryAddress: (address, coords) =>
        set({ deliveryAddress: address, deliveryCoordinates: coords }),
      setDeliveryCost: (cost, distanceKm) => set({ deliveryCost: cost, distanceKm }),
      clearDelivery: () =>
        set({ deliveryAddress: '', deliveryCoordinates: null, distanceKm: 0, deliveryCost: 0 }),

      getTotals: () => {
        const state = get();
        const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = state.items.reduce((sum, item) => sum + item.itemTotal, 0);
        const discountPercent = state.coupon?.active ? state.coupon.discountPercent : 0;
        const discount = (subtotal * discountPercent) / 100;
        const activeDeliveryCost = state.deliveryType === 'delivery' ? state.deliveryCost : 0;
        const total = subtotal - discount + activeDeliveryCost;

        return { itemCount, subtotal, discount, total };
      },
    }),
    {
      name: 'american-way-cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
