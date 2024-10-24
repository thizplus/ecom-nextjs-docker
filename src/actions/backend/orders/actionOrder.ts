// @/actions/orders/createOrder.ts

import type { TypeOrder } from "@/types/orderTypes";


const actionCreateOrder = async (orderData: TypeOrder) => {
  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'// ถ้ามีการใช้ token สำหรับ authentication
      },
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || 'Failed to create order');
    }

    const createdOrder = await response.json();

    // console.log('Created Order:', createdOrder);

    return createdOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export default actionCreateOrder;
