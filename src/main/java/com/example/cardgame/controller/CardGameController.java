package com.example.cardgame.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

import com.example.cardgame.model.Boss;
import com.example.cardgame.model.Card;
import com.example.cardgame.model.Player;

public class CardGameController {

    private Random random;

    public CardGameController() {
  
        random = new Random();
    }

    public void startGame() {
        System.out.println("欢迎来到卡牌游戏！");

        // 初始化卡牌库
        List<Card> bossDeck = new ArrayList<>();
        List<Card> playerDeck = new ArrayList<>();

        // 添加 J、Q、K 到 boss 牌库
        for (String suit : new String[]{"❤", "♦", "♣", "♠"}) {
            bossDeck.add(new Card(suit + "J", 10, 20, "骑士", null, suit));
            bossDeck.add(new Card(suit + "Q", 15, 30, "皇后", null, suit));
            bossDeck.add(new Card(suit + "K", 20, 40, "国王", null, suit));
        }

        // 洗牌
        Collections.shuffle(bossDeck);

        // 玩家起始抽取 8 张手牌
        for (int i = 0; i < 8; i++) {
            playerDeck.add(bossDeck.remove(0));
        }

        Player player = new Player("玩家", null);
        Boss currentBoss = new Boss(bossDeck.get(0));

        boolean isRunning = true;
        while (isRunning && !bossDeck.isEmpty()) {
            // 打出卡牌阶段
            Card playedCard = player.playCard(playerDeck);
            if (playedCard == null) {
                System.out.println("没有可用的手牌，游戏结束！");
                break;
            }

            // 激活技能阶段
            activateSkill(playedCard, currentBoss);

            // 对敌人造成伤害阶段
            int damage = calculateDamage(playedCard, currentBoss);
            currentBoss.takeDamage(damage);

            if (currentBoss.isDefeated()) {
                System.out.println("击败了 " + currentBoss.getName() + "！");
                bossDeck.remove(0); // 移除当前 boss
                if (!bossDeck.isEmpty()) {
                    currentBoss = new Boss(bossDeck.get(0)); // 更新当前 boss
                }
            } else {
                // 承受敌人伤害阶段
                if (!player.takeDamage(currentBoss)) {
                    System.out.println("玩家无法承受伤害，游戏失败！");
                    isRunning = false;
                }
            }
        }

        if (isRunning) {
            System.out.println("恭喜！你成功击败了所有 boss，恢复了大陆的和平！");
        } else {
            System.out.println("很遗憾，你在战斗中失败了...");
        }
    }

    private void activateSkill(Card card, Boss boss) {
        switch (card.getSuit()) {
            case "❤":
                // 实现红桃治疗技能
                break;
            case "♦":
                // 实现方片抽牌技能
                break;
            case "♣":
                // 实现草花攻击技能
                break;
            case "♠":
                // 实现黑桃防御技能
                break;
        }
    }

    private int calculateDamage(Card card, Boss boss) {
        int damage = card.getAttack();
        if ("♣".equals(card.getSuit())) {
            damage *= 2; // 草花双倍伤害
        }
        return Math.max(0, damage - boss.getDefense());
    }
}