import type {
  Product,
  Category,
  Brand,
  Banner,
  User,
  Address,
  Order,
  ApiResponse,
  CartItem,
} from "./types";
import {
  products,
  categories,
  brands,
  banners,
  users,
  addresses,
  orders,
} from "./mock";

// 通用的延迟函数
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// 通用的响应包装函数
const wrapResponse = <T>(data: T): ApiResponse<T> => ({
  code: 200,
  message: "success",
  data,
});

// 产品相关服务
export const productService = {
  // 获取产品列表
  async getProducts(
    params: {
      page?: number;
      pageSize?: number;
      categoryId?: number;
      brandId?: number;
    } = {}
  ) {
    await delay(500);
    const { page = 1, pageSize = 10, categoryId, brandId } = params;
    let filteredProducts = [...products];

    if (categoryId) {
      filteredProducts = filteredProducts.filter(
        (p) => p.categoryId === categoryId
      );
    }
    if (brandId) {
      filteredProducts = filteredProducts.filter((p) => p.brandId === brandId);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return wrapResponse({
      items: filteredProducts.slice(start, end),
      total: filteredProducts.length,
    });
  },

  // 获取产品详情
  async getProduct(id: number) {
    await delay(300);
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error("Product not found");
    }
    return wrapResponse(product);
  },
};

// 分类相关服务
export const categoryService = {
  // 获取分类列表
  async getCategories() {
    await delay(300);
    return wrapResponse(categories);
  },

  // 获取分类详情
  async getCategory(id: number) {
    await delay(200);
    const category = categories.find((c) => c.id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    return wrapResponse(category);
  },
};

// 品牌相关服务
export const brandService = {
  // 获取品牌列表
  async getBrands() {
    await delay(300);
    return wrapResponse(brands);
  },

  // 获取品牌详情
  async getBrand(id: number) {
    await delay(200);
    const brand = brands.find((b) => b.id === id);
    if (!brand) {
      throw new Error("Brand not found");
    }
    return wrapResponse(brand);
  },
};

// Banner相关服务
export const bannerService = {
  // 获取Banner列表
  async getBanners() {
    await delay(300);
    return wrapResponse(banners);
  },
};

// 用户相关服务
export const userService = {
  // 登录
  async login(params: { email: string; password: string }) {
    await delay(500);
    const user = users[0]; // 模拟返回第一个用户
    return wrapResponse({ token: "mock_token", user });
  },

  // 注册
  async register(params: {
    username: string;
    email: string;
    password: string;
  }) {
    await delay(500);
    const user = users[0]; // 模拟返回第一个用户
    return wrapResponse({ token: "mock_token", user });
  },

  // 获取用户信息
  async getUserInfo() {
    await delay(300);
    return wrapResponse(users[0]);
  },

  // 更新用户信息
  async updateUserInfo(params: Partial<User>) {
    await delay(500);
    Object.assign(users[0], params);
    return wrapResponse(users[0]);
  },
};

// 地址相关服务
export const addressService = {
  // 获取地址列表
  async getAddresses() {
    await delay(300);
    return wrapResponse(addresses);
  },

  // 添加地址
  async addAddress(params: Omit<Address, "id">) {
    await delay(500);
    const newAddress: Address = {
      ...params,
      id: addresses.length + 1,
    };
    addresses.push(newAddress);
    return wrapResponse(newAddress);
  },

  // 更新地址
  async updateAddress(id: number, params: Partial<Address>) {
    await delay(500);
    const address = addresses.find((a) => a.id === id);
    if (!address) {
      throw new Error("Address not found");
    }
    Object.assign(address, params);
    return wrapResponse(address);
  },

  // 删除地址
  async deleteAddress(id: number) {
    await delay(500);
    const index = addresses.findIndex((a) => a.id === id);
    if (index > -1) {
      addresses.splice(index, 1);
    }
    return wrapResponse(true);
  },
};

// 购物车相关服务
export const cartService = {
  // 获取购物车列表
  async getCartItems() {
    await delay(300);
    const cartItems: CartItem[] = products.slice(0, 3).map((product) => ({
      id: product.id,
      userId: 1,
      productId: product.id,
      quantity: 1,
      product,
      selected: true,
    }));
    return wrapResponse(cartItems);
  },

  // 添加到购物车
  async addToCart(params: { productId: number; quantity: number }) {
    await delay(500);
    return wrapResponse(true);
  },

  // 更新购物车商品数量
  async updateCartItem(id: number, quantity: number) {
    await delay(500);
    return wrapResponse(true);
  },

  // 删除购物车商品
  async removeFromCart(id: number) {
    await delay(500);
    return wrapResponse(true);
  },

  // 清空购物车
  async clearCart() {
    await delay(500);
    return wrapResponse(true);
  },
};

// 订单相关服务
export const orderService = {
  // 获取订单列表
  async getOrders(
    params: { page?: number; pageSize?: number; status?: Order["status"] } = {}
  ) {
    await delay(500);
    const { page = 1, pageSize = 10, status } = params;
    let filteredOrders = [...orders];

    if (status) {
      filteredOrders = filteredOrders.filter((o) => o.status === status);
    }

    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return wrapResponse({
      items: filteredOrders.slice(start, end),
      total: filteredOrders.length,
    });
  },

  // 获取订单详情
  async getOrder(id: string) {
    await delay(300);
    const order = orders.find((o) => o.id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    return wrapResponse(order);
  },

  // 创建订单
  async createOrder(params: {
    addressId: number;
    products: Array<{ productId: number; quantity: number }>;
  }) {
    await delay(800);
    const newOrder: Order = {
      id: `${Date.now()}`,
      userId: 1,
      products: params.products.map((item) => {
        const product = products.find((p) => p.id === item.productId)!;
        return {
          id: item.productId,
          quantity: item.quantity,
          price: product.price,
          product,
        };
      }),
      total: 0,
      status: "pending",
      address: addresses[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    newOrder.total = newOrder.products.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    orders.unshift(newOrder);
    return wrapResponse(newOrder);
  },

  // 取消订单
  async cancelOrder(id: string) {
    await delay(500);
    const order = orders.find((o) => o.id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = "cancelled";
    return wrapResponse(true);
  },

  // 支付订单
  async payOrder(id: string) {
    await delay(800);
    const order = orders.find((o) => o.id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = "paid";
    return wrapResponse(true);
  },

  // 确认收货
  async confirmOrder(id: string) {
    await delay(500);
    const order = orders.find((o) => o.id === id);
    if (!order) {
      throw new Error("Order not found");
    }
    order.status = "completed";
    return wrapResponse(true);
  },
};
