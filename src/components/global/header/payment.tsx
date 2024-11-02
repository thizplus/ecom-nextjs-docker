import React, { useState, useEffect, useCallback } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

import Alert from '@mui/material/Alert';

import type { TypeOrder } from '@/types/orderTypes';
import { formatNumber } from '@/components/global/functions/numberFormat';
import UploadSlip from './uploadSlip';
import BtnVoidOrder from './voidOrder';

interface PaymentProps {
  paymentData: TypeOrder;
  qr: string | undefined;
  onClose: () => void;
  onOpen: boolean;
  onUpdatePayment: (updatedPayment: TypeOrder['payment']) => void;
}

const Payment: React.FC<PaymentProps> = ({ paymentData, onClose, onOpen, onUpdatePayment, qr }) => {
  const [isFullyPaid, setIsFullyPaid] = useState(false);
  const [currentPayment, setCurrentPayment] = useState(paymentData.payment);

  useEffect(() => {
    if (currentPayment.amount >= paymentData.netTotal) {
      setIsFullyPaid(true);

      const timer = setTimeout(() => {
        // onClose();
      }, 3000);


      return () => clearTimeout(timer);
    }
  }, [currentPayment, paymentData.netTotal, onClose]);

  const handleClose = () => {
    onClose();
  };

  const handlePaymentUpdate = useCallback((newPayment: TypeOrder['payment']) => {
    setCurrentPayment(newPayment);
    onUpdatePayment(newPayment);
  }, [onUpdatePayment]);

  const remainingAmount = Math.max(0, paymentData.netTotal - currentPayment.amount);

  const handleVoidSuccess = () => {
    onClose();  // Close the Payment dialog
  };

  return (
    <Dialog
      open={onOpen}
      disableEscapeKeyDown
      aria-labelledby='alert-dialog-title'
      aria-describedby='alert-dialog-description'
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          handleClose();
        }
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle>ชำระเงิน</DialogTitle>
      <DialogContent>
        <div className='block'>



          <div className='grid grid-cols-2'>
            <p>หมายเลขคำสั่งซื้อ:</p><p className='text-right font-bold'>{paymentData.orderId}</p>
            <p color={isFullyPaid ? 'success.main' : 'warning.main'}>
              สถานะการชำระเงิน:
            </p><p className='text-right font-bold'>{isFullyPaid ? 'ชำระเงินครบแล้ว' : 'รอการชำระเงิน'}</p>
          </div>

          <div className='grid grid-cols-3 gap-2 p-2 border-dashed border rounded-sm mt-2'>
            <div className='block text-center leading-none'>
              <p className='font-bold text-xl'>{formatNumber(paymentData.netTotal)}฿</p> <p>รวม</p>
            </div>

            <div className='block text-center leading-none text-green-600'>
              <p className='font-bold text-xl '>{formatNumber(currentPayment.amount)}฿</p> <p>ชำระแล้ว</p>
            </div>
            <div className='block text-center leading-none text-red-600'>
              <p className='font-bold text-xl '>{formatNumber(remainingAmount)}฿</p><p>ค้างชำระ</p>
            </div>
          </div>




        </div>

        {!isFullyPaid && (
          <UploadSlip
            order={paymentData}
            onPaymentUpdate={handlePaymentUpdate}
            currentPayment={currentPayment}
          />
        )}

        {qr &&
          <div className='mb-2'>
            <p className='text-center'>กรุณาชำระเงินที่บัญชีด้านล่างและแนบสลิป</p>
            <p className='text-center text-sm text-error'>หากสลิปของคุณไม่มี QR CODE ระบบจะไม่สามารถตรวจสอบยอดได้ กรุณาส่งหลักฐานให้แอดมินยืนยันในแชท</p>
            <img src={qr} alt='' className=' w-full' />
          </div>
        }

        {isFullyPaid && (
          <Alert severity='success' className='mt-4'>การชำระเงินของคุณเสร็จสมบูรณ์</Alert>

        )}
      </DialogContent>
      <DialogActions>
        {!isFullyPaid ? (
          <BtnVoidOrder orderId={paymentData.orderId} onVoidSuccess={handleVoidSuccess} />
        ) : (
          <Button onClick={handleClose} color="error" variant='outlined'>
            ปิด
          </Button>
        )}

      </DialogActions>
    </Dialog>
  );
};

export default Payment;
