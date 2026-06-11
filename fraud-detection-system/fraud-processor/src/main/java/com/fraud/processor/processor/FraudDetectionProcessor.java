package com.fraud.processor.processor;

import com.fraud.processor.model.FraudAlert;
import com.fraud.processor.model.Transaction;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.apache.kafka.streams.kstream.Produced;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
@Slf4j
public class FraudDetectionProcessor {

    private static final String INPUT_TOPIC = "transactions";
    private static final String OUTPUT_TOPIC = "fraud-alerts";

    // Fraud detection thresholds
    private static final double HIGH_AMOUNT_THRESHOLD = 10000.0;
    private static final double VERY_HIGH_AMOUNT_THRESHOLD = 50000.0;
    private static final int LATE_NIGHT_START = 0;  // 12 AM
    private static final int LATE_NIGHT_END = 5;    // 5 AM

    @Autowired
    private StreamsBuilder streamsBuilder;

    @Autowired
    private Serde<Transaction> transactionSerde;

    @Autowired
    private Serde<FraudAlert> fraudAlertSerde;

    @PostConstruct
    public void buildPipeline() {
        KStream<String, Transaction> transactions = streamsBuilder.stream(
                INPUT_TOPIC,
                Consumed.with(org.apache.kafka.common.serialization.Serdes.String(), transactionSerde)
        );

        // Log all incoming transactions
        transactions.peek((key, txn) ->
                log.info("📥 Received transaction: {} | User: {} | Amount: ₹{} | Location: {}",
                        txn.getTransactionId(), txn.getUserId(), txn.getAmount(), txn.getLocation())
        );

        // Filter suspicious transactions and create fraud alerts
        KStream<String, FraudAlert> alerts = transactions
                .filter((key, txn) -> isSuspicious(txn))
                .mapValues(txn -> createFraudAlert(txn));

        // Log and send alerts to output topic
        alerts.peek((key, alert) ->
                log.warn("🚨 FRAUD ALERT: {} | Risk: {} | Reason: {} | Amount: ₹{}",
                        alert.getAlertId(), alert.getRiskLevel(), alert.getReason(), alert.getAmount())
        );

        alerts.to(OUTPUT_TOPIC, Produced.with(
                org.apache.kafka.common.serialization.Serdes.String(), fraudAlertSerde
        ));

        log.info("✅ Fraud Detection Pipeline built successfully");
    }

    /**
     * Check if a transaction is suspicious based on multiple rules
     */
    private boolean isSuspicious(Transaction txn) {
        List<String> reasons = new ArrayList<>();

        // Rule 1: High-value transaction
        if (txn.getAmount() > HIGH_AMOUNT_THRESHOLD) {
            return true;
        }

        // Rule 2: Late-night transaction (between 12 AM - 5 AM)
        if (isLateNightTransaction(txn.getTimestamp())) {
            return true;
        }

        // Rule 3: Very high amount transfer
        if ("TRANSFER".equalsIgnoreCase(txn.getTransactionType()) && txn.getAmount() > 5000) {
            return true;
        }

        return false;
    }

    /**
     * Create a FraudAlert from a suspicious transaction
     */
    private FraudAlert createFraudAlert(Transaction txn) {
        List<String> reasons = new ArrayList<>();
        String riskLevel = "LOW";

        // Rule 1: High-value transaction
        if (txn.getAmount() > VERY_HIGH_AMOUNT_THRESHOLD) {
            reasons.add("Very high transaction amount: ₹" + txn.getAmount());
            riskLevel = "HIGH";
        } else if (txn.getAmount() > HIGH_AMOUNT_THRESHOLD) {
            reasons.add("High transaction amount: ₹" + txn.getAmount());
            riskLevel = riskLevel.equals("HIGH") ? "HIGH" : "MEDIUM";
        }

        // Rule 2: Late-night transaction
        if (isLateNightTransaction(txn.getTimestamp())) {
            reasons.add("Late-night transaction detected (12 AM - 5 AM)");
            riskLevel = riskLevel.equals("HIGH") ? "HIGH" : "MEDIUM";
        }

        // Rule 3: High-value transfer
        if ("TRANSFER".equalsIgnoreCase(txn.getTransactionType()) && txn.getAmount() > 5000) {
            reasons.add("High-value transfer: ₹" + txn.getAmount());
            riskLevel = txn.getAmount() > 25000 ? "HIGH" : riskLevel;
        }

        // If no specific reason found, mark as general suspicion
        if (reasons.isEmpty()) {
            reasons.add("General suspicious activity detected");
        }

        return new FraudAlert(
                "ALERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                txn.getTransactionId(),
                txn.getUserId(),
                txn.getAmount(),
                String.join("; ", reasons),
                riskLevel,
                "PENDING",
                LocalDateTime.now().toString(),
                txn.getLocation(),
                txn.getTransactionType()
        );
    }

    /**
     * Check if a transaction occurred during late-night hours (12 AM - 5 AM)
     */
    private boolean isLateNightTransaction(String timestamp) {
        if (timestamp == null || timestamp.isEmpty()) {
            return false;
        }
        try {
            LocalDateTime dateTime = LocalDateTime.parse(timestamp, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
            LocalTime time = dateTime.toLocalTime();
            return time.getHour() >= LATE_NIGHT_START && time.getHour() < LATE_NIGHT_END;
        } catch (DateTimeParseException e) {
            log.warn("Could not parse timestamp: {}", timestamp);
            return false;
        }
    }
}
