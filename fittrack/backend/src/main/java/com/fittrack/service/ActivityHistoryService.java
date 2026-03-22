package com.fittrack.service;

import com.fittrack.dto.ActivityDto;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.TimeUnit;


@Service
public class ActivityHistoryService {

    private final List<ActivityDto> activities = Collections.synchronizedList(new ArrayList<>());

    @PostConstruct
    public void seedData() {
        long now = System.currentTimeMillis();
        long day = 86400000L;

        addSeedActivity("Morning Sprint", "Running", 10.24, 2678, 165, 124, 680, 4.36, now - day, true);
        addSeedActivity("Evening Run", "Running", 8.42, 2292, 158, 89, 540, 4.53, now - 2 * day, false);
        addSeedActivity("Recovery Walk", "Walking", 3.10, 1920, 98, 12, 180, 10.32, now - 3 * day, false);
        addSeedActivity("Hill Trek", "Trekking", 12.50, 8100, 142, 480, 920, 10.80, now - 4 * day, false);
        addSeedActivity("Interval Training", "Running", 6.00, 1590, 172, 34, 420, 4.42, now - 5 * day, true);
        addSeedActivity("Coastal Ride", "Cycling", 28.40, 3720, 148, 210, 780, 0, now - 6 * day, false);
        addSeedActivity("Park Walk", "Walking", 4.20, 2520, 92, 8, 210, 10.00, now - 7 * day, false);
        addSeedActivity("Trail Run", "Running", 9.80, 3120, 162, 340, 720, 5.31, now - 8 * day, false);
        addSeedActivity("City Jog", "Running", 5.50, 1800, 155, 20, 380, 5.45, now - 9 * day, false);
        addSeedActivity("Mountain Hike", "Trekking", 15.00, 10800, 135, 620, 1100, 12.00, now - 10 * day, false);
        addSeedActivity("Speed Run", "Running", 3.00, 780, 178, 15, 280, 4.33, now - 11 * day, true);
        addSeedActivity("Evening Stroll", "Walking", 2.80, 1680, 88, 5, 140, 10.00, now - 12 * day, false);
    }

    private void addSeedActivity(String name, String type, double distance, long duration,
                                  int hr, double elevation, double calories, double pace,
                                  long timestamp, boolean pr) {
        ActivityDto a = new ActivityDto();
        a.setId(UUID.randomUUID().toString());
        a.setName(name);
        a.setType(type);
        a.setDistanceKm(distance);
        a.setDurationSeconds(duration);
        a.setHeartRateBpm(hr);
        a.setElevationMeters(elevation);
        a.setCaloriesKcal(calories);
        a.setPaceMinPerKm(pace);
        a.setTimestamp(timestamp);
        a.setPersonalRecord(pr);
        a.setDateFormatted(formatDate(timestamp));
        activities.add(a);
    }

    public void recordActivity(ActivityDto activity) {
        if (activity.getId() == null) activity.setId(UUID.randomUUID().toString());
        if (activity.getDateFormatted() == null) activity.setDateFormatted(formatDate(activity.getTimestamp()));
        activities.add(activity);
    }

    public List<ActivityDto> getRecentActivities(int limit) {
        long now = System.currentTimeMillis();
        return activities.stream()
                .sorted(Comparator.comparingLong(ActivityDto::getTimestamp).reversed())
                .limit(limit)
                .peek(a -> a.setTimeAgo(computeTimeAgo(now, a.getTimestamp())))
                .toList();
    }

    public List<ActivityDto> getAllActivities(String typeFilter) {
        long now = System.currentTimeMillis();
        return activities.stream()
                .filter(a -> typeFilter == null || typeFilter.isEmpty() || typeFilter.equalsIgnoreCase(a.getType()))
                .sorted(Comparator.comparingLong(ActivityDto::getTimestamp).reversed())
                .peek(a -> a.setTimeAgo(computeTimeAgo(now, a.getTimestamp())))
                .toList();
    }

    public Map<String, Object> getActivityStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalActivities", activities.size());
        stats.put("totalDistanceKm", activities.stream().mapToDouble(ActivityDto::getDistanceKm).sum());
        stats.put("totalCaloriesKcal", activities.stream().mapToDouble(ActivityDto::getCaloriesKcal).sum());
        stats.put("personalRecords", activities.stream().filter(ActivityDto::isPersonalRecord).count());
        return stats;
    }

    public List<ActivityDto> getActivitiesInRange(long fromTimestamp, long toTimestamp) {
        return activities.stream()
                .filter(a -> a.getTimestamp() >= fromTimestamp && a.getTimestamp() <= toTimestamp)
                .sorted(Comparator.comparingLong(ActivityDto::getTimestamp))
                .toList();
    }

    private String computeTimeAgo(long now, long timestamp) {
        long diffMs = now - timestamp;
        long days = TimeUnit.MILLISECONDS.toDays(diffMs);
        if (days == 0) return "Today";
        if (days == 1) return "Yesterday";
        return days + " Days Ago";
    }

    private String formatDate(long timestamp) {
        SimpleDateFormat sdf = new SimpleDateFormat("MMM dd, yyyy", Locale.US);
        return sdf.format(new Date(timestamp));
    }
}
