// 出牌与弃牌主逻辑
// 负责玩家出牌、技能激活、对Boss造成伤害、弃牌抵挡Boss攻击等。
// 处理出牌阶段和弃牌阶段的具体操作，调用阶段切换函数。
// 只在击败Boss后进入抽牌阶段，否则进入弃牌阶段。

import { hand, discardPile, updateDiscardPileDisplay } from './deck.js';
import { selectedCards, sortHandCards, clearSelectedCards } from './hand.js';
import { activateSkill } from './skills.js';
import { logGameEvent } from './ui.js';
import { currentPhase, advanceToNextPhase } from './phases.js';
import { increaseDefeatedBossCount, defeatedBossCount } from './boss.js'; // 新增导入defeatedBossCount

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
    window.hand = hand;
    window.discardPile = discardPile;

    // 计算总攻击力
    let totalAttack = 0;
    let hasClub = false;
    playedCards.forEach(card => {
        totalAttack += card.attack || 0;
        if (card.suit === '♣') hasClub = true;
    });

    // 只有草花♣造成双倍伤害，黑桃♠不加倍
    if (hasClub) {
        totalAttack *= 2;
    }

    // 技能生效判定：如果卡牌花色与当前Boss花色相同，则技能无效
    const bossCard = document.querySelector('.current-boss-card');
    let bossSuit = '';
    if (bossCard) {
        bossSuit = bossCard.getAttribute('data-suit') || '';
    }
    playedCards.forEach(card => {
        if (card.suit !== bossSuit) {
            // 只激活技能，不再对黑桃做任何伤害加倍处理
            activateSkill(card);
        }
    });

    // Boss 生命值处理
    const bossHealthSpan = document.getElementById('boss-health');
    let bossHealth = 0;
    if (bossHealthSpan) {
        bossHealth = parseInt(bossHealthSpan.textContent);
        bossHealth = Math.max(0, bossHealth - totalAttack);
        bossHealthSpan.textContent = bossHealth;
        // 同步到 window.currentBoss
        if (window.currentBoss) {
            window.currentBoss.health = bossHealth;
            window.currentBoss.defense = bossHealth;
        }
    }

    logGameEvent(`玩家使用了 ${playedCards.map(c => c.name).join(', ')}，造成 ${totalAttack} 点伤害！`);
    clearSelectedCards();
    sortHandCards();

    if (bossHealth > 0) {
        window.setTimeout(() => {
            logGameEvent('Boss未被击败，进入弃牌阶段（承伤）！');
            if (typeof advanceToNextPhase === 'function') advanceToNextPhase('discard');
        }, 300);
    } else {
        logGameEvent('Boss被击败，继续游戏！');
        window.setTimeout(() => {
            if (typeof advanceToNextPhase === 'function') advanceToNextPhase('draw');
        }, 300);
    }
}
      