# Rimay AI

Rimay AI is a professional hackathon MVP foundation for an accessibility tourism platform with future multimodal AI, inclusive route intelligence, and real-time analytics.

This repository is intentionally focused on foundation architecture only. It does not include AI logic, dashboard flows, chat, realtime subscriptions, or authentication yet.

## Architecture

```txt
RIMAY_AI/
  frontend/              React + Vite application
    src/
      app/               Router and app-level setup
      config/            Navigation and static app config
      lib/               Shared utilities
      pages/             Route-level screens
      services/          API and integration boundaries
      shared/            Reusable layouts and UI components
  backend/               FastAPI application
    app/
      api/v1/            Versioned API routers
      core/              Settings and core configuration
      integrations/      Supabase and Gemini boundaries
      schemas/           Pydantic response/request models
      services/          Business-service layer
```

## Stack

Frontend:
- React, Vite, TailwindCSS, shadcn/ui-compatible structure
- Framer Motion, React Router DOM, Recharts, Leaflet, Lucide React

Backend:
- FastAPI, Python, Pydantic, Uvicorn, dotenv
- Supabase client prepared
- Gemini SDK installed and isolated for future integration

## Environment

Root reference variables live in `.env.example`.

```bash
cd frontend
copy .env.example .env

cd ..\backend
copy .env.example .env
```

The local `.env` files contain only non-secret defaults and empty credential placeholders. Real Supabase and Gemini secrets should stay local.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Default URL: `http://localhost:5173`

Useful scripts:

```bash
npm run build
npm run lint
npm run preview
```

## Backend Setup

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Default API: `http://localhost:8000`

Health check: `GET http://localhost:8000/api/v1/health`

## Start Both Servers

On Windows inside this workspace, use the project launcher:

```bash
python scripts\start-dev.py
```

It starts:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- Health: `http://localhost:8000/api/v1/health`

Logs are written to `frontend/dev.log`, `frontend/dev.err.log`, `backend/dev.log`, and `backend/dev.err.log`.

## Development Rules

- Keep frontend and backend separated.
- Add future product areas as isolated feature modules.
- Reuse `shared/ui` components before creating new visual primitives.
- Keep integrations behind `services` or `integrations` boundaries.
- Do not add auth, AI flows, realtime, chat, or dashboard logic until the MVP scope explicitly requires it.
- Prioritize stable demo quality, clean naming, and fast iteration.

## Current Foundation

Implemented:
- React/Vite app with clean aliases via `@/*`
- TailwindCSS 3.4 and shadcn-compatible `components.json`
- Reusable `Button` and `Badge` primitives
- React Router setup with app shell and not-found route
- FastAPI app factory with CORS and versioned API prefix
- Pydantic settings from `.env`
- Supabase and Gemini integration boundaries
- Professional setup documentation
