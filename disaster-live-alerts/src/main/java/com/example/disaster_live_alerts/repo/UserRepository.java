package com.example.disaster_live_alerts.repo;

import com.example.disaster_live_alerts.dto.UserActivationDto;
import com.example.disaster_live_alerts.dto.UserResponseDto;
import com.example.disaster_live_alerts.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Modifying
    @Query("""
    UPDATE User u SET u.isActive = :b
    WHERE u.id = :userId
    """)
    void setIsActive(int userId, boolean b);

    @Query("""
    SELECT TRUE FROM User u WHERE u.email = :email
    """)
    Boolean existsByEmail(String email);

    Optional<User> findByEmail(String email);

    @Query("""
    SELECT new com.example.disaster_live_alerts.dto.UserActivationDto(u.id, u.email, u.isActive, u.role)
    FROM User u
    """)
    Page<UserActivationDto> findAllPaginated(Pageable pageable);
}
