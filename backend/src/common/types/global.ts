import { IUserPayload } from '~/modules/user/user.interface';

declare module 'express' {
  interface Request {
    user?: IUserPayload;
  }
}
