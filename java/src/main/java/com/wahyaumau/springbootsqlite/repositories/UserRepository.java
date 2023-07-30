package com.wahyaumau.springbootsqlite.repositories;

import com.wahyaumau.springbootsqlite.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByNickname(String nickname);
    User findByPhone(String phone);
}