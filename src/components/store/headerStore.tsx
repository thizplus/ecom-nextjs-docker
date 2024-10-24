// HeaderStore.tsx
import React, { useEffect, useState } from 'react';


import { useClientStores } from '@/stores/authStore';
import MyOrders from '../global/header/myOrders';
import { useLiffAuth } from '@/actions/client/useLiffAuth';
import MultiPriceTotalCart from './MultiPriceTotalCart';
import { useConfigStore } from '@/stores/configStore';



const HeaderStore = () => {
  const { user, isLoggedIn } = useClientStores();
  const { handleLogout } = useLiffAuth(); // Changed from useAuth to useLiffAuth
  const { config } = useConfigStore();

  const [priceId, setPriceId] = useState('store');
  const [priceName, setPriceName] = useState('store');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const currentPriceId = path.startsWith('/wholesale/') ? path.split('/')[2] : 'store';

      setPriceId(currentPriceId);

      // Get price name from config if available
      if (config && currentPriceId !== 'store') {
        const priceConfig = config.saleModel.listPrice.find(price => price.id === currentPriceId);

        if (priceConfig) {
          setPriceName(priceConfig.name);
        } else {
          setPriceName(currentPriceId);
        }
      } else {
        setPriceName('หน้าหลัก');
      }
    }
  }, [config]);

  return (
    <>
      <div className="p-4 fixed w-full bg-white shadow-md z-10 max-w-[430px]">
        <div className='flex gap-2 justify-between'>
          <div className="flex gap-2 leading-none">
            {user && isLoggedIn && (
              <MyOrders profile={user} priceId={priceId} />
            )}
            <div className='block leading-none'>
              <h2 className='text-[22px]'>{priceName}</h2>
              <p className="text-xs leading-none">รหัส: {priceId}</p>
              {user && isLoggedIn && (
                <p className="text-xs leading-none cursor-pointer" onClick={handleLogout}>
                  คุณ: {user.displayName}
                </p>
              )}
            </div>
          </div>

          {isLoggedIn &&
            <MultiPriceTotalCart />
          }
        </div>
      </div>
      <div className="h-[80px]"></div>
    </>
  );
};

export default HeaderStore;
