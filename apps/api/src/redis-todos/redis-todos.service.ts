import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { randomUUID } from 'crypto';
import { CreateTodoDto } from '../todos/dto/create-todo.dto';
import { UpdateTodoDto } from '../todos/dto/update-todo.dto';

export interface RedisTodo {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: string;
}

const REDIS_KEY = 'todos';

@Injectable()
export class RedisTodosService {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async create(dto: CreateTodoDto): Promise<RedisTodo> {
    const todo: RedisTodo = {
      id: randomUUID(),
      title: dto.title,
      description: dto.description || null,
      completed: dto.completed || false,
      createdAt: new Date().toISOString(),
    };
    await this.redis.hset(REDIS_KEY, todo.id, JSON.stringify(todo));
    return todo;
  }

  async findAll(): Promise<RedisTodo[]> {
    const all = await this.redis.hgetall(REDIS_KEY);
    return Object.values(all)
      .map((v) => JSON.parse(v) as RedisTodo)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async findOne(id: string): Promise<RedisTodo> {
    const data = await this.redis.hget(REDIS_KEY, id);
    if (!data) throw new NotFoundException(`Redis todo ${id} not found`);
    return JSON.parse(data);
  }

  async update(id: string, dto: UpdateTodoDto): Promise<RedisTodo> {
    const todo = await this.findOne(id);
    const updated = { ...todo, ...dto };
    await this.redis.hset(REDIS_KEY, id, JSON.stringify(updated));
    return updated;
  }

  async remove(id: string): Promise<{ deleted: true }> {
    await this.findOne(id);
    await this.redis.hdel(REDIS_KEY, id);
    return { deleted: true };
  }
}
