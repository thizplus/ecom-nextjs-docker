import type { TypeOrder } from '@/types/orderTypes';

export const sendLineNotification = async (orderData: TypeOrder) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/line/notification/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('Line Notification sent successfully');

    return data;
  } catch (error) {
    console.error('Error sending Line Notification:', error);
    throw error;
  }
};
