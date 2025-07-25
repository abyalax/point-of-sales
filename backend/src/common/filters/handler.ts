import { HttpException, HttpStatus } from '@nestjs/common';
import { JsonWebTokenError, NotBeforeError, TokenExpiredError } from '@nestjs/jwt';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';
import { EMessage } from '../types/response';

type ExceptionHandler<T = unknown> = (e: T) => {
  statusCode: number;
  message: string;
  error: string;
};

export const handlers = new Map<Function, ExceptionHandler>([
  [
    NotBeforeError,
    (e: NotBeforeError) => {
      console.log('NotBeforeError: ', e.message);
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: EMessage.TOKEN_NOT_BEFORE,
        error: e.message,
      };
    },
  ],
  [
    TokenExpiredError,
    (e: TokenExpiredError) => {
      console.log('TokenExpiredError: ', e.message);
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: EMessage.TOKEN_EXPIRED,
        error: e.message,
      };
    },
  ],
  [
    JsonWebTokenError,
    (e: JsonWebTokenError) => {
      console.log('JsonWebTokenError: ', e.message);
      return {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: EMessage.TOKEN_ERROR,
        error: e.message,
      };
    },
  ],
  [
    QueryFailedError,
    (e: QueryFailedError) => {
      console.log('QueryFailedError: ', e.message);
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: EMessage.DATABASE_QUERY_FAILED,
        error: e.message,
      };
    },
  ],
  [
    EntityNotFoundError,
    (e: EntityNotFoundError) => {
      console.log('EntityNotFoundError: ', e.message);
      return {
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        message: EMessage.ENTITY_NOT_FOUND,
        error: e.message,
      };
    },
  ],
  [
    HttpException,
    (e: HttpException) => {
      console.log('HttpException: ', e.getResponse());
      const response = e.getResponse();
      return {
        statusCode: e.getStatus(),
        message: (response as any).message,
        error: e.message,
      };
    },
  ],
]);
