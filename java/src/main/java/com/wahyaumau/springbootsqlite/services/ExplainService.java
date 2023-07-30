package com.wahyaumau.springbootsqlite.services;
import com.wahyaumau.springbootsqlite.entities.Explain;
import com.wahyaumau.springbootsqlite.models.BaseResponse;
import com.wahyaumau.springbootsqlite.repositories.ExplainRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class ExplainService {
    @Autowired
    private ExplainRepository explainRepository;

    public BaseResponse update(Long id, Explain explain) {
        explain.setId(id);
        return new BaseResponse("200","", explainRepository.save(explain));
    }
    public BaseResponse save(Explain explain){
        return new BaseResponse("200","", explainRepository.save(explain));
    }
    public BaseResponse delete(Long id) {
        explainRepository.deleteById(id);
        return new BaseResponse("200","" );
    }
    public BaseResponse findAll() {
        return new BaseResponse("200","", explainRepository.findAll());
    }
}