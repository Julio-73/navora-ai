# NAVORA AI Backend

FastAPI backend for NAVORA AI, including text chat, multimodal image analysis, Gemini integration, fallback handling, and versioned API routes.

## Run Locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API

```txt
GET  /api/v1/health
POST /api/v1/chat
POST /api/v1/chat/image
```

## Structure

- `api/v1`: versioned routers
- `core`: settings and app configuration
- `schemas`: Pydantic models
- `services`: chat, multimodal and fallback logic
- `integrations`: external providers such as Supabase and Gemini
