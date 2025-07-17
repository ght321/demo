// 卡牌堆与手牌相关逻辑
// 管理抽牌堆、弃牌堆、手牌的初始化、洗牌、抽牌、弃牌等。
// 提供牌堆和弃牌堆的UI更新方法。

export let deck = [];
export let hand = [];
export let discardPile = [];

export function shuffleDeck(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    // 保证洗牌后同步到 window
    window.deck = cards;
}

export function initializeDeck(cards) {
    deck = cards;
    if (!Array.isArray(deck) || deck.length === 0) {
        deck = [
            { name: "1❤", attack: 2, defense: 3, type: "普通", skill: null, suit: "❤" },
            { name: "2♦", attack: 4, defense: 6, type: "普通", skill: null, suit: "♦" },
            { name: "3♣", attack: 6, defense: 9, type: "普通", skill: null, suit: "♣" },
            { name: "4♠", attack: 8, defense: 12, type: "普通", skill: null, suit: "♠" }
        ];
    }
    shuffleDeck(deck);
    // 同步到 window
    window.deck = deck;
}

export function drawCard() {
    if (deck.length === 0) return null;
    const drawnCard = deck.shift();
    hand.push(drawnCard);
    // 同步到 window
    window.deck = deck;
    window.hand = hand;
    return drawnCard;
}

export function updateDeckDisplay() {
    const deckText = document.querySelector('.deck-text');
    if (deckText) {
        deckText.textContent = `卡牌堆 (${deck.length})`;
    }
}

export function updateDiscardPileDisplay() {
    const discardText = document.querySelector('.discard-text');
    if (discardText) {
        discardText.textContent = `弃牌堆 (${discardPile.length})`;
    }
    // 同步到 window
    window.discardPile = discardPile;
}
