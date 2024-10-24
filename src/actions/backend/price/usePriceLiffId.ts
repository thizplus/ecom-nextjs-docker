// hooks/usePriceLiffId.ts
import { useState } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UsePriceLiffIdProps {
  priceId: string;
}

export const usePriceLiffId = ({ priceId }: UsePriceLiffIdProps) => {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);

  // Query for getting LIFF ID
  const { data: liffId, isLoading } = useQuery({
    queryKey: ['priceLiffId', priceId],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/liff/${priceId}`);

      if (!response.ok) throw new Error('Failed to fetch LIFF ID');
      const data = await response.json();


      return data.liffId;
    }
  });

  // Mutation for updating LIFF ID
  const updateLiffId = useMutation({
    mutationFn: async (newLiffId: string) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/liff-update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId, liffId: newLiffId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update LIFF ID');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['priceLiffId', priceId] });
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : 'An error occurred');
    },
  });

  return {
    liffId,
    isLoading,
    error,
    updateLiffId: updateLiffId.mutate,
    isUpdating: updateLiffId.isPending
  };
};
