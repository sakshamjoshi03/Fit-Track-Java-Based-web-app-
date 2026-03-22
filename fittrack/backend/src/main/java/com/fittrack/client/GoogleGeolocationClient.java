package com.fittrack.client;

import com.fittrack.config.AppProperties;
import com.fittrack.service.ApiKeyValidationService;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Component
public class GoogleGeolocationClient {

    private final WebClient webClient;
    private final AppProperties props;
    private final ApiKeyValidationService keyValidator;

    public GoogleGeolocationClient(WebClient webClient, AppProperties props, ApiKeyValidationService keyValidator) {
        this.webClient = webClient;
        this.props = props;
        this.keyValidator = keyValidator;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> geolocate(Map<String, Object> requestBody) {
        keyValidator.requireGeolocationKey();
        String url = props.getGoogle().getGeolocation().getBaseUrl()
                + "?key=" + props.getGoogle().getGeolocation().getApiKey();

        return webClient.post()
                .uri(url)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
