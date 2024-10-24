import { create } from 'zustand';

import type { ShippingAddress } from '@/types/shippingTypes';

interface ShippingState {
  selectedAddress: ShippingAddress | null;
  setSelectedAddress: (address: ShippingAddress | null) => void;
}

export const useShippingStore = create<ShippingState>((set) => ({
  selectedAddress: null,
  setSelectedAddress: (address) => set({ selectedAddress: address }),
}));
