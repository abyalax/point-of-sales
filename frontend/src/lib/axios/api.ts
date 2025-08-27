import { type TResponse, EMessage } from '~/common/types/response';
import { CREDENTIAL } from '~/common/const/credential';
import { useSessionStore } from '~/stores/use-session';
import type { AxiosRequestConfig } from 'axios';
import { router } from '~/main';
import axios from 'axios';

export const axiosRequest: AxiosRequestConfig = {
  baseURL: CREDENTIAL.API.base_url,
  withCredentials: true,
};

export const api = axios.create(axiosRequest);
const setStatus = useSessionStore.getState().setStatus;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    let responseRefreshToken = null;
    console.log('interceptor error: ', error);
    const originalRequest = error.config;
    const response = error.response?.data as TResponse;
    console.log({ response });
    if (!response) return Promise.reject(error);
    if (response.error === EMessage.TOKEN_EXPIRED && !originalRequest._retry) {
      console.log('token expired, refreshing...');
      originalRequest._retry = true;
      try {
        setStatus('authenticating');
        responseRefreshToken = await api.post('/auth/refresh').then((res) => {
          setStatus('authenticated');
          console.log('Refresh token success', res);
          return api(originalRequest);
        });
      } catch (err) {
        console.log('response refresh token: ', { responseRefreshToken });
        console.log('catch error : ', err);
        return Promise.reject(response);
      }
    } else if (
      response.message === EMessage.TOKEN_NOT_FOUND ||
      response.message === EMessage.TOKEN_INVALID ||
      response.message === EMessage.TOKEN_MALFORMED ||
      response.message === EMessage.TOKEN_NOT_BEFORE ||
      response.message === EMessage.REFRESH_TOKEN_EXPIRED
    ) {
      console.log('refresh token expired', { response });
      setStatus('unauthenticated');
      router.navigate({ to: '/auth/login' });
      return Promise.reject(response);
    } else if (response.statusCode === 403 || response.statusCode === 401) {
      setStatus('unauthenticated');
      console.log('auth broken: ', { responseRefreshToken });
      router.navigate({ to: '/auth/login' });
      return Promise.reject(response);
    } else if (response.statusCode === 404) {
      console.log('Something Not Found');
      return Promise.reject(response);
    } else {
      console.log('reject response: ', response);
      return Promise.reject(response);
    }
    return Promise.reject(error);
  },
);
