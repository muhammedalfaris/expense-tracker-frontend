import apiClient from './apiClient';

export const registerUser = (userData) => apiClient.post('/users/register', userData);
export const loginUser = (credentials) => apiClient.post('/users/login', credentials);