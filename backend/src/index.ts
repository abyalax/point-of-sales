import { Logger } from '@nestjs/common';
import { dataSource } from '../typeorm.config';

dataSource
  .initialize()
  .then(() => {
    const logger = new Logger('Database Connection');
    logger.log('Connected into the database...');
  })
  .catch((error) => {
    const logger = new Logger('Database Connection');
    logger.error(error);
  });
