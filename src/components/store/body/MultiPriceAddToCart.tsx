import React, { useEffect, useState } from 'react';

import { TextField } from '@mui/material';

import { useMultiPriceCartStore } from '@/stores/multiCartStore';
import type { MultiPriceProduct } from '@/types/multiplePrice';

interface PropsMultiPriceAddToCart {
  product: MultiPriceProduct;
}

const MultiPriceAddToCart: React.FC<PropsMultiPriceAddToCart> = ({ product }) => {
  const {
    addItem,
    updateItemQuantity,
    getItemQuantity,
    recalculateBaseTotalCart,
    items,
    updateItemPrice // เพิ่ม updateItemPrice
  } = useMultiPriceCartStore();

  const [quantity, setQuantity] = useState(0);

  // ตรวจสอบและอัพเดทราคาถ้ามีการเปลี่ยนแปลง
  useEffect(() => {
    const cartItem = items.find(item => item.sku === product.sku);

    if (cartItem) {
      const newPrices = product.prices.reduce((acc, price) => ({
        ...acc,
        [price.priceId]: price.price
      }), {});

      // เปรียบเทียบราคาเก่าและใหม่
      const pricesChanged = product.prices.some(price =>
        cartItem.prices[price.priceId] !== price.price
      );

      if (pricesChanged) {
        updateItemPrice(product.sku, newPrices);
        recalculateBaseTotalCart();
      }
    }
  }, [product.prices, product.sku, items, updateItemPrice, recalculateBaseTotalCart]);

  useEffect(() => {
    const currentQuantity = getItemQuantity(product.sku);

    setQuantity(currentQuantity);
  }, [getItemQuantity, product.sku, items]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = Math.min(parseInt(event.target.value) || 0, product.availablestock);

    updateQuantity(newQuantity);
  };

  const handleIncrement = () => {
    if (quantity < product.availablestock) {
      updateQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      updateQuantity(quantity - 1);
    }
  };

  const updateQuantity = (newQuantity: number) => {
    if (newQuantity === 0) {
      updateItemQuantity(product.sku, 0);
    } else if (quantity === 0 && newQuantity > 0) {
      // อัพเดทราคาล่าสุดเมื่อเพิ่มสินค้าใหม่
      const currentPrices = product.prices.reduce((acc, price) => ({
        ...acc,
        [price.priceId]: price.price
      }), {});

      addItem({
        sku: product.sku,
        qty: newQuantity,
        prices: currentPrices,
        name: product.name,
        imagepath: product.imagepath,
        availablestock: product.availablestock,
      });
    } else {
      updateItemQuantity(product.sku, newQuantity);
    }

    setQuantity(newQuantity);
    recalculateBaseTotalCart();
  };

  return (
    <div className='flex justify-between mt-2'>
      <p onClick={handleDecrement} className='flex p-0 my-auto cursor-pointer'>
        <i className="tabler-minus"></i>
      </p>
      <TextField
        value={quantity}
        onChange={handleChange}
        type="number"
        onFocus={(event) => event.currentTarget.select()}
        inputProps={{
          min: 0,
          max: product.availablestock,
          className: 'p-0 text-center h-full p-1 w-[70px]'
        }}
        sx={{
          "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
            display: "none",
          },
          "& input[type=number]": {
            MozAppearance: "textfield",
          },
        }}
        size="small"
      />
      <p onClick={handleIncrement} className='flex p-0 my-auto cursor-pointer'>
        <i className="tabler-plus"></i>
      </p>
    </div>
  );
};

export default MultiPriceAddToCart;
