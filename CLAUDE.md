# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VietQR Payment is a Vietnamese bank QR code top-up (nạp tiền) website. Users select a bank, enter a point amount, receive a VietQR-generated QR code, scan and transfer money, then an admin manually confirms the transaction to credit points to the user's balance.

**Stack:** Next.js 14 (App Router) + TypeScript + TailwindCSS frontend, Express.js + TypeScript backend, PostgreSQL via Prisma ORM, JWT auth.

## Development Commands

### Backend

```bash
cd backend
npm install
npx prisma generate          # Generate Prisma client (also runs on postinstall)
npx prisma db push            # Push schema to database
npx prisma db seed            # Seed default users and sample banks
npm run dev                   # ts-node-dev with hot reload (port 4000)
npm run build                 # prisma generate + tsc -> dist/
npm start                     # node dist/index.js
```

### Frontend

```bash
cd frontend
npm install
npm run dev                   # next dev (port 3000)
npm run build                 # next build
npm run lint                  # next lint
```

### Docker

```bash
docker-compose up --build     # Full stack
```

**Note:** Docker Compose references MySQL but Prisma schema uses `postgresql` provider — Docker setup needs updating for PostgreSQL.

## Environment Variables

**Backend:** `DATABASE_URL` (PostgreSQL connection string, required), `JWT_SECRET` (default: `'your-secret-key'`), `PORT` (default: `4000`), `FRONTEND_URL` (CORS origin, default: `'*'`).

**Frontend:** `NEXT_PUBLIC_API_URL` (default: `http://localhost:4000/api`).

## Architecture

### Backend (`backend/src/`)

- Single Express app in `index.ts` — no separate app.ts file
- Prisma client singleton in `config/database.ts`
- Auth middleware in `middleware/auth.ts`: `authMiddleware` validates Bearer JWT, `adminMiddleware` checks `role === 'ADMIN'`
- JWT tokens expire in 7 days, generated/verified in `utils/jwt.ts`
- QR service (`services/qrService.ts`) builds VietQR image URLs: `https://img.vietqr.io/image/{bankCode}-{accountNumber}-qr_only.png?amount={amount}&addInfo={content}&accountName={name}`
- Transfer content format: `NAP` + 8 random uppercase alphanumeric chars (e.g., `NAPX3K7AB2F9`)
- Points conversion: 1,000 VND = 1 point
- Transaction confirmation uses `prisma.$transaction()` for atomic status update + balance increment
- Admin actions logged to `AdminLog` table

### Frontend (`frontend/src/`)

- Next.js 14 App Router, all pages use `'use client'`
- Path alias: `@/*` → `./src/*`
- Auth state in `localStorage` (token + user JSON), managed via `AuthContext` in `lib/auth.ts` with `useAuth()` hook
- API calls in `lib/api.ts` use a generic `fetchAPI<T>` wrapper that attaches Bearer token from localStorage
- Admin layout (`app/admin/layout.tsx`) guards routes — redirects to `/login` if not ADMIN role
- Dark theme with custom Tailwind palette: `dark-{900-400}` backgrounds, `gold-{400-700}` accents

### Database Models (Prisma)

- **User**: username (unique), password (bcrypt), balance (int, points), role (USER|ADMIN)
- **Bank**: bankCode, bankName, accountNumber, accountName, isActive
- **Transaction**: userId, bankId, amount (VND), points, transferContent, status (PENDING|SUCCESS|FAILED)
- **AdminLog**: adminId, action, data (JSON string) — audit trail

### API Routes

Public: `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/banks`, `POST /api/payment/create-qr`, `GET /api/payment/transactions`, `GET /api/health`.

Authenticated: `GET /api/auth/me`.

Admin: CRUD on `/api/admin/banks`, `/api/admin/transactions` (list, confirm, reject).

## Known Issues

- `createQR` endpoint is public and hardcodes `userId: 1` for guest transactions (marked as TODO)
- Frontend calls `/payment/my-transactions` but backend route is `/payment/transactions` — endpoint mismatch
- No test framework configured in either backend or frontend

## Deployment

- **Backend → Render:** configured in `render.yaml`, free-tier PostgreSQL
- **Frontend → Netlify:** configured in `frontend/netlify.toml`, uses `@netlify/plugin-nextjs`

## Seed Credentials

`admin`/`admin123` (ADMIN), `testuser`/`user123` (USER)
