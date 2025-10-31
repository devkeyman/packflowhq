# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Innopackage (Manufacturing Execution System) frontend built with React, TypeScript, and Vite following Feature-Sliced Design (FSD) architecture.

## Essential Commands

```bash
# Development
npm run dev          # Start Vite dev server on http://localhost:5173

# Build & Production
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # ESLint with max-warnings 0
npm run type-check   # TypeScript type checking without emit
```

## Architecture: Feature-Sliced Design (FSD)

### Layer Hierarchy (Import Rules)
```
app → pages → widgets → features → entities → shared
```
- Higher layers import from lower layers only
- All layers can import from `shared`
- No circular dependencies between layers

### Layer Responsibilities

- **app/**: Application setup, routing, global providers
- **pages/**: Page compositions (auth/login, dashboard, production)
- **widgets/**: Complex UI blocks (navigation)
- **features/**: Business logic and hooks (auth only - production features to be implemented)
- **entities/**: Domain models and types (user, production - to be redesigned)
- **shared/**: Reusable utilities (api clients, components, stores, config)

### Path Aliases

All imports use `@/` prefix for absolute paths:
- `@/app`, `@/pages`, `@/widgets`, `@/features`, `@/entities`, `@/shared`

## Key Technical Decisions

### UI Framework
- **Styling**: Tailwind CSS with custom theme configuration
- **Components**: shadcn/ui components in `src/shared/components/ui/`
- **Utilities**: `cn()` helper in `src/shared/lib/utils.ts` for className merging
- **Theme**: CSS variables for colors, dark mode support via class

### State Management
- **Server State**: TanStack React Query for API data caching and synchronization
- **Client State**: Zustand for auth and local state management
- **Pattern**: All API calls through custom hooks in features layer

### API Integration
- **Base URL**: `http://localhost:8080/api`
- **Auth**: JWT with automatic refresh token handling
- **Client**: Axios instance with interceptors in `src/shared/api/client.ts`
- **Error Handling**: Automatic 401 handling with token refresh

### Current Pages and Routes

**Dashboard** (`/`)
- Empty template with header only
- To be implemented based on requirements

**Production Management** (`/production/*`)
- `/production` - List page (작업 지시서 목록)
- `/production/new` - Create page (새 작업 지시서 등록)
- `/production/:id` - Detail page (작업 지시서 상세)
- `/production/:id/edit` - Edit page (작업 지시서 수정)
- All pages have header only, main content to be implemented

**Authentication**
- `/login` - Login page (fully functional)

### Entity Types

**User** (defined in `entities/user/types.ts`):
- Roles: `ADMIN`, `MANAGER`, `WORKER`
- Includes auth-related types: `LoginRequest`, `AuthResponse`, `LoginResponse`

**Production** (to be redesigned):
- Currently empty placeholder in `entities/production/index.ts`
- WorkOrder types and related entities need to be defined

## Component Patterns

### React Components
```typescript
interface ComponentProps {
  // Props definition
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return <div>...</div>;
};
```

### Custom Hooks
```typescript
export const useCustomHook = (params) => {
  const query = useQuery({...});
  const mutation = useMutation({...});
  
  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    actions: { create: mutation.mutate }
  };
};
```

### API Structure
```typescript
export const entityApi = {
  getAll: async (params) => apiClient.get('/endpoint', { params }),
  getById: async (id) => apiClient.get(`/endpoint/${id}`),
  create: async (data) => apiClient.post('/endpoint', data),
  update: async (id, data) => apiClient.put(`/endpoint/${id}`, data),
  delete: async (id) => apiClient.delete(`/endpoint/${id}`)
};
```

## Current Project State

### What's Implemented
- ✅ Authentication flow (login, logout, token refresh)
- ✅ Protected routes with role-based access
- ✅ Navigation sidebar
- ✅ Page routing structure for production management
- ✅ Empty page templates (Dashboard, Production pages)

### What's NOT Implemented (To Do)
- ❌ Production entity types and API
- ❌ Production list, create, edit, detail functionality
- ❌ Dashboard content and widgets
- ❌ All business logic for production management

### Available APIs
- `authApi` - Authentication (login, logout, refresh)
- `usersApi` - User management
- Production APIs need to be created

## Development Workflow

1. **Feature Development**: Start in `features/` with hooks, move up to `widgets/` for UI, integrate in `pages/`
2. **New Entity**: Define types in `entities/`, create API in `shared/api/`, add hooks in `features/`
3. **Component Creation**: Check existing patterns in same layer, maintain consistency
4. **Import Organization**: Use barrel exports (`index.ts`) in each module
5. **Routing**: Use React Router for page navigation (no ViewMode state management)

## Code Style Guidelines

- **Folders/Files**: kebab-case (`work-orders-table.tsx`)
- **Components**: PascalCase (`WorkOrdersTable`)
- **Hooks**: camelCase with `use` prefix (`useWorkOrders`)
- **Types/Interfaces**: PascalCase, prefix with `I` for interfaces if needed
- **No** unnecessary comments - code should be self-documenting
- **Avoid** `any` type - use proper TypeScript types

## Testing Approach

Currently no test framework configured. When adding tests:
1. Consider Jest + React Testing Library for unit/integration tests
2. Place test files next to components (`component.test.tsx`)
3. Focus on business logic in hooks and critical user flows