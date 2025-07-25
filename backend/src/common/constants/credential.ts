export const environment = process.env.NODE_ENV || 'development';

export const isDevelopment = environment === 'development';

export const CREDENTIALS = {
  JWT_SECRET: 'jwt_secret',
  JWT_PRIVATE_KEY: 'jwt_private_key',
  JWT_PUBLIC_KEY: 'jwt_public_key',
  JWT_SECRET_OR_PRIVATE_KEY: 'jwt_secret_or_private_key',
  JWT_SECRET_OR_PROVIDER_KEY: 'jwt_secret_or_provider_key',
  JWT_EXPIRATION: 'jwt_expiration',
  JWT_REFRESH_SECRET: 'jwt_refresh_secret',
  JWT_REFRESH_EXPIRATION: 'jwt_refresh_expiration',

  COOKIE_SECRET: 'cookie_secret',
};
