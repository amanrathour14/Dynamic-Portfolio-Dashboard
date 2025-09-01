# Technical Write-Up

This document summarizes key challenges encountered while building the Dynamic Portfolio Dashboard and the solutions adopted across backend and frontend.

## Architecture Overview
- Backend: `backend/` — Express + TypeScript. Core modules in `src/controllers`, `src/routes`, `src/services`, `src/utils`.
- Frontend: `frontend/` — Next.js (React + TypeScript) with Tailwind CSS. Data fetching via `frontend/lib/api.ts` and polling in `frontend/hooks/usePortfolioPolling.ts`.
- Local dev routing: `frontend/next.config.js` rewrites `/api/*` → `http://localhost:5000/api/*` to avoid CORS and simplify local development.

## Key Challenges & Solutions

- __API Aggregation & Data Freshness__
  - Challenge: Fetching quotes/metrics from external sources while keeping UI responsive.
  - Solution: Service-layer separation: `data-service.ts`, `quotesService.ts`, `metricsService.ts`. Backend aggregates and normalizes responses, while frontend polls with `usePortfolioPolling.ts` at controlled intervals.

- __Rate Limiting & Stability__
  - Challenge: Prevent API abuse and accidental request storms during polling.
  - Solution: `express-rate-limit` configured in the backend app (`backend/src/app.ts`). Polling intervals tuned on the frontend. Where applicable, `p-limit` is used for controlled concurrency when fanning out to providers.

- __Caching & Performance__
  - Challenge: Reduce redundant upstream calls and speed up typical UI loads.
  - Solution: Optional Redis cache (configurable via `.env`, e.g., `REDIS_URL`). Service layer reads/writes to cache on hot paths. TTLs tuned to balance freshness vs. speed.

- __Resilience & Error Handling__
  - Challenge: External APIs are unreliable; partial failures should not break the UI.
  - Solution: Defensive fetches with timeouts and try/catch in services; structured error responses from controllers. Frontend gracefully degrades and shows partial data while retrying.

- __Excel/CSV Ingestion__
  - Challenge: Users provide input portfolios via spreadsheets; need robust parsing and validation.
  - Solution: `exceljs`/`xlsx` parsing in services with type guards in `interfaces.ts`. Validation errors surfaced via controller responses for clear feedback.

- __Monorepo Dev Experience (Windows)__
  - Challenge: Next.js monorepo path tracing on Windows.
  - Solution: `outputFileTracingRoot` in `frontend/next.config.js` set to repo root (`D:/Workspace/Dynamic Portfolio Dashboard`). This avoids spurious warnings while keeping build outputs correct.

- __Security & Config Management__
  - Challenge: Managing secrets and environment-specific config.
  - Solution: `.env` for backend with `dotenv` in `src/server.ts`/`src/app.ts`. No secrets in source control; document required keys in `README.md`.

## Notable Files
- Backend:
  - `backend/src/app.ts` — Express app setup, middleware (rate limiting, JSON), routes binding.
  - `backend/src/routes/routes.ts` — REST route definitions under `/api`.
  - `backend/src/controllers/portfolio-controller.ts` — Input validation, orchestration of services, and HTTP responses.
  - `backend/src/services/data-service.ts` — Portfolio ingestion and enrichment pipeline (I/O, parsing, aggregation).
  - `backend/src/services/quotesService.ts` & `metricsService.ts` — Upstream provider calls and normalization.
  - `backend/src/interfaces.ts` — TypeScript interfaces for portfolio and quote/metric shapes.
- Frontend:
  - `frontend/pages/index.tsx` — Dashboard entry (tables/charts via components).
  - `frontend/hooks/usePortfolioPolling.ts` — Client polling, backoff, and state management.
  - `frontend/lib/api.ts` — HTTP client wrappers, shared response typing.
  - `frontend/styles/globals.css` — Tailwind base and global styles.

## Trade-offs
- __Polling vs. WebSockets__: Chose polling for simplicity; for lower latency or event-driven updates, consider Socket.IO or SSE.
- __Single Source Provider__: Using `yahoo-finance2` stabilizes API surface but risks provider-specific outages. Abstracted provider logic allows swapping if needed.
- __Cache TTL__: Aggressive caching improves UX but may show slightly stale data. TTLs should be tuned per endpoint based on SLA and user expectations.

## Future Improvements
- Switch to server push (SSE/WebSockets) for real-time updates.
- Add end-to-end tests (Playwright) and service tests (Vitest/Jest) for critical paths.
- Implement robust feature flags for experimental data sources.
- Add role-based access if multi-user support is required.
- CI/CD pipeline with lint/test/build gates.
