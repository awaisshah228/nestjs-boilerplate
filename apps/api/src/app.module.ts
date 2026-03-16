import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@libs/database';
import { LoggerModule, ThrottleModule, RedisModule } from '@libs/commons';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodosModule } from './todos/todos.module';
import { RedisTodosModule } from './redis-todos/redis-todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule,
    DatabaseModule.forRoot(),
    RedisModule.forRoot(),
    ThrottleModule,
    ...(process.env.DB_HOST ? [TodosModule] : []),
    ...(process.env.REDIS_HOST ? [RedisTodosModule] : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
