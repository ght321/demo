// 游戏主入口
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
