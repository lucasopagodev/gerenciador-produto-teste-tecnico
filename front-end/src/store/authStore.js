import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const initialState = {
  token: null,
  user: null,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...initialState,
      setAuth: ({ token, user }) => set({ token, user }),
      updateUser: (user) => set((state) => ({ ...state, user })),
      logout: () => set(initialState),
    }),
    {
      name: 'gerenciador-produto-auth',
    },
  ),
);
