package com.fittrack.controller;

import com.fittrack.dto.ProgressDto;
import com.fittrack.service.ProgressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {

    private final ProgressService progressService;

    public ProgressController(ProgressService progressService) {
        this.progressService = progressService;
    }

    @GetMapping
    public ResponseEntity<ProgressDto> getProgress(
            @RequestParam(defaultValue = "weekly") String period) {
        return ResponseEntity.ok(progressService.getProgressData(period));
    }
}
