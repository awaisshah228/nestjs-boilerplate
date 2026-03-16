# Docker Guide

## Prerequisites

Make sure Docker Desktop is running before executing any docker commands.
If you see `Cannot connect to the Docker daemon`, open the Docker Desktop app and wait for it to fully start.

## Development (hot reload)

```bash
# Start full stack (API + PostgreSQL + Redis)
docker compose -f docker-compose.dev.yml up --build

# Start only DB + Redis (run API locally with yarn start:dev)
docker compose -f docker-compose.dev.yml up db redis

# Rebuild after adding new dependencies
docker compose -f docker-compose.dev.yml up --build

# Stop all dev containers
docker compose -f docker-compose.dev.yml down

# Stop and reset everything (removes DB data, Redis data, node_modules volume)
docker compose -f docker-compose.dev.yml down -v
```

Once running:
- API: http://localhost:3000
- Swagger docs: http://localhost:3000/api/docs

## Production

```bash
# Start production stack
docker compose up --build

# Run in background
docker compose up --build -d

# View logs
docker compose logs -f api

# Stop
docker compose down

# Stop and remove volumes (deletes DB data)
docker compose down -v
```

## Dockerfile targets

The production `Dockerfile` uses multi-stage builds with separate targets:

| Target | Command | Description |
|---|---|---|
| `api` | `docker compose up` | Default API service |
| (add more) | — | Add new targets as you add apps |

Build a specific target:

```bash
docker build --target api -t my-api .
```

## Volumes

| Volume | What it stores | When to reset |
|---|---|---|
| `pgdata` | PostgreSQL data | When you want a fresh DB |
| `redisdata` | Redis data | When you want to clear cache |
| `node_modules` | Container's node_modules (dev only) | After major dependency changes |

## Useful commands

```bash
# Shell into running container
docker exec -it nest-js-boiler-plate-api-1 sh

# Shell into DB
docker exec -it nest-js-boiler-plate-db-1 psql -U postgres -d nestjs_db

# Check running containers
docker compose -f docker-compose.dev.yml ps

# View real-time logs for a specific service
docker compose -f docker-compose.dev.yml logs -f api
```
