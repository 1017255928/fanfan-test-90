package com.wahyaumau.springbootsqlite.repositories;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.wahyaumau.springbootsqlite.entities.Stall;

import java.util.Date;
import java.util.List;

@Repository
public interface StallRepository extends JpaRepository<Stall, Long> {
    List<Stall> findByNameContainingOrIntroduceContainingOrAddressContaining(String name, String introduce, String address);
//    List<Stall> findByStart_timeBetween(Date start_time,Date end_time);
}