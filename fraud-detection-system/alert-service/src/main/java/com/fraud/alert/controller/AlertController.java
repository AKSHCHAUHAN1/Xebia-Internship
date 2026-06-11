package com.fraud.alert.controller;

import com.fraud.alert.model.FraudAlertEntity;
import com.fraud.alert.service.AlertService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
@Slf4j
public class AlertController {

    @Autowired
    private AlertService alertService;

    /**
     * GET /api/alerts — Get all alerts (sorted by detected time, newest first)
     */
    @GetMapping
    public ResponseEntity<List<FraudAlertEntity>> getAllAlerts() {
        return ResponseEntity.ok(alertService.getAllAlerts());
    }

    /**
     * GET /api/alerts/{id} — Get alert by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<FraudAlertEntity> getAlertById(@PathVariable String id) {
        return alertService.getAlertById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/alerts/risk/{level} — Get alerts by risk level
     */
    @GetMapping("/risk/{level}")
    public ResponseEntity<List<FraudAlertEntity>> getAlertsByRiskLevel(@PathVariable String level) {
        return ResponseEntity.ok(alertService.getAlertsByRiskLevel(level.toUpperCase()));
    }

    /**
     * GET /api/alerts/status/{status} — Get alerts by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<FraudAlertEntity>> getAlertsByStatus(@PathVariable String status) {
        return ResponseEntity.ok(alertService.getAlertsByStatus(status.toUpperCase()));
    }

    /**
     * PUT /api/alerts/{id}/status — Update alert status (REVIEWED / RESOLVED)
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<FraudAlertEntity> updateAlertStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String status = body.get("status");
        if (status == null || status.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        try {
            FraudAlertEntity updated = alertService.updateAlertStatus(id, status.toUpperCase());
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * GET /api/alerts/stats — Get fraud statistics
     */
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(alertService.getStats());
    }
}
