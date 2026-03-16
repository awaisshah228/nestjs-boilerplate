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
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@ApiTags('Todos (PostgreSQL)')
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiOperation({ summary: 'Create a todo' })
  create(@Body() dto: CreateTodoDto) {
    return this.todosService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all todos' })
  findAll() {
    return this.todosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a todo by id' })
  findOne(@Param('id') id: string) {
    return this.todosService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo' })
  update(@Param('id') id: string, @Body() dto: UpdateTodoDto) {
    return this.todosService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a todo' })
  remove(@Param('id') id: string) {
    return this.todosService.remove(id);
  }
}
