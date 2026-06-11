package com.fraud.producer.service;

import com.fraud.producer.model.Transaction;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
public class TransactionProducerService {

    private static final String TOPIC = "transactions";

    @Autowired
    private KafkaTemplate<String, Transaction> kafkaTemplate;

    public void sendTransaction(Transaction transaction) {
        log.info("Sending transaction to Kafka: {}", transaction.getTransactionId());

        CompletableFuture<SendResult<String, Transaction>> future =
                kafkaTemplate.send(TOPIC, transaction.getTransactionId(), transaction);

        future.whenComplete((result, ex) -> {
            if (ex == null) {
                log.info("Transaction sent successfully: {} | Partition: {} | Offset: {}",
                        transaction.getTransactionId(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            } else {
                log.error("Failed to send transaction: {}", transaction.getTransactionId(), ex);
            }
        });
    }
}
