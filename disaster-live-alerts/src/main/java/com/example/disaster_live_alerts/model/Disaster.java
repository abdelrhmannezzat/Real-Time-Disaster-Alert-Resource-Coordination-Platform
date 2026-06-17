package com.example.disaster_live_alerts.model;


import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterSource;
import com.example.disaster_live_alerts.enums.DisasterStatus;
import com.example.disaster_live_alerts.enums.DisasterType;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "disaster")
public class Disaster {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    private Long id;

    @JoinColumn(name = "created_by_user_id", nullable = true)
    @ManyToOne(fetch = FetchType.EAGER)
    private User createdBy;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private DisasterType type;

    @Column(nullable = false)
    private DisasterSeverity severity;

    @Column(nullable = false)
    private DisasterSource source;

    @Column(nullable = false)
    private DisasterStatus status;

    @Column(nullable = false)
    private Double radius;

    @OneToOne(fetch = FetchType.EAGER)
    private Location location;

    @Column(name = "external_id", nullable = false, unique = true)
    private String externalId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = true)
    private LocalDateTime endTime;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
