import { create } from "zustand";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  options: string[]; // for "Build a Plate" customized toppings
}

interface CartState {
  vendorId: string | null;
  vendorName: string | null;
  items: CartItem[];
  addItem: (vendorId: string, vendorName: string, item: Omit<CartItem, "quantity">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  vendorId: null,
  vendorName: null,
  items: [],
  addItem: (vendorId, vendorName, item) => {
    const state = get();
    // Enforce ordering from one vendor at a time
    if (state.vendorId && state.vendorId !== vendorId) {
      if (!confirm("Ordering from a new restaurant will clear your current cart. Continue?")) {
        return;
      }
      set({ vendorId, vendorName, items: [{ ...item, quantity: 1 }] });
      return;
    }

    const existingItemIdx = state.items.findIndex(
      (i) => i.id === item.id && JSON.stringify(i.options) === JSON.stringify(item.options)
    );

    if (existingItemIdx > -1) {
      const updatedItems = [...state.items];
      updatedItems[existingItemIdx].quantity += 1;
      set({ items: updatedItems });
    } else {
      set({
        vendorId,
        vendorName,
        items: [...state.items, { ...item, quantity: 1 }],
      });
    }
  },
  removeItem: (itemId) => {
    const updatedItems = get().items.filter((i) => i.id !== itemId);
    set({
      items: updatedItems,
      vendorId: updatedItems.length === 0 ? null : get().vendorId,
      vendorName: updatedItems.length === 0 ? null : get().vendorName,
    });
  },
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    const updatedItems = get().items.map((i) =>
      i.id === itemId ? { ...i, quantity } : i
    );
    set({ items: updatedItems });
  },
  clearCart: () => {
    set({ vendorId: null, vendorName: null, items: [] });
  },
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
