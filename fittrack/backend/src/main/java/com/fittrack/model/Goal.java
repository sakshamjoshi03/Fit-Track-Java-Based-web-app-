package com.fittrack.model;

import java.util.UUID;

public class Goal {
    private String id;
    private String name;
    private String type;
    private String category; // "Distance", "Calories", "Steps"
    private double targetValue;
    private String unit;
    private String status; // "active", "completed"
    private String createdDate;
    private String dueDate;

    public Goal() {
        this.id = UUID.randomUUID().toString();
        this.status = "active";
    }

    public Goal(String name, String type, String category, double targetValue, String unit,
                String createdDate, String dueDate) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.type = type;
        this.category = category;
        this.targetValue = targetValue;
        this.unit = unit;
        this.status = "active";
        this.createdDate = createdDate;
        this.dueDate = dueDate;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getTargetValue() { return targetValue; }
    public void setTargetValue(double targetValue) { this.targetValue = targetValue; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
}
