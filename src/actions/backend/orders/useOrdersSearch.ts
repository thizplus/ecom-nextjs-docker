// hooks/useOrdersSearch.ts
import { useQuery } from "@tanstack/react-query";

import type { TypeOrder } from "@/types/orderTypes";

interface PaginatedResponse {
  items: TypeOrder[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

const useOrdersSearch = (query: string, page: number, limit: number) => {
  return useQuery<PaginatedResponse, Error>({
    queryKey: ['searchOrders', query, page, limit],
    queryFn: async () => {
      if (!query.trim()) {
        return {
          items: [],
          totalItems: 0,
          totalPages: 0,
          currentPage: 1
        };
      }

      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;

      console.log('Searching orders from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text();

        console.error('API Response:', text);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      return {
        items: data.items || [],
        totalItems: data.totalItems || 0,
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1
      };
    },
    enabled: !!query.trim(),
  });
};

export default useOrdersSearch;
