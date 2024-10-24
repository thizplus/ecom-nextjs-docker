// hooks/usePriceUpdate.ts
import { useCartStore } from '@/stores/cartStore';

export const usePriceUpdate = (priceId: string) => {
  const updateItemPrice = useCartStore(state => state.updateItemPrice);

  const updateCartPrices = async () => {
    try {
      const cartItems = useCartStore.getState().carts[priceId] || [];

      if (cartItems.length === 0) return;

      const skus = cartItems.map(item => item.sku);

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/cart-prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ skus, priceId })
      });

      if (!response.ok) throw new Error('Failed to fetch prices');

      const products = await response.json();

      // Update prices in cart
      products.forEach((product: { sku: string; price: number; }) => {
        updateItemPrice(priceId, product.sku, product.price);
      });
    } catch (error) {
      console.error('Error updating prices:', error);
    }
  };

  return { updateCartPrices };
};
