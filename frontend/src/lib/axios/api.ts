import { notifications } from '@mantine/notifications';
import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';
import { CREDENTIAL } from '~/common/const/credential';
import { EMessage } from '~/common/types/response';

export const axiosRequest: AxiosRequestConfig = {
  baseURL: CREDENTIAL.API.base_url,
  withCredentials: true,
};

export const api = axios.create(axiosRequest);

api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    const isRefreshing = originalRequest.url.includes('/auth/refresh');
    if (isRefreshing) return Promise.reject(error);

    if (error?.response?.data?.message === EMessage.TOKEN_EXPIRED && !originalRequest._retry) {
      originalRequest._retry = true;
      api
        .post('/auth/refresh')
        .then(res => {
          if (res.data.statusCode === 200) {
            return api(originalRequest);
          } else {
            window.location.href = '/auth/login';
          }
        })
        .catch(() => {
          window.location.href = '/auth/login';
        });
    } else if (error?.response?.data?.message === EMessage.TOKEN_NOT_FOUND) {
      window.location.href = '/auth/login';
    }

    if (error.code === 'ERR_NETWORK') {
      notifications.show({
        color: 'orange',
        title: 'Network Error',
        message: 'Please check your internet connection and try again.',
      });
      return Promise.reject(error);
    }
  }
);
