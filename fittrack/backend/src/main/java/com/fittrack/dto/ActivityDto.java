package com.fittrack.dto;

public class ActivityDto {
    private String id;
    private String name;
    private String type; // RUNNING, WALKING, CYCLING, TREKKING
    private double distanceKm;
    private long durationSeconds;
    private int heartRateBpm;
    private double elevationMeters;
    private double caloriesKcal;
    private double paceMinPerKm;
    private String timeAgo;
    private String comparison;
    private long timestamp;
    private String dateFormatted; // "Mar 21, 2026"
    private boolean personalRecord;

    public ActivityDto() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }
    public long getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(long durationSeconds) { this.durationSeconds = durationSeconds; }
    public int getHeartRateBpm() { return heartRateBpm; }
    public void setHeartRateBpm(int heartRateBpm) { this.heartRateBpm = heartRateBpm; }
    public double getElevationMeters() { return elevationMeters; }
    public void setElevationMeters(double elevationMeters) { this.elevationMeters = elevationMeters; }
    public double getCaloriesKcal() { return caloriesKcal; }
    public void setCaloriesKcal(double caloriesKcal) { this.caloriesKcal = caloriesKcal; }
    public double getPaceMinPerKm() { return paceMinPerKm; }
    public void setPaceMinPerKm(double paceMinPerKm) { this.paceMinPerKm = paceMinPerKm; }
    public String getTimeAgo() { return timeAgo; }
    public void setTimeAgo(String timeAgo) { this.timeAgo = timeAgo; }
    public String getComparison() { return comparison; }
    public void setComparison(String comparison) { this.comparison = comparison; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
    public String getDateFormatted() { return dateFormatted; }
    public void setDateFormatted(String dateFormatted) { this.dateFormatted = dateFormatted; }
    public boolean isPersonalRecord() { return personalRecord; }
    public void setPersonalRecord(boolean personalRecord) { this.personalRecord = personalRecord; }
}
