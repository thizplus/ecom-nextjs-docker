import { create } from 'zustand'

import actionGetStoreConfig from '@/actions/backend/setting/getStoreConfig'

interface LineLogin {
  LINE_CHANNEL_ID: string;
  LINE_CHANNEL_SECRET: string;
}

interface LineNotification {
  LINE_NOTIFY_TOKEN: string;
  NOTIFY_ENABLED: boolean;
}

interface LineMessage {
  CHANNEL_ACCESS_TOKEN: string;
  CHANNEL_SECRET: string;
  MESSAGE_ENABLED: boolean;
}

interface SlipOK {
  API_URL: string;
  API_KEY: string;
  ENABLED: boolean;
}

interface ShippingCost {
  standard: {
    value: number;
    cost: number;
  };
  special: {
    value: number;
  };
}

interface SaleModel {
  minOrderStatus: boolean;
  minOrderValue: number;
  type: string;
  listPrice: Array<{
    id: string;
    name: string;
    minPurchase: number;
    LIFF_ID: string;
  }>;
}

interface StoreConfig {
  lineLogin: LineLogin;
  lineNotification: LineNotification;
  lineMessage: LineMessage;
  slipOK: SlipOK;
  shippingCost: ShippingCost;
  saleModel: SaleModel;
}

interface ConfigState {
  config: StoreConfig | null;
  loading: boolean;
  error: string | null;
  fetchConfig: () => Promise<void>;
}

export const useConfigStore = create<ConfigState>((set, get) => ({
  config: null,
  loading: false,
  error: null,
  fetchConfig: async () => {
    // ถ้ามี config อยู่แล้วและไม่ได้กำลัง loading ให้ return เลย
    if (get().config && !get().loading) return;

    set({ loading: true });

    try {
      const result = await actionGetStoreConfig();

      set({ config: result, loading: false, error: null });
    } catch (error) {
      console.error('Failed to fetch store config:', error);
      set({ error: 'Failed to fetch store config', loading: false });
    }
  },
}));
