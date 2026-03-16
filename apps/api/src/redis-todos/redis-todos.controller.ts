import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RedisTodosService } from './redis-todos.service';
import { CreateTodoDto } from '../todos/dto/create-todo.dto';
import { UpdateTodoDto } from '../todos/dto/update-todo.dto';

@ApiTags('Todos (Redis)')
@Controller('redis-todos')
export class RedisTodosController {
  constructor(private readonly redisTodosService: RedisTodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a todo in Redis' })
  create(@Body() dto: CreateTodoDto) {
    return this.redisTodosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos from Redis' })
  findAll() {
    return this.redisTodosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id from Redis' })
  findOne(@Param('id') id: string) {
    return this.redisTodosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo in Redis' })
  update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.redisTodosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo from Redis' })
  remove(@Param('id') id: string) {
    return this.redisTodosService.remove(id);
  }
}
