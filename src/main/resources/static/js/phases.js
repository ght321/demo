// 游戏阶段与流程控制
// 负责游戏的阶段切换与主流程调度。
import { hand, deck, discardPile, initializeDeck, updateDiscardPileDisplay } from './deck.js';
// 导入increaseDefeatedBossCount函数
import { autoDrawBoss, currentBoss, resetBossProgress, defeatedBossCount, updateDefeatedBossCount, increaseDefeatedBossCount } from './boss.js';
import { sortHandCards, clearSelectedCards } from './hand.js';
import { updateHandCount, logGameEvent } from './ui.js';

export let currentPhase = 'draw';

import { updateDeckDisplay } from './deck.js';
import { updateDeckCount } from './ui.js';

const HAND_LIMIT = 9; // 修改手牌上限为9

function reducePlayerHealth(amount) {
    const playerHealthEl = document.getElementById('player-health');
    if (playerHealthEl) {
        let playerHealth = parseInt(playerHealthEl.textContent);
        playerHealth -= amount;
        playerHealthEl.textContent = Math.max(playerHealth, 0);
        logGameEvent(`玩家生命值减少 ${amount} 点，当前生命值：${playerHealth}`);
        if (playerHealth <= 0) {
            logGameEvent('玩家生命值归零，游戏失败！');
            // 可扩展游戏结束逻辑
            return true;
        }
    }
    return false;
}

let discardBtnBound = false;

export function advanceToNextPhase(nextPhase) {
    if (nextPhase === 'draw') {
        currentPhase = 'draw';
        logGameEvent('【当前阶段】draw（抽牌）');
        // 只抽3张牌，且不超过手牌上限
        let canDraw = Math.max(0, HAND_LIMIT - hand.length);
        let drawCount = Math.min(3, canDraw, deck.length);
        for (let i = 0; i < drawCount; i++) {
            hand.push(deck.shift());
        }
        // 防止手牌超限：如果抽牌后手牌超限，截断到HAND_LIMIT
        if (hand.length > HAND_LIMIT) {
            hand.length = HAND_LIMIT;
        }
        sortHandCards();
        updateHandCount();
        updateDeckDisplay();
        updateDeckCount();
        window.hand = hand;
        window.deck = deck;
        setTimeout(() => advanceToNextPhase('play'), 0);
        return;
    }
    if (nextPhase === 'play') {
        currentPhase = 'play';
        logGameEvent('【当前阶段】play（出牌）');
        const bossHealth = parseInt(document.getElementById('boss-health').textContent);
        if (bossHealth === 0) {
            if (typeof window.bossCards !== 'undefined' && window.bossCards.length > 0) {
                if (typeof window.currentBoss !== 'undefined') window.currentBoss = null;
                if (typeof autoDrawBoss === 'function') autoDrawBoss(window.bossCards);
                if (typeof increaseDefeatedBossCount === 'function') increaseDefeatedBossCount();
                logGameEvent('你击败了一个Boss！');
                if (defeatedBossCount >= 12) {
                    logGameEvent('已满足胜利条件，所有Boss已被击败');
                }
                return;
            }
            return;
        }
        window.hand = hand;
        window.deck = deck;
        return;
    }
    if (nextPhase === 'discard') {
        currentPhase = 'discard';
        logGameEvent('【当前阶段】discard（弃牌/承伤）');
        const bossHealth = parseInt(document.getElementById('boss-health').textContent);
        const bossAttack = parseInt(document.getElementById('boss-attack').textContent);
        // 修正：弃牌阶段开始时强制手牌不超过上限
        if (hand.length > HAND_LIMIT) {
            // 多余的手牌自动移入弃牌堆（从手牌末尾开始）
            while (hand.length > HAND_LIMIT) {
                const card = hand.pop();
                discardPile.push(card);
                updateDiscardPileDisplay();
            }
            sortHandCards();
            updateHandCount();
            logGameEvent(`手牌超出上限，已自动弃掉多余的牌。`);
        }
        // 修正：在进入弃牌阶段时立即判断当前手牌情况
        const handTotalAttack = hand.reduce((sum, card) => sum + (card.attack || 0), 0);
        if (hand.length === 0 || handTotalAttack < bossAttack) {
            logGameEvent('手牌为空或手牌总攻击力不足以抵挡 Boss 攻击，游戏失败！');
            // 可扩展：这里可以弹窗或跳转失败界面
            return;
        }
        if (bossHealth === 0) {
            if (typeof window.bossCards !== 'undefined' && window.bossCards.length > 0) {
                if (typeof window.currentBoss !== 'undefined') window.currentBoss = null;
                if (typeof autoDrawBoss === 'function') autoDrawBoss(window.bossCards);
                if (typeof increaseDefeatedBossCount === 'function') increaseDefeatedBossCount();
                logGameEvent('你击败了一个Boss！');
                if (defeatedBossCount >= 12) {
                    logGameEvent('已满足胜利条件，所有Boss已被击败');
                }
            }
            setTimeout(() => advanceToNextPhase('play'), 0);
            return;
        }
        if (bossAttack === 0) {
            setTimeout(() => advanceToNextPhase('play'), 0);
            return;
        }
        if (!discardBtnBound) {
            let discardBtn = document.getElementById('discard-btn');
            if (discardBtn) {
                discardBtn.onclick = function () {
                    if (currentPhase !== 'discard') return;
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
                        setTimeout(() => advanceToNextPhase('play'), 0);
                    } else {
                        logGameEvent('弃牌总攻击力不足以抵挡 Boss 攻击！请重新弃牌');
                        if (reducePlayerHealth(bossAttack)) return;
                        // 不再自动进入下一阶段，等待玩家重新弃牌
                    }
                };
                discardBtnBound = true;
            }
        }
        window.hand = hand;
        window.discardPile = discardPile;
        return;
    }
}

// 导出 discardSelectedCards，供外部调用弃牌逻辑
export function discardSelectedCards() {
    if (typeof window.currentPhase !== 'undefined' && window.currentPhase !== 'discard') return;
    const hand = window.hand || [];
    const discardPile = window.discardPile || [];
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
   
}

// 新增：导出 applyArchivePhaseState，供 game.js 调用
export function applyArchivePhaseState(archive) {
    if (typeof archive.currentPhase !== 'undefined') {
        currentPhase = archive.currentPhase;
        window.currentPhase = archive.currentPhase;
    } else {
        currentPhase = 'play';
        window.currentPhase = 'play';
    }
}

// 导出 initializeGame，供 game.js 调用
export function initializeGame(cards) {
    initializeDeck(cards);
    if (typeof resetBossProgress === 'function') resetBossProgress();
    if (typeof window.bossCards !== 'undefined' && window.bossCards.length > 0) {
        if (typeof window.currentBoss !== 'undefined') window.currentBoss = null;
        autoDrawBoss(window.bossCards);
    }
    hand.length = 0;
    for (let i = 0; i < HAND_LIMIT && deck.length > 0; i++) {
        hand.push(deck.shift());
    }
    sortHandCards();
    updateHandCount();
    updateDeckDisplay();
    updateDeckCount();
    window.hand = hand;
    window.deck = deck;
    window.discardPile = discardPile;
    setTimeout(() => advanceToNextPhase('play'), 0);
}
