# Dynamic Portfolio Dashboard

A full-stack project with an Express/TypeScript backend and a Next.js (React + TypeScript) frontend for tracking a dynamic stock/portfolio dashboard.

- Frontend: `frontend/` (Next.js + Tailwind)
- Backend: `backend/` (Express + TypeScript)

## Prerequisites
- Node.js 18+
- npm 9+
- (Optional) Redis, if you enable caching in the backend `.env`

## Quick Start

### 1) Backend (API)
```
cd backend
npm install
npm run build
npm start
```
- Dev mode (ts-node):
```
npm run dev
```
- Default port: 5000 (see `backend/src/server.ts`).
- Env file: `backend/.env` (example keys below). Create/update as needed.

Example `.env`:
```
PORT=5000
REDIS_URL=redis://localhost:6379
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=60
```

Available source:
- `backend/src/app.ts`
- `backend/src/server.ts`
- `backend/src/controllers/portfolio-controller.ts`
- `backend/src/routes/routes.ts`
- `backend/src/services/*` (data, quotes, metrics)
- `backend/src/utils/*`

Build output goes to `backend/dist/`. Root `package.json` provides scripts for backend build/run as well.

### 2) Frontend (Next.js)
```
cd frontend
npm install
npm run dev
```
- Default port: 3000
- API proxy to backend is configured in `frontend/next.config.js` via rewrites from `/api/*` → `http://localhost:5000/api/*`.
- Main entry points:
  - `frontend/pages/_app.tsx`
  - `frontend/pages/index.tsx`
  - `frontend/pages/components/*`
  - Hooks: `frontend/hooks/usePortfolioPolling.ts`
  - API client: `frontend/lib/api.ts`
  - Styles: `frontend/styles/globals.css` (Tailwind enabled)

### Run both
- Start backend first on 5000
- Start frontend next on 3000
- Open http://localhost:3000

## Development Notes
- TypeScript configs:
  - Backend: `backend/tsconfig.json` (outputs to `backend/dist`)
  - Frontend: `frontend/tsconfig.json`
- Linting: `frontend` has Next lint script `npm run lint`.
- Styling: Tailwind with `postcss.config.js` and `tailwind.config.js` in `frontend/`.

## Project Scripts (root)
Root `package.json` is configured primarily for the backend:
- `npm run build` → builds backend TypeScript
- `npm run dev` → runs backend in dev (ts-node ESM loader)
- `npm start` → runs compiled backend `dist/server.js`

For frontend scripts, run them inside `frontend/` as shown above.

## Troubleshooting
- If API calls from frontend fail, confirm backend is running on port 5000 and check `frontend/next.config.js` rewrites.
- If you use Redis caching, ensure `REDIS_URL` is reachable and Redis server is running.
- Windows path note: `outputFileTracingRoot` in Next config is set to your repo root (`D:/Workspace/Dynamic Portfolio Dashboard`).

## License
ISC
