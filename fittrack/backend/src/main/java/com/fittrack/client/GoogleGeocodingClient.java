package com.fittrack.client;

import com.fittrack.config.AppProperties;
import com.fittrack.dto.PlaceSuggestionDto;
import com.fittrack.service.ApiKeyValidationService;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class GoogleGeocodingClient {

    private final WebClient webClient;
    private final AppProperties props;
    private final ApiKeyValidationService keyValidator;

    public GoogleGeocodingClient(WebClient webClient, AppProperties props, ApiKeyValidationService keyValidator) {
        this.webClient = webClient;
        this.props = props;
        this.keyValidator = keyValidator;
    }

    @SuppressWarnings("unchecked")
    public String reverseGeocode(double lat, double lng) {
        keyValidator.requireGeocodingKey();
        String url = props.getGoogle().getGeocoding().getBaseUrl()
                + "/geocode/json?latlng=" + lat + "," + lng
                + "&key=" + props.getGoogle().getGeocoding().getApiKey();

        Map<String, Object> response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response != null && response.containsKey("results")) {
            List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
            if (!results.isEmpty()) {
                return (String) results.get(0).get("formatted_address");
            }
        }
        return "Unknown Location";
    }

    @SuppressWarnings("unchecked")
    public List<PlaceSuggestionDto> searchPlaces(String query) {
        keyValidator.requireGeocodingKey();
        String url = props.getGoogle().getGeocoding().getPlacesBaseUrl()
                + "/autocomplete/json?input=" + query
                + "&key=" + props.getGoogle().getGeocoding().getApiKey();

        Map<String, Object> response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<PlaceSuggestionDto> suggestions = new ArrayList<>();
        if (response != null && response.containsKey("predictions")) {
            List<Map<String, Object>> predictions = (List<Map<String, Object>>) response.get("predictions");
            for (Map<String, Object> prediction : predictions) {
                String placeId = (String) prediction.get("place_id");
                String description = (String) prediction.get("description");
                Map<String, Object> structured = (Map<String, Object>) prediction.get("structured_formatting");
                String mainText = structured != null ? (String) structured.get("main_text") : description;
                suggestions.add(new PlaceSuggestionDto(placeId, mainText, description));
            }
        }
        return suggestions;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getPlaceDetails(String placeId) {
        keyValidator.requireGeocodingKey();
        String url = props.getGoogle().getGeocoding().getPlacesBaseUrl()
                + "/details/json?place_id=" + placeId
                + "&fields=geometry,formatted_address,name"
                + "&key=" + props.getGoogle().getGeocoding().getApiKey();

        Map<String, Object> response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        if (response != null && response.containsKey("result")) {
            Map<String, Object> result = (Map<String, Object>) response.get("result");
            Map<String, Object> geometry = (Map<String, Object>) result.get("geometry");
            Map<String, Object> location = (Map<String, Object>) geometry.get("location");

            return Map.of(
                    "lat", location.get("lat"),
                    "lng", location.get("lng"),
                    "address", result.getOrDefault("formatted_address", ""),
                    "name", result.getOrDefault("name", "")
            );
        }
        return Map.of();
    }
}
