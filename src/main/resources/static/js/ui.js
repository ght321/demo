// UI 相关操作
// 负责手牌数、牌堆数、击败Boss数等UI的实时更新。
// 管理游戏日志的显示，只保留历史消息和当前阶段消息，避免日志混乱。
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
    const countDisplay = document.getElementById('defeated-boss-count');
    const count = window.defeatedBossList ? window.defeatedBossList.length : 0;
    if (countDisplay) {
        countDisplay.textContent = `已击败 Boss 数量: ${count}`;
    }
}

export function logGameEvent(message) {
    const logContainer = document.getElementById('game-log');
    if (!logContainer) return;
    // 只保留标题和当前阶段的消息
    const phaseTitle = logContainer.querySelector('p');
    // 获取当前阶段
    let currentPhase = '';
    try {
        // 尝试从window导入currentPhase
        currentPhase = window.currentPhase || '';
    } catch {}
    // 新日志插入到最前面
    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    if (phaseTitle && phaseTitle.nextSibling) {
        logContainer.insertBefore(logEntry, phaseTitle.nextSibling);
    } else {
        logContainer.appendChild(logEntry);
    }
    // 移除所有非标题、非当前阶段的消息（只保留标题和本阶段消息）
    Array.from(logContainer.children).forEach(child => {
        if (child !== phaseTitle && child !== logEntry && child.tagName === 'P') {
            if (!child.textContent.includes(`【当前阶段】${currentPhase}`) && !child.textContent.startsWith('游戏日志')) {
                logContainer.removeChild(child);
            }
        }
    });
    // 限制日志条数为50条（不包括标题）
    while (logContainer.children.length > 51) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

