package com.fittrack.controller;

import com.fittrack.dto.GoalDto;
import com.fittrack.model.Goal;
import com.fittrack.service.GoalsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/goals")
public class GoalsController {

    private final GoalsService goalsService;

    public GoalsController(GoalsService goalsService) {
        this.goalsService = goalsService;
    }

    @GetMapping
    public ResponseEntity<List<GoalDto>> getAllGoals() {
        return ResponseEntity.ok(goalsService.getAllGoals());
    }

    @PostMapping
    public ResponseEntity<GoalDto> createGoal(@RequestBody Goal goal) {
        return ResponseEntity.ok(goalsService.createGoal(goal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GoalDto> updateGoal(@PathVariable String id, @RequestBody Map<String, Object> body) {
        double newTarget = ((Number) body.get("targetValue")).doubleValue();
        GoalDto updated = goalsService.updateGoal(id, newTarget);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGoal(@PathVariable String id) {
        boolean deleted = goalsService.deleteGoal(id);
        return deleted ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getGoalStats() {
        return ResponseEntity.ok(goalsService.getGoalStats());
    }

    @GetMapping("/daily/steps")
    public ResponseEntity<GoalDto> getDailyStepsGoal() {
        GoalDto goal = goalsService.getDailyStepsGoal();
        return goal != null ? ResponseEntity.ok(goal) : ResponseEntity.noContent().build();
    }

    @GetMapping("/weekly/distance")
    public ResponseEntity<GoalDto> getWeeklyDistanceGoal() {
        GoalDto goal = goalsService.getWeeklyDistanceGoal();
        return goal != null ? ResponseEntity.ok(goal) : ResponseEntity.noContent().build();
    }
}
