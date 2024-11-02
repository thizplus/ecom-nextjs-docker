import { useState, useEffect, useCallback } from 'react';

import type { TypeOrder } from '@/types/orderTypes';

interface UsePendingOrdersReturn {
  pendingOrder: TypeOrder | null;
  isLoading: boolean;
  error: string | null;
  refreshPendingOrders: () => Promise<void>;
}

interface UsePendingOrdersProps {
  userId: string | undefined;
  typeId: string;
  isLoggedIn: boolean;
}

export const usePendingOrders = ({ userId, typeId, isLoggedIn }: UsePendingOrdersProps): UsePendingOrdersReturn => {
  const [pendingOrder, setPendingOrder] = useState<TypeOrder | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPendingOrders = useCallback(async () => {
    if (!userId || !isLoggedIn || !typeId) {
      setPendingOrder(null);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/pending/latest/${userId}/${typeId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch pending orders');
      }

      const data = await response.json();

      setPendingOrder(data.order);
    } catch (err) {
      console.error('Error fetching pending orders:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [userId, typeId, isLoggedIn]);

  useEffect(() => {
    fetchPendingOrders();
  }, [fetchPendingOrders]);

  return {
    pendingOrder,
    isLoading,
    error,
    refreshPendingOrders: fetchPendingOrders
  };
};
