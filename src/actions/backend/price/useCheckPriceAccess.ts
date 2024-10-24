import { useState, useEffect, useRef } from 'react';

import { useClientStores } from '@/stores/authStore';

interface PriceConfig {
  id: string;
  name: string;
  minPurchase: number;
  allowedUsers: string[];
}

interface PriceAccess extends PriceConfig {
  hasAccess: boolean;
}

export const useCheckPriceAccess = (priceId: string) => {
  const { user } = useClientStores();
  const [data, setData] = useState<PriceAccess | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const fetchAttempted = useRef(false);

  useEffect(() => {
    const fetchAccess = async () => {
      if (!priceId || fetchAttempted.current) return;

      fetchAttempted.current = true;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/price-access/${priceId}`,
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            }
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const configData: PriceConfig = await response.json();
        const userHasAccess = user?.userId ? configData.allowedUsers.includes(user.userId) : false;

        setData({
          ...configData,
          hasAccess: Array.isArray(configData.allowedUsers)
            ? configData.allowedUsers.length === 0 || userHasAccess
            : false
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.userId || !data) {
      fetchAttempted.current = false;
      fetchAccess();
    }
  }, [priceId, user?.userId]);

  return { data, isLoading, error };
};
