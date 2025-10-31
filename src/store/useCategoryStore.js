import { create } from 'zustand';
import { fetchCategories } from '@/api/category';

export const useCategoryStore = create((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchCategories();
      set({ categories: res.data.categories, loading: false });
    } catch (e) {
      set({ error: e.message || 'Failed to load categories', loading: false });
    }
  },
}));
