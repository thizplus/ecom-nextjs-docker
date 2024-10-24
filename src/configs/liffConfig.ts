import { liff } from '@line/liff'

import { useConfigStore } from '@/stores/configStore'

export const initializeLiff = async () => {
  const { fetchConfig } = useConfigStore.getState();

  await fetchConfig();
  const currentConfig = useConfigStore.getState().config;

  if (!currentConfig?.lineLogin?.LINE_LIFF_ID) {
    console.error('LIFF ID is not defined in the config');
    throw new Error('LIFF ID is not defined in the config');
  }

  const liffId = currentConfig.lineLogin.LINE_LIFF_ID;

  try {
    await liff.init({ liffId });
  } catch (error) {
    console.error('Error during LIFF initialization:', error);
    throw error;
  }
};

export const isLoggedIn = () => liff.isLoggedIn()

export const login = async () => {
  if (!liff.isLoggedIn()) {
    const currentPath = window.location.pathname + window.location.search;

    localStorage.setItem('redirectPath', currentPath);
    await liff.login({ redirectUri: `${window.location.origin}/auth-redirect` });
  }
}

export const logout = async () => {
  if (liff.isLoggedIn()) {
    await liff.logout();
    window.location.reload();
  }
}

export const getProfile = async () => {
  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();


    return {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
    };
  }


  return null;
}
