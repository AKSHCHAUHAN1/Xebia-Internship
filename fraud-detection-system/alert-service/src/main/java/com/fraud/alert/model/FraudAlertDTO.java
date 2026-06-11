package com.fraud.alert.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FraudAlertDTO {
    private String alertId;
    private String transactionId;
    private String userId;
    private double amount;
    private String reason;
    private String riskLevel;
    private String status;
    private String detectedAt;
    private String location;
    private String transactionType;
}
