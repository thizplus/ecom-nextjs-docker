'use client'

import { useEffect, useRef, useState } from 'react';

import actionSearchPrice from '@/actions/backend/price/searchPrice';
import ProductList from './body/productList';
import MainHeader from './header/mainHeader';
import Loading from '../global/Loading';
import NotFoundPage from '../global/notFound';
import { useCheckPriceAccess } from '@/actions/backend/price/useCheckPriceAccess';
import AccessDenied from '../global/AccessDenied';
import { useLiffAuth } from '@/actions/client/useLiffAuth';

type PropsPriceId = {
  priceId: string;
};

type PriceData = {
  items: any[];
  totalPages: number;
  currentPage: number;
};

const MainWholesale: React.FC<PropsPriceId> = ({ priceId }) => {
  const [priceData, setPriceData] = useState<PriceData | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(true);
  const [priceError, setPriceError] = useState<string | null>(null);
  const fetchAttempted = useRef(false);

  const { user, isLiffLoading, liffError } = useLiffAuth(priceId);
  const { data: accessData, isLoading: isAccessLoading, error: accessError } = useCheckPriceAccess(priceId);

  console.log('MainWholesale render:', {
    priceId,
    isLiffLoading,
    liffError,
    userExists: !!user
  });


  useEffect(() => {
    const fetchPriceData = async () => {
      if (fetchAttempted.current) return;

      fetchAttempted.current = true;

      try {
        const result = await actionSearchPrice(priceId, 1, 1);

        setPriceData(result);
      } catch (err) {
        setPriceError('ไม่พบข้อมูลรายการสินค้า');
      } finally {
        setIsPriceLoading(false);
      }
    };

    fetchPriceData();
  }, [priceId]);

  const isLoading = isPriceLoading || isLiffLoading || isAccessLoading;

  if (isLoading) return <Loading />;
  if (liffError) return <div>เกิดข้อผิดพลาดในการเข้าสู่ระบบ: {liffError}</div>;
  if (priceError) return <div>{priceError}</div>;
  if (accessError) return <div>เกิดข้อผิดพลาดในการตรวจสอบสิทธิ์: {accessError.message}</div>;
  if (accessData && !accessData.hasAccess) return <AccessDenied />;
  if (!priceData || priceData.items.length === 0) return <NotFoundPage />;

  return (
    <>

      <MainHeader
        priceId={priceId}
        priceName={priceData.items[0].name}
      />

      <ProductList priceId={priceId} />

    </>
  );
};

export default MainWholesale;
