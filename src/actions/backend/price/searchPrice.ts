// @/actions/prices/searchPrices.ts

const actionSearchPrice = async (query: string, page: number, limit: number) => {
  if (!query.trim()) {
    return { items: [], totalItems: 0, totalPages: 0, currentPage: 1 };
  }

  try {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch prices: ${response.statusText}`);
    }

    const result = await response.json();

    return {
      items: result.items || [],
      totalItems: result.totalItems || 0,
      totalPages: result.totalPages || 1,
      currentPage: result.currentPage || 1,
    };
  } catch (error) {
    console.error('Error searching prices:', error);
    throw error;
  }
};

export default actionSearchPrice;
