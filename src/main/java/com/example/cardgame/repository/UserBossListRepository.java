package com.example.cardgame.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cardgame.model.UserBossList;
import com.example.cardgame.model.UserSave;

public interface UserBossListRepository extends JpaRepository<UserBossList, Long> {
    List<UserBossList> findBySave(UserSave save);
    void deleteBySave(UserSave save);
}
