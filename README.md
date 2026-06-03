# SaaS Admin Panel

A fullstack SaaS admin panel built during a 90-day developer journey.

The project simulates a real-world SaaS backoffice where authenticated users can manage product features through a protected dashboard connected to a production API, remote PostgreSQL database and CI/CD deployments.

---

## Live Demo

- Frontend: https://dev-journey-90-days.vercel.app/
- Backend API: https://dev-journey-90-days-production.up.railway.app
- Swagger Docs: https://dev-journey-90-days-production.up.railway.app/docs

---

## Overview

This project was built to practice and demonstrate a production-oriented fullstack workflow, including:

- Authentication with JWT
- Protected frontend routes
- Feature CRUD management
- PostgreSQL database integration
- Prisma ORM
- Backend API documentation with Swagger
- Frontend deployment on Vercel
- Backend deployment on Railway
- CI/CD through GitHub integrations
- Professional Git workflow with feature branches and pull requests

The goal is not only to build a CRUD application, but to simulate the structure of a real SaaS admin system.

---

## Features

### Authentication

- User login
- JWT access token handling
- Persistent authentication
- Protected dashboard route
- Logout flow

### Feature Management

- List features
- Create feature
- Edit feature
- Delete feature
- Search/filter features
- Empty states
- Loading states
- Success and error feedback

### Backend

- REST API with NestJS
- Modular architecture
- DTO validation
- Repository pattern
- Use-case based business logic
- Prisma ORM
- PostgreSQL database
- Swagger documentation
- Global exception handling
- Request logging
- CORS configuration for production frontend

### Frontend

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Query
- Axios API client
- shadcn/ui components
- Responsive dashboard UI
- Dark admin interface

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- React Query
- Axios
- React Hook Form
- Zod
- shadcn/ui

### Backend

- NestJS 11
- TypeScript
- Prisma
- PostgreSQL
- JWT
- Passport
- Swagger
- Helmet
- Pino Logger
- Jest

### Infrastructure

- Vercel
- Railway
- PostgreSQL hosted database
- GitHub
- CI/CD checks

---

## Project Structure

```txt
dev-journey-90-days
├── backend-api       # NestJS API, Prisma, PostgreSQL, Swagger
├── frontend-web      # Next.js frontend dashboard
├── README.md         # Main project documentation
├── day-01.md         # Learning journey notes
├── react-basics      # Study materials
├── typescript-basics # Study materials
└── nextjs-app        # Previous learning app






```

---

## Architecture

The backend follows a modular structure inspired by clean architecture principles:

```txt
Controller
↓
Use Case
↓
Repository Interface
↓
Prisma Repository
↓
Database
```

Main backend concepts used:

- Controllers for HTTP handling
- DTOs for request validation
- Use cases for business rules
- Repositories for data access abstraction
- Prisma for database communication
- Guards for authentication and authorization
- Global filters/interceptors for consistent API behavior

---

## Main API Routes

### Auth

```txt
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

### Features

```txt
GET    /api/v1/features
POST   /api/v1/features
PATCH  /api/v1/features/:id
DELETE /api/v1/features/:id
```

### Health

```txt
GET /health
```

Full API documentation is available at:

```txt
https://dev-journey-90-days-production.up.railway.app/docs
```

---

## Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/EduardoSchmitt-dev/dev-journey-90-days.git
cd dev-journey-90-days
```

### 2. Backend setup

```bash
cd backend-api
npm install
```

Create a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-secret-key"
PORT=3001
```

Run Prisma migrations:

```bash
npx prisma migrate dev
```

Start the backend:

```bash
npm run start:dev
```

Backend:

```txt
http://localhost:3001
```

Swagger:

```txt
http://localhost:3001/docs
```

### 3. Frontend setup

In another terminal:

```bash
cd frontend-web
npm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Frontend:

```txt
http://localhost:3000
```

---

## Available Scripts

### Backend

```bash
npm run start:dev
npm run build
npm run lint
npm run test
npm run test:e2e
```

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run start
```

---

## Validation

The project has been manually validated with the following flows:

- Login with valid credentials
- Redirect to protected dashboard
- Persistent authentication
- Feature creation
- Feature listing
- Feature editing
- Feature deletion
- Feature search/filter
- Success and error feedback
- Empty states
- Production frontend connected to production backend
- Production backend connected to remote PostgreSQL database

Build validation:

```bash
cd frontend-web
npm run lint
npm run build
```

```bash
cd backend-api
npm run lint
npm run build
```

---

## Deployment

### Frontend

The frontend is deployed on Vercel.

Production URL:

```txt
https://dev-journey-90-days.vercel.app/
```

Required production environment variable:

```env
NEXT_PUBLIC_API_URL=https://dev-journey-90-days-production.up.railway.app
```

### Backend

The backend is deployed on Railway.

Production URL:

```txt
https://dev-journey-90-days-production.up.railway.app
```

Required production environment variables:

```env
DATABASE_URL="postgresql://..."
JWT_SECRET="production-secret"
PORT=3001
```

---

## Screenshots

### Login

![Login page](docs/screenshots/login.png)

### Dashboard

![Dashboard](docs/screenshots/dashboard.png)

### Feature Management

![Feature CRUD](docs/screenshots/features-crud.png)

### Swagger

![Swagger docs](docs/screenshots/swagger.png)

---

## What I Practiced

This project helped me practice:

- Building a fullstack project from scratch
- Connecting frontend and backend in production
- Debugging CORS issues
- Working with remote PostgreSQL
- Using Prisma in a real API
- Protecting routes with JWT
- Organizing NestJS modules
- Creating production pull requests
- Deploying on Railway and Vercel
- Validating features before merging
- Maintaining a professional Git workflow

---

## Next Improvements

Possible next steps:

- Add automated E2E tests
- Add toast component
- Add user profile page
- Add pagination to feature list
- Add role-based UI controls
- Add audit logs
- Add custom domain
- Add screenshots and demo GIF
- Improve observability and monitoring

---

## Author

Built by Eduardo Schmitt as part of a 90-day journey to become a fullstack developer.
