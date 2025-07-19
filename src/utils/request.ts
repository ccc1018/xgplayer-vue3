import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { handleError } from './errorHandler';
console.log(import.meta.env.VITE_APP_URL);

const request = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  timeout: 300000,
});

// 请求拦截器
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 可在此添加 token、loading 等逻辑
    return config;
  },
  (error: AxiosError) => {
    handleError(error);
    return Promise.reject(error);
  },
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse) => {
    // 业务错误统一处理
    if (response.data && response.data.code && response.data.code !== 200) {
      handleError(response.data.message || '业务错误');
      return Promise.reject(response.data.data);
    }
    return response.data;
  },
  (error: AxiosError) => {
    // 网络错误、超时等
    handleError(error);
    return Promise.reject(error);
  },
);

export default request;
