# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server (Next.js turbopack)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
```

## Architecture

**AslasChat** is a Next.js 15 (App Router) frontend for an AI chatbot SaaS. It uses Firebase for authentication and communicates with the `aslas-server` NestJS backend.

### Route Structure
- `app/(auth)/` — Public sign-in/sign-up pages
- `app/(root)/user-dashboard/` — All protected dashboard pages (chatbots, businesses, leads, analytics, settings, etc.)
- `app/page.tsx` — Public landing page

Protection is handled by the `useRequireAuth()` hook (`hooks/`) which redirects unauthenticated users to `/sign-in`.

### State Management
Three React Contexts handle global state — all wait for Firebase auth before fetching data:

| Context | File | Manages |
|---------|------|---------|
| `AuthContext` | `contexts/AuthContext.tsx` | Firebase auth, sign-up/in/out, profile updates |
| `BusinessContext` | `contexts/BusinessContext.tsx` | Business CRUD, file uploads, selected business |
| `ChatbotContext` | `contexts/ChatbotContext.tsx` | Chatbot CRUD, selected chatbot, optimistic updates |

Both `BusinessContext` and `ChatbotContext` use **optimistic updates** — UI updates immediately and rolls back on API error.

Loading states are split: `isInitialLoading` (first data fetch) vs `isMutating` (ongoing create/update/delete).

### API Layer (`lib/`)
- `lib/api.ts` — Core helper: `authenticatedFetch()` auto-attaches Firebase Bearer token; `api.get/post/patch/delete/postFormData()` wrappers
- `lib/services/` — One service file per domain (business, chatbot, chat, analytics, sources). Services handle data transformation between backend MongoDB format (e.g., `_id`, `ownerUid`) and frontend types (e.g., `id`, `contactEmail`)
- Backend base URL: `NEXT_PUBLIC_API_URL` env var

### Auth Flow
Sign-up writes to **both** Firebase and MongoDB (`POST /users`); MongoDB failure is non-fatal. Firebase is the source of truth. Every API call to the backend uses a fresh Firebase ID token as the Bearer token.

### API Layer details
- `ApiError` class (from `lib/api.ts`) carries `status: number` — catch it to distinguish 401/404/5xx
- All `api.*` methods are generic: `api.get<MyType>(...)` returns `Promise<MyType>`
- Services never throw to their callers — they return `ApiResponse<T>` with `success: boolean`

### Key Patterns
- **Form validation**: `lib/validations/auth.validation.ts` has shared `validateEmail`, `validateStrongPassword`, `validatePhoneNumber`, `toErrorMessage` etc. used by sign-in and sign-up. Business-specific validators are in `lib/validations/business.validation.ts`
- **Error messages**: always use `toErrorMessage(err, fallback)` (from `auth.validation.ts`) instead of `(err as any).message` — narrows `unknown` safely
- **Data transformation**: Backend `website` string → frontend `urls[]` array; `_id` → `id` — done in service layer, not components
- **UI components**: Radix UI primitives in `components/ui/`; dashboard-specific components in `components/user-dashboard/`
- **Toast notifications**: `sonner` library for all user-facing feedback

## Environment Variables

```
NEXT_PUBLIC_API_URL=                        # Backend URL, default http://localhost:3000
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
