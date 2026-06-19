import { create } from "zustand";
import { CartItem } from "./useCartStore";

export type OrderStatus = "placed" | "preparing" | "ready" | "picked_up" | "delivered";

export interface Order {
  id: string;
  vendorId: string;
  vendorName: string;
  items: CartItem[];
  status: OrderStatus;
  riderId: string | null;
  customerName: string;
  customerLocation: string;
  total: number;
  timestamp: string;
}

interface OrderState {
  orders: Order[];
  createOrder: (orderData: Omit<Order, "id" | "status" | "riderId" | "timestamp">) => Order;
  updateStatus: (orderId: string, status: OrderStatus) => void;
  assignRider: (orderId: string, riderId: string) => void;
  getOrdersByRole: (role: "customer" | "vendor" | "rider", id: string) => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  createOrder: (orderData) => {
    const newOrder: Order = {
      ...orderData,
      id: `order-${Math.floor(Math.random() * 900000) + 100000}`,
      status: "placed",
      riderId: null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    set((state) => ({ orders: [newOrder, ...state.orders] }));
    return newOrder;
  },
  updateStatus: (orderId, status) => {
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
    }));
  },
  assignRider: (orderId, riderId) => {
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === orderId ? { ...o, riderId, status: "picked_up" as const } : o
      ),
    }));
  },
  getOrdersByRole: (role, id) => {
    const { orders } = get();
    if (role === "vendor") {
      return orders.filter((o) => o.vendorId === id);
    }
    if (role === "rider") {
      return orders.filter((o) => o.riderId === id);
    }
    // Customer
    return orders.filter((o) => o.customerName === id);
  },
}));
