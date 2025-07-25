import type { QueryProducts, IProduct, ICategory, TProductCreate } from './type';
import type { TAxiosResponse, TResponse } from '~/common/types/response';
import { api } from '~/lib/axios/api';
import type { MetaResponse } from '~/common/types/meta';

export const getProducts = async (params: QueryProducts): Promise<TAxiosResponse<{ data: IProduct[]; meta: MetaResponse }>> => {
  console.log(params);
  return api.get('/products', { params });
};

export const getProductCategories = async (): Promise<TAxiosResponse<ICategory[]>> => {
  return api.get('/products/categories');
};

export const getProductByID = (params: { id: string }): Promise<TAxiosResponse<IProduct>> => {
  return api.get(`/products/${params.id}`);
};

export const deleteProduct = (params: { id: string }): Promise<TResponse<null>> => {
  console.log(params);
  const res = {
    statusCode: 200,
    data: null,
  };
  return Promise.resolve(res);
};

export const createProduct = (params: TProductCreate): Promise<TAxiosResponse<IProduct>> => {
  return api.post('/products', params);
};

export const createCategory = (params: { name: string }): Promise<TAxiosResponse<{ category: ICategory }>> => {
  console.log(params);
  return api.post('/products/categories', params);
};

export const updateProduct = (params: { id: string }, req: unknown): Promise<TResponse<null>> => {
  console.log(req, params);
  const res: TResponse<null> = {
    statusCode: 200,
    data: null,
  };
  return Promise.resolve(res);
};
