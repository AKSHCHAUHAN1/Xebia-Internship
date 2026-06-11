package com.fraud.alert.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_alerts")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class FraudAlertEntity {

    @Id
    @Column(name = "alert_id")
    private String alertId;

    @Column(name = "transaction_id", nullable = false)
    private String transactionId;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "amount", nullable = false)
    private double amount;

    @Column(name = "reason", length = 500)
    private String reason;

    @Column(name = "risk_level", nullable = false)
    private String riskLevel;

    @Column(name = "status", nullable = false)
    private String status;

    @Column(name = "detected_at")
    private LocalDateTime detectedAt;

    @Column(name = "location")
    private String location;

    @Column(name = "transaction_type")
    private String transactionType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
