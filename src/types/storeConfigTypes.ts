// Type for the Line Login configuration
export interface LineLoginConfig {
  LINE_LIFF_ID: string;
}

export interface LineNotificationConfig {
  LINE_NOTIFY_TOKEN: string;
  NOTIFY_ENABLED: boolean;
}

export interface LineMessageConfig {
  CHANNEL_ACCESS_TOKEN: string;
  CHANNEL_SECRET: string;
  MESSAGE_ENABLED: boolean;
}

export interface SlipOKConfig {
  API_URL: string;
  API_KEY: string;
  ENABLED: boolean;
}

// Type for each item in the listPrice array
export interface ListPrice {
  id: string;
  name: string;
  minPurchase: number;
  LIFF_ID: string;
}

// Type for the Sale Model configuration
export interface SaleModelConfig {
  minOrderStatus: boolean;
  minOrderValue: number;
  type: 'single' | 'multiple';
  listPrice: ListPrice[];
}

// Type for the Standard Shipping Cost configuration
export interface StandardShippingCost {
  value: number;
  cost: number;
}

// Type for the Special Shipping Cost configuration
export interface SpecialShippingCost {
  value: number;
}

// Type for the Shipping Cost configuration
export interface ShippingCostConfig {
  standard: StandardShippingCost;
  special: SpecialShippingCost;
}

// Main Config Type
export interface StoreConfig {
  lineLogin: LineLoginConfig;
  lineNotification: LineNotificationConfig;
  lineMessage: LineMessageConfig;
  slipOK: SlipOKConfig;
  saleModel: SaleModelConfig;
  shippingCost: ShippingCostConfig;
}
