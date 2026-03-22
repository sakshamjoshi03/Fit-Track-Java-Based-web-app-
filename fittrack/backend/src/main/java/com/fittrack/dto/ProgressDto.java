package com.fittrack.dto;

import java.util.List;
import java.util.Map;

public class ProgressDto {
    private String period; // "weekly" or "monthly"
    private double totalDistanceKm;
    private double totalCaloriesKcal;
    private double avgPaceMinPerKm;
    private long totalDurationSeconds;
    private int totalSteps;
    private int activeDays;
    private int totalDays;
    private double distanceChangePercent;
    private double caloriesChangePercent;
    private double paceChangePercent;
    private List<Map<String, Object>> distanceChart;  // [{day: "Mon", value: 8.2}, ...]
    private List<Map<String, Object>> caloriesChart;
    private List<Map<String, Object>> paceChart;
    private List<Map<String, Object>> stepsChart;

    public ProgressDto() {}

    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public double getTotalDistanceKm() { return totalDistanceKm; }
    public void setTotalDistanceKm(double totalDistanceKm) { this.totalDistanceKm = totalDistanceKm; }
    public double getTotalCaloriesKcal() { return totalCaloriesKcal; }
    public void setTotalCaloriesKcal(double totalCaloriesKcal) { this.totalCaloriesKcal = totalCaloriesKcal; }
    public double getAvgPaceMinPerKm() { return avgPaceMinPerKm; }
    public void setAvgPaceMinPerKm(double avgPaceMinPerKm) { this.avgPaceMinPerKm = avgPaceMinPerKm; }
    public long getTotalDurationSeconds() { return totalDurationSeconds; }
    public void setTotalDurationSeconds(long totalDurationSeconds) { this.totalDurationSeconds = totalDurationSeconds; }
    public int getTotalSteps() { return totalSteps; }
    public void setTotalSteps(int totalSteps) { this.totalSteps = totalSteps; }
    public int getActiveDays() { return activeDays; }
    public void setActiveDays(int activeDays) { this.activeDays = activeDays; }
    public int getTotalDays() { return totalDays; }
    public void setTotalDays(int totalDays) { this.totalDays = totalDays; }
    public double getDistanceChangePercent() { return distanceChangePercent; }
    public void setDistanceChangePercent(double distanceChangePercent) { this.distanceChangePercent = distanceChangePercent; }
    public double getCaloriesChangePercent() { return caloriesChangePercent; }
    public void setCaloriesChangePercent(double caloriesChangePercent) { this.caloriesChangePercent = caloriesChangePercent; }
    public double getPaceChangePercent() { return paceChangePercent; }
    public void setPaceChangePercent(double paceChangePercent) { this.paceChangePercent = paceChangePercent; }
    public List<Map<String, Object>> getDistanceChart() { return distanceChart; }
    public void setDistanceChart(List<Map<String, Object>> distanceChart) { this.distanceChart = distanceChart; }
    public List<Map<String, Object>> getCaloriesChart() { return caloriesChart; }
    public void setCaloriesChart(List<Map<String, Object>> caloriesChart) { this.caloriesChart = caloriesChart; }
    public List<Map<String, Object>> getPaceChart() { return paceChart; }
    public void setPaceChart(List<Map<String, Object>> paceChart) { this.paceChart = paceChart; }
    public List<Map<String, Object>> getStepsChart() { return stepsChart; }
    public void setStepsChart(List<Map<String, Object>> stepsChart) { this.stepsChart = stepsChart; }
}
