package com.fittrack.controller;

import com.fittrack.dto.MetricsSummaryDto;
import com.fittrack.service.HealthConnectService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class MetricsController {

    private final HealthConnectService healthConnectService;
    private final SimpMessagingTemplate messagingTemplate;

    public MetricsController(HealthConnectService healthConnectService, SimpMessagingTemplate messagingTemplate) {
        this.healthConnectService = healthConnectService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/metrics/summary")
    public ResponseEntity<MetricsSummaryDto> getMetricsSummary() {
        return ResponseEntity.ok(healthConnectService.buildLiveSummary());
    }

    // Health Connect sync endpoints — each pushes update to WebSocket immediately
    @PostMapping("/health/sync/steps")
    public ResponseEntity<Map<String, String>> syncSteps(@RequestBody Map<String, Object> body) {
        int steps = ((Number) body.get("steps")).intValue();
        healthConnectService.syncSteps(steps);
        pushMetricsUpdate();
        return ResponseEntity.ok(Map.of("status", "synced", "metric", "steps"));
    }

    @PostMapping("/health/sync/distance")
    public ResponseEntity<Map<String, String>> syncDistance(@RequestBody Map<String, Object> body) {
        double meters = ((Number) body.get("distanceMeters")).doubleValue();
        healthConnectService.syncDistance(meters);
        pushMetricsUpdate();
        return ResponseEntity.ok(Map.of("status", "synced", "metric", "distance"));
    }

    @PostMapping("/health/sync/activeTime")
    public ResponseEntity<Map<String, String>> syncActiveTime(@RequestBody Map<String, Object> body) {
        long seconds = ((Number) body.get("activeSeconds")).longValue();
        healthConnectService.syncActiveTime(seconds);
        pushMetricsUpdate();
        return ResponseEntity.ok(Map.of("status", "synced", "metric", "activeTime"));
    }

    @PostMapping("/health/sync/heartRate")
    public ResponseEntity<Map<String, String>> syncHeartRate(@RequestBody Map<String, Object> body) {
        int bpm = ((Number) body.get("bpm")).intValue();
        healthConnectService.syncHeartRate(bpm);
        pushMetricsUpdate();
        return ResponseEntity.ok(Map.of("status", "synced", "metric", "heartRate"));
    }

    @PostMapping("/health/sync/elevation")
    public ResponseEntity<Map<String, String>> syncElevation(@RequestBody Map<String, Object> body) {
        double meters = ((Number) body.get("elevationMeters")).doubleValue();
        healthConnectService.syncElevation(meters);
        pushMetricsUpdate();
        return ResponseEntity.ok(Map.of("status", "synced", "metric", "elevation"));
    }

    private void pushMetricsUpdate() {
        MetricsSummaryDto summary = healthConnectService.buildLiveSummary();
        messagingTemplate.convertAndSend("/topic/metrics", summary);
    }
}
