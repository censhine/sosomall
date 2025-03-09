import { defineStore } from "pinia";
import type { CartItem } from "@/types";

export const useCartStore = defineStore("cart", {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    count: (state) =>
      state.items.reduce(
        (total: number, item: CartItem) => total + item.quantity,
        0
      ),
    total: (state) =>
      state.items.reduce(
        (total: number, item: CartItem) => total + item.price * item.quantity,
        0
      ),
  },

  actions: {
    setItems(items: CartItem[]) {
      this.items = items;
      localStorage.setItem("cart", JSON.stringify(items));
    },

    addItem(item: CartItem) {
      const existingItem = this.items.find((i: CartItem) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        this.items.push(item);
      }
      this.setItems(this.items);
    },

    updateItem(id: number, quantity: number) {
      const item = this.items.find((i: CartItem) => i.id === id);
      if (item) {
        item.quantity = quantity;
        this.setItems(this.items);
      }
    },

    removeItem(id: number) {
      this.items = this.items.filter((item: CartItem) => item.id !== id);
      this.setItems(this.items);
    },

    clear() {
      this.items = [];
      localStorage.removeItem("cart");
    },

    async fetchItems() {
      try {
        const cart = localStorage.getItem("cart");
        this.items = cart ? JSON.parse(cart) : [];
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        this.items = [];
      }
    },
  },
});
