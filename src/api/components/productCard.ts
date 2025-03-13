import request from "@/utils/request";
import type { ApiResponse, Product } from "@/types/home";

export interface ProductCardAction {
  type: "view" | "addToCart" | "addToWishlist";
  productId: number;
  timestamp: string;
}

/**
 * 记录商品卡片交互行为
 */
export function logProductCardAction(data: ProductCardAction) {
  return request.post<any, ApiResponse<null>>("/analytics/product-card", data);
}

/**
 * 获取商品快速预览数据
 */
export function getProductQuickView(productId: number) {
  return request.get<
    any,
    ApiResponse<
      Product & {
        description: string;
        specifications: Record<string, string>;
        images: string[];
      }
    >
  >(`/products/${productId}/quick-view`);
}

/**
 * 检查商品库存状态
 */
export function checkProductStock(productId: number) {
  return request.get<
    any,
    ApiResponse<{
      inStock: boolean;
      availableQuantity: number;
      expectedRestockDate?: string;
    }>
  >(`/products/${productId}/stock`);
}

/**
 * 获取商品实时价格（包含促销信息）
 */
export function getProductRealTimePrice(productId: number) {
  return request.get<
    any,
    ApiResponse<{
      price: number;
      originalPrice?: number;
      discount?: number;
      promotions?: Array<{
        type: string;
        description: string;
        discount: number;
      }>;
    }>
  >(`/products/${productId}/price`);
}
