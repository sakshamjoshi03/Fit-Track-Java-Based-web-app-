# API Keys Configuration Guide

## Required Google Cloud APIs

Enable these APIs in [Google Cloud Console](https://console.cloud.google.com/apis):

### 1. Google Geolocation API
- **Console**: APIs & Services → Library → search "Geolocation API" → Enable
- **Environment Variable**: `GOOGLE_GEOLOCATION_API_KEY`
- **Used for**: Determining user's current location via Wi-Fi/cell tower data
- **Endpoint**: `POST https://www.googleapis.com/geolocation/v1/geolocate`

### 2. Google Geocoding API
- **Console**: APIs & Services → Library → search "Geocoding API" → Enable
- **Environment Variable**: `GOOGLE_GEOCODING_API_KEY`
- **Used for**: Reverse geocoding (lat/lng → human-readable address)
- **Endpoint**: `GET https://maps.googleapis.com/maps/api/geocode/json`

### 3. Google Places API
- **Console**: APIs & Services → Library → search "Places API" → Enable
- **Environment Variable**: Uses the same `GOOGLE_GEOCODING_API_KEY`
- **Used for**: Place autocomplete search and place details
- **Endpoints**:
  - `GET /maps/api/place/autocomplete/json` (search)
  - `GET /maps/api/place/details/json` (details)

## Optional: Health Connect

### Health Connect Integration
- **Environment Variable**: `HEALTH_CONNECT_API_KEY`
- **Environment Variable**: `HEALTH_CONNECT_BASE_URL`
- **Used for**: Syncing health metrics (steps, distance, heart rate, etc.)
- **Scopes/Permissions Required**:
  - `Steps` — daily step count
  - `Distance` — distance in meters
  - `ActiveCaloriesBurned` — activity data
  - `HeartRate` — heart rate BPM
  - `ElevationGained` — elevation data
  - `ExerciseSession` — activity history
  - `BodyMeasurements` — user weight (for MET calorie formula)

## Where Keys Go

All keys are set via **environment variables** and read in `backend/src/main/resources/application.yml`:

```yaml
app:
  google:
    geolocation:
      api-key: ${GOOGLE_GEOLOCATION_API_KEY:}   # ← Set this env var
    geocoding:
      api-key: ${GOOGLE_GEOCODING_API_KEY:}      # ← Set this env var
  health-connect:
    api-key: ${HEALTH_CONNECT_API_KEY:}           # ← Set this env var
    base-url: ${HEALTH_CONNECT_BASE_URL:}         # ← Set this env var
```

**No API key should ever appear in source code.** The `${}` syntax with empty defaults means the app boots cleanly without keys and degrades gracefully.

## Verification

After starting the backend, hit:
```
GET http://localhost:8080/api/system/health
```

Response shows configuration status of each service:
```json
{
  "status": "UP",
  "services": {
    "googleGeolocation": { "configured": true },
    "googleGeocoding": { "configured": true },
    "healthConnect": { "configured": false }
  }
}
```
