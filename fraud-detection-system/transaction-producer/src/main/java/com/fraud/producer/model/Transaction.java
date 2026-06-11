package com.fraud.producer.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Transaction {
    private String transactionId;
    private String userId;
    private double amount;
    private String merchantId;
    private String location;
    private String timestamp;
    private String transactionType; // PURCHASE, WITHDRAWAL, TRANSFER
}
