import type { ExtractString } from '~/utils';

export const QUERY_KEY = {
  PRODUCT: {
    GET_ALL: 'get-product-all',
    GET_BY_ID: 'get-product-by-id',
    GET_CATEGORIES: 'get-product-categories',
    GET_INFINITE: 'get-infinite-product',
    GET_POPULAR: 'get-popular-product',
    GET_SEARCH: 'get-search-product',

    GET_SOLD: 'get-product-sold',
    GET_TRENDING: 'get-product-trending',
    GET_DISCOUNT_IMPACT: 'get-product-discount-impact',
  },
  TRANSACTION: {
    GET_ALL: 'get-transaction-all',
    GET_BY_ID: 'get-transaction-by-id',
  },
  SALES: {
    PER_MONTH: 'get-sales-per-month',
    PER_YEAR: 'get-sales-per-year',

    BY_YEAR: 'get-sales-by-year',
    BY_CATEGORY: 'get-sales-by-category',
  },
} as const;

export type QueryKey<T = never> = ExtractString<typeof QUERY_KEY> | T;
