package com.fittrack.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "app")
public class AppProperties {

    private Google google = new Google();
    private HealthConnect healthConnect = new HealthConnect();
    private Tracking tracking = new Tracking();

    // --- Nested classes ---

    public static class Google {
        private Geolocation geolocation = new Geolocation();
        private Geocoding geocoding = new Geocoding();

        public static class Geolocation {
            private String apiKey;
            private String baseUrl;

            public String getApiKey() { return apiKey; }
            public void setApiKey(String apiKey) { this.apiKey = apiKey; }
            public String getBaseUrl() { return baseUrl; }
            public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
        }

        public static class Geocoding {
            private String apiKey;
            private String baseUrl;
            private String placesBaseUrl;

            public String getApiKey() { return apiKey; }
            public void setApiKey(String apiKey) { this.apiKey = apiKey; }
            public String getBaseUrl() { return baseUrl; }
            public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
            public String getPlacesBaseUrl() { return placesBaseUrl; }
            public void setPlacesBaseUrl(String placesBaseUrl) { this.placesBaseUrl = placesBaseUrl; }
        }

        public Geolocation getGeolocation() { return geolocation; }
        public void setGeolocation(Geolocation geolocation) { this.geolocation = geolocation; }
        public Geocoding getGeocoding() { return geocoding; }
        public void setGeocoding(Geocoding geocoding) { this.geocoding = geocoding; }
    }

    public static class HealthConnect {
        private String apiKey;
        private String baseUrl;

        public String getApiKey() { return apiKey; }
        public void setApiKey(String apiKey) { this.apiKey = apiKey; }
        public String getBaseUrl() { return baseUrl; }
        public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
    }

    public static class Tracking {
        private long locationPollIntervalMs;
        private long stepsSyncIntervalMs;
        private int dailyStepsTarget;
        private double weeklyDistanceTargetKm;

        public long getLocationPollIntervalMs() { return locationPollIntervalMs; }
        public void setLocationPollIntervalMs(long locationPollIntervalMs) { this.locationPollIntervalMs = locationPollIntervalMs; }
        public long getStepsSyncIntervalMs() { return stepsSyncIntervalMs; }
        public void setStepsSyncIntervalMs(long stepsSyncIntervalMs) { this.stepsSyncIntervalMs = stepsSyncIntervalMs; }
        public int getDailyStepsTarget() { return dailyStepsTarget; }
        public void setDailyStepsTarget(int dailyStepsTarget) { this.dailyStepsTarget = dailyStepsTarget; }
        public double getWeeklyDistanceTargetKm() { return weeklyDistanceTargetKm; }
        public void setWeeklyDistanceTargetKm(double weeklyDistanceTargetKm) { this.weeklyDistanceTargetKm = weeklyDistanceTargetKm; }
    }

    public Google getGoogle() { return google; }
    public void setGoogle(Google google) { this.google = google; }
    public HealthConnect getHealthConnect() { return healthConnect; }
    public void setHealthConnect(HealthConnect healthConnect) { this.healthConnect = healthConnect; }
    public Tracking getTracking() { return tracking; }
    public void setTracking(Tracking tracking) { this.tracking = tracking; }
}
