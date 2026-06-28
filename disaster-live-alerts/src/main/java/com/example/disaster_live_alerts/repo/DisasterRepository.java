package com.example.disaster_live_alerts.repo;

import com.example.disaster_live_alerts.model.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DisasterRepository extends JpaRepository<Disaster, Long> {

}
