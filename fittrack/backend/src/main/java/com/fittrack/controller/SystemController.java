package com.fittrack.controller;

import com.fittrack.service.ApiKeyValidationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/system")
public class SystemController {

    private final ApiKeyValidationService keyValidator;

    public SystemController(ApiKeyValidationService keyValidator) {
        this.keyValidator = keyValidator;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> getHealthStatus() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "services", Map.of(
                        "googleGeolocation", Map.of("configured", keyValidator.isGeolocationConfigured()),
                        "googleGeocoding", Map.of("configured", keyValidator.isGeocodingConfigured()),
                        "healthConnect", Map.of("configured", keyValidator.isHealthConnectConfigured())
                )
        ));
    }
}
