import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { json } from 'express';
import { LoggerModule as LoggerPinoModule } from 'nestjs-pino';
import { HttpConfig } from '~/infrastructure/config/http.config';

@Module({
  imports: [
    LoggerPinoModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const httpConfig = configService.get<HttpConfig>('http')!;
        return {
          pinoHttp: {
            level: httpConfig?.isProduction ? 'info' : 'debug',
            transport: httpConfig?.isDevelopment
              ? {
                  target: 'pino-pretty',
                  options: {
                    singleLine: false,
                    colorize: true,
                    translateTime: 'HH:MM:ss',
                    ignore: 'pid,hostname',
                  },
                }
              : undefined,
            customSuccessMessage: (req) => `${req.method} ${req.url} completed`,
            customErrorMessage: (req) => `${req.method} ${req.url} failed`,
            serializers: {
              req: (req) => ({
                method: req.method,
                url: req.url,
                id: req.id,
                query: req.query,
              }),
              res: (res) => ({
                statusCode: res.statusCode,
                body: res.body,
                responseTime: res.responseTime,
              }),
            },
          },
        };
      },
    }),
  ],
  exports: [LoggerPinoModule],
})
export class LoggerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(json()).forRoutes('*');
  }
}
