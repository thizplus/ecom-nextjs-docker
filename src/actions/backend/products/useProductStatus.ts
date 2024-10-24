// hooks/useProductStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateProductStatusParams {
  productId: string;
  active: boolean;
}

export const useProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, active }: UpdateProductStatusParams) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/update-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, active }),
      });

      if (!response.ok) {
        const errorData = await response.json();

        throw new Error(errorData.message || 'Failed to update product status');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
