package com.fittrack.service;

import com.fittrack.config.AppProperties;
import com.fittrack.exception.ApiKeyMissingException;
import org.springframework.stereotype.Service;

@Service
public class ApiKeyValidationService {

    private final AppProperties props;

    public ApiKeyValidationService(AppProperties props) {
        this.props = props;
    }

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

    public void requireGeolocationKey() {
        if (!isGeolocationConfigured()) {
            throw new ApiKeyMissingException("Google Geolocation");
        }
    }

    public void requireGeocodingKey() {
        if (!isGeocodingConfigured()) {
            throw new ApiKeyMissingException("Google Geocoding");
        }
    }

    public void requireHealthConnectKey() {
        if (!isHealthConnectConfigured()) {
            throw new ApiKeyMissingException("Health Connect");
        }
    }
}
