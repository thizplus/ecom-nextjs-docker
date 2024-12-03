import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { TypeClient } from '@/types/clientTypes';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

interface ClientState {
  isLoggedIn: boolean;
  user: TypeClient | null;
  isLoading: boolean;
  error: string | null;
  setLoggedIn: (status: boolean) => void;
  setUser: (user: TypeClient | null) => void;
  checkAuthStatus: (token: string, profile: { userId: string; displayName: string; pictureUrl: string, userType: string, idType: string }) => Promise<TypeClient>;
  setError: (error: string | null) => void;
  resetLoading: () => void;
}

export const useClientStores = create<ClientState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      isLoading: true,
      error: null,
      setLoggedIn: (status) => set({ isLoggedIn: status }),
      setUser: (user) => set({ user, isLoggedIn: !!user }),
      setError: (error) => set({ error }),
      checkAuthStatus: async (token, profile) => {
        set({ isLoading: true, error: null });

        try {
          console.log('Checking auth status', { token: token.substring(0, 10) + '...', profile });

          const response = await fetch(`${API_BASE_URL}/api/line/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(profile)
          });

          console.log('Auth status response:', response);

          if (response.ok) {
            const userData: TypeClient = await response.json();

            console.log('User data received:', userData);

            set({ user: userData, isLoggedIn: true, isLoading: false, error: null });
            console.log('State updated:', { user: userData, isLoggedIn: true });

            return userData;
          } else {
            const errorText = await response.text();

            console.error('Auth status error:', errorText);

            set({ isLoggedIn: false, user: null, isLoading: false, error: errorText || 'Authentication failed' });
            throw new Error(errorText || 'Authentication failed');
          }
        } catch (error) {
          console.error('Error checking auth status:', error);
          set({ isLoggedIn: false, user: null, isLoading: false, error: error instanceof Error ? error.message : 'An error occurred' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      resetLoading: () => set({ isLoading: false }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ isLoggedIn: state.isLoggedIn, user: state.user }),
    }
  )
);

export default useClientStores;
