const uploadPriceCSV = async (formData: FormData) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('CSV upload failed');
    }

    const result = await response.json();


    return result;
  } catch (error) {
    console.error('Error during CSV upload:', error);
    throw error;
  }
};

export default uploadPriceCSV;
