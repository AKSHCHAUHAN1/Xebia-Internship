package com.fraud.alert.service;

import com.fraud.alert.model.FraudAlertEntity;
import com.fraud.alert.repository.FraudAlertRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
public class AlertService {

    @Autowired
    private FraudAlertRepository repository;

    public List<FraudAlertEntity> getAllAlerts() {
        return repository.findAllByOrderByDetectedAtDesc();
    }

    public Optional<FraudAlertEntity> getAlertById(String id) {
        return repository.findById(id);
    }

    public List<FraudAlertEntity> getAlertsByRiskLevel(String riskLevel) {
        return repository.findByRiskLevel(riskLevel);
    }

    public List<FraudAlertEntity> getAlertsByStatus(String status) {
        return repository.findByStatus(status);
    }

    public FraudAlertEntity updateAlertStatus(String id, String status) {
        Optional<FraudAlertEntity> optionalAlert = repository.findById(id);
        if (optionalAlert.isPresent()) {
            FraudAlertEntity alert = optionalAlert.get();
            alert.setStatus(status);
            repository.save(alert);
            log.info("Alert {} status updated to {}", id, status);
            return alert;
        }
        throw new RuntimeException("Alert not found: " + id);
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAlerts", repository.count());
        stats.put("highRisk", repository.countByRiskLevel("HIGH"));
        stats.put("mediumRisk", repository.countByRiskLevel("MEDIUM"));
        stats.put("lowRisk", repository.countByRiskLevel("LOW"));
        stats.put("pending", repository.countByStatus("PENDING"));
        stats.put("reviewed", repository.countByStatus("REVIEWED"));
        stats.put("resolved", repository.countByStatus("RESOLVED"));
        return stats;
    }
}
