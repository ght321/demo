package com.example.cardgame.service;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cardgame.model.User;
import com.example.cardgame.model.UserBossList;
import com.example.cardgame.model.UserDeckCard;
import com.example.cardgame.model.UserDefeatedBoss;
import com.example.cardgame.model.UserDiscardCard;
import com.example.cardgame.model.UserHandCard;
import com.example.cardgame.model.UserSave;
import com.example.cardgame.repository.UserBossListRepository;
import com.example.cardgame.repository.UserDeckCardRepository;
import com.example.cardgame.repository.UserDefeatedBossRepository;
import com.example.cardgame.repository.UserDiscardCardRepository;
import com.example.cardgame.repository.UserHandCardRepository;
import com.example.cardgame.repository.UserRepository;
import com.example.cardgame.repository.UserSaveRepository;

@Service
public class UserSaveService {
    @Autowired private UserRepository userRepository;
    @Autowired private UserSaveRepository userSaveRepository;
    @Autowired private UserHandCardRepository userHandCardRepository;
    @Autowired private UserDeckCardRepository userDeckCardRepository;
    @Autowired private UserDiscardCardRepository userDiscardCardRepository;
    @Autowired private UserBossListRepository userBossListRepository;
    @Autowired private UserDefeatedBossRepository userDefeatedBossRepository;

    // 保存完整存档（覆盖slot）
    @Transactional
    public void saveAll(String username, int slot, int defeatedBossCount, String phase, String currentBossId, Integer currentBossHp, Integer currentBossAttack,
                        List<UserHandCard> handCards, List<UserDeckCard> deckCards, List<UserDiscardCard> discardCards,
                        List<UserBossList> bossList, List<UserDefeatedBoss> defeatedBossList) {
        System.out.println("[存档] 用户:" + username + " slot:" + slot);
        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("[存档] 用户不存在: " + username);
            throw new RuntimeException("用户不存在");
        }
        UserSave save = userSaveRepository.findByUserAndSlot(user, slot);
        if (save == null) {
            save = new UserSave();
            save.setUser(user);
            save.setSlot(slot);
            System.out.println("[存档] 新建存档记录");
        } else {
            System.out.println("[存档] 覆盖已有存档记录 id=" + save.getId());
        }
        save.setSaveTime(new Date());
        save.setDefeatedBossCount(defeatedBossCount);
        save.setPhase(phase);
        save.setCurrentBossId(currentBossId);
        save.setCurrentBossHp(currentBossHp);
        save.setCurrentBossAttack(currentBossAttack);
        userSaveRepository.save(save);
        System.out.println("[存档] 基础信息已保存, saveId=" + save.getId());

        // 先查出所有旧数据并删除，保证表内容和存档一致
        userHandCardRepository.deleteBySave(save);
        userDeckCardRepository.deleteBySave(save);
        userDiscardCardRepository.deleteBySave(save);
        userBossListRepository.deleteBySave(save);
        userDefeatedBossRepository.deleteBySave(save);
        System.out.println("[存档] 关联表已清空");

        // 插入新数据
        if (handCards != null) {
            for (UserHandCard c : handCards) { c.setSave(save); userHandCardRepository.save(c); }
            System.out.println("[存档] 手牌数:" + handCards.size());
        }
        if (deckCards != null) {
            for (UserDeckCard c : deckCards) { c.setSave(save); userDeckCardRepository.save(c); }
            System.out.println("[存档] 牌堆数:" + deckCards.size());
        }
        if (discardCards != null) {
            for (UserDiscardCard c : discardCards) { c.setSave(save); userDiscardCardRepository.save(c); }
            System.out.println("[存档] 弃牌堆数:" + discardCards.size());
        }
        if (bossList != null) {
            for (UserBossList b : bossList) { b.setSave(save); userBossListRepository.save(b); }
            System.out.println("[存档] 剩余boss数:" + bossList.size());
        }
        if (defeatedBossList != null) {
            for (UserDefeatedBoss b : defeatedBossList) { b.setSave(save); userDefeatedBossRepository.save(b); }
            System.out.println("[存档] 已击败boss数:" + defeatedBossList.size());
        }
        System.out.println("[存档] 完成");
    }

    // 读取完整存档
    public UserSave getSave(String username, int slot) {
        System.out.println("[读档] 用户:" + username + " slot:" + slot);
        User user = userRepository.findByUsername(username);
        if (user == null) {
            System.out.println("[读档] 用户不存在: " + username);
            return null;
        }
        UserSave save = userSaveRepository.findByUserAndSlot(user, slot);
        if (save == null) {
            System.out.println("[读档] 存档不存在");
        } else {
            System.out.println("[读档] 存档id=" + save.getId());
        }
        return save;
    }
    public List<UserHandCard> getHandCards(UserSave save) { return userHandCardRepository.findBySave(save); }
    public List<UserDeckCard> getDeckCards(UserSave save) { return userDeckCardRepository.findBySave(save); }
    public List<UserDiscardCard> getDiscardCards(UserSave save) { return userDiscardCardRepository.findBySave(save); }
    public List<UserBossList> getBossList(UserSave save) { return userBossListRepository.findBySave(save); }
    public List<UserDefeatedBoss> getDefeatedBossList(UserSave save) { return userDefeatedBossRepository.findBySave(save); }
}
