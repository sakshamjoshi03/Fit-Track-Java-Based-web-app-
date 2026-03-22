package com.fittrack.dto;

public class LocationDto {
    private double lat;
    private double lng;
    private double accuracy;
    private String address;
    private long timestamp;

    public LocationDto() {}

    public LocationDto(double lat, double lng, double accuracy, String address) {
        this.lat = lat;
        this.lng = lng;
        this.accuracy = accuracy;
        this.address = address;
        this.timestamp = System.currentTimeMillis();
    }

    public double getLat() { return lat; }
    public void setLat(double lat) { this.lat = lat; }
    public double getLng() { return lng; }
    public void setLng(double lng) { this.lng = lng; }
    public double getAccuracy() { return accuracy; }
    public void setAccuracy(double accuracy) { this.accuracy = accuracy; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
