const deletePriceById = async (priceId: string) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/delete/${priceId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete price');
    }

    const result = await response.json();

    console.log(result.message);

    return result;

    // ทำการอัปเดต UI หรือ state ตามที่ต้องการ
  } catch (error) {
    console.error('Error deleting price:', error);

    // จัดการ error ตามที่ต้องการ
    throw error;
  }
};

export default deletePriceById;
