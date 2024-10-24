// components/dashboard/products/PriceEditor.tsx
import React, { useState, useEffect, useCallback } from 'react';

import TextField from '@mui/material/TextField';

import { useUpdatePrice } from '@/actions/backend/products/useUpdatePrice';

interface PriceEditorProps {
  sku: string;
  priceId: string;
  initialPrice: number;
  priceName: string;
}

const PriceEditor = ({ sku, priceId, initialPrice, priceName }: PriceEditorProps) => {
  const [price, setPrice] = useState<string>(initialPrice.toString());
  const [isEditing, setIsEditing] = useState(false);
  const updatePriceMutation = useUpdatePrice();

  // Reset price when initialPrice changes
  useEffect(() => {
    setPrice(initialPrice.toString());
  }, [initialPrice]);

  // Update price with debounce
  useEffect(() => {
    if (!isEditing) return;

    const numericValue = parseFloat(price);

    if (isNaN(numericValue)) return;

    const timeoutId = setTimeout(async () => {
      try {
        await updatePriceMutation.mutateAsync({
          sku,
          priceId,
          newPrice: numericValue
        });
      } catch (error) {
        // Reset to initial price on error
        setPrice(initialPrice.toString());
      } finally {
        setIsEditing(false);
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [price, isEditing, sku, priceId, initialPrice, updatePriceMutation]);

  const handlePriceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setPrice(newValue);
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (isEditing) {
      const numericValue = parseFloat(price);

      if (isNaN(numericValue)) {
        setPrice(initialPrice.toString());
        setIsEditing(false);
      }
    }
  }, [isEditing, price, initialPrice]);

  return (
    <TextField
      type="number"
      value={price}
      onChange={handlePriceChange}
      onBlur={handleBlur}
      size="small"
      label={priceName}
      disabled={updatePriceMutation.isPending}
      sx={{
        width: '80px',
        '& .MuiInputBase-root': {
          height: '35px',
        }
      }}
      InputProps={{
        inputProps: {
          min: 0,
          step: "0.01"
        }
      }}
    />
  );
};

export default PriceEditor;
