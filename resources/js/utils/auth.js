export function getStoredUser() {
    try {
        return JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
        return {};
    }
}

export function getToken() {
    return localStorage.getItem('auth_token');
}

export function isLoggedIn() {
    return !!getToken();
}

export function ensureAuthToken() {
    const token = getToken();
    if (token && window.setAuthToken) {
        window.setAuthToken(token);
    }
    return token;
}

export async function refreshUser() {
    if (!ensureAuthToken()) return null;
    try {
        const r = await window.axios.get('/api/v1/profile');
        const user = r.data.user || r.data;
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch {
        return null;
    }
}

export async function logout() {
    try {
        await window.axios.post('/api/v1/logout');
    } catch {
        /* token may already be invalid */
    }
    if (window.setAuthToken) {
        window.setAuthToken(null);
    }
    localStorage.removeItem('user');
    window.location.href = '/login';
}

export function requireAuth(redirectTo = '/login') {
    if (!ensureAuthToken()) {
        const path = window.location.pathname + window.location.search;
        window.location.href = redirectTo + (path !== '/' ? '?redirect=' + encodeURIComponent(path) : '');
        return false;
    }
    return true;
}

export async function requireAdmin() {
    if (!requireAuth()) return false;
    const user = await refreshUser();
    if (!user?.is_admin) {
        window.location.href = '/dashboard';
        return false;
    }
    return user;
}

export async function requireGynecologist() {
    if (!requireAuth()) return false;
    const user = await refreshUser();
    if (!user?.is_gynecologist) {
        window.location.href = '/dashboard';
        return false;
    }
    return user;
}
