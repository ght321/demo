package com.example.cardgame.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cardgame.model.UserDiscardCard;
import com.example.cardgame.model.UserSave;

public interface UserDiscardCardRepository extends JpaRepository<UserDiscardCard, Long> {
    List<UserDiscardCard> findBySave(UserSave save);
    void deleteBySave(UserSave save);
}
