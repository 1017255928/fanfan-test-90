package com.wahyaumau.springbootsqlite.entities;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "reserve")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reserve {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @ManyToOne
    @JoinColumn(name = "parking_id")
    @JsonIgnoreProperties(value = {"reserve"})
    private Parking parking;

    @Transient
    @JsonProperty("parking_id")
    private long parking_id;

    private String user_id;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+0")
    private Date start_time;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+0")
    private Date end_time;
    private String service_change;
    private String bank_card;
    private String bank_name;
    private String bank_code;
    private String bank_time;
    private String price;
    private String integral;
    private String type; // hour小时 sky天
    private String total_prices;
    private String state; // 1预定 2拒绝预定 3取消预定 4预定成功 5评论成功

    private String comment;
    private String star;

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

    public long getParking_id(){
        if(parking == null){
            return parking_id;
        }
        return parking.getId();
    }
}
