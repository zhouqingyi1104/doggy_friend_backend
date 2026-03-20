# Project Rules & Coding Standards

## Coding Standards
- **PSR Standards:** Follow PSR-2 and PSR-12 coding style guidelines.
- **Naming Conventions:**
  - **Controllers:** PascalCase, suffixed with `Controller` (e.g., `TopicController`).
  - **Models:** PascalCase, singular (e.g., `User`, `Topic`).
  - **Services:** PascalCase, suffixed with `Service` (e.g., `TopicService`).
  - **Methods:** camelCase (e.g., `getTopicsList`).
  - **Database Tables:** snake_case, plural.

## Architectural Rules
1. **Fat Models, Skinny Controllers:** Controllers should mainly handle HTTP requests and responses. Business logic must reside in the Service classes.
2. **Dependency Injection:** Use Laravel's IoC container to inject services into controllers when applicable, or instantiate them cleanly.
3. **API Responses:** Ensure consistency in API responses, preferably using the Dingo API response builders.
4. **Authentication:** All protected API endpoints must use JWT authentication.
5. **Third-Party APIs:** External API calls (WeChat, Qiniu, Baidu) must be isolated in their respective Service classes. Do not call third-party SDKs directly from controllers.

## Deployment & Environment
- Environment variables must be used for sensitive credentials (API keys, secrets, database credentials). Ensure `.env.example` is updated when adding new environment variables.
