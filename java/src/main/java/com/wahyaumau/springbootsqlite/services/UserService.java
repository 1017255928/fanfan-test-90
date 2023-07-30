package com.wahyaumau.springbootsqlite.services;
import com.wahyaumau.springbootsqlite.entities.User;
import com.wahyaumau.springbootsqlite.models.BaseResponse;
import com.wahyaumau.springbootsqlite.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public BaseResponse login(User user) {
        User new_user = userRepository.findByNickname(user.getNickname());

        if (new_user == null || !new_user.getPassword().equals(user.getPassword())) {
            return new BaseResponse("502","Invalid nickname or password");
        }
        return new BaseResponse("200","", new_user);
    }

    public BaseResponse register(User user) {
        if (userRepository.findByNickname(user.getNickname()) != null) {
            return new BaseResponse("502","Nickname already exists");
        }
        if (userRepository.findByPhone(user.getPhone()) != null) {
            return new BaseResponse("502","Phone already exists");
        }

        return  new BaseResponse("200","", userRepository.save(user));
    }

    public BaseResponse update(Long id, User user) {
        User oldUser = userRepository.findById(id).orElse(null);
        if (oldUser == null) {
            throw new RuntimeException("User not found");
        }
        if (!oldUser.getNickname().equals(user.getNickname()) && userRepository.findByNickname(user.getNickname()) != null) {
            throw new RuntimeException("Nickname already exists");
        }
        if (!oldUser.getPhone().equals(user.getPhone()) && userRepository.findByPhone(user.getPhone()) != null) {
            throw new RuntimeException("Phone already exists");
        }
        user.setId(id);
        return new BaseResponse("200","", userRepository.save(user));
    }

    public BaseResponse delete(Long id) {
        userRepository.deleteById(id);
        return new BaseResponse("200","" );
    }
    public List<User> findAll() {
        return userRepository.findAll();
    }

    public BaseResponse findById(Long id) {
        return new BaseResponse("200","", userRepository.findById(id));
    }

}