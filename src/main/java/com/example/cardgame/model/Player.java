package com.example.cardgame.model;

import java.util.ArrayList;
import java.util.List; // 新增此行导入
public class Player {
    private String name;
    private Card card;
    private List<Card> hand;

    public Player(String name, Card card) {
        this.name = name;
        this.card = card;
        this.hand = new ArrayList<>();
    }

    public Card playCard(List<Card> deck) {
        if (hand.isEmpty()) {
            System.out.println(name + " 没有手牌可打！");
            return null;
        }
        Card playedCard = hand.remove(0); // 简单实现：先出第一张手牌
        System.out.println(name + " 出了 " + playedCard.getName());
        return playedCard;
    }

    public boolean takeDamage(Boss boss) {
        int requiredHealth = boss.getAttack();
        int totalHandValue = hand.stream().mapToInt(Card::getAttack).sum();
        if (totalHandValue >= requiredHealth) {
            hand.clear(); // 弃掉手牌
            return true;
        } else {
            System.out.println(name + " 无法承受 " + boss.getName() + " 的攻击！");
            return false;
        }
    }

    public String getName() {
        return name;
    }

    public Card getCard() {
        return card;
    }

    public void setCard(Card card) {
        this.card = card;
    }
}