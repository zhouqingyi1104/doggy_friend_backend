# Agent Instructions (NestJS Refactoring)

## Overview
This repository contains the backend for "Doggy Friend". It was originally built with Laravel 5.5 but is currently being refactored into a modern 2026 NestJS (Node.js) application.

## Guidelines for AI Agent
- **Framework Context:** You are now working in a NestJS + Prisma environment. 
- **Legacy Code:** The old Laravel code is preserved in `legacy_laravel/`. Do not edit the legacy code. Use it ONLY as a reference for business logic, database structure, and third-party integrations (WeChat, Baidu AI, QiNiu).
- **Service Layer:** Maintain the Service-oriented architecture. Controllers should only handle HTTP routing/DTO validation, and pass data to NestJS Services.
- **Database:** Use Prisma for database interactions. If requested to "check the database schema", look at `prisma/schema.prisma` first. If it's missing there, refer to the old Laravel migrations in `legacy_laravel/database/migrations` or models in `legacy_laravel/app/Models`.
- **Typing:** Write strict TypeScript.
- **Package Management:** Use `npm` for package management.
