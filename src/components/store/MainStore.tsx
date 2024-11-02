'use client'

import { useEffect, useState, useCallback } from 'react';

import HeaderStore from "./headerStore"
import { useLiffAuth } from '@/actions/client/useLiffAuth';
import { useClientStores } from '@/stores/authStore';
import ProductList from './body/productList';
import { useConfigStore } from '@/stores/configStore';
import Loading from '../global/Loading';
import Payment from '../global/header/payment';
import { usePendingOrders } from '@/actions/backend/orders/usePendingOrders';


const MainStore = () => {
  const { isLiffLoading, liffError } = useLiffAuth();
  const { user, isLoggedIn } = useClientStores();
  const { config, fetchConfig, loading: configLoading } = useConfigStore();

  // State for payment dialog
  const [showPayment, setShowPayment] = useState(false);

  // Use pending orders hook
  const {
    pendingOrder,
    isLoading: isPendingOrderLoading,
    refreshPendingOrders
  } = usePendingOrders(user?.userId, isLoggedIn);

  // Initialize LIFF and fetch config
  useEffect(() => {
    if (!config) {
      fetchConfig();
    }
  }, [config, fetchConfig]);

  // Show payment dialog if there's a pending order
  useEffect(() => {
    if (pendingOrder && isLoggedIn) {
      setShowPayment(true);
    }
  }, [pendingOrder, isLoggedIn]);

  // Handle payment dialog close
  const handlePaymentClose = useCallback(() => {
    setShowPayment(false);
    refreshPendingOrders();
  }, [refreshPendingOrders]);

  // Handle payment update
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePaymentUpdate = useCallback((updatedPayment: any) => {
    refreshPendingOrders();
  }, [refreshPendingOrders]);

  // Show loading state
  if (isLiffLoading || configLoading || isPendingOrderLoading) {
    return <Loading />;
  }

  // Show error if any
  if (liffError) {
    return (
      <div className="p-4 text-red-500">
        เกิดข้อผิดพลาดในการเชื่อมต่อ: {liffError}
      </div>
    );
  }

  return (
    <>
      <HeaderStore />
      {config && <ProductList priceIds={config.saleModel.listPrice.map(price => price.id)} />}

      {/* Show Payment dialog for pending order */}
      {pendingOrder && showPayment && (
        <Payment
          paymentData={pendingOrder}
          qr={config?.slipOK.qr_image}
          onClose={handlePaymentClose}
          onOpen={showPayment}
          onUpdatePayment={handlePaymentUpdate}
        />
      )}
    </>
  );
};

export default MainStore;
