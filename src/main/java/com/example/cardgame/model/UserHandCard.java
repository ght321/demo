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
@Table(name = "user_hand_card")
public class UserHandCard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "save_id")
    private UserSave save;

    private String cardId;
    @Column(columnDefinition = "TEXT")
    private String cardJson; // 卡牌完整json

    // getter/setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserSave getSave() { return save; }
    public void setSave(UserSave save) { this.save = save; }

    public String getCardId() { return cardId; }
    public void setCardId(String cardId) { this.cardId = cardId; }

    public String getCardJson() { return cardJson; }
    public void setCardJson(String cardJson) { this.cardJson = cardJson; }
}
