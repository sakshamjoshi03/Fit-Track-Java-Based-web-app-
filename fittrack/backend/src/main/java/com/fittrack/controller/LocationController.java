package com.fittrack.controller;

import com.fittrack.dto.LocationDto;
import com.fittrack.dto.PlaceSuggestionDto;
import com.fittrack.model.LiveSession;
import com.fittrack.service.GeolocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/location")
public class LocationController {

    private final GeolocationService geolocationService;

    public LocationController(GeolocationService geolocationService) {
        this.geolocationService = geolocationService;
    }

    @PostMapping("/current")
    public ResponseEntity<LocationDto> getCurrentLocation(@RequestBody Map<String, Object> requestBody) {
        LocationDto location = geolocationService.getCurrentLocation(requestBody);
        return ResponseEntity.ok(location);
    }

    @GetMapping("/route")
    public ResponseEntity<List<double[]>> getRoute() {
        return ResponseEntity.ok(geolocationService.getActiveRoute());
    }

    @PostMapping("/manual/search")
    public ResponseEntity<List<PlaceSuggestionDto>> searchPlaces(@RequestBody Map<String, String> body) {
        String query = body.getOrDefault("query", "");
        return ResponseEntity.ok(geolocationService.searchPlaces(query));
    }

    @PostMapping("/manual/select")
    public ResponseEntity<LocationDto> selectPlace(@RequestBody Map<String, String> body) {
        String placeId = body.getOrDefault("placeId", "");
        return ResponseEntity.ok(geolocationService.selectPlace(placeId));
    }

    @PostMapping("/session/start")
    public ResponseEntity<LiveSession> startSession() {
        return ResponseEntity.ok(geolocationService.startSession());
    }

    @PostMapping("/session/stop")
    public ResponseEntity<LiveSession> stopSession() {
        return ResponseEntity.ok(geolocationService.stopSession());
    }

    @GetMapping("/session/active")
    public ResponseEntity<Map<String, Object>> getActiveSession() {
        LiveSession session = geolocationService.getActiveSession();
        if (session == null) {
            return ResponseEntity.ok(Map.of("active", false));
        }
        return ResponseEntity.ok(Map.of(
                "active", session.isActive(),
                "id", session.getId(),
                "activityType", session.getActivityType(),
                "locationName", session.getLocationName() != null ? session.getLocationName() : "",
                "routePointCount", session.getRoutePoints().size()
        ));
    }

    @GetMapping("/reverse")
    public ResponseEntity<LocationDto> reverseGeocode(@RequestParam double lat, @RequestParam double lng) {
        String address = geolocationService.reverseGeocode(lat, lng);
        return ResponseEntity.ok(new LocationDto(lat, lng, 0, address));
    }

    @PostMapping("/route-distance")
    public ResponseEntity<Map<String, Object>> calculateRouteDistance(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        Map<String, Number> start = (Map<String, Number>) body.get("start");
        @SuppressWarnings("unchecked")
        Map<String, Number> end = (Map<String, Number>) body.get("end");

        double lat1 = start.get("lat").doubleValue();
        double lng1 = start.get("lng").doubleValue();
        double lat2 = end.get("lat").doubleValue();
        double lng2 = end.get("lng").doubleValue();

        // Haversine formula
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        double distanceKm = Math.round(R * c * 100.0) / 100.0;

        return ResponseEntity.ok(Map.of("distanceKm", distanceKm));
    }
}
