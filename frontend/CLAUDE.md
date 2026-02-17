# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

```bash
npm run dev          # Start Vite dev server on http://localhost:5173
npm run build        # TypeScript check + Vite production build
npm run preview      # Preview production build locally
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

| Layer | Purpose | Examples |
|-------|---------|----------|
| `app/` | Application setup, routing, global providers | Router, layouts |
| `pages/` | Page compositions | auth/login, dashboard, production |
| `widgets/` | Complex UI blocks combining features | navigation |
| `features/` | Business logic and hooks | auth hooks |
| `entities/` | Domain models and types | user, production |
| `shared/` | Reusable utilities | api clients, UI components, stores |

### Path Aliases

All imports use `@/` prefix: `@/app`, `@/pages`, `@/widgets`, `@/features`, `@/entities`, `@/shared`

## Key Technical Decisions

### State Management
- **Server State**: TanStack React Query for API data caching
- **Client State**: Zustand for auth and local state
- **Pattern**: All API calls through custom hooks in features layer

### UI Components
- **Component Library**: shadcn/ui components in `src/shared/components/ui/`
- **Styling**: Tailwind CSS with CSS variables for theming
- **Utilities**: `cn()` helper in `src/shared/lib/utils.ts` for className merging

### API Integration
- **Base URL**: `http://localhost:8080/api`
- **Client**: Axios instance in `src/shared/api/client.ts`
- **Auth**: JWT with automatic 401 handling and token refresh

## Routes

- `/login` - Login page
- `/` - Dashboard
- `/production` - Work orders list
- `/production/new` - Create work order
- `/production/:id` - Work order detail
- `/production/:id/edit` - Edit work order

## Development Workflow

1. **New Entity**: Define types in `entities/` → create API in `shared/api/` → add hooks in `features/`
2. **New Feature**: Start in `features/` with hooks → build widgets → integrate in `pages/`
3. **Import Organization**: Use barrel exports (`index.ts`) in each module

## Code Style

- **Files/Folders**: kebab-case (`work-orders-table.tsx`)
- **Components**: PascalCase (`WorkOrdersTable`)
- **Hooks**: camelCase with `use` prefix (`useWorkOrders`)
- **Types**: PascalCase (`WorkOrder`, `WorkStatus`)
- **Avoid** `any` type - use proper TypeScript types
