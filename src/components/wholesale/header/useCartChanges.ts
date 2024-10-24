import { useState, useEffect } from 'react';

import { useCartStore } from '@/stores/cartStore';

export const useCartChanges = (priceId: string) => {
  const { carts } = useCartStore();
  const [cartVersion, setCartVersion] = useState(0);

  useEffect(() => {
    setCartVersion(prev => prev + 1);
  }, [carts[priceId]]);

  return cartVersion;
};
