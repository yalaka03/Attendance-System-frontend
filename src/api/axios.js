import axios from 'axios';
const BASE_URL = 'https://attendance-system-backend-vkyx.onrender.com';

const axiosPublic = axios.create({
    baseURL: BASE_URL
});

export default axiosPublic;

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// Global loading indicator via CustomEvent
let activeRequests = 0;
const emitLoading = () => {
    if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('global-axios-loading', { detail: { count: activeRequests } }));
    }
};

const attachLoadingInterceptors = (instance) => {
    instance.interceptors.request.use((config) => {
        activeRequests += 1;
        emitLoading();
        return config;
    }, (error) => {
        return Promise.reject(error);
    });

    instance.interceptors.response.use((response) => {
        activeRequests = Math.max(0, activeRequests - 1);
        emitLoading();
        return response;
    }, (error) => {
        activeRequests = Math.max(0, activeRequests - 1);
        emitLoading();
        return Promise.reject(error);
    });
};

attachLoadingInterceptors(axiosPublic);
attachLoadingInterceptors(axiosPrivate);