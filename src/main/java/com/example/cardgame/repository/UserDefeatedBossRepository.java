package com.example.cardgame.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cardgame.model.UserDefeatedBoss;
import com.example.cardgame.model.UserSave;

public interface UserDefeatedBossRepository extends JpaRepository<UserDefeatedBoss, Long> {
    List<UserDefeatedBoss> findBySave(UserSave save);
    void deleteBySave(UserSave save);
}
