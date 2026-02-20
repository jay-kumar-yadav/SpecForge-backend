# SpecForge Server

Production-ready Node.js + Express + MongoDB API for product spec generation.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your MONGO_URI and PORT
```

## Run

```bash
npm run dev   # development (nodemon)
npm start     # production
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate` | Generate spec from feature input (no DB) |
| POST | `/api/spec` | Create and save a spec |
| GET | `/api/specs` | List all specs |
| GET | `/api/spec/:id` | Get spec by ID |
| DELETE | `/api/spec/:id` | Delete spec |

## Environment Variables

- `PORT` – Server port (default: 5001)
- `MONGO_URI` – MongoDB connection string
- `JWT_SECRET` – Secret for JWT signing (required in production)
- `GROQ_API_KEY` – Optional; enables AI generation
- `GROQ_MODEL` – Optional; default `llama-3.3-70b-versatile`
- `GROQ_TEMPERATURE` – Optional; default 0.6
- `GROQ_MAX_TOKENS` – Optional; default 4096
- `GROQ_MAX_RETRIES` – Optional; default 2
- `NODE_ENV` – `development` or `production`
