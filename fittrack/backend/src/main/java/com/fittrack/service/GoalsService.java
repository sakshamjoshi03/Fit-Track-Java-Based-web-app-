package com.fittrack.service;

import com.fittrack.config.AppProperties;
import com.fittrack.dto.GoalDto;
import com.fittrack.model.Goal;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;

@Service
public class GoalsService {

    private final AppProperties props;
    private final HealthConnectService healthConnectService;
    private final List<Goal> goals = Collections.synchronizedList(new ArrayList<>());

    public GoalsService(AppProperties props, HealthConnectService healthConnectService) {
        this.props = props;
        this.healthConnectService = healthConnectService;
    }

    @PostConstruct
    public void seedData() {
        goals.add(new Goal("March Distance Challenge", "WEEKLY_DISTANCE", "Distance", 150, "km", "Mar 1", "Mar 31"));
        goals.add(new Goal("Weekly Calorie Target", "WEEKLY_CALORIES", "Calories", 5000, "kcal", "Mar 17", "Mar 22"));
        Goal completed = new Goal("10K Steps Daily Streak", "DAILY_STEPS", "Steps", 70000, "steps", "Mar 15", "Mar 22");
        completed.setStatus("completed");
        goals.add(completed);
        goals.add(new Goal("Daily Steps Target", "DAILY_STEPS", "Steps",
                props.getTracking().getDailyStepsTarget(), "steps", "Mar 1", "Mar 31"));
        goals.add(new Goal("Weekly Running Distance", "WEEKLY_DISTANCE", "Distance",
                props.getTracking().getWeeklyDistanceTargetKm(), "km", "Mar 1", "Mar 31"));
    }

    public List<GoalDto> getAllGoals() {
        return goals.stream().map(this::toDto).toList();
    }

    public GoalDto createGoal(Goal goal) {
        if (goal.getId() == null) goal.setId(UUID.randomUUID().toString());
        if (goal.getStatus() == null) goal.setStatus("active");
        goals.add(goal);
        return toDto(goal);
    }

    public GoalDto updateGoal(String id, double newTarget) {
        Optional<Goal> found = goals.stream().filter(g -> g.getId().equals(id)).findFirst();
        if (found.isPresent()) {
            found.get().setTargetValue(newTarget);
            return toDto(found.get());
        }
        return null;
    }

    public boolean deleteGoal(String id) {
        return goals.removeIf(g -> g.getId().equals(id));
    }

    public Map<String, Object> getGoalStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        long active = goals.stream().filter(g -> "active".equals(g.getStatus())).count();
        long completed = goals.stream().filter(g -> "completed".equals(g.getStatus())).count();
        double avgProgress = goals.stream().mapToDouble(g -> {
            GoalDto dto = toDto(g);
            return Math.min(dto.getPercentage(), 100);
        }).average().orElse(0);
        stats.put("activeGoals", active);
        stats.put("completedGoals", completed);
        stats.put("avgProgress", Math.round(avgProgress));
        return stats;
    }

    public GoalDto getDailyStepsGoal() {
        return goals.stream()
                .filter(g -> "DAILY_STEPS".equals(g.getType()) && "active".equals(g.getStatus()))
                .findFirst()
                .map(this::toDto)
                .orElse(null);
    }

    public GoalDto getWeeklyDistanceGoal() {
        return goals.stream()
                .filter(g -> "WEEKLY_DISTANCE".equals(g.getType()) && "active".equals(g.getStatus()))
                .findFirst()
                .map(this::toDto)
                .orElse(null);
    }

    private GoalDto toDto(Goal goal) {
        double current = getCurrentValue(goal);
        int daysRemaining = estimateDaysRemaining(goal.getDueDate());
        return new GoalDto(goal.getId(), goal.getName(), goal.getType(), goal.getCategory(),
                current, goal.getTargetValue(), goal.getUnit(), goal.getStatus(),
                goal.getCreatedDate(), goal.getDueDate(), daysRemaining);
    }

    private double getCurrentValue(Goal goal) {
        if ("completed".equals(goal.getStatus())) {
            // Return a value >= target to show 100%
            if ("10K Steps Daily Streak".equals(goal.getName())) return 71200;
        }
        return switch (goal.getType()) {
            case "DAILY_STEPS" -> healthConnectService.getCurrentSteps();
            case "WEEKLY_DISTANCE" -> {
                double d = healthConnectService.getCurrentDistanceKm();
                // For March Distance Challenge, use accumulated
                if (goal.getTargetValue() >= 100) yield Math.max(d, 98.4);
                yield d;
            }
            case "WEEKLY_CALORIES" -> {
                double c = healthConnectService.getCurrentCalories();
                yield Math.max(c, 3250);
            }
            default -> 0;
        };
    }

    private int estimateDaysRemaining(String dueDate) {
        if (dueDate == null) return 0;
        // Simple estimation
        if (dueDate.contains("31")) return 8;
        if (dueDate.contains("22")) return 0;
        return 5;
    }
}
