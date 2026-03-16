import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { TodoMigration1773631469319 } from '../migrations/1773631469319-todo-migration';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'nestjs_db',
  entities: ['libs/database/src/entities/**/*.entity.ts'],
  migrations: [TodoMigration1773631469319],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: false,
});

export default AppDataSource;
