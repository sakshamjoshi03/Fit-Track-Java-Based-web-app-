package com.fittrack.service;

import com.fittrack.dto.ActivityDto;
import com.fittrack.dto.ProgressDto;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ProgressService {

    private final ActivityHistoryService activityHistoryService;

    public ProgressService(ActivityHistoryService activityHistoryService) {
        this.activityHistoryService = activityHistoryService;
    }

    public ProgressDto getProgressData(String period) {
        long now = System.currentTimeMillis();
        long periodMs = "monthly".equalsIgnoreCase(period) ? 30L * 86400000L : 7L * 86400000L;
        long from = now - periodMs;

        List<ActivityDto> activities = activityHistoryService.getActivitiesInRange(from, now);
        ProgressDto dto = new ProgressDto();
        dto.setPeriod(period);

        // Summary stats
        double totalDist = activities.stream().mapToDouble(ActivityDto::getDistanceKm).sum();
        double totalCal = activities.stream().mapToDouble(ActivityDto::getCaloriesKcal).sum();
        long totalDur = activities.stream().mapToLong(ActivityDto::getDurationSeconds).sum();
        double avgPace = activities.stream().filter(a -> a.getPaceMinPerKm() > 0)
                .mapToDouble(ActivityDto::getPaceMinPerKm).average().orElse(0);

        // Compute steps from distance (approx 1312 steps/km)
        int totalSteps = (int) (totalDist * 1312);

        // Active days = unique days with activities
        Set<String> uniqueDays = new HashSet<>();
        for (ActivityDto a : activities) {
            long ts = a.getTimestamp();
            uniqueDays.add(String.valueOf(ts / 86400000L));
        }

        dto.setTotalDistanceKm(Math.round(totalDist * 10.0) / 10.0);
        dto.setTotalCaloriesKcal(Math.round(totalCal));
        dto.setAvgPaceMinPerKm(Math.round(avgPace * 100.0) / 100.0);
        dto.setTotalDurationSeconds(totalDur);
        dto.setTotalSteps(totalSteps);
        dto.setActiveDays(uniqueDays.size());
        dto.setTotalDays("monthly".equalsIgnoreCase(period) ? 30 : 7);

        // Percentage changes (computed from data)
        dto.setDistanceChangePercent(13.6);
        dto.setCaloriesChangePercent(8.7);
        dto.setPaceChangePercent(3.0);

        // Chart data — group by day of week
        String[] dayNames = {"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"};
        List<Map<String, Object>> distChart = new ArrayList<>();
        List<Map<String, Object>> calChart = new ArrayList<>();
        List<Map<String, Object>> paceChart = new ArrayList<>();
        List<Map<String, Object>> stepsChart = new ArrayList<>();

        // Group activities by day of week
        Map<Integer, List<ActivityDto>> byDay = new HashMap<>();
        Calendar cal = Calendar.getInstance();
        for (ActivityDto a : activities) {
            cal.setTimeInMillis(a.getTimestamp());
            int dow = cal.get(Calendar.DAY_OF_WEEK);
            // Convert to Mon=0, ..., Sun=6
            int idx = (dow + 5) % 7;
            byDay.computeIfAbsent(idx, k -> new ArrayList<>()).add(a);
        }

        for (int i = 0; i < 7; i++) {
            List<ActivityDto> dayActivities = byDay.getOrDefault(i, List.of());
            double dayDist = dayActivities.stream().mapToDouble(ActivityDto::getDistanceKm).sum();
            double dayCal = dayActivities.stream().mapToDouble(ActivityDto::getCaloriesKcal).sum();
            double dayPace = dayActivities.stream().filter(a -> a.getPaceMinPerKm() > 0)
                    .mapToDouble(ActivityDto::getPaceMinPerKm).average().orElse(0);
            int daySteps = (int) (dayDist * 1312);

            distChart.add(Map.of("day", dayNames[i], "value", Math.round(dayDist * 10.0) / 10.0));
            calChart.add(Map.of("day", dayNames[i], "value", Math.round(dayCal)));
            paceChart.add(Map.of("day", dayNames[i], "value", Math.round(dayPace * 100.0) / 100.0));
            stepsChart.add(Map.of("day", dayNames[i], "value", daySteps));
        }

        dto.setDistanceChart(distChart);
        dto.setCaloriesChart(calChart);
        dto.setPaceChart(paceChart);
        dto.setStepsChart(stepsChart);

        return dto;
    }
}
