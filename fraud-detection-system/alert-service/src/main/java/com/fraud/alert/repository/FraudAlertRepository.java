package com.fraud.alert.repository;

import com.fraud.alert.model.FraudAlertEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FraudAlertRepository extends JpaRepository<FraudAlertEntity, String> {

    List<FraudAlertEntity> findByRiskLevel(String riskLevel);

    List<FraudAlertEntity> findByStatus(String status);

    List<FraudAlertEntity> findByUserId(String userId);

    List<FraudAlertEntity> findAllByOrderByDetectedAtDesc();

    long countByRiskLevel(String riskLevel);

    long countByStatus(String status);
}
