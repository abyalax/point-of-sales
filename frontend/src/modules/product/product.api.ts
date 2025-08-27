import { api } from '~/lib/axios/api';

import type {
  QueryProducts,
  Product,
  ICategory,
  TPayloadProduct,
  ProductPaginated,
  ProductFrequencySold,
  ProductTrending,
  ProductTrendPeriode,
  ProductDiscountImpact,
} from './product.schema';
import type { TAxiosResponse } from '~/common/types/response';
import type { FilterPeriode } from '~/common/types/filter';

export const getProducts = async (): Promise<TAxiosResponse<Product[]>> => {
  return api.get('/products');
};

export const searchProducts = async (params: { search: string }): Promise<TAxiosResponse<Product[]>> => {
  return api.get('/products/search/name', { params });
};

export const filterProducts = async (params: QueryProducts): Promise<TAxiosResponse<ProductPaginated>> => {
  return api.get('/products/search', { params });
};

export const getProductCategories = async (): Promise<TAxiosResponse<ICategory[]>> => {
  return api.get('/products/categories');
};

export const getProductByID = (params: { id: string }): Promise<TAxiosResponse<Product>> => {
  return api.get(`/products/${params.id}`);
};

export const getProductSold = (params: FilterPeriode): Promise<TAxiosResponse<ProductFrequencySold[]>> => {
  return api.get('/products/sold', { params });
};

export const getProductDiscountImpact = (params: FilterPeriode): Promise<TAxiosResponse<ProductDiscountImpact[]>> => {
  return api.get('/products/discount/impact', { params });
};

export const getProductTrendings = (params: { type_periode: ProductTrendPeriode }): Promise<TAxiosResponse<ProductTrending[]>> => {
  return api.get('/products/trending', { params });
};

export const updateProduct = (payload: TPayloadProduct): Promise<TAxiosResponse<Product>> => {
  return api.patch(`/products/${payload.id}`, payload);
};

export const deleteProduct = (params: { id: string }): Promise<TAxiosResponse<boolean>> => {
  return api.delete(`/products/${params.id}`);
};

export const createProduct = (payload: TPayloadProduct): Promise<TAxiosResponse<Product>> => {
  return api.post('/products', payload);
};

export const createCategory = (payload: { name: string }): Promise<TAxiosResponse<{ category: ICategory }>> => {
  return api.post('/products/categories', payload);
};
