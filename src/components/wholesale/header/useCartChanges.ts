import { useState, useEffect } from 'react';

import { useCartStore } from '@/stores/cartStore';

export const useCartChanges = (priceId: string) => {
  const { carts } = useCartStore();
  const [cartVersion, setCartVersion] = useState(0);

  useEffect(() => {
    setCartVersion(prev => prev + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carts[priceId]]);

  return cartVersion;
};
