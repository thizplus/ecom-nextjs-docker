// hooks/usePriceLevels.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface PriceLevel {
  id: string;
  name: string;
  minPurchase: number;
  allowedUsers?: string[];
  LIFF_ID?: string;
}

interface StoreConfig {
  saleModel: {
    listPrice: PriceLevel[];
  };
}

export const usePriceLevels = (userId: string) => {
  const queryClient = useQueryClient();

  // Fetch all price levels
  const { data: config, isLoading } = useQuery<StoreConfig>({
    queryKey: ['store-config'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/config`);

      if (!response.ok) throw new Error('Failed to fetch config');

      return response.json();
    }
  });

  // Get all available price levels
  const priceLevels = config?.saleModel?.listPrice?.map(price => ({
    id: price.id,
    name: price.name
  })) || [];

  // Get price levels that user has access to
  const userPriceLevels = config?.saleModel?.listPrice
    ?.filter(price => price.allowedUsers?.includes(userId))
    .map(price => ({
      id: price.id,
      name: price.name
    })) || [];

  // Mutation for updating user's price levels
  const updatePriceLevels = useMutation({
    mutationFn: async (priceIds: string[]) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/clients/update-prices`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, priceIds }),
      });

      if (!response.ok) {
        throw new Error('Failed to update prices');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ['store-config'] });
      queryClient.invalidateQueries({ queryKey: ['client'] });
      queryClient.invalidateQueries({ queryKey: ['searchClient'] });
    },
  });

  return {
    priceLevels,
    userPriceLevels,
    updatePriceLevels,
    isLoading
  };
};
