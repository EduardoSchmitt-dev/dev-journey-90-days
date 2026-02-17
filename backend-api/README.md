# SaaS Feature Control API

Multi-tenant SaaS backend with plan-based feature limits (Free vs Pro), built using NestJS + Prisma.

---

## 📌 Overview

This project simulates a real SaaS product environment where:

- Users authenticate via JWT
- Plans control feature limits
- Free users are restricted
- Pro users have unlimited access
- Upgrade flow unlocks permissions dynamically

The system enforces business rules using Guards instead of service-level logic, ensuring clean architecture separation.

---

## 🏗 Architecture

### Modules
- AuthModule
- UsersModule
- FeaturesModule

### Design Decisions

- Repository Pattern abstraction
- PlanGuard for authorization control
- DTO validation via class-validator
- Global Exception Filter
- Global Response Interceptor
- Swagger documentation
- Strict TypeScript mode

### Authorization Flow

Plan enforcement happens inside `PlanGuard`, not inside the service layer.

This guarantees:
- Separation of concerns
- Reusable authorization logic
- Clean service responsibilities

---

## 🔄 Business Flow

### Free User

1. Register
2. Login
3. Create up to 3 features
4. 4th feature → 403 Forbidden

### Upgrade

1. PATCH /users/me/plan
2. Plan changes to Pro
3. Unlimited feature creation enabled

---

## 🔐 Main Endpoints

### Auth
POST /auth/register  
POST /auth/login  
POST /auth/refresh  
POST /auth/logout  

### Features
POST /features  
GET /features  
PUT /features/:id  
DELETE /features/:id  

### Users
PATCH /users/me/plan  

---

## 🚀 Running the Project

```bash
npm install
npx prisma migrate dev
npm run start:dev
