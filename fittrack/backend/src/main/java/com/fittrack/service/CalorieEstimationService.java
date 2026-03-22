package com.fittrack.service;

import org.springframework.stereotype.Service;

@Service
public class CalorieEstimationService {

    /**
     * MET-based calorie estimation.
     * Formula: Calories = MET × weight(kg) × durationHours
     * MET values: Walking = 3.5, Running = 8.0, Cycling = 6.0
     * Weight comes from Health Connect user profile sync — never hardcoded.
     */
    public double estimateCalories(String activityType, double durationHours, double weightKg, double distanceKm) {
        double met = switch (activityType.toUpperCase()) {
            case "RUNNING" -> 8.0;
            case "WALKING" -> 3.5;
            case "CYCLING" -> 6.0;
            default -> 4.0; // general activity
        };
        return met * weightKg * durationHours;
    }
}
