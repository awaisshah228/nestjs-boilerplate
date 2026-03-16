# NestJS Monorepo Boilerplate

NestJS monorepo workspace with Swagger, TypeORM (PostgreSQL), Redis, Pino logging, and Docker support.

## Project Structure

```
├── apps/
│   └── api/                 # Default API application
├── libs/
│   ├── database/            # @libs/database — TypeORM, entities, migrations
│   └── commons/             # @libs/commons — filters, logger, throttle, redis
├── guides/                  # Detailed guides
├── .github/workflows/       # CI/CD pipeline (AWS ECS)
├── docker-compose.yml       # Production Docker Compose
├── docker-compose.dev.yml   # Development Docker Compose (hot reload)
├── Dockerfile               # Production multi-stage build
├── Dockerfile.dev           # Development Dockerfile
└── nest-cli.json            # Monorepo + Swagger plugin config
```

## Quick Start

```bash
# Install dependencies
yarn install

# Start DB + Redis via Docker
docker compose -f docker-compose.dev.yml up db redis

# Start API locally (hot reload)
yarn start:dev
```

- API: http://localhost:3000
- Swagger docs: http://localhost:3000/api/docs

Or run everything in Docker:

```bash
docker compose -f docker-compose.dev.yml up --build
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_USERNAME` | `postgres` | PostgreSQL username |
| `DB_PASSWORD` | `postgres` | PostgreSQL password |
| `DB_NAME` | `nestjs_db` | PostgreSQL database name |
| `REDIS_HOST` | `localhost` | Redis host |
| `REDIS_PORT` | `6379` | Redis port |
| `PORT` | `3000` | Application port |

> When `DB_HOST` / `REDIS_HOST` are not set, the app starts without those connections (build-only mode).

## Scripts

| Command | Description |
|---|---|
| `yarn start:dev` | Start default app in watch mode |
| `yarn start:debug` | Start with debugger |
| `yarn build` | Build default app |
| `yarn build:api` | Build the api app |
| `yarn lint` | Lint all apps and libs |
| `yarn test` | Run unit tests |
| `yarn test:cov` | Run tests with coverage |
| `yarn migration:generate <path>` | Auto-generate migration from entity changes |
| `yarn migration:run` | Run all pending migrations |
| `yarn migration:revert` | Revert the last migration |
| `yarn migration:show` | List migrations and status |

## Guides

| Guide | Description |
|---|---|
| [TypeORM & Migrations](guides/typeorm-migrations.md) | Entities, migrations, database reset |
| [Docker](guides/docker.md) | Dev/prod Docker, volumes, useful commands |
| [Monorepo](guides/monorepo.md) | Adding apps, libs, path aliases, yarn workspaces |

## CI/CD (GitHub Actions)

The workflow at `.github/workflows/deploy.yml`:

1. **Build job** — runs on every push/PR to `main` (validates the build)
2. **Deploy job** — runs only on push to `main`, builds Docker image, pushes to ECR, deploys to ECS

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM access key |
| `AWS_SECRET_ACCESS_KEY` | IAM secret key |
| `ECS_CLUSTER` | ECS cluster name |
| `ECS_SERVICE` | ECS service name |

> If secrets are not configured, the deploy job skips gracefully with a log message.

## License

[MIT](LICENSE)
