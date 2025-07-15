package com.example.cardgame.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cardgame.model.Card;

@RestController
@RequestMapping("/api")
public class CardApiController {

    @GetMapping("/cards")
    public Map<String, List<Card>> getCards() {
        List<Card> cards = new ArrayList<>();
        List<Card> bossCards = new ArrayList<>();

        // 普通卡牌 A~10
        String[] suits = {"❤", "♦", "♣", "♠"};
        for (String suit : suits) {
            for (int i = 1; i <= 10; i++) { // 遍历 A 到 10
                int attack = i; // 攻击力等于卡牌大小
                int defense = attack * 3; // 防御力为攻击力的三倍
                cards.add(new Card(String.valueOf(i) + suit, attack, defense, "普通", null, suit));
            }
        }

        // 新增：生成12张Boss卡
        String[] bossNames = {"J", "Q", "K"};  // 修改为 J, Q, K
        int[] bossAttacks = {10, 15, 20};
        int[] bossDefenses = {20, 30, 40};

        for (int i = 0; i < suits.length; i++) {
            for (int j = 0; j < bossNames.length; j++) {
                // 修正为 J❤ Q♦ K♠ 格式
                bossCards.add(new Card(bossNames[j] + suits[i], bossAttacks[j], bossDefenses[j], "Boss", null, suits[i]));
            }
        }

        // 返回包含两张列表的对象
        Map<String, List<Card>> result = new HashMap<>();
        result.put("cards", cards);
        result.put("bossCards", bossCards);

        return result;
    }
}