type PropsDownloadPriceCSV = {
  priceId: string;
  priceName: string;
};

const actionDownloadPriceCSV = async ({ priceId, priceName }: PropsDownloadPriceCSV) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/products/${priceId}/csv`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('CSV download failed');
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename="?(.+)"?/i);
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '');
    const filename = filenameMatch ? filenameMatch[1] : `products_${priceName}_${priceId}_${timestamp}.csv`;

    // Convert the response to a blob
    const blob = await response.blob();

    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger the download
    const link = document.createElement('a');

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true, message: 'CSV downloaded successfully' };
  } catch (error) {
    console.error('Error during CSV download:', error);
    throw error;
  }
};

export default actionDownloadPriceCSV;
