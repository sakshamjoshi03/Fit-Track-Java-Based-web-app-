package com.fittrack.dto;

public class GoalDto {
    private String id;
    private String name;
    private String type;
    private String category; // "Distance", "Calories", "Steps"
    private double currentValue;
    private double targetValue;
    private double percentage;
    private String unit;
    private String status; // "active", "completed"
    private String createdDate; // "Mar 1"
    private String dueDate; // "Mar 31"
    private int daysRemaining;

    public GoalDto() {}

    public GoalDto(String id, String name, String type, String category, double currentValue,
                   double targetValue, String unit, String status, String createdDate,
                   String dueDate, int daysRemaining) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.category = category;
        this.currentValue = currentValue;
        this.targetValue = targetValue;
        this.percentage = targetValue > 0 ? (currentValue / targetValue) * 100 : 0;
        this.unit = unit;
        this.status = status;
        this.createdDate = createdDate;
        this.dueDate = dueDate;
        this.daysRemaining = daysRemaining;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getCurrentValue() { return currentValue; }
    public void setCurrentValue(double currentValue) { this.currentValue = currentValue; }
    public double getTargetValue() { return targetValue; }
    public void setTargetValue(double targetValue) { this.targetValue = targetValue; }
    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }
    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }
    public int getDaysRemaining() { return daysRemaining; }
    public void setDaysRemaining(int daysRemaining) { this.daysRemaining = daysRemaining; }
}
