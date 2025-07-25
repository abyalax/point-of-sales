import type { TAxiosResponse, TResponse } from '~/common/types/response';
import type { IUser } from '~/api/user/user';
import { api } from '~/lib/axios/api';

export type TLoginParams = {
  email: string;
  password: string;
};
export const postLogin = async (payload: TLoginParams): Promise<TAxiosResponse<IUser>> => {
  return await api.post('/auth/login', payload);
};

export const refreshTokens = async (refreshToken: string): Promise<TResponse<{ access_token: string }>> => {
  return await api
    .post('/auth/refresh', { refreshToken })
    .then(res => res.data)
    .catch(err => err);
};

export const getPermission = async (): Promise<IUser> => {
  const data: Promise<IUser> = Promise.resolve({
    id: 1,
    name: 'Abya Lacks',
    email: 'abyalaxx@gmail.com',
    roles: [
      {
        id: 1,
        name: 'admin',
        users: [],
        permissions: [],
      },
    ],
    permissions: [],
  });
  return data;
};
