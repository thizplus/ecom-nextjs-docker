// hooks/useBulkUsers.ts
import { useQuery } from '@tanstack/react-query';

interface User {
  userId: string;
  displayName: string;
  pictureUrl?: string;
}

export const useBulkUsers = (userIds: string[]) => {
  return useQuery<User[]>({
    queryKey: ['bulkUsers', userIds],
    queryFn: async () => {
      // ถ้าไม่มี userIds ให้ return array ว่าง
      if (!userIds?.length) return [];

      const validUserIds = userIds.filter(id => id); // กรอง empty string ออก

      if (validUserIds.length === 0) return [];

      console.log('Fetching users with IDs:', validUserIds); // เพิ่ม log

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/clients/bulk?ids=${validUserIds.join(',')}`
      );

      if (!response.ok) {
        const errorData = await response.json();

        console.error('API Error:', errorData); // เพิ่ม log
        throw new Error(errorData.message || 'Failed to fetch users');
      }

      const data = await response.json();

      console.log('Received data:', data); // เพิ่ม log

      return data;
    },
    enabled: Boolean(userIds?.length), // เช็คว่ามี userIds จริงๆ
    staleTime: 30000, // cache 30 วินาที
  });
};
