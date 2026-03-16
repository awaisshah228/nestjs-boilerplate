import { Module } from '@nestjs/common';
import { RedisTodosController } from './redis-todos.controller';
import { RedisTodosService } from './redis-todos.service';

@Module({
  controllers: [RedisTodosController],
  providers: [RedisTodosService],
})
export class RedisTodosModule {}
