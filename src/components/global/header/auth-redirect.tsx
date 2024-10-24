import { useEffect } from 'react';

import { useRouter } from 'next/router';

import { isLoggedIn, getProfile } from '@/configs/liffConfig';
import { useClientStores } from '@/stores/authStore';

const AuthRedirect = () => {
  const router = useRouter();
  const { setUser, setLoggedIn, checkAuthStatus } = useClientStores();

  useEffect(() => {
    const handleRedirect = async () => {
      if (isLoggedIn()) {
        const profile = await getProfile();

        if (profile) {
          await checkAuthStatus({
            userId: profile.userId,
            displayName: profile.displayName,
            pictureUrl: profile.pictureUrl || '',
            userType: 'store',
            idType: 'store'
          });
        }

        setLoggedIn(true);
        const redirectPath = localStorage.getItem('redirectPath') || '/';

        localStorage.removeItem('redirectPath');
        router.push(redirectPath);
      } else {
        router.push('/');
      }
    };

    handleRedirect();
  }, [router, setUser, setLoggedIn, checkAuthStatus]);

  return <div>Redirecting...</div>;
};

export default AuthRedirect;
