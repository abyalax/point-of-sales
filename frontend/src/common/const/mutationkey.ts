import type { ExtractString } from '~/utils';

export const MUTATION_KEY = {
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    LOGOUT: 'logout',
  },
  PRODUCT: {
    CREATE: 'create_product',
    UPDATE: 'update_product',
    DELETE: 'delete_product',

    CREATE_CATEGORY: 'create_product_category',
    UPDATE_CATEGORY: 'update_product_category',
    DELETE_CATEGORY: 'delete_product_category',
  },
  TRANSACTION: {
    CREATE: 'create_transaction',
  },
} as const;

export type MutationKey = ExtractString<typeof MUTATION_KEY>;
