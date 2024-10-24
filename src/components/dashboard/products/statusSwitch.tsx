// components/dashboard/products/StatusSwitch.tsx
import { useState } from 'react';

import Switch from '@mui/material/Switch';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useProductStatus } from '@/actions/backend/products/useProductStatus';
import type { TypesProduct } from "@/types/productTypes";

interface StatusSwitchProps {
  items: TypesProduct;
}

const StatusSwitch = ({ items }: StatusSwitchProps) => {
  const [status, setStatus] = useState<boolean>(items.active);

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const updateStatusMutation = useProductStatus();

  const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked;

    event.stopPropagation(); // ป้องกันการ trigger row selection

    try {
      await updateStatusMutation.mutateAsync({
        productId: items._id.toString(),
        active: newStatus,
      });

      setStatus(newStatus);
      setSnackbar({
        open: true,
        message: `สถานะสินค้าถูกเปลี่ยนเป็น${newStatus ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}`,
        severity: 'success',
      });
    } catch (error) {
      setStatus(items.active);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการอัพเดทสถานะ',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // ป้องกันการ trigger row selection
  };

  return (
    <div onClick={handleClick}>  {/* wrapper div เพื่อป้องกัน event bubbling */}
      <Switch
        checked={status}
        onChange={handleStatusChange}
        disabled={updateStatusMutation.isPending}
        size="small"
        color="primary"
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{
            width: '100%',
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default StatusSwitch;
