import axios from 'axios';
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Restore auth token from localStorage
const token = localStorage.getItem('auth_token');
if (token) {
    window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}

// Helper to set/clear auth token
window.setAuthToken = (t) => {
    if (t) {
        localStorage.setItem('auth_token', t);
        window.axios.defaults.headers.common['Authorization'] = 'Bearer ' + t;
    } else {
        localStorage.removeItem('auth_token');
        delete window.axios.defaults.headers.common['Authorization'];
    }
};
