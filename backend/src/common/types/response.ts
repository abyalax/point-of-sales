import { HttpStatus } from '@nestjs/common';

export type TResponse<T> = {
  statusCode: HttpStatus;
  message?: string;
  error?: string;
  data?: T;
};

export enum EMessage {
  TOKEN_NOT_FOUND = 'Token Not Found',
  TOKEN_INVALID = 'Token Invalid',
  TOKEN_EXPIRED = 'Token Expired',
  TOKEN_MALFORMED = 'Token Malformed',
  TOKEN_SIGNATURE_INVALID = 'Token Signature Invalid',
  TOKEN_NOT_BEFORE = 'Token Not Before',
  TOKEN_ERROR = 'Token Error',

  DATABASE_ERROR = 'Database Error',
  DATABASE_QUERY_FAILED = 'Database Query Failed',

  ENTITY_NOT_FOUND = 'Entity Not Found',
  ENTITY_CONFLICT = 'Entity Conflict',

  INTERNAL_SERVER_ERROR = 'Internal Server Error',
}
