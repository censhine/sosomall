export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  description: string;
  image: string;
  images?: string[];
  stock: number;
  sales: number;
  rating: number;
  specs?: Record<string, string>;
  categoryId: number;
  brandId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  image: string;
  parentId?: number;
}

export interface Brand {
  id: number;
  name: string;
  description: string;
  logo: string;
  image: string;
}

export interface Banner {
  id: number;
  title: string;
  image: string;
  link: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  avatar?: string;
  nickname?: string;
  createdAt: string;
}

export interface Address {
  id: number;
  userId: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault?: boolean;
}

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product: Product;
  selected?: boolean;
}

export interface Order {
  id: string;
  userId: number;
  products: Array<{
    id: number;
    quantity: number;
    price: number;
    product: Product;
  }>;
  total: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
