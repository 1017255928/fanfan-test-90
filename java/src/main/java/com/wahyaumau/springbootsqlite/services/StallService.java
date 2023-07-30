package com.wahyaumau.springbootsqlite.services;

import com.wahyaumau.springbootsqlite.entities.Stall;
import com.wahyaumau.springbootsqlite.repositories.StallRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class StallService {
    @Autowired
    private StallRepository stallRepository;

    public List<Stall> findAll() {
        return stallRepository.findAll();
    }

//    public Stall findById(Long id) {
//        return stallRepository.findById(id).orElse(null);
//    }
//
//    public List<Stall> findByNameOrIntroduceOrAddress(String keyword) {
//        return stallRepository.findByNameContainingOrIntroduceContainingOrAddressContaining(keyword, keyword, keyword);
//    }
//
//    public List<Stall> findByStartTimeBetween(Date start_time, Date end_time) {
//        return stallRepository.findByStartTimeBetween(start_time, end_time);
//    }
//
//    public Stall save(Stall stall) {
//        return stallRepository.save(stall);
//    }
//
//    public void deleteById(Long id) {
//        stallRepository.deleteById(id);
//    }
}