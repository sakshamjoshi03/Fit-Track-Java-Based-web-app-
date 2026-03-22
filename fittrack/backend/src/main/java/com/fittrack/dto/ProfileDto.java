package com.fittrack.dto;

public class ProfileDto {
    private String name;
    private String email;
    private String location;
    private int age;
    private String bio;
    private double weightKg;
    private int heightCm;
    private int restingHR;
    private String units; // "metric" or "imperial"

    public ProfileDto() {}

    public ProfileDto(String name, String email, String location, int age, String bio,
                      double weightKg, int heightCm, int restingHR, String units) {
        this.name = name;
        this.email = email;
        this.location = location;
        this.age = age;
        this.bio = bio;
        this.weightKg = weightKg;
        this.heightCm = heightCm;
        this.restingHR = restingHR;
        this.units = units;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public double getWeightKg() { return weightKg; }
    public void setWeightKg(double weightKg) { this.weightKg = weightKg; }
    public int getHeightCm() { return heightCm; }
    public void setHeightCm(int heightCm) { this.heightCm = heightCm; }
    public int getRestingHR() { return restingHR; }
    public void setRestingHR(int restingHR) { this.restingHR = restingHR; }
    public String getUnits() { return units; }
    public void setUnits(String units) { this.units = units; }
}
