package com.example.disaster_live_alerts.repo;

import com.example.disaster_live_alerts.dto.DisasterNearbyResponseDto;
import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterType;
import com.example.disaster_live_alerts.model.Disaster;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DisasterRepository extends JpaRepository<Disaster, Long> {

    @Query("""
    SELECT new com.example.disaster_live_alerts.dto.DisasterNearbyResponseDto(
        d.id,
        d.title,
        d.description,
        d.severity,
        d.type,
        d.radius,
        d.location.latitude,
        d.location.longitude,
        d.location.city,
        d.location.country,
        d.startTime
    )
    FROM Disaster d
    WHERE function(
        'ST_DWithin',
        d.location.coordinates,
        function('ST_SetSRID',
            function('ST_MakePoint', :lng, :lat),
            4326
        ),
        :rad * 1000.0
    ) = true
    AND (:sev IS NULL OR d.severity = :sev)
    AND (:typ IS NULL OR d.type = :typ)
    """)
    Page<DisasterNearbyResponseDto> getNearbyDisasters(Double lat,
                                                       Double lng,
                                                       Double rad,
                                                       DisasterSeverity sev,
                                                       DisasterType typ,
                                                       Pageable pageable);
}
