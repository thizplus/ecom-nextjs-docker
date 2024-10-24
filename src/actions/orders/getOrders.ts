import type { TypeOrder } from "@/types/orderTypes";

interface GetOrdersParams {
  userId: string;
  typeId: string;
  page?: number;
  limit?: number;
}

interface GetOrdersResponse {
  items: TypeOrder[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

const actionGetOrders = async ({ userId, typeId, page = 1, limit = 10 }: GetOrdersParams): Promise<GetOrdersResponse> => {
  try {
    const queryParams = new URLSearchParams({
      userId,
      typeId,
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'

        // ถ้ามีการใช้ token สำหรับ authentication ให้เพิ่ม header ตรงนี้
      }
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || 'Failed to fetch orders');
    }

    const ordersData: GetOrdersResponse = await response.json();


    return ordersData;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export default actionGetOrders;
