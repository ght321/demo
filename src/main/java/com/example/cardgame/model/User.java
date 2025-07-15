package com.example.cardgame.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;

    private String password;

    // 可扩展：保存游戏进度（如击败Boss数、手牌等）
    private int defeatedBossCount;

    // getter/setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public int getDefeatedBossCount() { return defeatedBossCount; }
    public void setDefeatedBossCount(int defeatedBossCount) { this.defeatedBossCount = defeatedBossCount; }
}

