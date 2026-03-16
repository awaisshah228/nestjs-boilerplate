import { DynamicModule, Module, Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({})
export class DatabaseModule {
  private static readonly logger = new Logger(DatabaseModule.name);

  static forRoot(): DynamicModule {
    const imports: Array<DynamicModule> = [];

    if (process.env.DB_HOST) {
      imports.push(
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            type: 'postgres',
            host: config.get<string>('DB_HOST'),
            port: config.get<number>('DB_PORT', 5432),
            username: config.get<string>('DB_USERNAME', 'postgres'),
            password: config.get<string>('DB_PASSWORD', 'postgres'),
            database: config.get<string>('DB_NAME', 'nestjs_db'),
            autoLoadEntities: true,
            synchronize: false,
            migrationsRun: true,
            migrationsTableName: 'migrations',
            migrations: [
              __dirname + '/migrations/*.js',
              __dirname + '/migrations/*.ts',
            ],
            logging: ['migration'],
          }),
        }),
      );

      this.logger.log('Database configured with auto-migration enabled');
    }

    return {
      module: DatabaseModule,
      imports,
      exports: imports,
    };
  }
}
