import type { ObjectId } from "mongodb";

import type { ShippingAddress } from "./shippingTypes";

interface AccessiblePrice {
  id: string;
  name: string;
}

export interface TypeClient {
  _id: ObjectId;
  userId: string;
  displayName: string;
  pictureUrl: string;
  userType: string;
  idType: string;
  shippingAddresses?: ShippingAddress[];
  accessiblePrices?: AccessiblePrice[]; // เพิ่ม field นี้
  createdAt?: Date;
  updatedAt?: Date;
}


export interface TypeClientVerify {
  userId: string;
  displayName: string;
  pictureUrl: string;
  userType: string;
  idType: string;
  shippingAddresses?: ShippingAddress[]
}
