import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userInfo: null,

      setAccessToken: (token) => set({ accessToken: token }),
      setRefreshToken: (token) => set({ refreshToken: token }),
      setUserInfo: (info) => set({ userInfo: info }),

      clearAuth: () => set({ accessToken: null, refreshToken: null, userInfo: null }),
    }),
    {
      name: 'auth-storage', // Nombre de la clave en el localStorage
      getStorage: () => localStorage, // Puedes cambiarlo a sessionStorage si prefieres
    }
  )
);
