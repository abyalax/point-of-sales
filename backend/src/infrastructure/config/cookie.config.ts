import z from 'zod';
import { validateSchema } from '~/common/helpers/validation';

const cookieConfigSchema = z.object({
  cookie: z.object({
    secret: z.string({ message: 'Cookie secret is required' }),
  }),
});

type Schema = z.infer<typeof cookieConfigSchema>;
export type CookieConfig = Schema['cookie'];

export default () => {
  const config = {
    cookie: {
      secret: process.env.COOKIE_SECRET!,
    },
  };
  return validateSchema(cookieConfigSchema, config);
};
