import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? { target: 'pino-pretty', options: { colorize: true } }
            : undefined,
        level: process.env.LOG_LEVEL || 'info',
        autoLogging: true,
        redact: ['req.headers.authorization', 'req.headers.cookie'],
        serializers: {
          req(req) {
            return {
              method: req.method,
              url: req.url,
              params: req.raw?.params,
            };
          },
          res(res) {
            return { statusCode: res.statusCode };
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}
