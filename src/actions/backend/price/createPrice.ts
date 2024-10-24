type PropsCreatePrice = {
  priceName: string;
  defaultPrice: number;
  copyFromId: string | null;
};

const actionCreatePrice = async ({ priceName, defaultPrice, copyFromId }: PropsCreatePrice) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceName, defaultPrice, copyFromId })
    });

    if (!response.ok) {
      throw new Error('Price creation failed');
    }

    const result = await response.json();


    return result;
  } catch (error) {
    console.error('Error during price creation:', error);
    throw error;
  }
};

export default actionCreatePrice;
