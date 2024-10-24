import { useClientStores } from '@/stores/authStore';
import type { ShippingAddress, NewShippingAddress } from '@/types/shippingTypes';

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const getShippingAddresses = async (): Promise<ShippingAddress[]> => {
  const { user } = useClientStores.getState();
  const response = await fetch(`${API_URL}/api/shipping?userId=${user?.userId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch shipping addresses: ${response.statusText}`);
  }

  return await response.json();
};

export const addShippingAddress = async (address: NewShippingAddress): Promise<ShippingAddress[]> => {
  const { user } = useClientStores.getState();

  const response = await fetch(`${API_URL}/api/shipping`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: user?.userId, address }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add shipping address: ${response.statusText}`);
  }

  return await response.json();
};

export const setDefaultAddress = async (addressId: string): Promise<void> => {
  const { user } = useClientStores.getState();

  if (!user || !user.userId) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/shipping/${user.userId}/${addressId}/default`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || 'Failed to set default address');
  }
};

export const updateShippingAddress = async (data: { addressId: string; address: Partial<ShippingAddress> }): Promise<ShippingAddress[]> => {
  const { user } = useClientStores.getState();
  const { addressId, address } = data;

  const response = await fetch(`${API_URL}/api/shipping/${user?.userId}/${addressId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ address }),
  });

  if (!response.ok) {
    throw new Error(`Failed to update shipping address: ${response.statusText}`);
  }

  return await response.json();
};

export const deleteShippingAddress = async (addressId: string): Promise<void> => {
  const { user } = useClientStores.getState();

  if (!user || !user.userId) {
    throw new Error('User not authenticated');
  }

  const response = await fetch(`${API_URL}/api/shipping/${user.userId}/${addressId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(errorData.message || 'Failed to delete shipping address');
  }
};
