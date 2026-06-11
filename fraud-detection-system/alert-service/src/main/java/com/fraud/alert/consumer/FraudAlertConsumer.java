package com.fraud.alert.consumer;

import com.fraud.alert.model.FraudAlertDTO;
import com.fraud.alert.model.FraudAlertEntity;
import com.fraud.alert.repository.FraudAlertRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

@Service
@Slf4j
public class FraudAlertConsumer {

    @Autowired
    private FraudAlertRepository repository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @KafkaListener(topics = "fraud-alerts", groupId = "alert-consumer-group")
    public void consume(FraudAlertDTO alert) {
        log.info("🚨 Received fraud alert: {} | Risk: {} | Amount: ₹{}",
                alert.getAlertId(), alert.getRiskLevel(), alert.getAmount());

        // Map DTO to Entity
        FraudAlertEntity entity = new FraudAlertEntity();
        entity.setAlertId(alert.getAlertId());
        entity.setTransactionId(alert.getTransactionId());
        entity.setUserId(alert.getUserId());
        entity.setAmount(alert.getAmount());
        entity.setReason(alert.getReason());
        entity.setRiskLevel(alert.getRiskLevel());
        entity.setStatus(alert.getStatus());
        entity.setLocation(alert.getLocation());
        entity.setTransactionType(alert.getTransactionType());

        // Parse detected time
        try {
            entity.setDetectedAt(LocalDateTime.parse(alert.getDetectedAt()));
        } catch (DateTimeParseException e) {
            entity.setDetectedAt(LocalDateTime.now());
        }

        // Save to PostgreSQL
        repository.save(entity);
        log.info("✅ Alert saved to database: {}", alert.getAlertId());

        // Push real-time update to dashboard via WebSocket
        messagingTemplate.convertAndSend("/topic/alerts", alert);
        log.info("📡 Alert pushed to WebSocket: {}", alert.getAlertId());
    }
}
