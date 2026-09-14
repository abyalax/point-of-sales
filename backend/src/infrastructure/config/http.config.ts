import z from 'zod';
import { validateSchema } from '~/common/helpers/validation';

const httpConfigSchema = z.object({
  http: z.object({
    cors: z.string({ message: 'CORS is required' }),
    isProduction: z.boolean({ message: 'ENVIRONMENT is required' }),
    isDevelopment: z.boolean({ message: 'ENVIRONMENT is required' }),
  }),
});

type Schema = z.infer<typeof httpConfigSchema>;
export type HttpConfig = Schema['http'];

export default () => {
  const config = {
    http: {
      cors: process.env.CORS_ORIGIN!,
      isProduction: process.env.ENVIRONMENT === 'production',
      isDevelopment: process.env.ENVIRONMENT === 'development',
    },
  };
  return validateSchema(httpConfigSchema, config);
};
