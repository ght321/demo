package com.example.cardgame.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cardgame.model.UserDeckCard;
import com.example.cardgame.model.UserSave;

public interface UserDeckCardRepository extends JpaRepository<UserDeckCard, Long> {
    List<UserDeckCard> findBySave(UserSave save);
    void deleteBySave(UserSave save);
}
