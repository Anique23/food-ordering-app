import axios from 'axios';

const API = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth APIs
export const registerUser = (data) => API.post('/users/register/', data);
export const loginUser = (data) => API.post('/users/login/', data);
export const verifyEmail = (data) => API.post('/users/verify-email/', data);
export const getProfile = () => API.get('/users/profile/');

// Menu APIs
export const getCategories = () => API.get('/menu/categories/');
export const getFoodItems = (params) => API.get('/menu/items/', { params });

// Order APIs
export const placeOrder = (data) => API.post('/orders/place_order/', data);
export const getMyOrders = () => API.get('/orders/');

// Admin APIs
export const getAllOrders = () => API.get('/orders/');
export const updateOrderStatus = (id, status) => API.patch(`/orders/${id}/update_status/`, { status });
export const addFoodItem = (data) => API.post('/menu/items/', data);
export const updateFoodItem = (id, data) => API.put(`/menu/items/${id}/`, data);
export const deleteFoodItem = (id) => API.delete(`/menu/items/${id}/`);
export const addCategory = (data) => API.post('/menu/categories/', data);