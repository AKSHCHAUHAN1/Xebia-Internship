package com.fraud.producer.controller;

import com.fraud.producer.model.Transaction;
import com.fraud.producer.service.TransactionProducerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
@Slf4j
public class TransactionController {

    @Autowired
    private TransactionProducerService producerService;

    /**
     * Submit a new transaction to Kafka
     * POST /api/transactions
     */
    @PostMapping
    public ResponseEntity<Map<String, String>> createTransaction(@RequestBody Transaction transaction) {
        // Generate transaction ID if not provided
        if (transaction.getTransactionId() == null || transaction.getTransactionId().isEmpty()) {
            transaction.setTransactionId("TXN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        }

        // Set timestamp if not provided
        if (transaction.getTimestamp() == null || transaction.getTimestamp().isEmpty()) {
            transaction.setTimestamp(LocalDateTime.now().toString());
        }

        log.info("Received transaction request: {}", transaction);
        producerService.sendTransaction(transaction);

        Map<String, String> response = new HashMap<>();
        response.put("status", "ACCEPTED");
        response.put("transactionId", transaction.getTransactionId());
        response.put("message", "Transaction sent to Kafka for processing");

        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "transaction-producer");
        return ResponseEntity.ok(response);
    }
}
