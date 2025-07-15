import { initializeGame, advanceToNextPhase } from './phases.js';
import { bindHandCardClick, bindPlayButton } from './events.js';
import { updateBossCardColors } from './boss.js';
import './gamestate.js'; // 拦截击败Boss数量增加时自动同步gameState
import { updateHandCount, updateDeckCount, updateDefeatedBossCount } from './ui.js';

window.addEventListener('DOMContentLoaded', () => {
    fetch('/api/cards')
        .then(response => response.json())
        .then(cardsData => {
            window.cards = cardsData.cards;
            window.bossCards = cardsData.bossCards;
            initializeGame(window.cards);
            updateHandCount();
            updateDeckCount();
            updateDefeatedBossCount();
            updateBossCardColors();
            bindHandCardClick();
            bindPlayButton();
            syncWindowGameState();

function filterNullArray(arr, type) {
    if (!Array.isArray(arr)) return arr;
    let key1 = null, key2 = null;
    switch(type) {
        case 'hand':
        case 'deck':
        case 'discard':
            key1 = 'cardId'; key2 = 'cardJson'; break;
        case 'boss':
        case 'defeatedBoss':
            key1 = 'bossId'; key2 = 'bossJson'; break;
    }
    return arr.filter(item => {
        if (!item) return false;
        if (key1 && key2) {
            // 过滤 null、undefined、空字符串
            return item[key1] != null && item[key1] !== '' && item[key2] != null && item[key2] !== '';
        }
        return true;
    });
}

// 包装 fetch/post 存档时自动过滤
window.saveGameData = function(url, data) {
    // 需要过滤的字段名及类型
    const arrFields = [
        {f: 'handCards', t: 'hand'},
        {f: 'deckCards', t: 'deck'},
        {f: 'discardCards', t: 'discard'},
        {f: 'bossList', t: 'boss'},
        {f: 'defeatedBossList', t: 'defeatedBoss'}
    ];
    arrFields.forEach(({f, t}) => {
        if (Array.isArray(data[f])) {
            data[f] = filterNullArray(data[f], t);
        }
    });
    // 自动类型转换和必填字段校验
    if (typeof data.slot === 'string') data.slot = parseInt(data.slot, 10);
    if (typeof data.defeatedBossCount === 'string') data.defeatedBossCount = parseInt(data.defeatedBossCount, 10);
    if (typeof data.currentBossHp === 'string') data.currentBossHp = parseInt(data.currentBossHp, 10);
    if (typeof data.currentBossAttack === 'string') data.currentBossAttack = parseInt(data.currentBossAttack, 10);
    // 必填字段列表
    const requiredFields = ['username','slot','defeatedBossCount','phase','currentBossId','currentBossHp','currentBossAttack'];
    let missing = requiredFields.filter(k => data[k] === undefined || data[k] === null || data[k] === '');
    if (missing.length > 0) {
        alert('存档失败，缺少字段：' + missing.join(','));
        throw new Error('saveGameData 缺少字段: ' + missing.join(','));
    }
    // 日志输出
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}
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
            syncWindowGameState();
        });

// 每次主流程推进后都同步 window.handCards 等
window.syncWindowGameState = function() {
    try {
        // 动态 import 以避免循环依赖
        import('./deck.js').then(deckMod => {
            window.handCards = deckMod.hand;
            window.deck = deckMod.deck;
            window.discardPile = deckMod.discardPile;
            if (window.updateGameState) window.updateGameState();
        });
        import('./boss.js').then(bossMod => {
            window.bossList = bossMod.bossList || [];
            window.defeatedBossList = bossMod.defeatedBossList || [];
            window.currentBoss = bossMod.currentBoss || null;
            window.defeatedBossCount = bossMod.defeatedBossCount || 0;
            if (window.updateGameState) window.updateGameState();
        });
        window.phase = window.currentPhase || '';
        if (window.updateGameState) window.updateGameState();
    } catch(e) {
        // 容错
    }
}
});
