// 游戏主入口
// 负责页面加载后初始化游戏数据、绑定事件、首次渲染UI。
// 加载卡牌数据，初始化各模块，启动游戏主流程。
import { initializeGame, advanceToNextPhase } from './phases.js';
import { bindHandCardClick, bindPlayButton } from './events.js';
import { updateBossCardColors } from './boss.js';
import { updateHandCount, updateDeckCount, updateDefeatedBossCount } from './ui.js';

window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/cards')
        .then(response => response.json())
        .then(cardsData => {
            window.cards = cardsData.cards;
            window.bossCards = cardsData.bossCards;
            console.log('bossCards:', window.bossCards); // 调试输出
            initializeGame(window.cards);
            updateHandCount();
            updateDeckCount();
            updateDefeatedBossCount();
            updateBossCardColors();
            bindHandCardClick();
            bindPlayButton();
        })
        .catch(() => {
            // 默认数据
            window.cards = [
                { name: "1❤", attack: 2, defense: 3, type: "普通", skill: null, suit: "❤" },
                { name: "2♦", attack: 4, defense: 6, type: "普通", skill: null, suit: "♦" }
            ];
            window.bossCards = [
                { name: "骑士❤", attack: 10, defense: 20, type: "Boss", skill: null, suit: "❤" },
                { name: "皇后♦", attack: 15, defense: 30, type: "Boss", skill: null, suit: "♦" },
                { name: "国王♠", attack: 20, defense: 40, type: "Boss", skill: null, suit: "♠" }
            ];
            initializeGame(window.cards);
            updateHandCount();
            updateDeckCount();
            updateDefeatedBossCount();
            updateBossCardColors();
            bindHandCardClick();
            bindPlayButton();
        });
});

// 新增：暴露一个 applyArchiveState 方法用于恢复游戏状态
export function applyArchiveState(archive) {
    window.cards = archive.cards || [];
    window.hand = archive.hand || [];
    window.deck = archive.deck || [];
    window.discardPile = archive.discardPile || [];
    window.bossCards = archive.bossCards || [];
    // 修正：同步 currentBoss 和 defeatedBossCount 到 boss.js 的全局变量
    window.currentBoss = archive.currentBoss || null;
    window.defeatedBossCount = archive.defeatedBossCount || 0;

    // 同步到 boss.js 的全局变量
    try {
        // boss.js 采用 export let currentBoss/defeatedBossCount
        // 需要通过 window 访问模块变量
        if (typeof import.meta !== 'undefined') {
            // ESM环境下无法直接赋值import变量，但window.currentBoss/defeatedBossCount可被boss.js读取
        } else {
            // 非模块环境下可直接赋值
            if (typeof currentBoss !== 'undefined') currentBoss = window.currentBoss;
            if (typeof defeatedBossCount !== 'undefined') defeatedBossCount = window.defeatedBossCount;
        }
    } catch (e) {}

    // 强制刷新UI
    if (typeof window.updateGameUI === 'function') window.updateGameUI();
    // 调试输出
    console.log('恢复存档后状态:', {
        hand: window.hand,
        discardPile: window.discardPile,
        currentBoss: window.currentBoss,
        defeatedBossCount: window.defeatedBossCount
    });
}

// 确保每次游戏状态变化时都同步更新 window.hand、window.deck 等全局变量

// 提供统一导出当前游戏状态的方法
export function getCurrentGameState() {
    const state = {
        cards: window.cards,
        hand: window.hand,
        deck: window.deck,
        discardPile: window.discardPile,
        bossCards: window.bossCards,
        currentBoss: window.currentBoss,           // 确保包含当前boss
        defeatedBossCount: window.defeatedBossCount // 确保包含已击败boss数量
    };
    console.log('存档内容:', state);
    return state;
}

// 说明：如果数据库只存储了 cards 和 bossCards，说明 window.hand、window.deck、window.discardPile、window.currentBoss、window.defeatedBossCount 在存档时是 undefined 或空。
