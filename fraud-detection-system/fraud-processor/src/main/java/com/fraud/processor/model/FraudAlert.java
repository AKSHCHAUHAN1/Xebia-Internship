package com.fraud.processor.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FraudAlert {
    private String alertId;
    private String transactionId;
    private String userId;
    private double amount;
    private String reason;
    private String riskLevel;   // HIGH, MEDIUM, LOW
    private String status;      // PENDING, REVIEWED, RESOLVED
    private String detectedAt;
    private String location;
    private String transactionType;
}
