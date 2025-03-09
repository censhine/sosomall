import request from "@/utils/request";
import type { ApiResponse } from "@/types/home";
import type { CartItem } from "./cart";

export interface Address {
  id: number;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: number;
  name: string;
  icon: string;
  description: string;
}

export interface OrderSummary {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface CreateOrderParams {
  addressId: number;
  paymentMethodId: number;
  items: { id: number; quantity: number }[];
  couponCode?: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  items: CartItem[];
  address: Address;
  paymentMethod: PaymentMethod;
  totalQuantity: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  createdAt: string;
  paidAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
}

/**
 * 获取用户地址列表
 */
export function getAddressList() {
  return request.get<any, ApiResponse<Address[]>>("/addresses");
}

/**
 * 添加新地址
 */
export function addAddress(data: Omit<Address, "id">) {
  return request.post<any, ApiResponse<Address>>("/addresses", data);
}

/**
 * 更新地址
 */
export function updateAddress(id: number, data: Partial<Address>) {
  return request.put<any, ApiResponse<Address>>(`/addresses/${id}`, data);
}

/**
 * 删除地址
 */
export function deleteAddress(id: number) {
  return request.delete<any, ApiResponse<null>>(`/addresses/${id}`);
}

/**
 * 设置默认地址
 */
export function setDefaultAddress(id: number) {
  return request.put<any, ApiResponse<null>>(`/addresses/${id}/default`);
}

/**
 * 获取支付方式列表
 */
export function getPaymentMethods() {
  return request.get<any, ApiResponse<PaymentMethod[]>>("/payment-methods");
}

/**
 * 获取订单摘要（购物车商品、价格等）
 */
export function getOrderSummary(itemIds: number[]) {
  return request.post<any, ApiResponse<OrderSummary>>("/orders/summary", {
    itemIds,
  });
}

/**
 * 创建订单
 */
export function createOrder(data: CreateOrderParams) {
  return request.post<any, ApiResponse<Order>>("/orders", data);
}

/**
 * 获取订单详情
 */
export function getOrderDetail(id: number) {
  return request.get<any, ApiResponse<Order>>(`/orders/${id}`);
}

/**
 * 取消订单
 */
export function cancelOrder(id: number) {
  return request.put<any, ApiResponse<null>>(`/orders/${id}/cancel`);
}

/**
 * 支付订单
 */
export function payOrder(id: number) {
  return request.post<any, ApiResponse<{ paymentUrl: string }>>(
    `/orders/${id}/pay`
  );
}
