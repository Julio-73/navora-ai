# NAVORA AI

> Tu companero inteligente para explorar el Peru sin barreras.

![Status](https://img.shields.io/badge/status-hackathon_ready-14b8a6?style=for-the-badge)
![Frontend](https://img.shields.io/badge/frontend-React_+_Vite-61dafb?style=for-the-badge)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688?style=for-the-badge)
![AI](https://img.shields.io/badge/AI-Gemini_multimodal-8b5cf6?style=for-the-badge)
![UX](https://img.shields.io/badge/UX-premium_accessibility-111827?style=for-the-badge)

NAVORA AI es una plataforma premium de turismo inclusivo impulsada por IA multimodal. Ayuda a personas viajeras, familias, adultos mayores y personas con discapacidad a explorar destinos del Peru con mayor confianza mediante voz, imagenes, mapas inteligentes, rutas accesibles y analitica visual en tiempo real.

Construida como un MVP profesional para hackathon, NAVORA AI combina una experiencia cinematografica con una arquitectura full stack limpia, modular y lista para evolucionar hacia una plataforma govtech/tourism-tech real.

## Vision

NAVORA AI convierte reportes humanos en inteligencia accionable:

```txt
voz o imagen -> IA multimodal -> mapa reactivo -> dashboard vivo -> ruta mas accesible
```

La experiencia esta disenada para sentirse como una startup internacional: rapida, confiable, emocional, inclusiva y lista para presentarse ante jurado, inversionistas o un equipo tecnico.

## Features

| Area | Capacidad |
| --- | --- |
| AI conversacional | Chat conectado a Gemini con memoria contextual y fallback premium |
| Voz a texto | Web Speech API para dictar reportes y enviarlos automaticamente |
| Analisis visual | Upload real de JPG, PNG y WebP hacia Gemini multimodal |
| Mapas inteligentes | Leaflet con markers, focus visual, tooltips y zonas turisticas |
| Dashboard reactivo | KPIs, actividad, timeline y senales visuales conectadas al flujo |
| Realtime UX | Actualizaciones visuales simuladas para una demo fluida y viva |
| Experiencia cultural | Narrativa inmersiva para patrimonio, rutas y accesibilidad |
| Accesibilidad | Focus states, aria-labels, navegacion mobile y contraste premium |
| Responsive | Mobile, tablet y desktop con layout SaaS cinematografico |

## Tech Stack

### Frontend

| Tecnologia | Uso |
| --- | --- |
| React | Interfaz principal y estado de experiencia |
| Vite | Desarrollo rapido y build moderno |
| TailwindCSS | Sistema visual premium y responsive |
| Framer Motion | Microinteracciones, transiciones y polish cinematografico |
| Recharts | Analitica y visualizacion de KPIs |
| Leaflet | Mapa turistico accesible y reactivo |
| Lucide React | Iconografia consistente |

### Backend

| Tecnologia | Uso |
| --- | --- |
| FastAPI | API modular versionada |
| Python | Servicios, integraciones y validacion |
| Pydantic | Schemas de requests/responses |
| Gemini API | Chat IA y analisis multimodal |
| Uvicorn | Servidor local |
| dotenv | Configuracion segura por entorno |

## Architecture

```txt
frontend/
  src/
    app/                 Router y setup de aplicacion
    config/              Navegacion y configuracion estatica
    features/            Datos y hooks de experiencia
    pages/               Pantallas principales
    services/api/        Cliente API y contratos frontend-backend
    shared/              Layouts y UI reutilizable

backend/
  app/
    api/v1/routes/       Endpoints versionados
    core/                Settings y configuracion
    integrations/        Clientes externos como Gemini y Supabase
    schemas/             Modelos Pydantic
    services/            Logica de chat, multimodal y fallback
```

Principios:

- Frontend y backend separados.
- Endpoints estables: `/api/v1/health`, `/api/v1/chat`, `/api/v1/chat/image`.
- Gemini aislado detras de servicios.
- Fallback humano para cuota, timeout o errores externos.
- UI modular sin acoplarse a la implementacion del proveedor IA.

## Installation

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend local:

```txt
http://localhost:5173
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend local:

```txt
http://localhost:8000
```

Health check:

```txt
http://localhost:8000/api/v1/health
```

### 3. Start Full Stack

Desde la raiz del workspace:

```bash
python scripts\start-dev.py
```

Esto levanta:

| Servicio | URL |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend | `http://localhost:8000` |
| Health | `http://localhost:8000/api/v1/health` |

## Environment Variables

Crea o actualiza `backend/.env`:

```env
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```

Variables opcionales:

```env
GEMINI_FALLBACK_MODEL=gemini-2.0-flash
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
```

## Scripts

### Frontend

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Full Stack

```bash
python scripts\start-dev.py
```

### Backend

```bash
uvicorn app.main:app --reload
```

## Demo Flow

```txt
1. Usuario dicta una necesidad por voz
2. NAVORA AI transcribe y responde con Gemini
3. El mapa enfoca el destino detectado
4. El dashboard refleja actividad y KPIs vivos
5. Usuario sube una imagen del ingreso o barrera
6. Gemini multimodal analiza accesibilidad visual
7. La experiencia recomienda una ruta mas amable
```

## Screenshots

### Landing

> Placeholder para captura del hero cinematografico de NAVORA AI.

### Chat IA

> Placeholder para la interfaz conversacional con voz, imagenes y respuestas IA.

### Dashboard

> Placeholder para KPIs, actividad, timeline y analitica reactiva.

### Mapa

> Placeholder para Leaflet con hotspots de accesibilidad y rutas inteligentes.

## Quality & Hardening

Incluye protecciones para:

- timeouts de red
- quota/rate limit de Gemini
- fallbacks humanos
- uploads invalidos
- permisos de microfono
- doble submit
- estados de carga
- responsive mobile

## Roadmap

- PWA instalable
- modo offline para rutas guardadas
- integracion municipal realtime
- scoring avanzado de accesibilidad
- soporte multilingue
- rutas verificadas por comunidad
- analitica historica por destino
- panel operativo para gestores turisticos

## License

MIT License.

## Author

**Julio Quispe**  
AI Full Stack Developer

Construido con enfoque en IA aplicada, accesibilidad, turismo inclusivo y experiencias SaaS premium.

Demo:
https://navora-ai.netlify.app/
