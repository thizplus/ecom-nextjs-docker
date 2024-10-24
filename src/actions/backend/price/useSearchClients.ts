// hooks/useSearchClients.ts
import { useQuery } from '@tanstack/react-query';

interface Client {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export const useSearchClients = (searchTerm: string) => {
  return useQuery<Client[]>({
    queryKey: ['clients', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/clients/search?query=${encodeURIComponent(searchTerm)}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch clients');
      }

      return response.json();
    },
    enabled: searchTerm.length >= 2
  });
};
