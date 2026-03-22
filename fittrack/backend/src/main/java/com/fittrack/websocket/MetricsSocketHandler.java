package com.fittrack.websocket;

import com.fittrack.dto.MetricsSummaryDto;
import com.fittrack.service.GeolocationService;
import com.fittrack.service.HealthConnectService;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
public class MetricsSocketHandler {

    private final SimpMessagingTemplate messagingTemplate;
    private final HealthConnectService healthConnectService;
    private final GeolocationService geolocationService;

    public MetricsSocketHandler(SimpMessagingTemplate messagingTemplate,
                                 HealthConnectService healthConnectService,
                                 GeolocationService geolocationService) {
        this.messagingTemplate = messagingTemplate;
        this.healthConnectService = healthConnectService;
        this.geolocationService = geolocationService;
    }

    @Scheduled(fixedDelayString = "${app.tracking.steps-sync-interval-ms}")
    public void pushMetricsUpdate() {
        MetricsSummaryDto summary = healthConnectService.buildLiveSummary();
        messagingTemplate.convertAndSend("/topic/metrics", summary);
    }

    @Scheduled(fixedDelayString = "${app.tracking.location-poll-interval-ms}")
    public void pushLocationUpdate() {
        if (geolocationService.hasActiveSession()) {
            List<double[]> route = geolocationService.getActiveRoute();
            messagingTemplate.convertAndSend("/topic/route", Map.of(
                    "points", route,
                    "active", true,
                    "timestamp", System.currentTimeMillis()
            ));
        }
    }
}
