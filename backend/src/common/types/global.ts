import { IUserPayload } from '~/modules/user/user.interface';

/**disable-next-line @typescript-eslint/no-namespace */
declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
    }
  }
}
