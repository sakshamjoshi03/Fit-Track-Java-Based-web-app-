package com.fittrack.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class LiveSession {
    private String id;
    private boolean active;
    private long startTime;
    private long endTime;
    private String activityType; // RUNNING, WALKING, CYCLING
    private String locationName;
    private List<double[]> routePoints; // [lat, lng]
    private double[] destination; // [lat, lng] if manual destination set
    private String destinationAddress;

    public LiveSession() {
        this.id = UUID.randomUUID().toString();
        this.active = true;
        this.startTime = System.currentTimeMillis();
        this.routePoints = new ArrayList<>();
        this.activityType = "RUNNING";
    }

    public void addRoutePoint(double lat, double lng) {
        routePoints.add(new double[]{lat, lng});
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public long getStartTime() { return startTime; }
    public void setStartTime(long startTime) { this.startTime = startTime; }
    public long getEndTime() { return endTime; }
    public void setEndTime(long endTime) { this.endTime = endTime; }
    public String getActivityType() { return activityType; }
    public void setActivityType(String activityType) { this.activityType = activityType; }
    public String getLocationName() { return locationName; }
    public void setLocationName(String locationName) { this.locationName = locationName; }
    public List<double[]> getRoutePoints() { return routePoints; }
    public void setRoutePoints(List<double[]> routePoints) { this.routePoints = routePoints; }
    public double[] getDestination() { return destination; }
    public void setDestination(double[] destination) { this.destination = destination; }
    public String getDestinationAddress() { return destinationAddress; }
    public void setDestinationAddress(String destinationAddress) { this.destinationAddress = destinationAddress; }
}
