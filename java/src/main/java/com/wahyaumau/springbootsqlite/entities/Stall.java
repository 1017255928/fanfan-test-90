package com.wahyaumau.springbootsqlite.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Date;

@Entity
@Table(name = "stall")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stall {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String introduce;

    @Column(nullable = false)
    private String address;

    @Column(nullable = false)
    private Double priceDays;

    @Column(nullable = false)
    private Double priceHour;

    @Column(nullable = false)
    private String type;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lot;

    @Column(nullable = false)
    private Integer state;

    @Column(nullable = false)
    private Long user_id;

    @Column(nullable = false)
    private Date start_time;

    @Column(nullable = false)
    private Date end_time;

    @Column(nullable = false)
    private String imgs;

    @Column(name = "created_at", updatable = false, nullable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    @JsonProperty("updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    private void onCreate(){
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    private void onUpdate(){
        updatedAt = LocalDateTime.now();
    }
}