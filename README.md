# LingoMate

LingoMate is a Chrome Side Panel extension + Node.js orchestrator for bi-directional, persona-aware chat translation.

## What is now complete in this repo

- Chrome Side Panel UI (React + TypeScript) for read/write translation workflow.
- Runtime content-script bridge for message ingestion and outbound text injection.
- Platform-specific extraction selectors for WhatsApp, X, Discord, Telegram.
- Backend translation orchestrator with validation, persona enforcement contract, and 20-message context cap.
- Ephemeral model (in-memory only), no DB/log persistence.
- Local smoke-test script for backend API.

## Structure

- `extension/`: Chrome extension side-car UI, adapters, content/background scripts.
- `backend/`: Express API that enforces persona + context translation policy.
- `scripts/`: local smoke testing helpers.

## Quick start (local dev)

### 0) Prerequisites

- Node.js 20+
- npm 10+

### 1) Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Runs at `http://localhost:8787`.

### 2) Extension app

```bash
cd extension
npm install
npm run build
```

Then load unpacked extension from `extension/dist` in Chrome.

## Local test commands

From repo root:

```bash
npm run test:smoke
```

This checks:

- `GET /health` returns `ok`
- `POST /translate` returns a `translated` payload with metadata

## Environment

Backend `.env` example:

```bash
PORT=8787
LINGO_API_KEY=demo-key
CORS_ORIGIN=*
```

## Current translation provider behavior

`backend/src/lingoService.ts` intentionally ships with a deterministic local fallback to keep this project runnable offline.
You can replace `LingoService.translate()` internals with real `@lingo.dev/sdk` integration without changing request/response contracts.
