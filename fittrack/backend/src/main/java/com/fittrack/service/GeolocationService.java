package com.fittrack.service;

import com.fittrack.client.GoogleGeocodingClient;
import com.fittrack.client.GoogleGeolocationClient;
import com.fittrack.dto.LocationDto;
import com.fittrack.dto.PlaceSuggestionDto;
import com.fittrack.model.LiveSession;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class GeolocationService {

    private final GoogleGeolocationClient geolocationClient;
    private final GoogleGeocodingClient geocodingClient;
    private LiveSession activeSession;

    public GeolocationService(GoogleGeolocationClient geolocationClient, GoogleGeocodingClient geocodingClient) {
        this.geolocationClient = geolocationClient;
        this.geocodingClient = geocodingClient;
    }

    public LocationDto getCurrentLocation(Map<String, Object> requestBody) {
        Map<String, Object> result = geolocationClient.geolocate(requestBody);

        if (result != null && result.containsKey("location")) {
            @SuppressWarnings("unchecked")
            Map<String, Object> location = (Map<String, Object>) result.get("location");
            double lat = ((Number) location.get("lat")).doubleValue();
            double lng = ((Number) location.get("lng")).doubleValue();
            double accuracy = result.containsKey("accuracy") ? ((Number) result.get("accuracy")).doubleValue() : 0;

            String address = geocodingClient.reverseGeocode(lat, lng);

            LocationDto dto = new LocationDto(lat, lng, accuracy, address);

            // Add to active session if one exists
            if (activeSession != null && activeSession.isActive()) {
                activeSession.addRoutePoint(lat, lng);
                if (activeSession.getLocationName() == null) {
                    activeSession.setLocationName(address);
                }
            }

            return dto;
        }
        return new LocationDto(0, 0, 0, "Unable to determine location");
    }

    public List<double[]> getActiveRoute() {
        if (activeSession != null && activeSession.isActive()) {
            return activeSession.getRoutePoints();
        }
        return List.of();
    }

    public List<PlaceSuggestionDto> searchPlaces(String query) {
        return geocodingClient.searchPlaces(query);
    }

    @SuppressWarnings("unchecked")
    public LocationDto selectPlace(String placeId) {
        Map<String, Object> details = geocodingClient.getPlaceDetails(placeId);
        if (!details.isEmpty()) {
            double lat = ((Number) details.get("lat")).doubleValue();
            double lng = ((Number) details.get("lng")).doubleValue();
            String address = (String) details.get("address");

            if (activeSession != null && activeSession.isActive()) {
                activeSession.setDestination(new double[]{lat, lng});
                activeSession.setDestinationAddress(address);
            }

            return new LocationDto(lat, lng, 0, address);
        }
        return new LocationDto(0, 0, 0, "Place not found");
    }

    public LiveSession startSession() {
        activeSession = new LiveSession();
        return activeSession;
    }

    public LiveSession stopSession() {
        if (activeSession != null) {
            activeSession.setActive(false);
            activeSession.setEndTime(System.currentTimeMillis());
        }
        LiveSession completed = activeSession;
        activeSession = null;
        return completed;
    }

    public LiveSession getActiveSession() {
        return activeSession;
    }

    public boolean hasActiveSession() {
        return activeSession != null && activeSession.isActive();
    }
    public String reverseGeocode(double lat, double lng) {
        try {
            return geocodingClient.reverseGeocode(lat, lng);
        } catch (Exception e) {
            return lat + ", " + lng;
        }
    }
}
