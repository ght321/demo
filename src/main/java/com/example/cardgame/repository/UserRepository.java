package com.example.cardgame.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cardgame.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}

