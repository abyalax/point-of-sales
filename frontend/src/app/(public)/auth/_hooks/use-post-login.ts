import { useMutation, type UseMutationResult } from '@tanstack/react-query';
import { notifications } from '@mantine/notifications';

import { postLogin, type TLoginParams } from '~/api/auth';
import { MUTATION_KEY } from '~/common/const/mutationkey';
import { useSessionStore } from '~/stores/use-session';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { IUser } from '~/api/user/user';

export const usePostLogin = (): UseMutationResult<TAxiosResponse<IUser>, TResponse, TLoginParams, unknown> => {
  const setSession = useSessionStore((s) => s.setSession);
  return useMutation({
    mutationKey: [MUTATION_KEY.AUTH.LOGIN],
    mutationFn: async (payload) => await postLogin(payload),
    meta: { invalidateQueries: [] },
    onSuccess: (res) => {
      setSession({
        status: 'authenticated',
        user: res.data.data,
      });
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Successfully login',
      });
    },
    onError: (error) => {
      console.log('usePostLogin error: ', error);
      notifications.show({
        color: 'red',
        title: 'Login Failed',
        message: error.message,
      });
    },
  });
};
