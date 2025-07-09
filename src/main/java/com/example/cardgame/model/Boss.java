package com.example.cardgame.model;

public class Boss extends Card {
    private int health;
    private boolean defeated = false;

    public Boss(Card card) {
        super(card.getName(), card.getAttack(), card.getDefense(), card.getType(), card.getSkill(), card.getSuit());
        this.health = card.getDefense(); // 初始生命值等于防御值
        this.setBossImmune(true); // 所有boss免疫其他技能
    }

    public void takeDamage(int damage) {
        health -= damage;
        if (health <= 0 && !defeated) {
            defeated = true;
            System.out.println(this.getName() + " 被击败了！");
        }
    }

    public boolean isDefeated() {
        return defeated;
    }

    public int getHealth() {
        return health;
    }
}