export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export interface Banner {
  id: number;
  title: string;
  image: string;
  link: string;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  stock: number;
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
}
