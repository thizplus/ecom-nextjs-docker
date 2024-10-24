import { useState, useEffect, useCallback, useRef } from 'react';

import { useConfigStore } from '@/stores/configStore';
import { useClientStores } from '@/stores/authStore';
import type { TypeClient } from '@/types/clientTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://b01.ngrok.dev';

export const useAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { fetchConfig } = useConfigStore();
  const { user, setUser, setLoggedIn, checkAuthStatus } = useClientStores();
  const tokenVerified = useRef(false);

  const handleAuthStatus = useCallback(async (token: string, profile: TypeClient) => {
    console.log('handleAuthStatus called', { token: token.substring(0, 10) + '...', profile });

    if (tokenVerified.current) {
      console.log('Token already verified, skipping');

      return;
    }

    try {
      const updatedProfile = await checkAuthStatus(token, profile);

      console.log('Updated profile', updatedProfile);
      setUser(updatedProfile);
      setLoggedIn(true);
      tokenVerified.current = true;
      console.log('Auth status updated successfully');
    } catch (error) {
      console.error('Error updating auth status:', error);
      setLoggedIn(false);
      setUser(null);
    }
  }, [checkAuthStatus, setUser, setLoggedIn]);

  const verifyToken = useCallback(async (token: string) => {
    console.log('verifyToken called', { token: token.substring(0, 10) + '...' });

    if (tokenVerified.current) {
      console.log('Token already verified, skipping');

      return;
    }

    try {
      console.log('Sending verify-token request to:', `${API_BASE_URL}/api/line/verify-token`);

      const response = await fetch(`${API_BASE_URL}/api/line/verify-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ token })
      });

      const data = await response.json();

      console.log('Verify token response:', data);

      if (data.valid) {
        console.log('Token is valid, updating auth status');
        await handleAuthStatus(token, data.profile as TypeClient);
        tokenVerified.current = true;
      } else {
        console.log('Token is invalid, logging out');
        setLoggedIn(false);
        setUser(null);
        localStorage.removeItem('lineLoginToken');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      setLoggedIn(false);
      setUser(null);
      localStorage.removeItem('lineLoginToken');
    }
  }, [handleAuthStatus, setLoggedIn, setUser]);

  useEffect(() => {
    const initialize = async () => {
      console.log('Initializing auth');

      if (isInitialized) {
        console.log('Already initialized, skipping');

        return;
      }

      try {
        await fetchConfig();
        const token = localStorage.getItem('lineLoginToken');

        console.log('Token from localStorage:', token ? token.substring(0, 10) + '...' : 'null');

        if (token) {
          console.log('Token found in localStorage, verifying');
          await verifyToken(token);
        } else {
          console.log('No token in localStorage, checking URL');
          const urlParams = new URLSearchParams(window.location.search);
          const tokenFromUrl = urlParams.get('token');

          console.log('Token from URL:', tokenFromUrl ? tokenFromUrl.substring(0, 10) + '...' : 'null');

          if (tokenFromUrl) {
            console.log('Token found in URL, saving and verifying');
            localStorage.setItem('lineLoginToken', tokenFromUrl);
            await verifyToken(tokenFromUrl);
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            console.log('No token found, setting logged out state');
            setLoggedIn(false);
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsInitialized(true);
        setIsLoading(false);
        console.log('Initialization complete');
      }
    };

    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchConfig, verifyToken, setLoggedIn, setUser]);

  const handleLogin = useCallback(async () => {
    console.log('handleLogin called');

    try {
      const loginUrl = `${API_BASE_URL}/api/line/login?redirectUrl=${encodeURIComponent(window.location.href)}`;

      console.log('Fetching login URL from:', loginUrl);
      const response = await fetch(loginUrl);
      const data = await response.json();

      console.log('Login response:', data);

      if (data.loginUrl) {
        console.log('Redirecting to:', data.loginUrl);
        window.location.href = data.loginUrl;
      } else {
        throw new Error('Login URL not received');
      }
    } catch (error) {
      console.error('Error initiating login:', error);
    }
  }, []);

  const handleLogout = useCallback(() => {
    console.log('handleLogout called');
    localStorage.removeItem('lineLoginToken');
    setLoggedIn(false);
    setUser(null);
    tokenVerified.current = false;
    console.log('Logout complete');
  }, [setLoggedIn, setUser]);

  const updateUserInfo = useCallback(async () => {
    console.log('updateUserInfo called');

    if (user) {
      const token = localStorage.getItem('lineLoginToken');

      console.log('Token for updating user info:', token ? token.substring(0, 10) + '...' : 'null');

      if (token) {
        await handleAuthStatus(token, user);
      } else {
        console.error('No token found for updating user info');
      }
    } else {
      console.log('No user to update');
    }
  }, [user, handleAuthStatus]);

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('lineLoginToken');

      if (token && !user) {
        console.log('Token found, verifying...');
        await verifyToken(token);
      }
    };

    checkToken();
  }, [verifyToken, user]);

  return { isInitialized, isLoading, user, handleLogin, handleLogout, updateUserInfo };
};
