package com.example.cardgame.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "user_defeated_boss")
public class UserDefeatedBoss {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "save_id")
    private UserSave save;

    private String bossId;
    @Column(columnDefinition = "TEXT")
    private String bossJson;

    // getter/setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserSave getSave() { return save; }
    public void setSave(UserSave save) { this.save = save; }

    public String getBossId() { return bossId; }
    public void setBossId(String bossId) { this.bossId = bossId; }

    public String getBossJson() { return bossJson; }
    public void setBossJson(String bossJson) { this.bossJson = bossJson; }
}
