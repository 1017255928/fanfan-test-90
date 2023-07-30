package com.wahyaumau.springbootsqlite.controllers;

import com.wahyaumau.springbootsqlite.entities.User;
import com.wahyaumau.springbootsqlite.models.BaseResponse;
import com.wahyaumau.springbootsqlite.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public BaseResponse login(@RequestBody User user) {
        return userService.login(user);
    }

    @PostMapping("/register")
    public BaseResponse register(@RequestBody User user) {
        System.out.println(user);
        return userService.register(user);
    }

    @PutMapping("/{id}")
    public BaseResponse update(@PathVariable Long id, @RequestBody User user) {
        return userService.update(id, user);
    }

    @DeleteMapping("/{id}")
    public BaseResponse delete(@PathVariable Long id) {
        return userService.delete(id);
    }

    @GetMapping
    public List<User> findAll() {
        return userService.findAll();
    }

    @GetMapping("/{id}")
    public BaseResponse findById(@PathVariable Long id) {
        return userService.findById(id);
    }
}