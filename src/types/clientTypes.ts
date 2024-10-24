import type { ShippingAddress } from "./shippingTypes";

export interface TypeClient {
  userId: string;
  displayName: string;
  pictureUrl: string;
  userType: string;
  idType: string;
  shippingAddresses?: ShippingAddress[]
}
