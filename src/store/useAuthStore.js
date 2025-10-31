import {create} from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));