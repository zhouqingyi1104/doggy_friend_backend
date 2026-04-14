# Project Rules & Coding Standards

## Modern 2026 NestJS Stack

- **Framework Context:** This is a modern Node.js application built with NestJS and TypeScript.
- **Service Layer:** Retain the strong Service layer architecture. Keep controllers thin and move all business logic into NestJS Services (Providers).
- **ORM:** Use Prisma. Do not use raw SQL or QueryBuilders unless explicitly needed for performance.
- **Typing:** Use strict TypeScript. Avoid `any` whenever possible.

## Migration from Laravel
- All old code is in `legacy_laravel/`. When converting a feature, refer to the old PHP code and convert it directly to idiomatic TypeScript.
- **Controllers:** Laravel controllers become NestJS `@Controller()` classes.
- **Routing:** Handled via NestJS decorators (`@Get()`, `@Post()`, etc.) instead of a centralized `routes` file.
- **Middleware/Guards:** Laravel middleware logic should be translated into NestJS Guards or Interceptors (especially for JWT authentication).
