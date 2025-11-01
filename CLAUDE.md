# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Innopackage Smart Factory MES (Manufacturing Execution System) - A monorepo containing both frontend (React) and backend (Spring Boot) for production management, work order tracking, and quality issue monitoring.

## Essential Commands

### Development

```bash
# Backend (Spring Boot)
cd backend
./mvnw spring-boot:run              # Run Spring Boot server (port 8080)
./mvnw clean install                # Build backend
./mvnw test                         # Run backend tests
./mvnw test -Dtest=ClassName       # Run single test class
./mvnw test -Dtest=ClassName#methodName  # Run single test method

# Frontend (React/Vite)
cd frontend
npm run dev                         # Run Vite dev server (port 5173)
npm run build                       # Production build
npm run preview                     # Preview production build locally
npm run lint                        # ESLint check
npm run type-check                  # TypeScript check

# Run both frontend and backend simultaneously
./scripts/dev.sh                    # Launches both servers
```

### Build & Deploy

```bash
# Backend build
cd backend
./mvnw clean package -DskipTests   # Create JAR file

# Frontend build
cd frontend
npm run build                       # Standard build
npm run build:ec2                   # Memory-optimized build for EC2

# Full project build (builds both and copies frontend to backend/static)
./scripts/build.sh                  # Complete build script
```

## Architecture Overview

### Backend (Spring Boot)

**Architecture**: Hexagonal Architecture (Port & Adapter Pattern)

```
backend/src/main/java/com/mes/
├── adapter/           # External adapters
│   ├── in/web/       # REST controllers, request/response DTOs
│   └── out/persistence/  # JPA repositories, entities
├── application/       # Application services
│   ├── port/         # Port interfaces (in/out)
│   └── service/      # Use case implementations
├── domain/           # Domain models and business logic
│   ├── model/        # Domain models
│   └── service/      # Domain services
├── config/           # Spring configurations (Security, CORS, etc.)
└── common/           # Shared utilities
    ├── dto/          # Data transfer objects
    ├── exception/    # Exception handling
    └── mapper/       # Object mappers
```

**Key Technologies**:
- Spring Boot 3.5.4, Java 17
- Spring Security + JWT authentication
- Spring Data JPA with MySQL
- Maven for dependency management
- Lombok for boilerplate reduction

### Frontend (React/TypeScript)

**Architecture**: Feature-Sliced Design (FSD)

```
frontend/src/
├── app/              # Application setup, routing, providers
├── pages/            # Page components
├── widgets/          # Complex UI blocks
├── features/         # Business logic and hooks
├── entities/         # Domain models and types
└── shared/           # Shared utilities and components
    ├── api/          # API clients and endpoints
    ├── components/   # Reusable UI components
    ├── config/       # App configuration
    └── stores/       # Zustand stores
```

**Key Technologies**:
- React 19.1.1 with TypeScript 5.9.2
- Vite for bundling
- TanStack Query for server state
- Zustand for client state
- Tailwind CSS + shadcn/ui components

## API Structure

Base URL: `http://localhost:8080/api`

### Main Endpoints

- `/auth/*` - Authentication (login, refresh, logout)
- `/users/*` - User management
- `/work-orders/*` - Work order CRUD and status management
- `/issues/*` - Quality issue tracking
- `/dashboard/*` - Dashboard statistics and summaries
- `/work-logs/*` - Activity logging

### Request/Response Format

- Content-Type: `application/json`
- Pagination: `page` (0-indexed), `size`, `sort` query parameters
- Error format: `{ "message": "error description", "status": 400 }`

### Authentication

JWT-based authentication with access/refresh tokens:
- Access token in Authorization header: `Bearer {token}`
- Automatic token refresh on 401 responses
- Role-based access control: ADMIN, MANAGER, WORKER

## Database Configuration

### Development (application-dev.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mes_db_dev
    username: admin
    password: inno0000
```

### Production (application-prod.yml)
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mes_db
    username: mes_user
    password: [configured on server]
```

## Key Business Entities

### WorkOrder
- Status: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- Priority: `LOW`, `NORMAL`, `MEDIUM`, `HIGH`, `URGENT`

### Issue
- Status: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`
- Priority: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`
- Type: `EQUIPMENT`, `QUALITY`, `SAFETY`, `PROCESS`, `OTHER`

### User
- Roles: `ADMIN`, `MANAGER`, `WORKER`
- WORKER can only access assigned work orders

## Development Workflow

1. **Backend changes**: Modify code in `backend/src`, Spring Boot DevTools will auto-reload
2. **Frontend changes**: Modify code in `frontend/src`, Vite HMR will auto-reload
3. **API changes**: Update both backend controllers and frontend API clients
4. **Database changes**: Update JPA entities, then run application to auto-migrate

## Testing Accounts

- Admin: `admin@mes.com` / `admin123`
- Manager: `manager@mes.com` / `manager123`
- Worker: `worker@mes.com` / `worker123`

## Code Style Guidelines

### Backend (Java)
- Package names: lowercase (`com.mes.domain.model`)
- Classes: PascalCase (`WorkOrder`)
- Methods/variables: camelCase (`getUserById`)
- Use Lombok annotations to reduce boilerplate

### Frontend (TypeScript)
- Files/folders: kebab-case (`work-order-form.tsx`)
- Components: PascalCase (`WorkOrderForm`)
- Hooks: camelCase with `use` prefix (`useWorkOrders`)
- Avoid `any` type, use proper TypeScript types

## Important Files

- `backend/pom.xml` - Maven dependencies and build config
- `backend/src/main/resources/application.yml` - Spring Boot config
- `frontend/package.json` - NPM dependencies
- `frontend/vite.config.ts` - Vite build config
- `API_INTERFACE.md` - Complete API documentation
- `README.md` - Detailed setup and deployment guide

## Deployment

The application is deployed on AWS EC2 (Ubuntu):
- Production URL: https://www.innopackage.com
- Backend runs as systemd service on port 8080
- Frontend served by Nginx, proxies `/api/*` to backend
- SSL certificates managed by Certbot

### Quick Deploy Commands

```bash
# SSH to server
ssh -i your-key.pem ubuntu@your-ec2-instance

# Deploy backend
sudo systemctl stop mes-backend
scp target/mes-backend-0.0.1-SNAPSHOT.jar ubuntu@server:/home/ubuntu/
sudo systemctl start mes-backend

# Deploy frontend
npm run build:ec2
scp -r dist/* ubuntu@server:/var/www/html/
```

For detailed deployment instructions, see README.md sections on EC2 deployment.