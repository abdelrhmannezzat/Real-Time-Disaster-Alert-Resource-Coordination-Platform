package com.example.disaster_live_alerts.repo;

import com.example.disaster_live_alerts.model.Location;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LocationRepository extends JpaRepository<Location, Long> {

}
