package com.example.cardgame.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cardgame.model.UserHandCard;
import com.example.cardgame.model.UserSave;

public interface UserHandCardRepository extends JpaRepository<UserHandCard, Long> {
    List<UserHandCard> findBySave(UserSave save);
    void deleteBySave(UserSave save);
}
