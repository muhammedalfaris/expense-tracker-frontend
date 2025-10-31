import apiClient from './apiClient';

export const fetchCategories = () => apiClient.get('/categories');
