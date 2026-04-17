# Project Architecture (2026 Modern Stack)

## Tech Stack
- **Language:** TypeScript (Node.js)
- **Framework:** NestJS
- **Database ORM:** Prisma
- **Database Engine:** MySQL (or PostgreSQL depending on environment)
- **Deployment:** WeChat CloudRun (Tencent CloudBase)
- **Storage:** WeChat CloudBase Storage (Migrated from Qiniu OSS)

## Directory Structure Highlights
- `legacy_laravel/` - Contains the old PHP/Laravel 5.5 code for reference. (Migration Complete).
- `src/` - The main NestJS application code.
  - `main.ts` - Application entry point. Features `TransformInterceptor` for legacy API compatibility.
  - `app.module.ts` - Root module.
  - `auth/`, `user/`, `post/`, `interaction/`, `sale-friend/`, `match-love/`, `chat/`, `inbox/`, `travel/`, `job/`, `compare-face/` - Feature modules.
- `prisma/` - Contains Prisma schema and database migration configurations.

## Migration Status
**MIGRATION COMPLETE (Laravel -> NestJS)**
1. All database models from Laravel have been introspected and adapted in `schema.prisma`.
2. All `legacy_laravel/app/Http/Service` logic has been successfully converted to NestJS Providers (`@Injectable()`).
3. All legacy WeChat endpoints (`routes/wechat.php`) are mapped to `@Controller('api/wechat')` to maintain backward compatibility with the frontend `http.js`.
4. Image storage has been completely refactored to use native WeChat CloudBase, deprecating Qiniu.
