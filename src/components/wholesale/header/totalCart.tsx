import React, { useState, useMemo, useEffect } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { useCartStore } from '@/stores/cartStore';
import { useConfigStore } from '@/stores/configStore';
import { useClientStores } from '@/stores/authStore';
import { useShippingStore } from '@/stores/shippingStore';
import { formatNumber } from '@/components/global/functions/numberFormat';
import { useCartChanges } from '../header/useCartChanges';
import ShippingInfo from '@/components/global/shipping/shippingInfo';
import actionCreateOrder from '@/actions/backend/orders/actionOrder';
import { sendLineNotification } from '@/actions/global/lineNotification';
import { sendLineFlexMessage } from '@/actions/global/lineFlexMessage';
import { sendOrderToZort } from '@/actions/zortout/actionZortout';
import type { TypeOrder } from '@/types/orderTypes';
import Payment from '../../global/header/payment';
import { usePriceUpdate } from '@/actions/wholesale/usePriceUpdate';

interface PropsTotalCart {
  priceId: string;
}

const TotalCart: React.FC<PropsTotalCart> = ({ priceId }) => {
  const { carts, getTotalAmount, getItemCount, updateItemQuantity, removeItem } = useCartStore();
  const { config, loading, error, fetchConfig } = useConfigStore();
  const { selectedAddress } = useShippingStore();
  const [open, setOpen] = useState<boolean>(false);
  const [isProcess, setIsProcess] = useState<boolean>(false);
  const cartVersion = useCartChanges(priceId);
  const [payment, setPayment] = useState<TypeOrder | undefined>(undefined);
  const { updateCartPrices } = usePriceUpdate(priceId);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (!config) {
      fetchConfig();
    }
  }, [config, fetchConfig]);

  const handleClickOpen = async () => {
    setOpen(true);
    await updateCartPrices(); // อัพเดทราคาเมื่อเปิด dialog
  };

  const handleClose = (): void => setOpen(false);

  const handleQuantityChange = (sku: string, newQuantity: number): void => {
    if (newQuantity === 0) {
      removeItem(priceId, sku);
    } else {
      updateItemQuantity(priceId, sku, newQuantity);
    }
  };

  const cartItems = carts[priceId] || [];
  const filteredItems = cartItems.filter(item => item.qty > 0);

  const calculateShippingCost = useMemo(() => {
    if (!config || !config.shippingCost || getTotalAmount(priceId) === 0) return 0;
    const totalAmount = getTotalAmount(priceId);
    const { standard, special } = config.shippingCost;

    if (totalAmount <= standard.value) {
      return standard.cost;
    } else {
      return Math.ceil(totalAmount / special.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, priceId, getTotalAmount, cartVersion]);

  const totalWithShipping = useMemo(() => {
    return getTotalAmount(priceId) + calculateShippingCost;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTotalAmount, priceId, calculateShippingCost, cartVersion]);

  const totalCartSum = useMemo(() => {
    return getTotalAmount(priceId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getTotalAmount, priceId, cartVersion]);


  const isCartEmpty = useMemo(() => {
    return totalCartSum <= 0;
  }, [totalCartSum]);

  const canCheckout = useMemo(() => {
    if (!config) return false;
    const { minOrderStatus, minOrderValue } = config.saleModel;






    return !minOrderStatus || getTotalAmount(priceId) >= minOrderValue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, priceId, getTotalAmount, cartVersion]);

  const handleCreateOrders = async () => {
    const { user } = useClientStores.getState();

    if (!user || !user.userId) {
      setSnackbar({ open: true, message: 'กรุณาเข้าสู่ระบบก่อนทำรายการ', severity: 'error' });

      return;
    }

    if (!selectedAddress) {
      setSnackbar({ open: true, message: 'กรุณาเลือกที่อยู่จัดส่ง', severity: 'error' });

      return;
    }

    setIsProcess(true);

    try {
      const now = new Date();
      const expire = new Date(now.getTime() + 15 * 60000); // +15 นาที

      const orderData = {
        orderId: `WB-${Date.now()}`,
        typeOrder: 'store',
        typeId: priceId,
        userId: user.userId,
        listProducts: filteredItems.map(item => ({
          sku: item.sku,
          name: item.name,
          price: item.price,  // ใช้ price ปกติจาก wholesale
          qty: item.qty,
          total: item.price * item.qty
        })),
        shippingInfo: {
          _id: selectedAddress._id || 'default_id',
          cusName: selectedAddress.cusName,
          cusTel: selectedAddress.cusTel,
          addressNo: selectedAddress.addressNo,
          district: selectedAddress.district,
          amphoe: selectedAddress.amphoe,
          province: selectedAddress.province,
          zipcode: selectedAddress.zipcode,
          isDefault: selectedAddress.isDefault || false
        },
        shippingCost: calculateShippingCost,
        totalAmount: getTotalAmount(priceId),
        netTotal: totalWithShipping,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        expire: expire.toISOString(),
        payment: {
          status: 'pending' as const,
          amount: 0,
          slip: []
        }
      } as unknown as TypeOrder;



      const createdOrder = await actionCreateOrder(orderData);

      console.log('Created Order:', createdOrder);



      console.log('Order data:', orderData);
      await sendLineNotification(orderData);
      await sendLineFlexMessage(orderData);

      const res = await sendOrderToZort(orderData);

      console.log('sendOrderToZort: ', res);

      setSnackbar({ open: true, message: 'สร้างคำสั่งซื้อสำเร็จ', severity: 'success' });
      handleClose();

      setPayment(res.orderData);

      useCartStore.getState().clearCart(priceId);
    } catch (error) {
      console.error('Failed to create order:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'เกิดข้อผิดพลาดในการสร้างคำสั่งซื้อ',
        severity: 'error'
      });
    } finally {
      setIsProcess(false);
    }
  };

  const handleUpdatePayment = (updatedPayment: TypeOrder['payment']) => {
    setPayment(prevPayment => {
      if (prevPayment) {
        return { ...prevPayment, payment: updatedPayment };
      }


      return prevPayment;
    });

    // ที่นี่คุณอาจต้องการอัปเดตข้อมูลในฐานข้อมูลหรือ state อื่นๆ ด้วย
  };

  const handleCancelOrder = () => {
    // เพิ่มโลจิกสำหรับการยกเลิกคำสั่งซื้อที่นี่
    // เช่น เรียก API เพื่อยกเลิกคำสั่งซื้อ
    setPayment(undefined);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className='flex gap-2'>
        <Button
          variant='contained'
          onClick={handleClickOpen}
          size='small'
          disabled={getTotalAmount(priceId) <= 0}
          className='flex gap-2'
        >
          <i className="tabler-shopping-bag text-[32px]"></i>
          <div className='block leading-none my-auto text-left'>
            <p>{formatNumber(totalCartSum)} ฿</p>
            <p className='text-xs'>{getItemCount(priceId)} รายการ</p>
          </div>
        </Button>
      </div>

      <Dialog
        open={open}

        disableEscapeKeyDown
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
        onClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            handleClose()
          }
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id='alert-dialog-title'>ยืนยันการสั่งซื้อ</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            รายการสินค้าในตะกร้า:
          </DialogContentText>
          <div className="mt-4">
            {filteredItems.map((item, index) => (
              <div key={index} className="flex items-center mb-4 justify-between">
                <div className="flex gap-2 items-center">
                  {item.imagepath && (
                    <img src={item.imagepath} alt={item.name} className="w-full max-w-[80px]" />
                  )}
                  <div className='leading-none'>
                    <p className="font-semibold text-sm">{item.name}</p>
                    <p className='text-xs'>ราคา: {formatNumber(item.price)} | คงเหลือ: {item.availablestock}</p>
                    <div className='flex items-center justify-between'>
                      <div className='flex justify-between mt-2'>
                        <p onClick={() => handleQuantityChange(item.sku, item.qty - 1)} className='flex p-0 my-auto cursor-pointer'> <i className="tabler-minus"></i></p>
                        <TextField
                          value={item.qty}
                          onChange={(e) => handleQuantityChange(item.sku, parseInt(e.target.value) || 0)}
                          type="number"
                          onFocus={(event) => event.currentTarget.select()}
                          inputProps={{
                            min: 0,
                            max: item.availablestock,
                            className: 'p-0 text-center h-full p-1 w-[70px]'
                          }}
                          size="small"
                        />
                        <p onClick={() => handleQuantityChange(item.sku, item.qty + 1)} className='flex p-0 my-auto cursor-pointer'> <i className="tabler-plus"></i></p>
                      </div>
                      <p className="mt-4 text-sm text-right">
                        รวม: {formatNumber(item.qty * item.price)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <ShippingInfo />

          <div className='block text-right leading-none ml-auto py-2'>
            <div className='flex gap-2 justify-between'>
              <p>ยอดรวมสินค้า:</p>
              <p>{formatNumber(getTotalAmount(priceId))}</p>
            </div>
            <div className='flex gap-2 justify-between'>
              <p>ค่าจัดส่ง:</p>
              <p>{formatNumber(calculateShippingCost)}</p>
            </div>
            <div className='flex gap-2 justify-between'>
              <p>ยอดรวมทั้งสิ้น:</p>
              <p>{formatNumber(totalWithShipping)}</p>
            </div>
          </div>
          {config?.saleModel.minOrderStatus && getTotalAmount(priceId) < config.saleModel.minOrderValue && (
            <p className="text-red-500 mt-2 text-center underline">
              ยอดสั่งซื้อขั้นต่ำ {formatNumber(config.saleModel.minOrderValue)} บาท
            </p>
          )}
        </DialogContent>
        <DialogActions className='dialog-actions-dense pt-3'>
          <Button onClick={handleClose} variant='outlined' color='error' disabled={isProcess}>
            เลือกสินค้าเพิ่ม
          </Button>

          <Button
            onClick={handleCreateOrders}
            autoFocus
            variant='contained'
            color='primary'
            disabled={!canCheckout || isProcess || isCartEmpty}
          >
            {isProcess ? 'กำลังดำเนินการ...' : 'ยืนยันคำสั่งซื้อ'}
          </Button>

        </DialogActions>
      </Dialog>

      {payment && (
        <Payment
          paymentData={payment}
          onClose={handleCancelOrder}
          onOpen={true}
          onUpdatePayment={handleUpdatePayment}
        />
      )}

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
            borderRadius: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TotalCart;
