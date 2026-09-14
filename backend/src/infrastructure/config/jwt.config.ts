import z from 'zod';
import { validateSchema } from '~/common/helpers/validation';

const jwtConfigSchema = z.object({
  jwt: z.object({
    secret: z.string({ message: 'JWT secret is required' }),
    private_key: z.string({ message: 'JWT private key is required' }),
    public_key: z.string({ message: 'JWT public key is required' }),
    expiration: z.string({ message: 'JWT expiration is required' }),
    refresh_secret: z.string({ message: 'JWT refresh secret is required' }),
    refresh_expiration: z.string({ message: 'JWT refresh expiration is required' }),
  }),
});

type Schema = z.infer<typeof jwtConfigSchema>;
export type JwtConfig = Schema['jwt'];

export default () => {
  const config = {
    jwt: {
      secret: process.env.JWT_SECRET,
      private_key: process.env.JWT_PRIVATE_KEY,
      public_key: process.env.JWT_PUBLIC_KEY,
      expiration: process.env.JWT_EXPIRATION,
      refresh_secret: process.env.JWT_REFRESH_SECRET,
      refresh_expiration: process.env.JWT_REFRESH_EXPIRATION,
    },
  };
  return validateSchema(jwtConfigSchema, config);
};
