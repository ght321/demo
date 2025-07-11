// UI 相关操作
import { deck, hand, discardPile } from './deck.js';

export function updateHandCount() {
    const handCountDisplay = document.getElementById('hand-count-display');
    if (handCountDisplay) {
        handCountDisplay.textContent = `手牌数: ${hand.length}`;
    }
}

export function updateDeckCount() {
    const deckCountDisplay = document.getElementById('deck-count-display');
    if (deckCountDisplay) {
        deckCountDisplay.textContent = `抽卡堆剩余卡牌数: ${deck.length}`;
    }
}

export function updateDefeatedBossCount() {

}

export function logGameEvent(message) {
    const logContainer = document.getElementById('game-log');
    if (!logContainer) return;
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);
    logContainer.scrollTop = logContainer.scrollHeight;
}
