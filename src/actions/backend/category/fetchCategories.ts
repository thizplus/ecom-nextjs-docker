// @/actions/categories/fetchCategories.ts

const actionFetchCategories = async (page: number, limit: number) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/category/client?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export default actionFetchCategories;
