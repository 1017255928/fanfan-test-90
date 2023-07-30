package com.wahyaumau.springbootsqlite.services;
import com.wahyaumau.springbootsqlite.entities.Favorite;
import com.wahyaumau.springbootsqlite.models.BaseResponse;
import com.wahyaumau.springbootsqlite.repositories.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


@Service
public class FavoriteService {
    @Autowired
    private FavoriteRepository favoriteRepository;

    public BaseResponse update(Long id, Favorite favorite) {
        favorite.setId(id);
        return new BaseResponse("200","", favoriteRepository.save(favorite));
    }
    public BaseResponse save(Favorite favorite){
        return new BaseResponse("200","", favoriteRepository.save(favorite));
    }
    public BaseResponse delete(Long id) {
        favoriteRepository.deleteById(id);
        return new BaseResponse("200","" );
    }
    public BaseResponse findAll(long id) {
        return new BaseResponse("200","", favoriteRepository.findAllByUser(id));
    }
}
