package com.example.cardgame.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cardgame.model.Archive;

public interface ArchiveRepository extends JpaRepository<Archive, Long> {
    Optional<Archive> findTopByUserIdOrderBySaveTimeDesc(Long userId);
}
    

