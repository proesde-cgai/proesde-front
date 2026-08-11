import axios from "axios";
import { logout, refreshAccessToken } from "../features/authService";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

let refreshPromise = null;
const MAX_REFRESH_ATTEMPTS = 3;
const BASE_REFRESH_BACKOFF_MS = 1000;

const wait = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

const forceLogout = () => {
    logout();
    if (window.location.pathname !== "/login") {
        window.location.assign("/login");
    }
};

const refreshWithBackoff = async () => {
    for (let attempt = 1; attempt <= MAX_REFRESH_ATTEMPTS; attempt += 1) {
        try {
            return await refreshAccessToken();
        } catch (refreshError) {
            const refreshStatus = refreshError?.response?.status;
            const isAuthError = refreshStatus === 401 || refreshStatus === 403;

            if (!isAuthError) {
                throw refreshError;
            }

            if (attempt === MAX_REFRESH_ATTEMPTS) {
                forceLogout();
                throw refreshError;
            }

            const delay = BASE_REFRESH_BACKOFF_MS * (2 ** (attempt - 1));
            await wait(delay);
        }
    }
};

api.interceptors.request.use( config => {
    const token = localStorage.getItem('accessToken');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const refreshToken = localStorage.getItem('refreshToken');

        const isAuthEndpoint = originalRequest?.url?.includes('/api/v1/auth/login')
            || originalRequest?.url?.includes('/api/v1/auth/refresh-token');

        if ((status === 401 || status === 403) && !originalRequest?._retry && refreshToken && !isAuthEndpoint) {
            originalRequest._retry = true;

            try {
                if (!refreshPromise) {
                    refreshPromise = refreshWithBackoff().finally(() => {
                        refreshPromise = null;
                    });
                }

                const newAccessToken = await refreshPromise;
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;