import request from "@/utils/request";
import type { ApiResponse, Product } from "@/types/home";

export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  selected: boolean;
}

export interface AddToCartParams {
  productId: number;
  quantity: number;
}

export interface UpdateCartParams {
  id: number;
  quantity?: number;
  selected?: boolean;
}

/**
 * 获取购物车列表
 */
export function getCartList() {
  return request.get<any, ApiResponse<CartItem[]>>("/cart");
}

/**
 * 添加商品到购物车
 */
export function addToCart(data: AddToCartParams) {
  return request.post<any, ApiResponse<CartItem>>("/cart", data);
}

/**
 * 更新购物车商品
 */
export function updateCart(data: UpdateCartParams) {
  return request.put<any, ApiResponse<CartItem>>(`/cart/${data.id}`, data);
}

/**
 * 删除购物车商品
 */
export function removeFromCart(id: number) {
  return request.delete<any, ApiResponse<null>>(`/cart/${id}`);
}

/**
 * 清空购物车
 */
export function clearCart() {
  return request.delete<any, ApiResponse<null>>("/cart");
}

/**
 * 批量选择/取消选择购物车商品
 */
export function batchUpdateCartSelection(selected: boolean, ids?: number[]) {
  return request.put<any, ApiResponse<null>>("/cart/selection", {
    selected,
    ids,
  });
}

/**
 * 获取购物车商品总数
 */
export function getCartCount() {
  return request.get<any, ApiResponse<number>>("/cart/count");
}
