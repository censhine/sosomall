export interface ApiResponse<T = any> {
  code: number;
  data: T;
  message: string;
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link: string;
  sort: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  image: string;
  sales: number;
  rating: number;
  category: string;
  tags: string[];
  isNew?: boolean;
  isHot?: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  image: string;
  description: string;
  productCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  description: string;
  productCount: number;
}
