package com.fittrack.controller;

import com.fittrack.dto.ActivityDto;
import com.fittrack.service.ActivityHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityHistoryService activityHistoryService;

    public ActivityController(ActivityHistoryService activityHistoryService) {
        this.activityHistoryService = activityHistoryService;
    }

    @GetMapping
    public ResponseEntity<List<ActivityDto>> getAllActivities(
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(activityHistoryService.getAllActivities(type));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<ActivityDto>> getRecentActivities(
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(activityHistoryService.getRecentActivities(limit));
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getActivityStats() {
        return ResponseEntity.ok(activityHistoryService.getActivityStats());
    }

    @PostMapping
    public ResponseEntity<ActivityDto> recordActivity(@RequestBody ActivityDto activity) {
        activityHistoryService.recordActivity(activity);
        return ResponseEntity.ok(activity);
    }
}
