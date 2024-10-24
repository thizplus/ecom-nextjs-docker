// components/dashboard/price/LiffIdManager.tsx
import React, { useState, useEffect } from 'react';

import { TextField, Alert, CircularProgress } from '@mui/material';

import { usePriceLiffId } from '@/actions/backend/price/usePriceLiffId';

interface Props {
  priceId: string;
  priceName: string;
}

export const LiffIdManager: React.FC<Props> = ({ priceId }) => {
  const { liffId, isLoading, error, updateLiffId, isUpdating } = usePriceLiffId({ priceId });
  const [inputValue, setInputValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  // ตั้งค่าเริ่มต้น
  useEffect(() => {
    if (liffId) {
      setInputValue(liffId);
      setDebouncedValue(liffId);
    }
  }, [liffId]);

  // Debounce การ update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== debouncedValue && inputValue.trim()) {
        updateLiffId(inputValue.trim());
        setDebouncedValue(inputValue);
      }
    }, 1000); // delay 1 second

    return () => clearTimeout(timer);
  }, [inputValue, debouncedValue, updateLiffId]);

  if (isLoading) {
    return <div>Loading LIFF ID...</div>;
  }

  return (
    <>

      <TextField
        label="LIFF ID"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        fullWidth
        size="small"
        placeholder="Enter LIFF ID"
        helperText={
          isUpdating
            ? "กำลังบันทึก..."
            : "LIFF ID จะถูกบันทึกโดยอัตโนมัติหลังจากที่คุณหยุดพิมพ์"
        }
        InputProps={{
          endAdornment: isUpdating && (
            <CircularProgress color="inherit" size={20} />
          ),
        }}
      />

      {error && (
        <Alert severity="error" className="mt-2">
          {error}
        </Alert>
      )}

      {liffId && inputValue !== liffId && (
        <Alert severity="info" className="mt-2">
          Current LIFF ID: {liffId}
        </Alert>
      )}

    </>
  );
};
