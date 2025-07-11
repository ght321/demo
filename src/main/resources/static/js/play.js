// 出牌与弃牌主逻辑

import { hand, discardPile, updateDiscardPileDisplay } from './deck.js';
import { selectedCards, sortHandCards, clearSelectedCards } from './hand.js';
import { activateSkill } from './skills.js';
import { logGameEvent } from './ui.js';
import { currentPhase, advanceToNextPhase } from './phases.js';

export function playCard() {
    logGameEvent(`【当前阶段】${currentPhase}`);
    if (currentPhase !== 'play') {
        logGameEvent('当前不是出牌阶段，不能出牌！');
        return;
    }
    if (selectedCards.length === 0) {
        logGameEvent('请先选择要出的手牌！');
        return;
    }
    const playedCards = selectedCards.map(card => {
        const name = card.textContent;
        const index = hand.findIndex(cardObj => cardObj.name === name);
        if (index > -1) {
            const cardObj = hand.splice(index, 1)[0];
            discardPile.push(cardObj);
            updateDiscardPileDisplay();
            return cardObj;
        }
        return null;
    }).filter(card => card !== null);
    let totalAttack = playedCards.reduce((sum, card) => sum + card.attack, 0);
    playedCards.forEach(card => {
        activateSkill(card);
        if (card.suit === '♣') {
            totalAttack *= 2;
        }
    });

    // Boss 生命值处理
    const bossHealthSpan = document.getElementById('boss-health');
    let bossHealth = 0;
    if (bossHealthSpan) {
        bossHealth = parseInt(bossHealthSpan.textContent);
        bossHealth = Math.max(0, bossHealth - totalAttack);
        bossHealthSpan.textContent = bossHealth;
    }

    logGameEvent(`玩家使用了 ${playedCards.map(c => c.name).join(', ')}，造成 ${totalAttack} 点伤害！`);
    clearSelectedCards();
    sortHandCards();

    // 造成伤害后，若Boss未死则进入承伤（弃牌）阶段
    if (bossHealth > 0) {
        // 进入弃牌阶段
        window.setTimeout(() => {
            logGameEvent('Boss未被击败，进入弃牌阶段（承伤）！');
            if (typeof advanceToNextPhase === 'function') advanceToNextPhase('discard');
        }, 300);
    } else {
        logGameEvent('Boss被击败，继续游戏！');
        if (typeof advanceToNextPhase === 'function') advanceToNextPhase('play');
    }
}
