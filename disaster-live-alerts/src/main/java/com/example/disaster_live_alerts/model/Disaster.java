package com.example.disaster_live_alerts.model;


import com.example.disaster_live_alerts.enums.DisasterSeverity;
import com.example.disaster_live_alerts.enums.DisasterSource;
import com.example.disaster_live_alerts.enums.DisasterStatus;
import com.example.disaster_live_alerts.enums.DisasterType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "disaster")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
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
    @Enumerated(EnumType.STRING)
    private DisasterType type;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DisasterSeverity severity;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DisasterSource source;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DisasterStatus status;

    @Column(nullable = false)
    private Double radius;

    @OneToOne(fetch = FetchType.EAGER)
    private Location location;

    @Column(name = "external_id", nullable = true, unique = true)
    private String externalId;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = true)
    private LocalDateTime endTime;

    @Builder.Default
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();
}
