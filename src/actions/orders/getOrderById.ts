// @/actions/orders/getOrderById.ts

import type { TypeOrder } from "@/types/orderTypes";

interface GetOrderByIdParams {
  orderId: string;
  userId: string;
}

const actionGetOrderById = async ({ orderId, userId }: GetOrderByIdParams): Promise<TypeOrder> => {
  try {
    const queryParams = new URLSearchParams({ userId });

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${orderId}?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'

        // ถ้ามีการใช้ token สำหรับ authentication ให้เพิ่ม header ตรงนี้
      }
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || 'Failed to fetch order');
    }

    const orderData: TypeOrder = await response.json();


    return orderData;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export default actionGetOrderById;
