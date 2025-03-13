import request from "@/utils/request";
import type { ApiResponse } from "@/types/home";
import type { Order } from "./checkout";

export interface UserStats {
  orderCount: number;
  wishlistCount: number;
  reviewCount: number;
  couponCount: number;
}

export interface OrderQueryParams {
  status?: Order["status"];
  page?: number;
  limit?: number;
}

export interface WishlistItem {
  id: number;
  productId: number;
  product: {
    id: number;
    name: string;
    image: string;
    price: number;
    originalPrice?: number;
    discount?: number;
  };
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minAmount?: number;
  startDate: string;
  endDate: string;
  used: boolean;
  description: string;
}

/**
 * 获取用户统计数据
 */
export function getUserStats() {
  return request.get<any, ApiResponse<UserStats>>("/user/stats");
}

/**
 * 获取用户订单列表
 */
export function getUserOrders(params: OrderQueryParams) {
  return request.get<any, ApiResponse<{ items: Order[]; total: number }>>(
    "/user/orders",
    {
      params,
    }
  );
}

/**
 * 获取用户收藏列表
 */
export function getWishlist(page = 1, limit = 10) {
  return request.get<
    any,
    ApiResponse<{ items: WishlistItem[]; total: number }>
  >("/user/wishlist", {
    params: { page, limit },
  });
}

/**
 * 添加商品到收藏
 */
export function addToWishlist(productId: number) {
  return request.post<any, ApiResponse<WishlistItem>>("/user/wishlist", {
    productId,
  });
}

/**
 * 从收藏中移除商品
 */
export function removeFromWishlist(id: number) {
  return request.delete<any, ApiResponse<null>>(`/user/wishlist/${id}`);
}

/**
 * 获取用户优惠券列表
 */
export function getUserCoupons(status?: "unused" | "used" | "expired") {
  return request.get<any, ApiResponse<Coupon[]>>("/user/coupons", {
    params: { status },
  });
}

/**
 * 领取优惠券
 */
export function claimCoupon(code: string) {
  return request.post<any, ApiResponse<Coupon>>("/user/coupons/claim", {
    code,
  });
}

/**
 * 检查优惠券是否可用
 */
export function checkCoupon(code: string, amount: number) {
  return request.post<any, ApiResponse<{ valid: boolean; discount: number }>>(
    "/user/coupons/check",
    {
      code,
      amount,
    }
  );
}
