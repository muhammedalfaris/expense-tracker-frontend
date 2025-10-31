import { create } from 'zustand';
import { 
  fetchTransactions, 
  fetchMonthlySummary, 
  fetchTopCategories, 
  fetchRecentTransactions, 
  addTransaction as apiAddTransaction,
  deleteTransaction as apiDeleteTransaction,
} from '@/api/transaction';


export const useTransactionStore = create((set, get) => ({
  transactions: [],
  monthlySummary: [],
  topCategories: [],
  recentTransactions: [],
  filters: {},
  loading: false,
  error: null,

  fetchTransactions: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const res = await fetchTransactions(filters);
      set({ transactions: res.data.transactions, loading: false });
    } catch (e) {
      set({ error: e.message || 'Failed to load transactions', loading: false });
    }
  },

  addTransaction: async (data) => {
     set({ loading: true, error: null });
     try {
     await apiAddTransaction(data);
     await get().fetchTransactions();        // Refresh transactions after add
     await get().fetchRecentTransactions();
     await get().fetchMonthlySummary();
     set({ loading: false });
     } catch (error) {
     set({ error: error.message || "Failed to add transaction", loading: false });
     throw error; // propagate error for better UI handling if desired
     }
   },
  
  fetchMonthlySummary: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchMonthlySummary();
      set({ monthlySummary: res.data.summary, loading: false });
    } catch (e) {
      set({ error: e.message || 'Failed to load summaries', loading: false });
    }
  },

  fetchTopCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchTopCategories();
      set({ topCategories: res.data.topCategories, loading: false });
    } catch (e) {
      set({ error: e.message || 'Failed to load top categories', loading: false });
    }
  },

  fetchRecentTransactions: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetchRecentTransactions();
      set({ recentTransactions: res.data.recentTransactions, loading: false });
    } catch (e) {
      set({ error: e.message || 'Failed to load recent transactions', loading: false });
    }
  },

    deleteTransaction: async (transactionId) => {
        set({ loading: true, error: null });
        try {
        await apiDeleteTransaction(transactionId);
        await get().fetchTransactions();
        await get().fetchRecentTransactions();
        await get().fetchMonthlySummary();
        set({ loading: false });
        } catch (error) {
        set({ error: error.message || "Failed to delete transaction", loading: false });
        throw error;
        }
    },
}));
