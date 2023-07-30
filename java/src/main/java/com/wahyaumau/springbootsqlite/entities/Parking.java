package com.wahyaumau.springbootsqlite.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "parking")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Parking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String name;
    private String description;
    private String address;
    private String latitude;
    private String longitude;
    private String images;
    private String user_id;
    private String price_per_day;
    private String price_per_hour;
    private String standard; //停放标准
    @Column(nullable = false)
    private Date start_time;

    @Column(nullable = false)
    private Date end_time;
    private String to_access;
    private String size; //停放标准 比如12*12
    private String visible; //

    @OneToMany(mappedBy = "parking")
    @JsonIgnoreProperties(value = {"parking", "parking_id"})
    List<Reserve> reserve = new ArrayList<>();

    @Column(name = "created_at", updatable = false, nullable = false)
    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at", updatable = false, nullable = false)
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
