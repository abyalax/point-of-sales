import type { AxiosResponse } from 'axios';

export enum EMessage {
  TOKEN_NOT_FOUND = 'Token Not Found',
  TOKEN_INVALID = 'Token Invalid',
  TOKEN_EXPIRED = 'Token Expired',
  TOKEN_MALFORMED = 'Token Malformed',
  TOKEN_SIGNATURE_INVALID = 'Token Signature Invalid',
  TOKEN_NOT_BEFORE = 'Token Not Before',

  DATABASE_ERROR = 'Database Error',
  DATABASE_QUERY_FAILED = 'Database Query Failed',

  ENTITY_NOT_FOUND = 'Entity Not Found',
  ENTITY_CONFLICT = 'Entity Conflict',

  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}

export type TResponse<T = unknown> = {
  statusCode: number;
  message?: string;
  error?: string;
  data?: T;
};

export type TAxiosResponse<T> = AxiosResponse<TResponse<T>>;
