# @libs/database — TypeORM & Migrations Guide

This library contains the database layer: TypeORM configuration, entities, and migrations.

## Structure

```
libs/database/src/
├── config/
│   └── typeorm.config.ts    # DataSource config for CLI migrations
├── entities/
│   ├── base.entity.ts       # Base entity (uuid + createdAt + updatedAt)
│   └── todo.entity.ts       # Example entity
├── migrations/              # Auto-generated migration files
├── database.module.ts       # NestJS module (auto-runs migrations on startup)
└── index.ts                 # Public exports
```

## How it works

- `DatabaseModule.forRoot()` sets up TypeORM with PostgreSQL via environment variables
- On app startup, `onModuleInit()` automatically runs any pending migrations
- When `DB_HOST` is not set, the module loads without a DB connection (build-only mode)

## Adding a new entity

**Step 1** — Create the entity file:

```typescript
// libs/database/src/entities/user.entity.ts
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity('users')
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
```

**Step 2** — Export it from the index:

```typescript
// libs/database/src/index.ts
export * from './entities/user.entity';
```

**Step 3** — Generate a migration (DB must be running):

```bash
yarn migration:generate ./libs/database/src/migrations/create-users
```

This compares your entities against the current DB schema and auto-generates the SQL diff.

**Step 4** — Review the generated file in `libs/database/src/migrations/`.

**Step 5** — Run the migration:

```bash
yarn migration:run
```

Or just restart the app — migrations run automatically on startup.

## Editing an existing entity

1. Make your changes to the entity file (add/remove/rename columns).

2. Generate a new migration:

```bash
yarn migration:generate ./libs/database/src/migrations/add-avatar-to-users
```

TypeORM detects the diff and generates the appropriate `ALTER TABLE` statements.

3. Run it:

```bash
yarn migration:run
```

## Removing a column

1. Remove or comment out the column in your entity.
2. Generate a migration:

```bash
yarn migration:generate ./libs/database/src/migrations/remove-description-from-todos
```

3. Review the migration — make sure it's dropping the right column.
4. Run it.

## Renaming a column

TypeORM can't detect renames — it sees a drop + add. For renames, create a manual migration:

1. Generate an empty migration:

```bash
yarn migration:generate ./libs/database/src/migrations/rename-name-to-fullname
```

2. Edit the generated file manually:

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.renameColumn('users', 'name', 'fullName');
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.renameColumn('users', 'fullName', 'name');
}
```

3. Update your entity to match, then run the migration.

## Migration commands

| Command | Description |
|---|---|
| `yarn migration:generate ./libs/database/src/migrations/<name>` | Auto-generate migration from entity changes |
| `yarn migration:run` | Run all pending migrations |
| `yarn migration:revert` | Revert the last executed migration |
| `yarn migration:show` | List all migrations and their status |

## Reset database (re-run all migrations)

To drop all tables and re-run migrations from scratch:

```bash
# Drop tables and migration history
docker exec nest-js-boiler-plate-db-1 psql -U postgres -d nestjs_db -c "DROP TABLE IF EXISTS todos, migrations;"

# Restart the app — migrations will re-run automatically
yarn start:dev
```

To completely reset the database (nuclear option):

```bash
docker exec nest-js-boiler-plate-db-1 psql -U postgres -d nestjs_db -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

## Workflow summary

```
Edit entity → Generate migration → Review → Run (or restart app)
```

## Important notes

- **Never use `synchronize: true` in production** — it can drop columns/tables. Always use migrations.
- Always review generated migrations before running them.
- Name migrations descriptively: `create-users`, `add-email-to-users`, `remove-legacy-columns`.
- Migrations run in order based on their timestamp prefix.
- On app startup, only **pending** migrations are executed — already-applied ones are skipped.
- The `base.entity.ts` gives every entity a `uuid` primary key + `createdAt` / `updatedAt` timestamps automatically.
