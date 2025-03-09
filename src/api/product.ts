import request from "@/utils/request";
import type { Product } from "@/types/home";
import type { ApiResponse } from "@/types/home";

export interface ProductDetail extends Product {
  description: string;
  specifications: Record<string, string>;
  images: string[];
  reviews: ProductReview[];
  relatedProducts: Product[];
}

export interface ProductReview {
  id: number;
  user: {
    id: number;
    name: string;
    avatar: string;
  };
  rating: number;
  content: string;
  images?: string[];
  createdAt: string;
}

export interface ProductQueryParams {
  categoryId?: number;
  brandId?: number;
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "price" | "rating" | "sales";
  order?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 获取商品详情
 */
export function getProductDetail(id: number) {
  return request.get<any, ApiResponse<ProductDetail>>(`/products/${id}`);
}

/**
 * 获取商品列表
 */
export function getProductList(params: ProductQueryParams) {
  return request.get<any, ApiResponse<ProductListResponse>>("/products", {
    params,
  });
}

/**
 * 获取商品评论列表
 */
export function getProductReviews(productId: number, page = 1, limit = 10) {
  return request.get<
    any,
    ApiResponse<{ items: ProductReview[]; total: number }>
  >(`/products/${productId}/reviews`, {
    params: { page, limit },
  });
}

/**
 * 添加商品评论
 */
export interface AddReviewParams {
  productId: number;
  rating: number;
  content: string;
  images?: string[];
}

export function addProductReview(data: AddReviewParams) {
  return request.post<any, ApiResponse<ProductReview>>("/reviews", data);
}

/**
 * 获取相关商品推荐
 */
export function getRelatedProducts(productId: number, limit = 6) {
  return request.get<any, ApiResponse<Product[]>>(
    `/products/${productId}/related`,
    {
      params: { limit },
    }
  );
}
