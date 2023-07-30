package com.wahyaumau.springbootsqlite.controllers;
import com.wahyaumau.springbootsqlite.entities.Favorite;
import com.wahyaumau.springbootsqlite.models.BaseResponse;
import com.wahyaumau.springbootsqlite.services.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/favorite")
public class FavoriteController {
    @Autowired
    private FavoriteService favoriteService;

    @PostMapping
    public BaseResponse save(@RequestBody Favorite favorite){
        return favoriteService.save(favorite);
    }

    @PutMapping("/{id}")
    public BaseResponse update(@PathVariable Long id, @RequestBody Favorite favorite) {
        return favoriteService.update(id, favorite);
    }

    @DeleteMapping("/{id}")
    public BaseResponse delete(@PathVariable Long id) {
        return favoriteService.delete(id);
    }

    @GetMapping
    public BaseResponse findAll(@RequestParam long id) {
        return favoriteService.findAll(id);
    }
}