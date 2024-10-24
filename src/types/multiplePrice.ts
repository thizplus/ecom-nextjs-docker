import type { ObjectId } from "mongodb";

export type MultiPrice = {
  priceId: string;
  priceName: string;
  price: number;
  updatedAt: Date;
}

export type MultiPriceProduct = {
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
  prices: MultiPrice[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MultiPriceProductInner = {
  id: string;
  sku: string;
  name: string;
  prices: MultiPrice[];
  stock: number;
  availablestock: number;
}
