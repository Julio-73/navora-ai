# Rimay AI Backend

FastAPI foundation for Rimay AI.

## Run Locally

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## API

```txt
GET /api/v1/health
```

## Structure

- `api/v1`: versioned routers
- `core`: settings and app configuration
- `schemas`: Pydantic models
- `services`: business logic boundaries
- `integrations`: external providers such as Supabase and Gemini
