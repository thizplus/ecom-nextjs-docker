import React, { useState } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { deleteShippingAddress } from '@/actions/client/shipping';
import type { ShippingAddress } from '@/types/shippingTypes';

interface BtnDeleteShippingProps {
  address: ShippingAddress;
  onAddressDeleted: () => void;
}

const BtnDeleteShipping: React.FC<BtnDeleteShippingProps> = ({ address, onAddressDeleted }) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleDeleteAddress = async () => {
    try {
      await deleteShippingAddress(address._id);
      onAddressDeleted();
      handleClose();
    } catch (error) {
      console.error('Error deleting shipping address:', error);
    }
  };

  return (
    <>
      <Button variant='text' size='small' className="p-0 flex justify-start" color='error' startIcon={<DeleteForeverIcon />} onClick={handleClickOpen}>
        ลบที่อยู่
      </Button>

      <Dialog
        open={open}
        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        maxWidth='xs'
        fullWidth
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose();
          }
        }}
      >
        <DialogTitle id='alert-dialog-title'>คุณต้องการลบที่อยู่ ?</DialogTitle>
        <DialogContent>
          <div className='leading-none my-auto'>
            <p className='text-bold flex gap-2 font-bold text-sm leading-none'> {address.cusName} {address.cusTel}</p>
            <p className='leading-none text-sm'>{`${address.addressNo} ${address.district} ${address.amphoe} ${address.province} ${address.zipcode}`}</p>
          </div>
        </DialogContent>
        <DialogActions className='dialog-actions-dense'>
          <Button onClick={handleDeleteAddress} variant='contained' color="error">ยืนยัน</Button>
          <Button onClick={handleClose}>ยกเลิก</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BtnDeleteShipping;
