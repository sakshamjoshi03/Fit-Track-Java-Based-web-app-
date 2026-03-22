package com.fittrack.service;

import com.fittrack.dto.ProfileDto;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    private ProfileDto profile;

    public ProfileService() {
        // Default profile matching the mockup
        this.profile = new ProfileDto(
                "Alex Runner",
                "alex@fittrack.app",
                "San Francisco, CA",
                28,
                "Casual runner and trekking enthusiast. Tracking my fitness journey one step at a time.",
                72, 178, 62, "metric"
        );
    }

    public ProfileDto getProfile() {
        return profile;
    }

    public ProfileDto updateProfile(ProfileDto updated) {
        if (updated.getName() != null) profile.setName(updated.getName());
        if (updated.getEmail() != null) profile.setEmail(updated.getEmail());
        if (updated.getLocation() != null) profile.setLocation(updated.getLocation());
        if (updated.getAge() > 0) profile.setAge(updated.getAge());
        if (updated.getBio() != null) profile.setBio(updated.getBio());
        if (updated.getWeightKg() > 0) profile.setWeightKg(updated.getWeightKg());
        if (updated.getHeightCm() > 0) profile.setHeightCm(updated.getHeightCm());
        if (updated.getRestingHR() > 0) profile.setRestingHR(updated.getRestingHR());
        if (updated.getUnits() != null) profile.setUnits(updated.getUnits());
        return profile;
    }
}
