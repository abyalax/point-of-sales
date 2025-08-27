// import { EMessage, type TResponse } from '~/common/types/response';
import { useSessionStore } from '~/stores/use-session';
// import { api } from '~/lib/axios/api';
import { useEffect } from 'react';
// import { router } from '~/main';

const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const session = useSessionStore((s) => s.session);
  // const setStatus = useSessionStore((s) => s.setStatus);

  useEffect(() => {
    console.log('status session: ', session.status);
  }, [session.status, session]);

  // useEffect(() => {
  //   const interceptor = api.interceptors.response.use(
  //     (response) => response,
  //     async (error) => {
  //       console.log('interceptor error: ', error);
  //       const originalRequest = error.config;
  //       const response = error.response?.data as TResponse;
  //       console.log({ originalRequest });
  //       console.log({ response });
  //       console.log('reject error', error);
  //       if (!response) return Promise.reject(error);
  //       if (response.error === EMessage.TOKEN_EXPIRED && !originalRequest._retry) {
  //         console.log('token expired, refreshing...', { response });
  //         originalRequest._retry = true;
  //         try {
  //           setStatus('authenticating');
  //           await api.post('/auth/refresh').then(() => {
  //             setStatus('authenticated');
  //             console.log('Refresh token success');
  //             api(originalRequest);
  //           });
  //         } catch (err) {
  //           setStatus('unauthenticated');
  //           console.log('Refresh token failed', err);
  //           router.navigate({ to: '/auth/login' });
  //         }
  //       } else if (
  //         response.message === EMessage.TOKEN_NOT_FOUND ||
  //         response.message === EMessage.TOKEN_INVALID ||
  //         response.message === EMessage.TOKEN_MALFORMED ||
  //         response.message === EMessage.TOKEN_NOT_BEFORE ||
  //         response.message === EMessage.REFRESH_TOKEN_EXPIRED
  //       ) {
  //         console.log('refresh token expired');
  //         setStatus('unauthenticated');
  //         router.navigate({ to: '/auth/login' });
  //         return;
  //       } else if (response.statusCode === 403 || response.statusCode === 401) {
  //         setStatus('unauthenticated');
  //         router.navigate({ to: '/auth/login' });
  //         return;
  //       }
  //       console.log('undhandle error');
  //       console.log('refresh token expired');
  //       setStatus('unauthenticated');
  //       return Promise.reject(error);
  //     },
  //   );

  //   return () => api.interceptors.response.eject(interceptor);
  // }, [setStatus]);

  return children;
};

export default SessionProvider;
