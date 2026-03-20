# Project Architecture

## Tech Stack
- **Language:** PHP (>=7.0.0)
- **Framework:** Laravel 5.5
- **Database:** MySQL (Eloquent ORM)
- **Caching & Queues:** Redis (`predis/predis`)
- **Authentication:** JWT (`tymon/jwt-auth`)
- **API Framework:** Dingo API (`dingo/api`)

## Core Modules & Integrations
- **WeChat Mini Program Integration:** Powered by `overtrue/laravel-wechat`. Handled in `app/Http/Controllers/Wechat` and `app/Http/Service/WeChatService.php`.
- **Cloud Storage:** Qiniu (`qiniu/php-sdk`) handled in `QiNiuService.php`.
- **AI & External Services:**
  - Baidu AI (Image Processing, Face Comparison) in `app/Http/Service/Baidulib` and `CompareFaceService.php`.
  - Alibaba Cloud (Facebody, Viapi) and Tencent Cloud.
- **Admin Panel:** Controllers located in `app/Http/Controllers/Admin`.

## Directory Structure Highlights
- `app/Http/Controllers/` - Contains sub-namespaces for `Admin`, `Auth`, `IM`, and `Wechat`.
- `app/Http/Service/` - The business logic layer containing numerous services like `UserService`, `PostService`, `ChatService`, etc.
- `app/Models/` - Eloquent models corresponding to database tables.
- `app/common/helpers.php` - Custom helper functions.
