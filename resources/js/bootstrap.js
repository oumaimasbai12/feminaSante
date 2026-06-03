import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['Accept'] = 'application/json';

const AUTH_SKIP = ['/api/v1/login', '/api/v1/register', '/api/v1/forgot-password', '/api/v1/reset-password'];

function applyAuthToken(token) {
    if (token) {
        localStorage.setItem('auth_token', token);
        window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    } else {
        localStorage.removeItem('auth_token');
        delete window.axios.defaults.headers.common['Authorization'];
    }
}

// Restore auth token from localStorage
applyAuthToken(localStorage.getItem('auth_token'));

window.setAuthToken = applyAuthToken;

// Always attach the latest token (Inertia navigations / HMR can drop defaults)
window.axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
});

window.axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || '';

        if (status === 401 && !AUTH_SKIP.some((path) => url.includes(path))) {
            applyAuthToken(null);
            localStorage.removeItem('user');

            const path = window.location.pathname + window.location.search;
            if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
                window.location.href = '/login?redirect=' + encodeURIComponent(path);
            }
        }

        return Promise.reject(error);
    }
);
