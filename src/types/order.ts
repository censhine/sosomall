export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  specs?: Record<string, string>;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createTime: string;
  updateTime: string;
  payTime?: string;
  shipTime?: string;
  completeTime?: string;
  cancelTime?: string;
  address: {
    recipient: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    detail: string;
  };
  paymentMethod?: string;
  deliveryMethod?: string;
  remark?: string;
}
