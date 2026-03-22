package com.fittrack.service;

import com.fittrack.config.AppProperties;
import com.fittrack.dto.MetricsSummaryDto;
import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class HealthConnectService {

    private final AppProperties props;
    private final CalorieEstimationService calorieService;

    // Live aggregated metrics from Health Connect sync payloads
    private final AtomicInteger currentSteps = new AtomicInteger(0);
    private final AtomicReference<Double> currentDistanceMeters = new AtomicReference<>(0.0);
    private final AtomicLong activeTimeSeconds = new AtomicLong(0);
    private final AtomicInteger heartRateBpm = new AtomicInteger(0);
    private final AtomicReference<Double> elevationMeters = new AtomicReference<>(0.0);
    private final AtomicReference<Double> userWeightKg = new AtomicReference<>(70.0); // default, overridden by HC sync

    public HealthConnectService(AppProperties props, CalorieEstimationService calorieService) {
        this.props = props;
        this.calorieService = calorieService;
    }

    public void syncSteps(int steps) {
        currentSteps.set(steps);
    }

    public void syncDistance(double distanceMeters) {
        currentDistanceMeters.set(distanceMeters);
    }

    public void syncActiveTime(long seconds) {
        activeTimeSeconds.set(seconds);
    }

    public void syncHeartRate(int bpm) {
        heartRateBpm.set(bpm);
    }

    public void syncElevation(double meters) {
        elevationMeters.set(meters);
    }

    public void syncUserWeight(double weightKg) {
        userWeightKg.set(weightKg);
    }

    public MetricsSummaryDto buildLiveSummary() {
        MetricsSummaryDto summary = new MetricsSummaryDto();
        int steps = currentSteps.get();
        double distKm = currentDistanceMeters.get() / 1000.0;
        long activeSeconds = activeTimeSeconds.get();
        int target = props.getTracking().getDailyStepsTarget();

        summary.setSteps(steps);
        summary.setDailyStepsTarget(target);
        summary.setDistanceKm(Math.round(distKm * 100.0) / 100.0);
        summary.setWeeklyDistanceTargetKm(props.getTracking().getWeeklyDistanceTargetKm());
        summary.setActiveTimeSeconds(activeSeconds);
        summary.setHeartRateBpm(heartRateBpm.get());
        summary.setElevationMeters(elevationMeters.get());

        // Calculate pace (min/km)
        if (distKm > 0 && activeSeconds > 0) {
            double paceMinPerKm = (activeSeconds / 60.0) / distKm;
            summary.setPaceMinPerKm(Math.round(paceMinPerKm * 100.0) / 100.0);
        }

        // Calculate calories using MET formula
        double durationHours = activeSeconds / 3600.0;
        double calories = calorieService.estimateCalories("RUNNING", durationHours, userWeightKg.get(), distKm);
        summary.setCaloriesKcal(Math.round(calories * 10.0) / 10.0);

        summary.setDailyGoalMet(steps >= target);

        return summary;
    }

    public int getCurrentSteps() { return currentSteps.get(); }
    public double getCurrentDistanceKm() { return currentDistanceMeters.get() / 1000.0; }
    public double getCurrentCalories() {
        double durationHours = activeTimeSeconds.get() / 3600.0;
        return calorieService.estimateCalories("RUNNING", durationHours, userWeightKg.get(), getCurrentDistanceKm());
    }
}
