# FitTrack — Elite Performance Dashboard

A production-grade fitness tracking web application built with **Spring Boot** (backend) and **React + TypeScript + Tailwind CSS** (frontend). All metrics are driven by live API data — zero hardcoded values.

## Quick Start

### Prerequisites
- **Java 17+** and **Maven 3.8+** (backend)
- **Node.js 18+** and **npm 9+** (frontend)
- Google Cloud API keys (Geolocation, Geocoding, Places)
- Health Connect endpoint (optional)

### 1. Configure API Keys

Set environment variables before starting the backend:

```bash
# Required for location features
export GOOGLE_GEOLOCATION_API_KEY=your_geolocation_key
export GOOGLE_GEOCODING_API_KEY=your_geocoding_key

# Optional — for Health Connect integration
export HEALTH_CONNECT_API_KEY=your_health_connect_key
export HEALTH_CONNECT_BASE_URL=https://your-health-connect-endpoint
```

On Windows (PowerShell):
```powershell
$env:GOOGLE_GEOLOCATION_API_KEY="your_geolocation_key"
$env:GOOGLE_GEOCODING_API_KEY="your_geocoding_key"
```

### 2. Start the Backend

```bash
cd fittrack/backend
mvn clean install
mvn spring-boot:run
```

Backend starts on **http://localhost:8080**

### 3. Start the Frontend

```bash
cd fittrack/frontend
npm install
npm run dev
```

Frontend starts on **http://localhost:5173** and proxies API calls to the backend.

### 4. Verify

Open **http://localhost:5173** in your browser. The dashboard will show:
- A warning banner if any API keys are unconfigured
- Skeleton loaders while waiting for data
- A "Reconnecting..." badge if WebSocket connection drops

## Architecture

```
Backend (Spring Boot :8080)
├── REST API (/api/*)
├── WebSocket (/ws/fittrack → /topic/metrics, /topic/route)
└── Scheduled pushers (metrics every 10s, route every 5s)

Frontend (React + Vite :5173)
├── STOMP WebSocket client → real-time updates
├── REST calls → initial data + goals CRUD
└── Proxy to backend via vite.config.ts
```

## API Reference

See `FitTrack_Developer_Prompt.md` for the full endpoints table. Key endpoints:

| Endpoint | Description |
|---|---|
| `GET /api/system/health` | API key config status |
| `GET /api/metrics/summary` | Full dashboard snapshot |
| `POST /api/health/sync/steps` | Sync steps from Health Connect |
| `GET /api/goals` | All goals with live progress |
| `POST /api/location/session/start` | Begin tracking session |

## Graceful Degradation

If API keys are **not configured**, the application:
- Returns `HTTP 503` with `API_KEY_NOT_CONFIGURED` error
- Shows skeleton loaders and "Waiting for data..." states
- Displays an amber warning banner on the dashboard
- **Never** substitutes fake/hardcoded values
