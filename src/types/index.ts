export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  image: string;
  images: string[];
  stock: number;
  sales: number;
  rating: number;
  specs: {
    Color: string;
    Size: string;
  };
  categoryId: number;
  brandId: number;
}

export interface Category {
  id: number;
  name: string;
  image: string;
  description: string;
}

export interface Brand {
  id: number;
  name: string;
  logo: string;
  description: string;
  image: string;
}

export interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  nickname: string;
  avatar: string;
  phone: string;
  createdAt: string;
  password?: string;
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
  isDefault: boolean;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: string;
  userId: number;
  products: OrderItem[];
  total: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface State {
  cart: CartItem[];
  user: User | null;
  locale: string;
}
