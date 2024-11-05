// @/actions/zortout/checkZortStock.ts

interface ZortProduct {
  sku: string;
  availablestock: string;
  name: string;
}

interface ZortResponse {
  res: {
    resCode: string;
    resDesc: string;
  };
  list: ZortProduct[];
}

interface StockCheckResult {
  success: boolean;
  insufficientItems?: Array<{
    sku: string;
    requested: number;
    available: number;
    name: string;
  }>;
  error?: string;
}

export const checkZortStock = async (
  cartItems: Array<{ sku: string; qty: number }>
): Promise<StockCheckResult> => {
  try {
    const skuList = cartItems.map(item => item.sku).join(',');

    const myHeaders = new Headers();

    myHeaders.append("storename", process.env.NEXT_PUBLIC_ZORT_STORENAME || '');
    myHeaders.append("apikey", process.env.NEXT_PUBLIC_ZORT_APIKEY || '');
    myHeaders.append("apisecret", process.env.NEXT_PUBLIC_ZORT_APISECRET || '');
    myHeaders.append("skulist", skuList);

    const response = await fetch("https://open-api.zortout.com/v4/Product/GetProducts", {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    });

    if (!response.ok) {
      throw new Error('Failed to fetch stock information from Zort');
    }

    const data = await response.json() as ZortResponse;

    if (data.res.resCode !== "200") {
      throw new Error(data.res.resDesc || 'Error checking stock availability');
    }

    const zortProducts = new Map(
      data.list.map(product => [product.sku, product])
    );

    const insufficientItems: StockCheckResult['insufficientItems'] = [];

    cartItems.forEach(cartItem => {
      const zortProduct = zortProducts.get(cartItem.sku);

      if (!zortProduct) {
        insufficientItems.push({
          sku: cartItem.sku,
          requested: cartItem.qty,
          available: 0,
          name: 'Product not found'
        });

        return;
      }

      const availableStock = parseInt(zortProduct.availablestock);

      if (cartItem.qty > availableStock) {
        insufficientItems.push({
          sku: cartItem.sku,
          requested: cartItem.qty,
          available: availableStock,
          name: zortProduct.name
        });
      }
    });

    return {
      success: insufficientItems.length === 0,
      insufficientItems: insufficientItems.length > 0 ? insufficientItems : undefined
    };

  } catch (error) {
    console.error('Error checking Zort stock:', error);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to check stock availability'
    };
  }
};
