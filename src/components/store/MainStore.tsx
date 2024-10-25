'use client'

import { useEffect } from 'react';

import HeaderStore from "./headerStore"
import { useLiffAuth } from '@/actions/client/useLiffAuth';
import ProductList from './body/productList';
import { useConfigStore } from '@/stores/configStore';
import Loading from '../global/Loading';

const MainStore = () => {
  const { isLiffLoading, liffError } = useLiffAuth(); // Using new LIFF hook
  const { config, fetchConfig, loading: configLoading } = useConfigStore();



  // Initialize LIFF and fetch config
  useEffect(() => {
    if (!config) {
      fetchConfig();
    }
  }, [config, fetchConfig]);

  // Show loading state
  if (isLiffLoading || configLoading) {
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

  // Get price IDs from config
  const priceIds = config?.saleModel.listPrice.map(price => price.id) || [];

  return (
    <>
      <HeaderStore />
      {config && <ProductList priceIds={priceIds} />}
    </>
  );
};

export default MainStore;
