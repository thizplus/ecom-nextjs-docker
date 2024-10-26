import { useQuery } from "@tanstack/react-query";

import type { TypeClient } from "@/types/clientTypes";

interface PaginatedResponse {
  items: TypeClient[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}


const useClientAll = (page: number, limit: number) => {
  return useQuery<PaginatedResponse, Error>({
    queryKey: ['client', page, limit],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/clients/all-client?page=${page}&limit=${limit}`;

      console.log('Fetching data from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text();

        console.error('API Response:', text);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      console.log('API data received:', data);

      // คำนวณ totalItems จาก totalPages และ limit


      return {
        items: data.items || [],
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage
      };
    },
    placeholderData: (previousData) => previousData,
  });
};

export default useClientAll;
