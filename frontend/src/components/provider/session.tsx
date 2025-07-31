import { useNavigate } from '@tanstack/react-router';

import { useEffect } from 'react';

import { useSessionStore } from '~/stores/use-session';
import { EMessage } from '~/common/types/response';
import { api } from '~/lib/axios/api';

const SessionProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const session = useSessionStore((s) => s.session);
  const setStatus = useSessionStore((s) => s.setStatus);
  const navigate = useNavigate();

  useEffect(() => {
    if (session.status === 'unauthenticated') {
      navigate({ to: '/auth/login' });
      return;
    }
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        console.log('error: ', error);

        if (error?.response?.data?.error === EMessage.TOKEN_EXPIRED && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            setStatus('authenticating');
            console.log('Refreshing token...');
            await api.post('/auth/refresh');
            // After refreshing token, retry the original request
            return api(originalRequest);
          } catch (refreshErr) {
            // Refresh failed → force logout
            console.log('Refresh token failed...');
            navigate({ to: '/auth/login' });
            return Promise.reject(refreshErr);
          }
        } else if (error?.response?.data?.statusCode === 403) {
          console.log('Access denied...', error.response.data);

          setStatus('unauthenticated');
          navigate({ to: '/auth/login' });
        }

        return Promise.reject(error);
      }
    );

    return () => api.interceptors.response.eject(interceptor);
  }, [navigate, session.status, setStatus]);

  return children;
};

export default SessionProvider;
