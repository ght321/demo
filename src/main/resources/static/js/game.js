// 游戏主入口
// 负责页面加载后初始化游戏数据、绑定事件、首次渲染UI。
// 加载卡牌数据，初始化各模块，启动游戏主流程。
import { hand, deck, discardPile, updateDiscardPileDisplay, updateDeckDisplay } from './deck.js';
import { sortHandCards } from './hand.js';
import { updateHandCount, updateDeckCount, updateDefeatedBossCount } from './ui.js';
import { updateBossCardColors } from './boss.js';
import { bindHandCardClick, bindPlayButton, bindDiscardButton } from './events.js';
import { discardSelectedCards, currentPhase as phasesCurrentPhase, applyArchivePhaseState } from './phases.js';
import { applyArchiveBossState } from './boss.js';
import { initializeGame, advanceToNextPhase } from './phases.js';

window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/cards')
        .then(response => response.json())
        .then(cardsData => {
            window.cards = cardsData.cards;
            window.bossCards = cardsData.bossCards;
            console.log('bossCards:', window.bossCards); // 调试输出
            // 修正：确保 initializeGame 已正确导入并可用
            if (typeof initializeGame === 'function') {
                initializeGame(window.cards);
            } else if (typeof window.initializeGame === 'function') {
                window.initializeGame(window.cards);
            } else {
                console.error('initializeGame 未定义，请检查 phases.js 的导出和导入！');
            }
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
            if (typeof initializeGame === 'function') {
                initializeGame(window.cards);
            } else if (typeof window.initializeGame === 'function') {
                window.initializeGame(window.cards);
            } else {
                console.error('initializeGame 未定义，请检查 phases.js 的导出和导入！');
            }
            updateHandCount();
            updateDeckCount();
            updateDefeatedBossCount();
            updateBossCardColors();
            bindHandCardClick();
            bindPlayButton();
        });

    // 确保全局可调试
    window.gameState = {
        get hand() { return window.hand; },
        get deck() { return window.deck; },
        get discardPile() { return window.discardPile; },
        get currentPhase() {
            return typeof window.currentPhase !== 'undefined'
                ? window.currentPhase
                : (typeof currentPhase !== 'undefined' ? currentPhase : '');
        },
        get currentBoss() { return window.currentBoss; },
        get defeatedBossCount() { return window.defeatedBossCount; }
    };
});


export function applyArchiveState(archive) {
    // 全量同步数据库内的各项数据到当前局面
    window.cards = archive.cards || [];
    window.hand = archive.hand || [];
    window.deck = archive.deck || [];
    window.discardPile = archive.discardPile || [];
    window.bossCards = archive.bossCards || [];
    window.currentBoss = typeof archive.currentBoss !== 'undefined' ? archive.currentBoss : null;
    window.defeatedBossCount = typeof archive.defeatedBossCount !== 'undefined' ? archive.defeatedBossCount : 0;
    window.currentPhase = typeof archive.currentPhase !== 'undefined' ? archive.currentPhase : 'play';

    // 同步 deck.js 的 hand/deck/discardPile
    hand.length = 0;
    window.hand.forEach(card => hand.push(card));
    deck.length = 0;
    window.deck.forEach(card => deck.push(card));
    discardPile.length = 0;
    window.discardPile.forEach(card => discardPile.push(card));

    // 刷新手牌区DOM和颜色
    sortHandCards();

    // 刷新UI
    updateHandCount();
    updateDeckCount();
    updateDefeatedBossCount();
    updateDiscardPileDisplay();
    updateDeckDisplay();

    // 刷新Boss和手牌的颜色
    updateBossCardColors();

    // 重新绑定所有事件，确保UI可交互
    bindHandCardClick();
    bindPlayButton();
    bindDiscardButton();

    // 保证弃牌逻辑引用
    window.discardSelectedCards = (...args) => discardSelectedCards.apply(null, args);

    // 同步阶段和boss相关变量
    applyArchivePhaseState(archive);
    applyArchiveBossState(archive);

    // 关键：恢复后根据当前阶段重新激活主流程（如按钮可用性、阶段逻辑等）
    if (window.currentPhase === 'play') {
        // 重新激活出牌阶段的主流程（如按钮、事件、UI等）
        if (typeof window.playCard === 'function') {
            // 可选：可在此处做出牌按钮可用等处理
        }
    } else if (window.currentPhase === 'discard') {
        // 重新激活弃牌阶段的主流程
        if (typeof window.discardSelectedCards === 'function') {
            // 可选：可在此处做弃牌按钮可用等处理
        }
    }

    // 强制刷新页面所有UI（如果有全局刷新函数）
    if (typeof window.updateGameUI === 'function') window.updateGameUI();

    // 额外：同步 window 变量到 gameState，便于F12调试
    window.gameState = {
        get hand() { return window.hand; },
        get deck() { return window.deck; },
        get discardPile() { return window.discardPile; },
        get currentPhase() { return window.currentPhase; },
        get currentBoss() { return window.currentBoss; },
        get defeatedBossCount() { return window.defeatedBossCount; }
    };

    // 新增：确保按钮不被禁用
    const playBtn = document.getElementById('play-btn');
    if (playBtn) playBtn.disabled = false;
    const discardBtn = document.getElementById('discard-btn');
    if (discardBtn) discardBtn.disabled = false;

    console.log('恢复存档后状态:', {
        hand: window.hand,
        deck: window.deck,
        discardPile: window.discardPile,
        bossCards: window.bossCards,
        currentBoss: window.currentBoss,
        defeatedBossCount: window.defeatedBossCount,
        currentPhase: window.currentPhase
    });
}

// 提供统一导出当前游戏状态的方法
export function getCurrentGameState() {
    // 修正：存档时同步当前boss的最新血量和攻击力
    let boss = window.currentBoss ? { ...window.currentBoss } : null;
    if (boss) {
        // 从UI读取最新血量和攻击力
        const bossHealthEl = document.getElementById('boss-health');
        const bossAttackEl = document.getElementById('boss-attack');
        if (bossHealthEl) {
            const health = parseInt(bossHealthEl.textContent);
            boss.health = health;
            boss.defense = health;
        }
        if (bossAttackEl) {
            const attack = parseInt(bossAttackEl.textContent);
            boss.attack = attack;
        }
    }
    const state = {
        cards: window.cards,
        hand: window.hand,
        deck: window.deck,
        discardPile: window.discardPile,
        bossCards: window.bossCards,
        currentBoss: boss,
        defeatedBossCount: window.defeatedBossCount,
        currentPhase: typeof window.currentPhase !== 'undefined' ? window.currentPhase : (typeof currentPhase !== 'undefined' ? currentPhase : 'play')
    };
    console.log('存档内容:', state);
    return state;
}

