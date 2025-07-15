// 手牌与出牌相关逻辑
// 管理手牌的排序、选中、清除选中等操作。
// 负责手牌的UI渲染和交互（如点击选中、取消选中）。
import { hand, discardPile, updateDiscardPileDisplay } from './deck.js';

export let selectedCards = [];

export function sortHandCards() {
    const suitOrder = ['❤', '♦', '♣', '♠'];
    hand.sort((a, b) => {
        const rankA = getCardRank(a.name);
        const rankB = getCardRank(b.name);
        if (rankA !== rankB) return rankA - rankB;
        const suitIndexA = suitOrder.indexOf(a.suit);
        const suitIndexB = suitOrder.indexOf(b.suit);
        return suitIndexA - suitIndexB;
    });
    const handContainer = document.getElementById('hand-cards');
    if (handContainer) {
        handContainer.innerHTML = '';
        for (const card of hand) {
            const cardElement = document.createElement('div');
            cardElement.className = 'hand-card';
            cardElement.textContent = `${card.name}`;
            // 根据花色设置颜色
            if (card.suit === '❤' || card.suit === '♦') {
                cardElement.style.color = 'red';
            } else {
                cardElement.style.color = 'black';
            }
            handContainer.appendChild(cardElement);
        }
    }
}

function getCardRank(cardName) {
    if (/^\d+$/.test(cardName)) {
        return parseInt(cardName, 10);
    } else {
        const match = cardName.match(/^(\d+)/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
    }
    return 0;
}

export function clearSelectedCards() {
    selectedCards = [];
    const handContainer = document.getElementById('hand-cards');
    if (handContainer) {
        const allCards = handContainer.querySelectorAll('.hand-card');
        allCards.forEach(card => card.classList.remove('selected'));
    }
}
