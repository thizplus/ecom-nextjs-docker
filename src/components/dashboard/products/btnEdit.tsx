// components/dashboard/products/btnEdit.tsx
import { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

import { useProductStatus } from '@/actions/backend/products/useProductStatus';
import type { TypesProduct } from '@/types/productTypes';

type PropsEdit = {
  items: TypesProduct;
};

const BtnEdit = ({ items }: PropsEdit) => {
  const [open, setOpen] = useState<boolean>(false);
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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleStatusChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setStatus(event.target.checked);
  };

  const handleEdit = async () => {
    try {
      await updateStatusMutation.mutateAsync({
        productId: items._id.toString(),
        active: status,
      });

      setSnackbar({
        open: true,
        message: 'สถานะสินค้าถูกอัพเดทเรียบร้อยแล้ว',
        severity: 'success',
      });
      handleClose();
    } catch (error) {
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

  return (
    <>
      <IconButton aria-label="edit" onClick={handleClickOpen}>
        <EditIcon />
      </IconButton>

      <Dialog
        open={open}
        maxWidth="xs"
        fullWidth
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">แก้ไขสถานะสินค้า</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description" className="mb-4">
            {items.name} (SKU: {items.sku})
          </DialogContentText>
          <FormControlLabel
            control={
              <Switch
                checked={status}
                onChange={handleStatusChange}
                color="primary"
              />
            }
            label={status ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
          />
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button
            variant="contained"
            onClick={handleEdit}
            disabled={updateStatusMutation.isPending}
          >
            {updateStatusMutation.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleClose}
            disabled={updateStatusMutation.isPending}
          >
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>

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
    </>
  );
};

export default BtnEdit;
