// hooks/useMultiPriceUpdate.ts
import { useMultiPriceCartStore } from '@/stores/multiCartStore';

export const useMultiPriceUpdate = () => {
  const updateItemPrice = useMultiPriceCartStore(state => state.updateItemPrice);
  const updateAvailableStock = useMultiPriceCartStore(state => state.updateAvailableStock);
  const removeItem = useMultiPriceCartStore(state => state.removeItem);

  const updateCartPrices = async () => {
    try {
      const items = useMultiPriceCartStore.getState().items;
      const priceIds = items[0]?.prices ? Object.keys(items[0].prices) : [];

      if (items.length === 0 || priceIds.length === 0) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/store/prices/multi-cart-prices`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          skus: items.map(item => item.sku),
          priceIds
        })
      });

      if (!response.ok) throw new Error('Failed to fetch prices');

      const { success, data } = await response.json();

      if (!success || !data) throw new Error('Invalid response');

      // อัพเดทราคาและสต็อกในตะกร้า
      data.forEach((product: any) => {
        if (!product.active || product.availablestock <= 0) {
          removeItem(product.sku);

          return;
        }

        const newPrices = product.prices.reduce((acc: Record<string, number>, price: any) => ({
          ...acc,
          [price.priceId]: price.price
        }), {});

        updateItemPrice(product.sku, newPrices);
        updateAvailableStock(product.sku, product.availablestock);
      });

      return true;
    } catch (error) {
      console.error('Error updating multi prices:', error);

      return false;
    }
  };

  return { updateCartPrices };
};
