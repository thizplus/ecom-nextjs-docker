// types/productTypes.ts
import type { ObjectId } from "mongodb";



export interface IListPrice {
  _id?: string; // optional เพราะอาจจะเป็นข้อมูลใหม่
  priceId: string;
  priceName: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TypesProduct {
  _id: ObjectId;
  id: number;
  __v: number;
  name: string;
  sku: string;
  stock: number;
  availablestock: number;
  imagepath: string | null;
  categoryid: number | null;
  category: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  listPrice?: IListPrice[]; // เพิ่ม type annotation ที่ชัดเจน
}

// Type สำหรับ API Response
export interface ProductResponse {
  items: TypesProduct[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

// ถ้าต้องการเก็บ Type สำหรับการอัพเดทราคา
export interface UpdatePricePayload {
  sku: string;
  priceId: string;
  price: number;
}



export type TypesProductInner = {
  id: string;
  sku: string;
  name: string;
  price: number;
  stock: number;
  availablestock: number;
}



export type TypesProductWholesale = {
  _id: ObjectId;
  id: number;
  __v: number;
  name: string;
  sku: string;
  stock: number;
  availablestock: number;
  imagepath: string | null;
  categoryid: number | null;
  category: string | null;
  price: number | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
