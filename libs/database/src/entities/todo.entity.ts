import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('todos')
export class Todo extends BaseEntity {
  @Column()
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  completed: boolean;
}
