package com.example.cardgame.controller;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.Arrays;
import com.example.cardgame.model.Boss;
import com.example.cardgame.model.Card;
import com.example.cardgame.model.Player;

public class CardGameController {

    private Random random;
    private List<Card> discardPile;

    public CardGameController() {
        random = new Random();
        discardPile = new ArrayList<>();
    }

    public void startGame() {
        System.out.println("欢迎来到卡牌游戏！");

        // 初始化卡牌库
        List<Card> cardDeck = new ArrayList<>(); // 普通卡牌池
        List<Card> bossDeck = new ArrayList<>();
        List<Card> playerDeck = new ArrayList<>();

        // 添加 J、Q、K 到 boss 牌库（每种花色各4张）
        for (String suit : new String[]{"❤", "♦", "♣", "♠"}) {
            bossDeck.add(new Card(suit + "J", 10, 20, "骑士", null, suit));
            bossDeck.add(new Card(suit + "Q", 15, 30, "皇后", null, suit));
            bossDeck.add(new Card(suit + "K", 20, 40, "国王", null, suit));
        }

        // 添加普通卡牌到 cardDeck（A~10）
        for (String suit : new String[]{"❤", "♦", "♣", "♠"}) {
            for (int i = 1; i <= 10; i++) {
                cardDeck.add(new Card(String.valueOf(i) + suit, i, i * 3, "普通", null, suit));
            }
        }

        // 洗牌
        Collections.shuffle(cardDeck);
        Collections.shuffle(bossDeck);

        // 确保 cardDeck 不为空
        if (cardDeck.isEmpty()) {
            System.err.println("普通卡牌池为空，使用默认卡牌数据！");
            cardDeck.addAll(Arrays.asList(
                new Card("1❤", 1, 3, "普通", null, "❤"),
                new Card("2♦", 2, 6, "普通", null, "♦")
            ));
        }

        // 玩家起始抽取 12 张手牌（固定数量）
        while (playerDeck.size() < 12 && !cardDeck.isEmpty()) {
            playerDeck.add(cardDeck.remove(0)); // 从卡组顶部抽取一张牌
        }

        // 新增：对玩家初始手牌进行排序和更新显示
        sortHandCards(playerDeck); // 排序手牌
        updateHandCount(playerDeck); // 更新手牌数显示

        Player player = new Player("玩家", null);
        Boss currentBoss = new Boss(bossDeck.get(0));

        boolean isRunning = true;
        while (isRunning && !cardDeck.isEmpty()) { // 使用 cardDeck 判断是否继续游戏
            // 打出卡牌阶段
            Card playedCard = player.playCard(playerDeck);
            if (playedCard == null) {
                System.out.println("没有可用的手牌，游戏结束！");
                break;
            }

            // 激活技能阶段（调整至伤害计算之前）
            activateSkill(playedCard, currentBoss, cardDeck, playerDeck);

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

    private void activateSkill(Card card, Boss boss, List<Card> bossDeck, List<Card> playerDeck) {
        switch (card.getSuit()) {
            case "❤": // 红桃治疗：从弃牌堆随机抽取对应数量的牌返回卡组底部
                int drawCount = Math.min(discardPile.size(), getCardValue(card));
                for (int i = 0; i < drawCount; i++) {
                    Card drawnCard = discardPile.remove(random.nextInt(discardPile.size()));
                    bossDeck.add(drawnCard); // 将弃牌堆中的牌移回卡组底部
                }
                System.out.println("红桃治疗生效！从弃牌堆抽取了 " + drawCount + " 张牌并放回卡组底部。");

                // 触发状态更新通知
                notifyGameStateUpdate();
                break;
            case "♦": // 方片抽牌：玩家从卡组上方抽取对应数量的牌
                int drawFromDeckCount = Math.min(bossDeck.size(), getCardValue(card));
                for (int i = 0; i < drawFromDeckCount && playerDeck.size() < 12; i++) {
                    if (!bossDeck.isEmpty()) {
                        playerDeck.add(bossDeck.remove(0)); // 从卡组顶部抽取一张牌
                    }
                }
                sortHandCards(playerDeck); // 排序手牌
                updateHandCount(playerDeck); // 更新手牌数显示
                System.out.println("方片抽牌生效！从卡组抽取了 " + drawFromDeckCount + " 张牌。");
                break;
            case "♣": // 草花攻击：对敌人造成双倍攻击伤害（已在 calculateDamage 中处理）
                System.out.println("草花攻击生效！造成双倍伤害！");
                break;
            case "♠": // 黑桃防御：减少敌人与卡牌数字等量的攻击，并永久降低 boss 攻击力
                int defenseValue = getCardValue(card);
                boss.setAttack(Math.max(0, boss.getAttack() - defenseValue)); // 永久降低 boss 攻击力
                System.out.println("黑桃防御生效！Boss 攻击力永久降低了 " + defenseValue + " 点。");
                break;
        }
    }

    // 新增方法：获取卡牌数值（假设卡牌名称中的数字部分表示攻击力）
    private int getCardValue(Card card) {
        String name = card.getName();
        if (name.matches("\\d+")) { // 如果卡牌名称是纯数字
            return Integer.parseInt(name);
        } else {
            // 解析卡牌名称中的数字部分
            String[] parts = name.split("[A-Z]");
            if (parts.length > 0 && parts[0].matches("\\d+")) {
                return Integer.parseInt(parts[0]);
            }
        }
        return 0; // 默认返回 0
    }

    private int calculateDamage(Card card, Boss boss) {
        int damage = card.getAttack();
        if ("♣".equals(card.getSuit())) {
            damage *= 2; // 草花双倍伤害
            System.out.println("草花攻击生效！原始攻击力: " + card.getAttack() + " -> 翻倍后攻击力: " + damage); // 调试日志
        }
        return Math.max(0, damage - boss.getDefense());
    }

    // 新增方法：排序手牌
    private void sortHandCards(List<Card> hand) {
        hand.sort((a, b) -> {
            int rankA = getCardValue(a);
            int rankB = getCardValue(b);
            if (rankA != rankB) {
                return rankA - rankB; // 卡牌大小优先级
            }
            // 如果卡牌大小相同，则按花色排序
            return a.getSuit().compareTo(b.getSuit());
        });
    }

    // 新增方法：更新手牌数显示
    private void updateHandCount(List<Card> hand) {
        System.out.println("当前手牌数: " + hand.size());
    }

    // 新增方法：通知前端游戏状态更新
    private void notifyGameStateUpdate() {
        // 假设通过 WebSocket 或其他方式通知前端
        System.out.println("通知前端：游戏状态已更新！");
    }
}