import Big from 'big.js';
import z from 'zod';

export const numberAsString = (min: number, max: number, msg: string) =>
  z.preprocess((val) => (val !== undefined ? Number(val) : undefined), z.number().min(min).max(max), { message: msg });

export const basePaginationSchema = (entityKey: readonly [string, ...string[]]) =>
  z.object({
    page: z.coerce.number().min(1).optional().default(1),
    per_page: z.coerce.number().min(1).max(100).optional().default(10),
    sort_by: z.enum(entityKey).optional(),
    order_by: z.enum(['ASC', 'DESC']).optional(),
    search: z.string().optional(),
    engine: z.enum(['server_side', 'client_side']).default('server_side').optional(),
  });

export const isValidStringPrice = () =>
  z.string().superRefine((val, ctx) => {
    try {
      if (val.includes(',')) {
        ctx.addIssue({
          code: 'custom',
          message: 'Use dot as decimal separator',
        });
      }
      const num = new Big(val);
      if (Number.isNaN(num)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Value must be a valid number string',
        });
      }
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid number string' });
    }
  });

export const isValidPercentString = (min: string = '0', max: string = '1') =>
  z.string().superRefine((val, ctx) => {
    try {
      if (val.includes(',')) {
        ctx.addIssue({
          code: 'custom',
          message: 'Use dot as decimal separator',
        });
      }
      const parts = val.split('.');
      if (parts[1] && parts[1].length > 4) {
        ctx.addIssue({
          code: 'custom',
          message: 'Value must have at most 4 decimal places',
        });
        return;
      }
      const num = new Big(val);
      if (Number.isNaN(Number(num.toString()))) {
        ctx.addIssue({
          code: 'custom',
          message: 'Value must be a valid number string',
        });
        return;
      }
      if (num.lt(min) || num.gt(max)) {
        ctx.addIssue({
          code: 'custom',
          message: `Percentage must be between ${min} and ${max}`,
        });
      }
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid number string' });
    }
  });
