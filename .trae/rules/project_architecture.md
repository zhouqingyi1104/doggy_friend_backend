# Project Architecture (2026 Modern Stack)

## Tech Stack
- **Language:** TypeScript (Node.js)
- **Framework:** NestJS
- **Database ORM:** Prisma
- **Database Engine:** MySQL (or PostgreSQL depending on environment)
- **Deployment:** WeChat CloudRun (Tencent CloudBase)

## Directory Structure Highlights
- `legacy_laravel/` - Contains the old PHP/Laravel 5.5 code for reference during migration.
- `src/` - The main NestJS application code.
  - `main.ts` - Application entry point.
  - `app.module.ts` - Root module.
- `prisma/` - Contains Prisma schema and database migration configurations.

## Migration Strategy
We are currently migrating from Laravel to NestJS.
1. Database models from Laravel will be introspected or rewritten in `schema.prisma`.
2. Services from `legacy_laravel/app/Http/Service` will be converted to NestJS Providers (`@Injectable()`).
3. Controllers will be converted to NestJS Controllers (`@Controller()`).
4. WeChat integrations will use modern Node.js SDKs (e.g. `@cloudbase/node-sdk` or specific WeChat APIs).
