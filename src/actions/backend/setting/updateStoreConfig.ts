import type { StoreConfig } from "@/types/storeConfigTypes";

type propsConfig = {
  config: StoreConfig;
  qrFile?: File | null;
}

const actionUpdateConfig = async ({ config, qrFile }: propsConfig) => {
  try {
    let response;

    if (qrFile) {
      const formData = new FormData();

      formData.append('qr_image', qrFile);
      formData.append('config', JSON.stringify(config));

      response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/config`, {
        method: 'PUT',
        body: formData
      });
    } else {
      response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/config`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config)
      });
    }

    if (!response.ok) throw new Error('Failed to update configuration');
    const data = await response.json();

    return data;
  } catch (error) {
    throw error;
  }
};

export default actionUpdateConfig;
