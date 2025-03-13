import { defineStore } from "pinia";
import type { User } from "@/types";
import { login, register, logout, getUserInfo } from "@/api/mock/auth";

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
  isInitialized: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserState => ({
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "null"),
    cartCount: 0,
    cart: [],
    isInitialized: false,
  }),

  getters: {
    isAuthenticated(): boolean {
      return !!this.token && !!this.user;
    },
    isLoggedIn(): boolean {
      return this.isAuthenticated;
    },
  },

  actions: {
    // 验证token是否有效
    async validateToken(token: string): Promise<boolean> {
      try {
        const user = await getUserInfo(token);
        if (user) {
          this.user = user;
          return true;
        }
        return false;
      } catch (error) {
        return false;
      }
    },

    // 初始化用户状态（从 localStorage 恢复）
    async init(): Promise<void> {
      if (this.token) {
        try {
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

      this.isInitialized = true;
    },

    // 登录
    async login(credentials: {
      email: string;
      password: string;
      remember?: boolean;
    }): Promise<void> {
      try {
        const { user, token } = await login(
          credentials.email,
          credentials.password
        );
        this.setUserState(user, token);
        this.persistUserState();
      } catch (error) {
        this.clearUserState();
        throw error;
      }
    },

    // 注册
    async register(userData: {
      email: string;
      password: string;
      username: string;
      phone?: string;
    }): Promise<void> {
      try {
        const { user, token } = await register(userData);
        this.setUserState(user, token);
        this.persistUserState();
      } catch (error) {
        this.clearUserState();
        throw error;
      }
    },

    // 登出
    async logout(): Promise<void> {
      try {
        await logout();
        this.clearUserState();
      } catch (error) {
        console.error("Logout failed:", error);
        throw error;
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

    // 更新购物车数量
    updateCartCount(): void {
      this.cartCount = this.cart.reduce(
        (total, item) => total + item.quantity,
        0
      );
    },

    // 持久化购物车数据
    persistCart(): void {
      localStorage.setItem("cart", JSON.stringify(this.cart));
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

    // // 更新购物车数量
    // updateCartCount(): void {
    //   this.cartCount = this.cart.reduce((total: number, item: CartItem) => total + item.quantity, 0);
    // },

    // // 持久化购物车数据
    // persistCart(): void {
    //   localStorage.setItem("cart", JSON.stringify(this.cart));
    // },

    // 清除所有状态
    clearState(): void {
      this.user = null;
      this.token = null;
      this.cartCount = 0;
      this.cart = [];
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
    },
  },
});
