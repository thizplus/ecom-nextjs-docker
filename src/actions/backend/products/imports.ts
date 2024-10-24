// @/actions/products/imports.ts

const actionImports = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/import-from-zortout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Import failed');
    }

    const result = await response.json();


    return result;
  } catch (error) {
    console.error('Error during import:', error);
    throw error;
  }
};

export default actionImports;
