import { useQuery } from "@tanstack/react-query";

import type { TypesProduct } from "@/types/productTypes";

interface PaginatedResponse {
  items: TypesProduct[];
  totalItems: number; // เปลี่ยนจาก totalItems เป็น totalItems ตามโครงสร้างข้อมูลใหม่
  totalPages: number;
  currentPage: number;
}

const useProductSearch = (query: string, page: number, limit: number) => {
  return useQuery<PaginatedResponse, Error>({
    queryKey: ['searchProducts', query, page, limit],
    queryFn: async () => {
      if (!query.trim()) {
        return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
      }

      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      return {
        items: data.items || [],
        totalItems: data.totalItems || 0, // ใช้ totalItems แทน totalItems
        totalPages: data.totalPages || 1,
        currentPage: data.currentPage || 1
      };
    },
    enabled: !!query.trim(),
  });
};

export default useProductSearch;
