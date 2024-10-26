import { jwtDecode } from "jwt-decode";

import type { TypeClientVerify } from "@/types/clientTypes";

export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const removeToken = (): void => {
  localStorage.removeItem('token');
};

export const decodeToken = (token: string): TypeClientVerify | null => {
  try {
    const decoded = jwtDecode<TypeClientVerify>(token);

    console.log('Decoded token:', decoded);

    return {
      userId: decoded.userId,
      displayName: decoded.displayName,
      pictureUrl: decoded.pictureUrl,
      userType: decoded.userType,
      idType: decoded.idType,
    };
  } catch (error) {
    console.error('Failed to decode token:', error);

    return null;
  }
};

export const getUserData = (): TypeClientVerify | null => {
  const token = getToken();

  if (token) {
    return decodeToken(token);
  }


  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  removeToken();
};
