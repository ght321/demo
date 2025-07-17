// 技能与卡牌效果
// 负责根据卡牌花色激活不同技能（如回血、抽牌、Boss减攻等）。
// 技能效果直接影响牌堆、手牌、Boss属性等。
import { deck, hand, discardPile, updateDeckDisplay, updateDiscardPileDisplay } from './deck.js';
import { updateDeckCount } from './ui.js';

export function activateSkill(card) {
    switch (card.suit) {
        case '❤':
            const drawCount = Math.min(discardPile.length, getCardValue(card));
            for (let i = 0; i < drawCount; i++) {
                const drawnCard = discardPile.pop();
                deck.unshift(drawnCard);
            }
            updateDeckDisplay();
            updateDiscardPileDisplay();
            updateDeckCount();
            window.deck = deck;
            window.discardPile = discardPile;
            break;
        case '♦':
            const drawFromDeckCount = Math.min(deck.length, getCardValue(card));
            // 注意：这里手牌上限应与主流程一致
            for (let i = 0; i < drawFromDeckCount && hand.length < 9; i++) {
                if (deck.length > 0) {
                    hand.push(deck.shift());
                }
            }
            window.hand = hand;
            window.deck = deck;
            break;
        case '♣':
            // 草花：造成双倍伤害（主流程已处理，这里无需操作）
            break;
        case '♠':
            // 黑桃：降低Boss攻击力，不造成双倍伤害，只正常结算伤害
            const bossAttackElement = document.getElementById('boss-attack');
            if (bossAttackElement) {
                let currentAttack = parseInt(bossAttackElement.textContent);
                const reduceValue = getCardValue(card);
                currentAttack = Math.max(0, currentAttack - reduceValue);
                bossAttackElement.textContent = currentAttack;
                if (window.currentBoss) {
                    window.currentBoss.attack = currentAttack;
                }
            }
            // 不做双倍伤害处理，主流程只按普通伤害结算
            break;
    }
}

function getCardValue(card) {
    const name = card.name;
    if (/^\d+$/.test(name)) {
        return parseInt(name, 10);
    } else {
        const match = name.match(/^(\d+)/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
    }
    return 0;
}
