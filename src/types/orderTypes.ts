// types/orderTypes.ts
import type { ObjectId } from "mongodb";

export interface OrderProduct {
  _id?: ObjectId;
  sku: string;
  name: string;
  price: number;
  qty: number;
  total: number;
}

export interface ShippingInfo {
  _id: string;
  cusName: string;
  cusTel: string;
  addressNo: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  isDefault: boolean;

  // เพิ่ม tracking fields
  trackingNo?: string;
  shippingChannel?: string;
  trackingUpdateAt?: string | Date;
}

export interface PaymentSlip {
  _id?: ObjectId;
  url: string;
  amount: number;
  uploadedAt: Date;
}

export interface Payment {
  status: 'pending' | 'success' | 'cancelled';
  amount: number;
  slip: PaymentSlip[];
}

export type TypeOrder = {
  _id: ObjectId;
  orderId: string;
  typeOrder: string;
  typeId: string;
  userId: string;
  listProducts: OrderProduct[];
  shippingInfo: ShippingInfo;
  shippingCost: number;
  totalAmount: number;
  netTotal: number;
  expire: string | Date;
  payment: Payment;
  zortoutId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  __v: number;
}

export interface OrderResponse {
  items: TypeOrder[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
