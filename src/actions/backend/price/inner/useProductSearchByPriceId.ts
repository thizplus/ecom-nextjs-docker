// useProductSearchByPriceId.ts

import { useQuery } from "@tanstack/react-query";

import type { TypesProductInner } from "@/types/productTypes";

interface PaginatedProductResponse {
  items: TypesProductInner[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  priceId: string;
  priceName: string;
  allowedUsers: string[]; // เพิ่ม field นี้
}

const useProductSearchByPriceId = (priceId: string, query: string, page: number, limit: number) => {
  return useQuery<PaginatedProductResponse, Error>({
    queryKey: ['productSearchByPriceId', priceId, query, page, limit],
    queryFn: async () => {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/products/${priceId}/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;

      console.log('Searching products data from:', url);

      const response = await fetch(url);

      if (!response.ok) {
        const text = await response.text();

        console.error('API Response:', text);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      console.log('API search products data received:', data);

      return {
        items: data.items || [],
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        priceId: data.priceId,
        priceName: data.priceName,
        allowedUsers: data.allowedUsers || [] // กำหนดค่าเริ่มต้นเป็น array ว่าง
      };
    },
    placeholderData: (previousData) => previousData,
    enabled: !!query, // Only run the query if there's a search query
  });
};

export default useProductSearchByPriceId;
