import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// ==================== AUTH APIs ====================
export const authAPI = {
    login: (credentials) => api.post('/admin/login', credentials),
    getProfile: () => api.get('/admin/profile'),
};

// ==================== PERFORMER APIs ====================
export const performerAPI = {
    getAll: () => api.get('/performers'),
    search: (params) => api.get('/performers/search', { params }),
    getById: (id) => api.get(`/performers/${id}`),
    create: (data) => api.post('/performers', data),
    update: (id, data) => api.put(`/performers/${id}`, data),
    delete: (id) => api.delete(`/performers/${id}`),
};

// ==================== CLIENT APIs ====================
export const clientAPI = {
    generateLink: (data) => api.post('/client/generate-link', data),
    validate: (accessCode) => api.get(`/client/validate/${accessCode}`),
    addToCastingGroup: (data) => api.post('/client/casting-group/add', data),
    removeFromCastingGroup: (data) => api.post('/client/casting-group/remove', data),
    getCastingGroup: (clientId) => api.get(`/client/casting-group/${clientId}`),
    finalizeCastingGroup: (data) => api.post('/client/casting-group/finalize', data),
    getCastingOrders: () => api.get('/client/casting-orders'),
    getCastingOrderById: (id) => api.get(`/client/casting-orders/${id}`),
};

// ==================== EMAIL APIs ====================
export const emailAPI = {
    generate: (data) => api.post('/email/generate', data),
    send: (data) => api.post('/email/send', data),
};

export default api;
