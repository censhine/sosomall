import request from "@/utils/request";
import type {
  Banner,
  Product,
  Category,
  Brand,
  ApiResponse,
} from "@/types/home";

/**
 * 获取轮播图列表
 */
export function getBanners() {
  return request.get<any, ApiResponse<Banner[]>>("/banners");
}

/**
 * 获取热卖商品列表
 * @param params 查询参数
 */
export function getHotProducts(params?: { limit?: number }) {
  return request.get<any, ApiResponse<Product[]>>("/products/hot", { params });
}

/**
 * 获取新品上架商品列表
 * @param params 查询参数
 */
export function getNewProducts(params?: { limit?: number }) {
  return request.get<any, ApiResponse<Product[]>>("/products/new", { params });
}

/**
 * 获取商品分类列表
 */
export function getCategories() {
  return request.get<any, ApiResponse<Category[]>>("/categories");
}

/**
 * 获取品牌列表
 * @param params 查询参数
 */
export function getBrands(params?: { limit?: number }) {
  return request.get<any, ApiResponse<Brand[]>>("/brands", { params });
}

// 模拟数据
const mockBanners = [
  {
    id: 1,
    title: "新品上市",
    image: "https://via.placeholder.com/1200x400",
    link: "/products/new",
  },
  {
    id: 2,
    title: "限时特惠",
    image: "https://via.placeholder.com/1200x400",
    link: "/products/sale",
  },
];

const mockHotProducts = [
  {
    id: 1,
    name: "商品1",
    image: "https://via.placeholder.com/300",
    price: 199,
    originalPrice: 299,
    rating: 4.5,
  },
  {
    id: 2,
    name: "商品2",
    image: "https://via.placeholder.com/300",
    price: 299,
    originalPrice: 399,
    rating: 4.8,
  },
];

const mockNewProducts = [
  {
    id: 3,
    name: "新品1",
    image: "https://via.placeholder.com/300",
    price: 399,
    rating: 5,
  },
  {
    id: 4,
    name: "新品2",
    image: "https://via.placeholder.com/300",
    price: 499,
    rating: 4.9,
  },
];

const mockCategories = [
  {
    id: 1,
    name: "电子产品",
    image: "https://via.placeholder.com/300",
    description: "最新的电子产品",
  },
  {
    id: 2,
    name: "服装",
    image: "https://via.placeholder.com/300",
    description: "时尚服装",
  },
];

const mockBrands = [
  {
    id: 1,
    name: "品牌1",
    logo: "https://via.placeholder.com/200",
  },
  {
    id: 2,
    name: "品牌2",
    logo: "https://via.placeholder.com/200",
  },
];

// API 函数
export const getBannersMock = () => {
  return Promise.resolve({ data: mockBanners });
};

export const getHotProductsMock = () => {
  return Promise.resolve({ data: mockHotProducts });
};

export const getNewProductsMock = () => {
  return Promise.resolve({ data: mockNewProducts });
};

export const getCategoriesMock = () => {
  return Promise.resolve({ data: mockCategories });
};

export const getBrandsMock = () => {
  return Promise.resolve({ data: mockBrands });
};
