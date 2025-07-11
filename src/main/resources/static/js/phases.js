// 游戏阶段与流程控制
import { hand, deck, discardPile, initializeDeck, updateDiscardPileDisplay } from './deck.js';
import { autoDrawBoss, currentBoss, resetBossProgress } from './boss.js';
import { sortHandCards, clearSelectedCards } from './hand.js';
import { updateHandCount, logGameEvent } from './ui.js';

export let currentPhase = 'draw';

import { updateDeckDisplay } from './deck.js';
import { updateDeckCount } from './ui.js';

export function advanceToNextPhase(nextPhase) {
    if (nextPhase === 'draw') {
        currentPhase = 'draw';
        logGameEvent('【当前阶段】draw（抽牌）');
        // 抽满手牌上限
        const HAND_LIMIT = 12;
        while (hand.length < HAND_LIMIT && deck.length > 0) {
            hand.push(deck.shift());
        }
        sortHandCards();
        updateHandCount();
        updateDeckDisplay();
        updateDeckCount();
        // 进入出牌阶段
        advanceToNextPhase('play');
        return;
    }
    if (nextPhase === 'play') {
        currentPhase = 'play';
        logGameEvent('【当前阶段】play（出牌）');
        // 出牌和技能结算应在play.js中完成，阶段流转只负责切换

        // play 阶段也检测 Boss 是否死亡
        const bossHealth = parseInt(document.getElementById('boss-health').textContent);
        if (bossHealth === 0) {
            if (typeof window.bossCards !== 'undefined' && window.bossCards.length > 0) {
                if (typeof window.currentBoss !== 'undefined') window.currentBoss = null;
                if (typeof autoDrawBoss === 'function') autoDrawBoss(window.bossCards);


                logGameEvent('你击败了一个Boss！');
                // 这里直接 return，等待玩家操作或新阶段由 UI 触发，避免 Boss UI 没刷新
                return;
            }
            return;
        }
        return;
    }
    if (nextPhase === 'discard') {
        currentPhase = 'discard';
        logGameEvent('【当前阶段】discard（弃牌/承伤）');
        // 进入弃牌阶段后判断Boss状态
        const bossHealth = parseInt(document.getElementById('boss-health').textContent);
        const bossAttack = parseInt(document.getElementById('boss-attack').textContent);
        if (bossHealth === 0) {
            // Boss已死，切换下一个Boss，补牌，进入新一轮
            if (typeof window.bossCards !== 'undefined' && window.bossCards.length > 0) {
                if (typeof window.currentBoss !== 'undefined') window.currentBoss = null;
                if (typeof autoDrawBoss === 'function') autoDrawBoss(window.bossCards);


                logGameEvent('你击败了一个Boss！');
                // 这里直接 return，等待玩家操作或新阶段由 UI 触发，避免 Boss UI 没刷新
                return;
            }
            // 如果没有 bossCards 也直接 return
            return;
        }
        if (bossAttack === 0) {
            // Boss攻击为0，直接进入出牌阶段
            advanceToNextPhase('play');
            return;
        }
        // 绑定弃牌按钮事件（承伤）
        let discardBtn = document.getElementById('discard-btn');
        if (discardBtn) {
            const newBtn = discardBtn.cloneNode(true);
            discardBtn.parentNode.replaceChild(newBtn, discardBtn);
            discardBtn = newBtn;
            discardBtn.id = 'discard-btn';
            discardBtn.onclick = function () {
                const selected = Array.from(document.querySelectorAll('.hand-card.selected'));
                let total = 0;
                const toDiscard = [];
                selected.forEach(cardEl => {
                    const cardName = cardEl.textContent;
                    const idx = hand.findIndex(c => c.name === cardName);
                    if (idx > -1) {
                        const cardObj = hand[idx];
                        total += cardObj.attack;
                        toDiscard.push({ idx, cardObj, cardEl });
                    }
                });
                const bossAttack = parseInt(document.getElementById('boss-attack').textContent);
                if (total >= bossAttack) {
                    toDiscard.sort((a, b) => b.idx - a.idx).forEach(({ idx, cardObj, cardEl }) => {
                        hand.splice(idx, 1);
                        discardPile.push(cardObj);
                        updateDiscardPileDisplay();
                        cardEl.classList.remove('selected');
                    });
                    logGameEvent(`玩家弃掉了 ${toDiscard.map(x=>x.cardObj.name).join(', ')}，成功抵挡 Boss 反击！`);
                    sortHandCards();
                    updateHandCount();
                    clearSelectedCards();
                    // 弃牌后进入出牌阶段
                    advanceToNextPhase('play');
                } else {
                    // 承伤失败，Boss攻击未被抵挡
                    logGameEvent('弃牌总攻击力不足以抵挡 Boss 攻击！你承受了 Boss 的全部伤害！');
                    // 这里可扩展玩家生命等逻辑
                    // 进入下一阶段（如直接抽牌或游戏失败）
                    advanceToNextPhase('draw');
                }
            };
        }
        return;
    }
}

export function initializeGame(cards) {
    initializeDeck(cards);
    // 重置boss顺序队列和击败数
    if (typeof resetBossProgress === 'function') resetBossProgress();
    // 初始化时先切换Boss
    if (typeof window.bossCards !== 'undefined' && window.bossCards.length > 0) {
        if (typeof window.currentBoss !== 'undefined') window.currentBoss = null;
        autoDrawBoss(window.bossCards);
    }
    // 初始抽满12张牌
    hand.length = 0;
    for (let i = 0; i < 12 && deck.length > 0; i++) {
        hand.push(deck.shift());
    }
    sortHandCards();
    updateHandCount();
    updateDeckDisplay();
    updateDeckCount();
    advanceToNextPhase('play');
}
