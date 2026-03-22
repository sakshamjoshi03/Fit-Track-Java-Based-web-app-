# 🧑‍💻 Senior Java Developer Assignment — FitTrack Performance Dashboard

---

## 📌 Project Summary

You are building a **production-grade fitness tracking web application** that is a **pixel-perfect replica of the attached UI mockup** (FitTrack — Elite Performance Dashboard). The stack is **Spring Boot (backend) + React + TypeScript + Tailwind CSS (frontend)**. Every single metric on the dashboard — steps, distance, time, calories, route, goals — must come from **live API data only**. There is to be **zero hardcoded, seeded, mocked, or demo data** anywhere in the codebase. If an API key has not yet been provided, the system must display a graceful "API key not configured" state and idle cleanly — it must **never** silently substitute fake values.

---

## 🎨 UI Replication — Exact Spec from Mockup

Replicate every element of the provided screenshot with fidelity. Below is the complete component breakdown:

### Sidebar (Left Panel)
- App logo: lightning bolt icon + "FitTrack" title + "ELITE PERFORMANCE" subtitle — amber/orange color scheme
- Nav items: **Dashboard** (active, amber highlighted), **Activities**, **Progress**, **Goals**, **Settings**
- Bottom: User avatar + name ("Alex Rivera") + subtitle ("Pro Athlete") + kebab menu icon
- Background: `#1a1a1a` dark, sidebar slightly lighter `#1f1f1f`

### Top Bar
- Page title: **"Performance Overview"** — bold, white
- Search bar: "Search analytics..." placeholder, dark input, search icon
- Notification bell icon (top right)

### Live Activity Card (Main Hero Card)
- Badge: `LIVE ACTIVITY` pill in top-left
- Title: **"MORNING RUN"** — large, italic, bold, white
- Subtitle: Location name (e.g., "San Francisco Waterfront Route") — fetched dynamically
- Route visualization: Animated SVG polyline drawn over a dark map-style canvas showing the GPS path in amber/orange gradient. The route must be drawn in real time from actual GPS coordinates
- Below the map: three stat pills — **PACE** (`4'22"/km`), **ELEVATION** (`124m`), **AVG HEART RATE** (`162 bpm`)
- Button: **"View Detailed Map"** — amber background, map-pin icon

### Recent Activity Cards (Right Column)
- Two stacked cards: "Evening Sprint" (Yesterday, 8.42 km, +12% vs last wk) and "Recovery Walk" (2 Days Ago, 3.10 km, Standard)
- Both use a running/walking icon in a dark amber circle
- All values sourced from Health Connect history — no hardcoded entries

### Metric Cards Row (4 cards)
| Card | Value | Detail |
|---|---|---|
| DISTANCE | `24.8 km` | "Weekly trend up" label |
| STEPS | `12,482` | Progress bar (12,482 / 15,000 daily target) |
| TIME | `01:42 hr` | "Active moving time" label |
| CALORIES | `1,240 kcal` | "Daily goal met" badge |

All values real-time from Health Connect. Progress bar on STEPS updates live.

### Active Goals Section
- Header: "Active Goals" + "+ Create New" button
- Row 1: **Daily Steps Target** — `12,482 / 15,000` with amber progress bar — updates in real time
- Row 2: **Weekly Running Distance** — `24.8 / 40 km` with amber progress bar
- Both targets editable by user; progress driven by live API data

### Next Milestone Card (Bottom Right)
- Trophy icon in amber circle
- Title: **"NEXT MILESTONE"** italic bold
- Description: proximity to next badge (e.g., "15.2km away from achieving the 'Marathon Prep' badge")
- Calculated dynamically from real distance data

### Global Design Tokens
```
Background:       #111111
Card background:  #1c1c1c
Accent / Primary: #f5a623  (amber/orange)
Text primary:     #ffffff
Text secondary:   #9ca3af
Border:           #2a2a2a
Font:             Inter or similar sans-serif
```

---

## 🗂️ Full Project Structure

```
fittrack/
├── backend/
│   ├── src/main/java/com/fittrack/
│   │   ├── FitTrackApplication.java
│   │   ├── config/
│   │   │   ├── AppProperties.java
│   │   │   ├── WebClientConfig.java
│   │   │   ├── CorsConfig.java
│   │   │   └── WebSocketConfig.java
│   │   ├── controller/
│   │   │   ├── LocationController.java
│   │   │   ├── MetricsController.java
│   │   │   ├── GoalsController.java
│   │   │   └── ActivityController.java
│   │   ├── service/
│   │   │   ├── GeolocationService.java
│   │   │   ├── GeocodingService.java
│   │   │   ├── HealthConnectService.java
│   │   │   ├── CalorieEstimationService.java
│   │   │   ├── GoalsService.java
│   │   │   └── ActivityHistoryService.java
│   │   ├── client/
│   │   │   ├── GoogleGeolocationClient.java
│   │   │   ├── GoogleGeocodingClient.java
│   │   │   └── HealthConnectClient.java
│   │   ├── dto/
│   │   │   ├── LocationDto.java
│   │   │   ├── MetricsSummaryDto.java
│   │   │   ├── ActivityDto.java
│   │   │   ├── GoalDto.java
│   │   │   └── PlaceSuggestionDto.java
│   │   ├── model/
│   │   │   ├── LiveSession.java
│   │   │   ├── Goal.java
│   │   │   └── ManualLocationEntry.java
│   │   ├── websocket/
│   │   │   ├── MetricsSocketHandler.java
│   │   │   └── LocationSocketHandler.java
│   │   └── exception/
│   │       ├── ApiKeyMissingException.java
│   │       └── GlobalExceptionHandler.java
│   └── src/main/resources/
│       └── application.yml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── LiveActivityCard.tsx
│   │   │   ├── RouteCanvas.tsx
│   │   │   ├── MetricCard.tsx
│   │   │   ├── GoalsPanel.tsx
│   │   │   ├── ActivityHistoryCard.tsx
│   │   │   ├── MilestoneCard.tsx
│   │   │   └── ManualLocationSearch.tsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts
│   │   │   ├── useMetrics.ts
│   │   │   └── useLocation.ts
│   │   └── pages/
│   │       └── Dashboard.tsx
└── README.md
```

---

## ⚙️ Backend — Spring Boot: Complete Specification

### 1. API Key Configuration (application.yml)

```yaml
app:
  google:
    geolocation:
      api-key: ${GOOGLE_GEOLOCATION_API_KEY:}
      base-url: https://www.googleapis.com/geolocation/v1/geolocate
    geocoding:
      api-key: ${GOOGLE_GEOCODING_API_KEY:}
      base-url: https://maps.googleapis.com/maps/api
      places-base-url: https://maps.googleapis.com/maps/api/place

  health-connect:
    api-key: ${HEALTH_CONNECT_API_KEY:}
    base-url: ${HEALTH_CONNECT_BASE_URL:}

  tracking:
    location-poll-interval-ms: 5000
    steps-sync-interval-ms: 10000
    daily-steps-target: 15000
    weekly-distance-target-km: 40.0

server:
  port: 8080

spring:
  application:
    name: fittrack-backend
```

---

### 2. AppProperties Configuration Class

```java
@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Google google = new Google();
    private HealthConnect healthConnect = new HealthConnect();
    private Tracking tracking = new Tracking();

    public static class Google {
        private Geolocation geolocation = new Geolocation();
        private Geocoding geocoding = new Geocoding();

        public static class Geolocation {
            private String apiKey;
            private String baseUrl;
            // getters + setters
        }

        public static class Geocoding {
            private String apiKey;
            private String baseUrl;
            private String placesBaseUrl;
            // getters + setters
        }
        // getters + setters
    }

    public static class HealthConnect {
        private String apiKey;
        private String baseUrl;
        // getters + setters
    }

    public static class Tracking {
        private long locationPollIntervalMs;
        private long stepsSyncIntervalMs;
        private int dailyStepsTarget;
        private double weeklyDistanceTargetKm;
        // getters + setters
    }
    // top-level getters + setters
}
```

---

### 3. API Key Validation Service

```java
@Service
public class ApiKeyValidationService {

    private final AppProperties props;

    public boolean isGeolocationConfigured() {
        String key = props.getGoogle().getGeolocation().getApiKey();
        return key != null && !key.isBlank();
    }

    public boolean isGeocodingConfigured() {
        String key = props.getGoogle().getGeocoding().getApiKey();
        return key != null && !key.isBlank();
    }

    public boolean isHealthConnectConfigured() {
        String key = props.getHealthConnect().getApiKey();
        return key != null && !key.isBlank();
    }

    // Each service must call the relevant check before making external calls.
    // If not configured → throw ApiKeyMissingException with a descriptive message.
    // GlobalExceptionHandler returns HTTP 503:
    // { "error": "API_KEY_NOT_CONFIGURED", "service": "Google Geolocation", "message": "..." }
}
```

---

### 4. Location Module — Google Geolocation API

**GoogleGeolocationClient.java** — Uses Spring WebClient.
Calls `POST https://www.googleapis.com/geolocation/v1/geolocate?key={API_KEY}`

- Accepts a list of `WifiAccessPoint` objects (SSID, MAC, signal strength) and/or cell tower data from the frontend
- POSTs this payload to Google's endpoint
- Returns `{ lat, lng, accuracy }` from the response

```java
@Component
public class GoogleGeolocationClient {

    private final WebClient webClient;
    private final AppProperties props;
    private final ApiKeyValidationService keyValidator;

    public GeolocationResult geolocate(GeolocationRequest request) {
        keyValidator.requireGeolocationKey(); // throws if not configured
        String url = props.getGoogle().getGeolocation().getBaseUrl()
                   + "?key=" + props.getGoogle().getGeolocation().getApiKey();

        return webClient.post()
                .uri(url)
                .bodyValue(request)
                .retrieve()
                .bodyToMono(GeolocationResult.class)
                .block();
    }
}
```

**GoogleGeocodingClient.java**

- `reverseGeocode(double lat, double lng)` → human-readable address
  - Calls `GET /maps/api/geocode/json?latlng={lat},{lng}&key={key}`
- `searchPlaces(String query)` → list of place suggestions
  - Calls `GET /maps/api/place/autocomplete/json?input={query}&key={key}`
- `getPlaceDetails(String placeId)` → returns `{ lat, lng, formattedAddress }`
  - Calls `GET /maps/api/place/details/json?place_id={placeId}&key={key}`

---

### 5. Location Controller — REST Endpoints

```
POST   /api/location/current          → Accepts WiFi/cell data, returns {lat, lng, address}
GET    /api/location/route            → Returns ordered list of GPS coords for active session
POST   /api/location/manual/search   → Body: {query: "Connaught Place"} → place suggestions
POST   /api/location/manual/select   → Body: {placeId: "..."} → sets destination, returns {lat, lng, address}
POST   /api/location/session/start   → Starts a new live tracking session
POST   /api/location/session/stop    → Ends session, finalizes route
GET    /api/location/session/active  → Returns current session state
```

**Manual Location Feature:**
The frontend shows a search input in the Live Activity Card. Typing calls `/api/location/manual/search` which proxies to Google Places Autocomplete. On selection, `/api/location/manual/select` is called with the `placeId`. The backend resolves lat/lng via Place Details API and sets it as the session's destination. The route visualization draws a path from current GPS location to the manually entered destination.

---

### 6. Health Connect Module

**HealthConnectClient.java** — Acts as a proxy/aggregator.
The Android Health Connect app pushes data to Spring Boot, which exposes it to the dashboard via REST and WebSocket.

```
POST /api/health/sync/steps          → Body: {steps: 12482, timestamp: ...}
POST /api/health/sync/distance       → Body: {distanceMeters: 24800, timestamp: ...}
POST /api/health/sync/activeTime     → Body: {activeSeconds: 6120, timestamp: ...}
POST /api/health/sync/heartRate      → Body: {bpm: 162, timestamp: ...}
POST /api/health/sync/elevation      → Body: {elevationMeters: 124, timestamp: ...}
```

**HealthConnectService.java** must:
- Aggregate steps across the current day (midnight to now) → STEPS card
- Aggregate distance across the current day → DISTANCE card
- Calculate active time → TIME card
- Pass steps + distance + active time into `CalorieEstimationService`

---

### 7. Calorie Estimation Service

```java
@Service
public class CalorieEstimationService {

    /**
     * MET-based estimation. No hardcoded calorie values ever.
     * Formula: Calories = MET × weight(kg) × durationHours
     * MET values: Walking = 3.5, Running = 8.0, Cycling = 6.0
     * Weight must come from Health Connect user profile sync — never hardcode.
     */
    public double estimateCalories(ActivityType type,
                                   double durationHours,
                                   double weightKg,
                                   double distanceKm) {
        double met = switch (type) {
            case RUNNING -> 8.0;
            case WALKING -> 3.5;
            case CYCLING -> 6.0;
        };
        return met * weightKg * durationHours;
    }
}
```

The CALORIES card must always display this computed value — never a static number.

---

### 8. Goals Service

```
GET  /api/goals                  → Returns all active goals with live progress
POST /api/goals                  → Creates a new goal
PUT  /api/goals/{id}             → Updates target value
GET  /api/goals/daily/steps      → {current: 12482, target: 15000, percentage: 83.2}
GET  /api/goals/weekly/distance  → {currentKm: 24.8, targetKm: 40.0, percentage: 62.0}
```

Progress values always pulled from live Health Connect sync data — never stored as static progress.

---

### 9. Real-Time Updates via WebSocket

```java
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/fittrack").setAllowedOriginPatterns("*").withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }
}
```

**Scheduled pushers:**

```java
@Scheduled(fixedDelayString = "${app.tracking.steps-sync-interval-ms}")
public void pushMetricsUpdate() {
    MetricsSummaryDto summary = metricsService.buildLiveSummary();
    messagingTemplate.convertAndSend("/topic/metrics", summary);
}

@Scheduled(fixedDelayString = "${app.tracking.location-poll-interval-ms}")
public void pushLocationUpdate() {
    if (sessionService.hasActiveSession()) {
        RouteUpdateDto route = locationService.getActiveRoute();
        messagingTemplate.convertAndSend("/topic/route", route);
    }
}
```

Frontend subscribes to `/topic/metrics` and `/topic/route` — all cards update without page refresh.

---

## 🖥️ Frontend — React + TypeScript + Tailwind

### WebSocket Hook
```typescript
// hooks/useWebSocket.ts
// Connects to ws://localhost:8080/ws/fittrack
// Subscribes to /topic/metrics and /topic/route
// On every message → updates global state via Zustand or Context
// If connection drops → shows amber "Reconnecting..." badge on dashboard
```

### Route Canvas Component
```typescript
// components/RouteCanvas.tsx
// Receives array of {lat, lng} points from WebSocket
// Renders animated SVG polyline on a dark canvas
// Color: amber gradient (#f5a623 → #d97706)
// Start point: green dot. Current position: pulsing amber dot. Destination: red dot
// Auto-scales viewBox to fit all route points
// If manual destination is set → draw a dashed line from last GPS point to destination
```

### Manual Location Search Component
```typescript
// components/ManualLocationSearch.tsx
// Input field with debounced search (300ms)
// On type → calls POST /api/location/manual/search
// Renders dropdown of place suggestions (name + address)
// On select → calls POST /api/location/manual/select
// Shows selected destination as subtitle under activity title in hero card
// Has a "Clear Destination" × button
```

### Real-Time Goal Progress Bars
```typescript
// Both progress bars in Active Goals must animate smoothly on every WS update
// Use CSS transitions: transition: width 0.5s ease
// Daily Steps: width = (currentSteps / targetSteps) * 100 + '%'
// Weekly Distance: width = (currentKm / targetKm) * 100 + '%'
// Percentage labels and fraction text update on every push
```

---

## 📋 REST API Full Endpoint Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/location/current` | Get current location via Geolocation API |
| `GET` | `/api/location/route` | Get full GPS route of active session |
| `POST` | `/api/location/manual/search` | Search places (Google Places Autocomplete) |
| `POST` | `/api/location/manual/select` | Set destination from place ID |
| `POST` | `/api/location/session/start` | Begin live tracking session |
| `POST` | `/api/location/session/stop` | End tracking session |
| `GET` | `/api/location/session/active` | Active session status |
| `POST` | `/api/health/sync/steps` | Receive steps data from Health Connect |
| `POST` | `/api/health/sync/distance` | Receive distance data |
| `POST` | `/api/health/sync/activeTime` | Receive active time |
| `POST` | `/api/health/sync/heartRate` | Receive heart rate |
| `POST` | `/api/health/sync/elevation` | Receive elevation data |
| `GET` | `/api/metrics/summary` | Full dashboard metrics snapshot |
| `GET` | `/api/goals` | All goals with live progress |
| `POST` | `/api/goals` | Create new goal |
| `PUT` | `/api/goals/{id}` | Update goal target |
| `GET` | `/api/goals/daily/steps` | Daily steps goal + live progress |
| `GET` | `/api/goals/weekly/distance` | Weekly distance goal + live progress |
| `GET` | `/api/activities/recent` | Last N activities from Health Connect |
| `GET` | `/api/system/health` | API key config status check |

---

## 🚫 Absolute Constraints — Non-Negotiable

1. **No fake data, anywhere, ever.** No `return new StepsDto(12482)`. No `List.of(demoActivity)`. No frontend constants filling in for missing API data. If data isn't available → show a skeleton loader or "Waiting for data..." state.

2. **All API keys via `application.yml` / environment variables only.** No key string must appear in any `.java` or `.tsx` file.

3. **`/api/system/health` endpoint is mandatory.** It must return the configuration status of each API key (`configured: true/false`) without exposing the key value. The frontend must show a subtle amber warning banner if any key is unconfigured.

4. **WebSocket is mandatory for Steps, Distance, Time, Calories, and Route.** HTTP polling is not acceptable for real-time cards.

5. **Manual location search must use Google Places Autocomplete API** — not a free-text field. It must resolve to real `lat/lng` coordinates.

6. **Calorie calculation must always use the MET formula** driven by live activity type, duration, and user weight from Health Connect. Never a static value.

7. **Daily and weekly goal progress bars must update every time a Health Connect sync payload arrives** — not on a fixed schedule independent of data.

---

## 📦 Deliverables Checklist

- [ ] Full Spring Boot project compiling with `mvn clean install` or `./gradlew build`
- [ ] React frontend running with `npm run dev`
- [ ] `application.yml` with all API key slots clearly commented
- [ ] `README.md` with step-by-step: how to insert each API key and start both services
- [ ] `API_KEYS.md` documenting where each key goes, which Google API products to enable in Google Cloud Console, and which Health Connect scopes/permissions are required
- [ ] No compile errors, no runtime exceptions when keys are blank (graceful degradation only)
- [ ] Dashboard visually indistinguishable from the provided mockup screenshot
- [ ] Attach the mockup screenshot to this document when handing off to the developer
