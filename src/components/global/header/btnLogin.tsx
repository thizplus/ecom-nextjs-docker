'use client'
import React, { useEffect } from 'react';

import LockOpenIcon from '@mui/icons-material/LockOpen';
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";

import { useAuth } from '@/actions/client/useAuth';

const BtnLineLogin = () => {
  const { isInitialized, isLoading, user, handleLogin, handleLogout } = useAuth();

  useEffect(() => {
    console.log('BtnLineLogin mounted');
  }, []);

  if (!isInitialized || isLoading) {
    console.log('BtnLineLogin: Loading state');

    return <CircularProgress className='flex my-auto' size={30} />;
  }

  if (user) {
    console.log('BtnLineLogin: User logged in', user);

    return (
      <div className='flex gap-2 justify-between leading-none'>
        <div className='flex gap-2'>
          <img
            src={user.pictureUrl}
            alt={user.displayName}
            className='max-h-[38px] rounded-md shadow-sm cursor-pointer'
            onClick={handleLogout}
          />
          <div className='leading-none my-auto' onClick={handleLogout}>
            <p className='text-sm font-bold uppercase leading-none'>
              {user.displayName}
            </p>
          </div>
        </div>
      </div>
    );
  }

  console.log('BtnLineLogin: User not logged in');

  return (
    <>
      <Button
        variant='contained'
        onClick={handleLogin}
        size='small'
        startIcon={<LockOpenIcon />}
      >
        กรุณาเข้าสู่ระบบ
      </Button>

    </>
  );
};

export default BtnLineLogin;
