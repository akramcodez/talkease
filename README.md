# LingoMate

LingoMate is a Chrome Side Panel extension + Node.js orchestrator for bi-directional, persona-aware chat translation.

## Structure

- `extension/`: Chrome extension side-car UI, adapters, content/background scripts.
- `backend/`: Express API that enforces persona + context translation policy.

## Quick start

### 1) Backend

```bash
cd backend
npm install
npm run dev
```

Runs at `http://localhost:8787`.

### 2) Extension side panel app

```bash
cd extension
npm install
npm run dev
```

Build extension assets:

```bash
npm run build
```

Load unpacked extension from `extension/dist` in Chrome.

## Environment

Backend `.env` example:

```bash
PORT=8787
LINGO_API_KEY=demo-key
```

## Current MVP behavior

- Platform adapters for WhatsApp, X, Discord, and Telegram.
- 20-message sliding window in Zustand.
- Persona options (Professional, Casual, Technical).
- Inbound and outbound translation pipeline via backend endpoints.
- Ephemeral memory model (no persistence).

## Notes

The backend uses a pluggable `LingoService` abstraction. In this repo, an internal deterministic transformer is used as a fallback to keep local development functional without external API credentials.
