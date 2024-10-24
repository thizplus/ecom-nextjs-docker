// actions/backend/category/useCategoryStatus.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface UpdateStatusParams {
  categoryId: string;
  active: boolean;
}

const updateStatus = async ({ categoryId, active }: UpdateStatusParams) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category/update-status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryId, active }),
  });

  if (!response.ok) {
    throw new Error('Failed to update status');
  }

  return response.json();
};

export const useCategoryStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};
