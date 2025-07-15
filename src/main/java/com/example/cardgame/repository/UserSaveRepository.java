package com.example.cardgame.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cardgame.model.User;
import com.example.cardgame.model.UserSave;

public interface UserSaveRepository extends JpaRepository<UserSave, Long> {
    List<UserSave> findByUser(User user);
    UserSave findByUserAndSlot(User user, int slot);
}
