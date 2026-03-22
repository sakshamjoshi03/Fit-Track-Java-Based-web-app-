package com.fittrack.client;

import com.fittrack.config.AppProperties;
import com.fittrack.service.ApiKeyValidationService;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.Map;

@Component
public class HealthConnectClient {

    private final WebClient webClient;
    private final AppProperties props;
    private final ApiKeyValidationService keyValidator;

    public HealthConnectClient(WebClient webClient, AppProperties props, ApiKeyValidationService keyValidator) {
        this.webClient = webClient;
        this.props = props;
        this.keyValidator = keyValidator;
    }

    /**
     * Fetches user profile data from Health Connect (weight, height, etc.)
     * Used for calorie computation (MET formula requires weight).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getUserProfile() {
        keyValidator.requireHealthConnectKey();
        String url = props.getHealthConnect().getBaseUrl() + "/profile";

        return webClient.get()
                .uri(url)
                .header("Authorization", "Bearer " + props.getHealthConnect().getApiKey())
                .retrieve()
                .bodyToMono(Map.class)
                .block();
    }
}
