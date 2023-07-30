package com.wahyaumau.springbootsqlite.controllers;

import com.wahyaumau.springbootsqlite.entities.Stall;
import com.wahyaumau.springbootsqlite.services.StallService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/stalls")
public class StallController {
    @Autowired
    private StallService stallService;

    @GetMapping("")
    public List<Stall> findAll() {
        return stallService.findAll();
    }

//    @GetMapping("/{id}")
//    public Stall findById(@PathVariable Long id) {
//        return stallService.findById(id);
//    }
//
//    @GetMapping("/search")
//    public List<Stall> search(@RequestParam(required = false) String keyword,
//                              @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date start_time,
//                              @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date end_time) {
////        if (StringUtils.isNotBlank(keyword)) {
////            return stallService.findByNameOrIntroduceOrAddress(keyword);
////        } else if (start_time != null && endTime != null) {
////            return stallService.findByStartTimeBetween(start_time, end_time);
////        } else {
////            return stallService.findAll();
////        }
//        return stallService.findAll();
//    }
//
//    @PostMapping("")
//    public Stall save(@RequestBody Stall stall) {
//        return stallService.save(stall);
//    }
//
//    @PutMapping("/{id}")
//    public Stall update(@PathVariable Long id, @RequestBody Stall stall) {
//        Stall oldStall = stallService.findById(id);
//        if (oldStall == null) {
//            return null;
//        }
//        return stallService.save(oldStall);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteById(@PathVariable Long id) {
//        stallService.deleteById(id);
//    }
}