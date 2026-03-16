import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '@libs/database';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  create(dto: CreateTodoDto) {
    const todo = this.todoRepo.create(dto);
    return this.todoRepo.save(todo);
  }

  findAll() {
    return this.todoRepo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string) {
    const todo = await this.todoRepo.findOneBy({ id });
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }

  async update(id: string, dto: UpdateTodoDto) {
    const todo = await this.findOne(id);
    Object.assign(todo, dto);
    return this.todoRepo.save(todo);
  }

  async remove(id: string) {
    const todo = await this.findOne(id);
    return this.todoRepo.remove(todo);
  }
}
