package com.wahyaumau.springbootsqlite.services;

import com.wahyaumau.springbootsqlite.entities.Parking;
import com.wahyaumau.springbootsqlite.entities.Reserve;
import com.wahyaumau.springbootsqlite.exceptions.NotFoundException;
import com.wahyaumau.springbootsqlite.models.BaseResponse;
import com.wahyaumau.springbootsqlite.repositories.ReserveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ReserveServices {
    @Autowired
    ReserveRepository repository;

    @Autowired
    ParkingService parkingService;

    public BaseResponse findAll(Map<String, String> params){
        return new BaseResponse("200","", repository.findAll());
    }

    public Reserve findById(long id){
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Author with id " + id +" not found"));
    }

    public BaseResponse update(long id, Reserve test){
        Reserve authorFromDb = findById(id);
        test.setId(authorFromDb.getId());
        test.setCreatedAt(authorFromDb.getCreatedAt());
        return new BaseResponse("200","", repository.save(test));
    }

    public BaseResponse save(Reserve test){
        Parking parking = parkingService.findById(test.getParking_id());
        test.setParking(parking);
        return new BaseResponse("200","", repository.save(test));
    }
}