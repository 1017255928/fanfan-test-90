package com.wahyaumau.springbootsqlite.repositories;

import com.wahyaumau.springbootsqlite.entities.Reserve;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReserveRepository extends JpaRepository<Reserve, Long> {
}
