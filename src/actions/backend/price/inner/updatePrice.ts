// File: src/actions/updatePrice.ts

interface UpdatePriceParams {
  sku: string;
  priceId: string;
  newPrice: number;
}

const actionUpdatePrice = async ({ sku, priceId, newPrice }: UpdatePriceParams) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sku, priceId, price: newPrice }),
    });

    if (!response.ok) {
      throw new Error('Failed to update price');
    }

    const result = await response.json();


    return result;
  } catch (error) {
    console.error('Error updating price:', error);
    throw error;
  }
};

export default actionUpdatePrice;
