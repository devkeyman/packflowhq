# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Innopackage Smart Factory MES (Manufacturing Execution System) - A monorepo containing frontend (React) and backend (Spring Boot) for production management and work order tracking.

## Prerequisites

- Java 17+, Node.js 18+, MySQL 8.0+

**Database setup:**
```sql
CREATE DATABASE mes_db_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'inno0000';
GRANT ALL PRIVILEGES ON mes_db_dev.* TO 'admin'@'localhost';
```

## Essential Commands

### Development

```bash
# Backend (Spring Boot) - port 8080
cd backend
./mvnw spring-boot:run
./mvnw test                              # Run all tests
./mvnw test -Dtest=ClassName             # Run single test class
./mvnw test -Dtest=ClassName#methodName  # Run single test method

# Frontend (React/Vite) - port 5173
cd frontend
npm run dev
npm run lint
npm run type-check

# Run both simultaneously (uses mvn, not mvnw)
./scripts/dev.sh
```

### Build

```bash
# Backend
cd backend && ./mvnw clean package -DskipTests

# Frontend
cd frontend && npm run build

# Full project (builds both, copies frontend to backend/static)
./scripts/build.sh
```

## Architecture Overview

### Backend: Hexagonal Architecture (Port & Adapter)

```
backend/src/main/java/com/mes/
├── adapter/
│   ├── in/web/           # REST controllers, request/response DTOs
│   └── out/persistence/  # JPA repositories, entities
├── application/
│   ├── port/             # Port interfaces (in/out)
│   └── service/          # Use case implementations
├── domain/
│   ├── model/            # Domain models
│   └── service/          # Domain services
├── config/               # Spring configurations
└── common/               # DTOs, exceptions, mappers
```

**Stack**: Spring Boot 3.5, Java 17, Spring Security + JWT, Spring Data JPA, MySQL, Lombok

### Frontend: Feature-Sliced Design (FSD)

```
frontend/src/
├── app/        # Routing, providers
├── pages/      # Page components
├── widgets/    # Complex UI blocks
├── features/   # Business logic, hooks
├── entities/   # Domain models, types
└── shared/     # API clients, UI components, stores
```

**Import rule**: `app → pages → widgets → features → entities → shared` (higher layers import from lower only)

**Path aliases**: All imports use `@/` prefix (`@/shared`, `@/features`, etc.)

**Stack**: React 19, TypeScript 5, Vite, TanStack Query, Zustand, Tailwind CSS + shadcn/ui

## API Structure

Base URL: `http://localhost:8080/api`

| Endpoint | Description |
|----------|-------------|
| `/auth/*` | Authentication (login, refresh, logout) |
| `/users/*` | User management |
| `/work-orders/*` | Work order CRUD and status management |
| `/dashboard/*` | Statistics and summaries |

- **Auth**: JWT Bearer token in `Authorization` header
- **Pagination**: `page` (0-indexed), `size`, `sort` query params
- **Error format**: `{ "message": "...", "status": 400 }`

## Key Business Entities

### WorkOrder
- **Status**: `PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- **Priority**: `LOW`, `NORMAL`, `MEDIUM`, `HIGH`, `URGENT`

### User
- **Roles**: `ADMIN` (full access), `MANAGER` (work order management), `WORKER` (assigned work only)

## Code Style

### Backend (Java)
- Package names: lowercase (`com.mes.domain.model`)
- Classes: PascalCase (`WorkOrder`)
- Methods/variables: camelCase (`getUserById`)
- Use Lombok annotations

### Frontend (TypeScript)
- Files/folders: kebab-case (`work-order-form.tsx`)
- Components: PascalCase (`WorkOrderForm`)
- Hooks: camelCase with `use` prefix (`useWorkOrders`)

## Commit Message Convention

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅
refactor: 코드 리팩토링
test: 테스트 코드
chore: 빌드 업무 수정
```

## Testing Accounts

- Admin: `admin@mes.com` / `admin123`
- Manager: `manager@mes.com` / `manager123`
- Worker: `worker@mes.com` / `worker123`

## Backend DTO/UseCase Naming

| Type | Pattern | Example |
|------|---------|---------|
| Create Request | `Create{Entity}Request` | `CreateWorkOrderRequest` |
| Update Request | `Update{Entity}Request` | `UpdateWorkOrderRequest` |
| Detail Response | `{Entity}DetailResponse` | `WorkOrderDetailResponse` |
| List Response | `{Entity}ListResponse` | `WorkOrderListResponse` |
| UseCase | `{Entity}UseCase` | `WorkOrderUseCase` |

**Development order for new API**: Domain Model → Entity → Port Out → Repository → Port In (UseCase) → Service → Request/Response DTO → Controller → Tests
