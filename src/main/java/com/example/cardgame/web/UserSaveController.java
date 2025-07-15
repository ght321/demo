package com.example.cardgame.web;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cardgame.model.UserBossList;
import com.example.cardgame.model.UserDeckCard;
import com.example.cardgame.model.UserDefeatedBoss;
import com.example.cardgame.model.UserDiscardCard;
import com.example.cardgame.model.UserHandCard;
import com.example.cardgame.model.UserSave;
import com.example.cardgame.service.UserSaveService;

@RestController
@RequestMapping("/api/save")
public class UserSaveController {
    @Autowired private UserSaveService userSaveService;

    // 存档接口（前端传所有数据，slot为0/1/2）
    @PostMapping("/full")
    public Map<String, Object> saveAll(@RequestBody Map<String, Object> data) {
        String username = (String) data.get("username");
        int slot = (int) data.get("slot");
        int defeatedBossCount = (int) data.get("defeatedBossCount");
        String phase = (String) data.get("phase");
        String currentBossId = (String) data.get("currentBossId");
        Integer currentBossHp = data.get("currentBossHp") == null ? null : (Integer) data.get("currentBossHp");
        Integer currentBossAttack = data.get("currentBossAttack") == null ? null : (Integer) data.get("currentBossAttack");
        // 反序列化各表（兼容json数组，需手动转换）
        List<Map<String, Object>> handCardMaps = (List<Map<String, Object>>) data.get("handCards");
        List<UserHandCard> handCards = new java.util.ArrayList<>();
        if (handCardMaps != null) for (Map<String, Object> m : handCardMaps) {
            if (m == null) continue;
            UserHandCard c = new UserHandCard();
            c.setCardId((String)m.get("cardId"));
            c.setCardJson((String)m.get("cardJson"));
            handCards.add(c);
        }
        List<Map<String, Object>> deckCardMaps = (List<Map<String, Object>>) data.get("deckCards");
        List<UserDeckCard> deckCards = new java.util.ArrayList<>();
        if (deckCardMaps != null) for (Map<String, Object> m : deckCardMaps) {
            if (m == null) continue;
            UserDeckCard c = new UserDeckCard();
            c.setCardId((String)m.get("cardId"));
            c.setCardJson((String)m.get("cardJson"));
            deckCards.add(c);
        }
        List<Map<String, Object>> discardCardMaps = (List<Map<String, Object>>) data.get("discardCards");
        List<UserDiscardCard> discardCards = new java.util.ArrayList<>();
        if (discardCardMaps != null) for (Map<String, Object> m : discardCardMaps) {
            if (m == null) continue;
            UserDiscardCard c = new UserDiscardCard();
            c.setCardId((String)m.get("cardId"));
            c.setCardJson((String)m.get("cardJson"));
            discardCards.add(c);
        }
        List<Map<String, Object>> bossListMaps = (List<Map<String, Object>>) data.get("bossList");
        List<UserBossList> bossList = new java.util.ArrayList<>();
        if (bossListMaps != null) for (Map<String, Object> m : bossListMaps) {
            if (m == null) continue;
            UserBossList b = new UserBossList();
            b.setBossId((String)m.get("bossId"));
            b.setBossJson((String)m.get("bossJson"));
            bossList.add(b);
        }
        List<Map<String, Object>> defeatedBossListMaps = (List<Map<String, Object>>) data.get("defeatedBossList");
        List<UserDefeatedBoss> defeatedBossList = new java.util.ArrayList<>();
        if (defeatedBossListMaps != null) for (Map<String, Object> m : defeatedBossListMaps) {
            if (m == null) continue;
            UserDefeatedBoss b = new UserDefeatedBoss();
            b.setBossId((String)m.get("bossId"));
            b.setBossJson((String)m.get("bossJson"));
            defeatedBossList.add(b);
        }
        userSaveService.saveAll(username, slot, defeatedBossCount, phase, currentBossId, currentBossHp, currentBossAttack,
                handCards, deckCards, discardCards, bossList, defeatedBossList);
        return Map.of(
            "success", true,
            "msg", "存档成功"
        );
    }

    // 读档接口
    @GetMapping("/full")
    public Object getAll(@RequestParam String username, @RequestParam int slot) {
        UserSave save = userSaveService.getSave(username, slot);
        if (save == null) return null;
        // 返回结构化存档，前端可直接用这些字段恢复所有游戏状态
        return Map.of(
            // 存档基础信息
            "save", save,
            // 手牌数组
            "handCards", userSaveService.getHandCards(save),
            // 牌堆数组
            "deckCards", userSaveService.getDeckCards(save),
            // 弃牌堆数组
            "discardCards", userSaveService.getDiscardCards(save),
            // 剩余boss数组
            "bossList", userSaveService.getBossList(save),
            // 已击败boss数组
            "defeatedBossList", userSaveService.getDefeatedBossList(save)
        );
    }
}
           
