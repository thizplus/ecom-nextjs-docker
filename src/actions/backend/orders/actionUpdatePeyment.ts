type PropsUpdatePaymentStatus = {
  orderId: string;
  amount: number;
  slipUrl: string;
  verifyResult: any; // เพิ่ม verifyResult
};

const actionUpdatePaymentStatus = async ({ orderId, amount, slipUrl, verifyResult }: PropsUpdatePaymentStatus) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${orderId}/payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, slipUrl, verifyResult })
    });

    if (!response.ok) {
      const errorData = await response.json();

      throw new Error(errorData.message || 'Payment status update failed');
    }

    const result = await response.json();


    return result;
  } catch (error) {
    console.error('Error during payment status update:', error);
    throw error;
  }
};

export default actionUpdatePaymentStatus;
