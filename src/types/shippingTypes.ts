export interface ShippingAddress {
  _id: string;
  cusName: string;
  cusTel: string;
  addressNo: string;
  district: string;
  amphoe: string;
  province: string;
  zipcode: string;
  isDefault: boolean;
}

export type NewShippingAddress = Omit<ShippingAddress, '_id' | 'isDefault'>;
