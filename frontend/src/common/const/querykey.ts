export const QUERY_KEY = {
  PRODUCT: {
    GET_ALL: 'get-product-all',
    GET_BY_ID: 'get-product-by-id',
    GET_CATEGORIES: 'get-product-categories',
  },
} as const;

type ObjectKey = typeof QUERY_KEY;
export type QueryKey = ObjectKey[keyof ObjectKey][keyof ObjectKey[keyof ObjectKey]];
