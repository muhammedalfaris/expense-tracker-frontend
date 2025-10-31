import apiClient from './apiClient';

export const fetchTransactions = (filters) => apiClient.get('/transactions', { params: filters });
export const addTransaction = (data) => apiClient.post('/transactions', data);
export const fetchMonthlySummary = () => apiClient.get('/transactions/summary/monthly');
export const fetchTopCategories = () => {
  const startDate = '2025-01-01';  // customize or pass as param
  const endDate = '2025-12-31';
  return apiClient.get('/transactions/summary/top-categories', { params: { startDate, endDate, limit: 5 } });
};
export const fetchRecentTransactions = () => apiClient.get('/transactions/recent', { params: { limit: 10 } });
export const deleteTransaction = (transactionId) => 
  apiClient.delete(`/transactions/${transactionId}`);