# Monorepo Guide

## Structure

```
├── apps/                    # Deployable applications
│   └── api/                 # REST API (default)
├── libs/                    # Shared libraries
│   ├── database/            # @libs/database — TypeORM, entities, migrations
│   └── commons/             # @libs/commons — filters, logger, throttle, redis
├── nest-cli.json            # Monorepo + project config
└── tsconfig.json            # Root tsconfig with path aliases
```

## Adding a new application

```bash
nest generate app my-new-app
```

This creates `apps/my-new-app/` and updates `nest-cli.json`.

Run it:

```bash
nest start my-new-app --watch
```

Add a Dockerfile target for it:

```dockerfile
# In Dockerfile
FROM base AS my-new-app
EXPOSE 3001
CMD ["node", "dist/apps/my-new-app/src/main.js"]
```

## Adding a new library

```bash
nest generate library my-lib
```

Then add the path alias in `tsconfig.json`:

```json
"paths": {
  "@libs/my-lib": ["./libs/my-lib/src"],
  "@libs/my-lib/*": ["./libs/my-lib/src/*"]
}
```

And in `package.json` jest config:

```json
"moduleNameMapper": {
  "^@libs/my-lib(|/.*)$": "<rootDir>/libs/my-lib/src/$1"
}
```

Import in any app:

```typescript
import { Something } from '@libs/my-lib';
```

## Generate a CRUD resource

```bash
nest g resource users --project api
```

This scaffolds a full module with controller, service, DTOs, and entities.

## Yarn workspaces

Each app and lib has its own `package.json`. Shared dependencies go in the root `package.json`.

```bash
# Add dependency to root (shared)
yarn add -W some-package

# Run script from root
yarn start:dev
```

## Path aliases

| Alias | Points to |
|---|---|
| `@libs/database` | `libs/database/src` |
| `@libs/commons` | `libs/commons/src` |
