package com.fittrack.dto;

public class MetricsSummaryDto {
    private int steps;
    private int dailyStepsTarget;
    private double distanceKm;
    private double weeklyDistanceTargetKm;
    private long activeTimeSeconds;
    private double caloriesKcal;
    private int heartRateBpm;
    private double elevationMeters;
    private double paceMinPerKm;
    private boolean dailyGoalMet;
    private long timestamp;

    public MetricsSummaryDto() {
        this.timestamp = System.currentTimeMillis();
    }

    public int getSteps() { return steps; }
    public void setSteps(int steps) { this.steps = steps; }
    public int getDailyStepsTarget() { return dailyStepsTarget; }
    public void setDailyStepsTarget(int dailyStepsTarget) { this.dailyStepsTarget = dailyStepsTarget; }
    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
    public double getWeeklyDistanceTargetKm() { return weeklyDistanceTargetKm; }
    public void setWeeklyDistanceTargetKm(double weeklyDistanceTargetKm) { this.weeklyDistanceTargetKm = weeklyDistanceTargetKm; }
    public long getActiveTimeSeconds() { return activeTimeSeconds; }
    public void setActiveTimeSeconds(long activeTimeSeconds) { this.activeTimeSeconds = activeTimeSeconds; }
    public double getCaloriesKcal() { return caloriesKcal; }
    public void setCaloriesKcal(double caloriesKcal) { this.caloriesKcal = caloriesKcal; }
    public int getHeartRateBpm() { return heartRateBpm; }
    public void setHeartRateBpm(int heartRateBpm) { this.heartRateBpm = heartRateBpm; }
    public double getElevationMeters() { return elevationMeters; }
    public void setElevationMeters(double elevationMeters) { this.elevationMeters = elevationMeters; }
    public double getPaceMinPerKm() { return paceMinPerKm; }
    public void setPaceMinPerKm(double paceMinPerKm) { this.paceMinPerKm = paceMinPerKm; }
    public boolean isDailyGoalMet() { return dailyGoalMet; }
    public void setDailyGoalMet(boolean dailyGoalMet) { this.dailyGoalMet = dailyGoalMet; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
