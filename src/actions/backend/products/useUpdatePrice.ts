import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdatePriceParams {
  sku: string;
  priceId: string;
  newPrice: number;
}

export const useUpdatePrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sku, priceId, newPrice }: UpdatePriceParams) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/update-price`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sku, priceId, price: newPrice }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || 'Failed to update price');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
