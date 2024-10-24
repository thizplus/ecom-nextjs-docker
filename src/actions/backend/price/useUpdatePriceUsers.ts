// hooks/useUpdatePriceUsers.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdatePriceUsers = (priceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userIds: string[]) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/price-users`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ priceId, userIds }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update price users');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['config'] });
    },
  });
};
