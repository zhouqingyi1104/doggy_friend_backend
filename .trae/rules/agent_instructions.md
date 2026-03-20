# Agent Instructions

## Overview
This repository contains the backend for "Doggy Friend", built with Laravel 5.5 and PHP 7.0+. It heavily integrates with WeChat APIs, Qiniu Cloud Storage, and various AI/Cloud services (Baidu, Alibaba, Tencent).

## Guidelines for AI Agent
- **Framework Context:** This is an older Laravel version (5.5). Avoid using features introduced in Laravel 6, 7, 8, 9, 10, or 11.
- **Service Layer:** The project implements a robust Service layer in `app/Http/Service`. Always encapsulate business logic within these services instead of cluttering controllers.
- **WeChat Integration:** Use the existing `overtrue/wechat` package and the `WeChatService` for handling WeChat interactions.
- **API Development:** The project uses `dingo/api` and `tymon/jwt-auth` for API structure and JWT-based authentication.
- **File Modificaton:** Before modifying controllers, always check if a relevant Service class already exists and handles the domain logic.
- **Database Operations:** Use Eloquent ORM. Do not write raw SQL unless absolutely necessary for performance reasons.
