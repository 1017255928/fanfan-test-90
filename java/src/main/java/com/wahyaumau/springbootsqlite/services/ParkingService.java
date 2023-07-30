package com.wahyaumau.springbootsqlite.services;

import com.wahyaumau.springbootsqlite.entities.Parking;
import com.wahyaumau.springbootsqlite.entities.Reserve;
import com.wahyaumau.springbootsqlite.exceptions.NotFoundException;
import com.wahyaumau.springbootsqlite.models.BaseResponse;
import com.wahyaumau.springbootsqlite.repositories.ParkingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.*;

@Service
public class ParkingService {
    @Autowired
    ParkingRepository repository;

    public BaseResponse findAll(Map<String, String> test){
        List<Parking> result = null;
        System.out.println(test);
        if(test.get("name") != null && !test.get("name").isEmpty()){
            result = repository.findByNameContainingOrDescriptionContainingOrAddressContaining(test.get("name"),test.get("name"),test.get("name"));
        }

        if(result == null){
            result = repository.findAll();
        }

//        List<Long> dataIds = new ArrayList<>();
//        for (int i = 0; i < result.size(); i++) {
//            Parking parking = result.get(i);
//            dataIds.add(parking.getId());
//        }

        if(test.get("start_time") != null && !test.get("start_time").isEmpty()){
            String startTime = test.get("start_time");
            String endTime = test.get("end_time");


            Iterator<Parking> iterator = result.iterator();
            while (iterator.hasNext()) {
                Parking parking = iterator.next();
                List<Reserve> reserve = parking.getReserve();
                System.out.println(parking.getName());
                for (int j = 0; j < reserve.size(); j++) {
                    Reserve reservation = reserve.get(j);
                    Date start = reservation.getStart_time();
                    Date end = reservation.getEnd_time();

                    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

                    String startStr = sdf.format(start);
                    String endStr = sdf.format(end);

                    // 判断时间是否冲突
                    if ((startTime.compareTo(startStr) >= 0 && startTime.compareTo(endStr) < 0) ||
                            (endTime.compareTo(startStr) > 0 && endTime.compareTo(endStr) <= 0)) {
                        // 时间冲突，报错
                        // throw new RuntimeException("时间冲突");
                        if("4".equals(reservation.getState()) || "5".equals(reservation.getState())) {
                            iterator.remove();
                            break;
                        }
                    }
                }
            }
        }
        return new BaseResponse("200","", result);
    }

    public Parking findById(long id){
        return repository.findById(id).orElseThrow(() -> new NotFoundException("Author with id " + id +" not found"));
    }

    public BaseResponse update(long id, Parking test){
        Parking authorFromDb = findById(id);
        test.setId(authorFromDb.getId());
        test.setCreatedAt(authorFromDb.getCreatedAt());
        return new BaseResponse("200","", repository.save(test));
    }

    public BaseResponse delete(long id){
        Parking parking = findById(id);
        repository.delete(parking);
        return new BaseResponse("200", "Deleted parking successfully", null);
    }

    public BaseResponse save(Parking test){
        return new BaseResponse("200","", repository.save(test));
    }
}
