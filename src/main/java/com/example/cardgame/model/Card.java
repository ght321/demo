package com.example.cardgame.model;

public class Card {
    private String name;
    private int attack;
    private int defense;
    private String type; // 卡牌类型
    private Runnable skill; // 卡牌技能
    private String suit; // 卡牌花色
    private boolean isBossImmune; // 是否boss免疫

    // 添加无参构造函数
    public Card() {}

    // 原有的带参数构造函数
    public Card(String name, int attack, int defense, String type, Runnable skill, String suit) {
        this.name = name;
        this.attack = attack;
        this.defense = defense;
        this.type = type;
        this.skill = skill;
        this.suit = suit;
        this.isBossImmune = false; // 默认不免疫
    }
    
    // Getters and setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAttack() {
        return attack;
    }

    public void setAttack(int attack) {
        this.attack = attack;
    }

    public int getDefense() {
        return defense;
    }

    public void setDefense(int defense) {
        this.defense = defense;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void useSkill() {
        if (skill != null) {
            skill.run();
        }
    }

    public String getSuit() {
        return suit;
    }

    public void setSuit(String suit) {
        this.suit = suit;
    }

    public boolean isBossImmune() {
        return isBossImmune;
    }

    public void setBossImmune(boolean bossImmune) {
        this.isBossImmune = bossImmune;
    }

    @Override
    public String toString() {
        return name + " [攻: " + attack + ", 防: " + defense + ", 类型: " + type + "]";
    }

    public Runnable getSkill() {
        return skill;
    }

    public void setSkill(Runnable skill) {
        this.skill = skill;
    }
}