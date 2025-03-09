import { defineStore } from "pinia";
import type { User } from "@/types";
import {
  login,
  logout,
  socialLogin,
  validateToken,
  getUserInfo,
} from "@/api/auth";

interface CartItem {
  id: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface UserState {
  token: string | null;
  user: User | null;
  cartCount: number;
  cart: CartItem[];
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: localStorage.getItem("token"),
    user: null,
    cartCount: 0,
    cart: [],
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.token && !!this.user;
    },
  },

  actions: {
    // 登录
    async login(email: string, password: string): Promise<void> {
      try {
        const { token } = await login({ email, password });
        this.setToken(token);
        await this.fetchUserInfo();
      } catch (error) {
        this.clearState();
        throw error;
      }
    },

    // 第三方登录
    async socialLogin(provider: string): Promise<void> {
      try {
        const { token } = await socialLogin(provider);
        this.setToken(token);
        await this.fetchUserInfo();
      } catch (error) {
        this.clearState();
        throw error;
      }
    },

    // 登出
    async logout(): Promise<void> {
      try {
        await logout();
      } finally {
        this.clearState();
      }
    },

    // 设置用户状态
    setUserState(user: User, token: string) {
      this.user = user;
      this.token = token;
    },

    // 清除用户状态
    clearUserState() {
      this.user = null;
      this.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    // 持久化用户状态到 localStorage
    persistUserState() {
      if (this.user && this.token) {
        localStorage.setItem("token", this.token);
        localStorage.setItem("user", JSON.stringify(this.user));
      }
    },

    // 购物车相关操作
    addToCart(item: Omit<CartItem, "quantity">): void {
      const existingItem = this.cart.find(
        (cartItem: CartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ ...item, quantity: 1 });
      }
      this.updateCartCount();
      this.persistCart();
    },

    // 更新购物车商品数量
    updateCartItemQuantity(itemId: number, quantity: number): void {
      const item = this.cart.find(
        (cartItem: CartItem) => cartItem.id === itemId
      );
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          this.removeFromCart(itemId);
        } else {
          this.updateCartCount();
          this.persistCart();
        }
      }
    },

    // 从购物车移除商品
    removeFromCart(itemId: number): void {
      this.cart = this.cart.filter(
        (cartItem: CartItem) => cartItem.id !== itemId
      );
      this.updateCartCount();
      this.persistCart();
    },

    // 清空购物车
    clearCart(): void {
      this.cart = [];
      this.cartCount = 0;
      this.persistCart();
    },

    // 设置 token
    setToken(token: string): void {
      this.token = token;
      localStorage.setItem("token", token);
    },

    // 获取用户信息
    async fetchUserInfo(): Promise<void> {
      if (!this.token) return;
      try {
        const user = await getUserInfo(this.token);
        this.user = user;
      } catch (error) {
        this.clearState();
        throw error;
      }
    },

    // 初始化用户状态（从 localStorage 恢复）
    async init(): Promise<void> {
      if (this.token) {
        try {
          const isValid = await validateToken(this.token);
          if (!isValid) {
            this.clearState();
            return;
          }
          await this.fetchUserInfo();
        } catch {
          this.clearState();
        }
      }

      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            this.cart = parsedCart;
            this.updateCartCount();
          }
        } catch {
          this.clearCart();
        }
      }
    },

    // 更新购物车数量
    updateCartCount(): void {
      this.cartCount = this.cart.reduce(
        (total: number, item: CartItem) => total + item.quantity,
        0
      );
    },

    // 持久化购物车状态到 localStorage
    persistCart(): void {
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    // 清除用户状态
    clearState(): void {
      this.token = null;
      this.user = null;
      this.cartCount = 0;
      this.cart = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});
