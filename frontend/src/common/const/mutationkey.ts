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
};

type ObjectKey = typeof MUTATION_KEY;
export type MutationKey = ObjectKey[keyof ObjectKey][keyof ObjectKey[keyof ObjectKey]];
