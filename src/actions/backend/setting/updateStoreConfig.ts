import type { StoreConfig } from "@/types/storeConfigTypes";

type propsConfig = {
  config: StoreConfig;
}

const actionUpdateConfig = async ({ config }: propsConfig) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/config`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config), // Your updated configuration object
    });

    if (!response.ok) throw new Error('Failed to update configuration');
    const data = await response.json();

    return data

    // Handle successful update (e.g., show a success message)
  } catch (error) {
    // Handle error (e.g., show an error message)
  }
};

export default actionUpdateConfig
