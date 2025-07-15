package com.example.cardgame.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "user_save")
public class UserSave {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private int slot; // 存档槽位 0/1/2

    @Temporal(TemporalType.TIMESTAMP)
    private Date saveTime;

    private int defeatedBossCount;
    private String phase;
    private String currentBossId;
    private Integer currentBossHp;
    private Integer currentBossAttack;

    // getter/setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public int getSlot() { return slot; }
    public void setSlot(int slot) { this.slot = slot; }

    public Date getSaveTime() { return saveTime; }
    public void setSaveTime(Date saveTime) { this.saveTime = saveTime; }

    public int getDefeatedBossCount() { return defeatedBossCount; }
    public void setDefeatedBossCount(int defeatedBossCount) { this.defeatedBossCount = defeatedBossCount; }

    public String getPhase() { return phase; }
    public void setPhase(String phase) { this.phase = phase; }

    public String getCurrentBossId() { return currentBossId; }
    public void setCurrentBossId(String currentBossId) { this.currentBossId = currentBossId; }

    public Integer getCurrentBossHp() { return currentBossHp; }
    public void setCurrentBossHp(Integer currentBossHp) { this.currentBossHp = currentBossHp; }

    public Integer getCurrentBossAttack() { return currentBossAttack; }
    public void setCurrentBossAttack(Integer currentBossAttack) { this.currentBossAttack = currentBossAttack; }
}
