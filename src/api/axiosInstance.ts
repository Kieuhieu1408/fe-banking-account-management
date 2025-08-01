import axios from 'axios';
import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import type { ApiResponse } from '../types/ApiResponse';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:8080',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        apiVersion: 'v1.0',
    },
});

// Interceptor request: tự động gắn token, log dev
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (import.meta.env.DEV) {
            console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
                headers: config.headers,
                data: config.data,
            });
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// GET
export const get = async <T = unknown>(
    path: string,
    options: AxiosRequestConfig = {}
): Promise<T> => {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.get(path, options);
    if (response.data.code === 1000) {
        return response.data.result as T;
    } else {
        throw {
            code: response.data.code,
            message: response.data.message,
            details: response.data,
        };
    }
};

// POST
export const post = async <T = unknown>(
    path: string,
    data?: unknown,
    options: AxiosRequestConfig = {}
): Promise<T> => {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.post(path, data, options);
    if (response.data.code === 1000) {
        return response.data.result as T;
    } else {
        throw {
            code: response.data.code,
            message: response.data.message,
            details: response.data,
        };
    }
};

// PUT
export const put = async <T = unknown>(
    path: string,
    data?: unknown,
    options: AxiosRequestConfig = {}
): Promise<T> => {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.put(path, data, options);
    if (response.data.code === 1000) {
        return response.data.result as T;
    } else {
        throw {
            code: response.data.code,
            message: response.data.message,
            details: response.data,
        };
    }
};

// DELETE
export const deleteRequest = async <T = unknown>(
    path: string,
    options: AxiosRequestConfig = {}
): Promise<T> => {
    const response: AxiosResponse<ApiResponse<T>> = await axiosInstance.delete(path, options);
    if (response.data.code === 1000) {
        return response.data.result as T;
    } else {
        throw {
            code: response.data.code,
            message: response.data.message,
            details: response.data,
        };
    }
};

export default axiosInstance;
