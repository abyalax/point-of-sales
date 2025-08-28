import z from 'zod';
import { validateSchema } from '~/common/helpers/validation';

const databaseConfigSchema = z.object({
  database: z.object({
    host: z.string({ message: 'Invalid database host' }),
    port: z.number({ message: 'Invalid database port' }),
    username: z.string({ message: 'Invalid database username' }),
    password: z.string({ message: 'Invalid database password' }).optional(),
    database: z.string({ message: 'Invalid database name' }),
  }),
});

type Schema = z.infer<typeof databaseConfigSchema>;
export type DatabaseConfig = Schema['database'];

export default () => {
  const config = {
    database: {
      host: process.env.DATABASE_HOST!,
      port: parseInt(process.env.DATABASE_PORT!),
      username: process.env.DATABASE_USERNAME!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
    },
  };
  return validateSchema(databaseConfigSchema, config);
};
