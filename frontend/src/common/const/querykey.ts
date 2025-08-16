import type { ExtractString } from '~/utils';

export const QUERY_KEY = {
  PRODUCT: {
    GET_ALL: 'get-product-all',
    GET_BY_ID: 'get-product-by-id',
    GET_CATEGORIES: 'get-product-categories',
    GET_INFINITE: 'get-infinite-product',
    GET_POPULAR: 'get-popular-product',
    GET_SEARCH: 'get-search-product',
  },
  TRANSACTION: {
    GET_ALL: 'get-transaction-all',
  },
} as const;

export type QueryKey = ExtractString<typeof QUERY_KEY>;
