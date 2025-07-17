// Boss 相关逻辑
// 管理当前Boss、Boss顺序、击败Boss计数、胜利判定。
// 提供Boss的显示、切换、胜利页面跳转等功能。
// 负责判断是否通关（击败所有Boss），并在胜利时跳转到胜利界面。

export let currentBoss = null;
export let defeatedBossCount = 0; // 初始为0，只有在击败Boss后才增加

let bossOrderList = [];
let bossIndex = 0;

// 常量定义
const BOSS_ORDER = ['J', 'Q', 'K'];
const TOTAL_BOSS_COUNT = 12;

// DOM 元素缓存
const DOM_ELEMENTS = {
    currentBossCard: () => document.querySelector('.current-boss-card'),
    bossHealth: () => document.getElementById('boss-health'),
    bossAttack: () => document.getElementById('boss-attack'),
    defeatedBossCount: () => document.getElementById('defeated-boss-count'),
    victoryModal: () => document.getElementById('victory-modal')
};

// 新增：递增击败Boss数量
export function increaseDefeatedBossCount() {
    defeatedBossCount++;
    updateDefeatedBossCount();
    checkVictoryCondition(); // 每次递增后检查胜利
}

export function resetBossProgress() {
    bossOrderList = [];
    bossIndex = 0;
    defeatedBossCount = 0; // 重置击败的Boss数量
    updateDefeatedBossCount();
}

// 辅助函数：安全记录游戏事件
function safeLogGameEvent(message) {
    if (typeof logGameEvent === 'function') {
        logGameEvent(message);
    }
}

// 辅助函数：清空Boss显示
function clearBossDisplay(message = '无Boss') {
    const currentBossCard = DOM_ELEMENTS.currentBossCard();
    const bossHealth = DOM_ELEMENTS.bossHealth();
    const bossAttack = DOM_ELEMENTS.bossAttack();
    if (currentBossCard) {
        currentBossCard.classList.add('hidden');
        currentBossCard.innerHTML = message;
    }
    if (bossHealth) bossHealth.textContent = '0';
    if (bossAttack) bossAttack.textContent = '0';
}

// 辅助函数：显示Boss信息
function displayBossInfo(boss) {
    const currentBossCard = DOM_ELEMENTS.currentBossCard();
    const bossHealth = DOM_ELEMENTS.bossHealth();
    const bossAttack = DOM_ELEMENTS.bossAttack();
    if (currentBossCard) {
        currentBossCard.classList.remove('hidden');
        if (!boss || !boss.name) {
            currentBossCard.innerHTML = 'Boss数据异常';
        } else {
            currentBossCard.innerHTML = `${boss.name}<br>生命: ${boss.defense}<br>攻击: ${boss.attack}`;
            currentBossCard.setAttribute('data-suit', boss.suit);
        }
    }
    if (bossHealth) bossHealth.textContent = boss && boss.defense ? boss.defense : '0';
    if (bossAttack) bossAttack.textContent = boss && boss.attack ? boss.attack : '0';
}

// 辅助函数：构建Boss顺序队列
function buildBossOrderList(bossList) {
    // 只在bossOrderList为空时重建队列
    if (!Array.isArray(bossOrderList) || bossOrderList.length === 0) {
        let ordered = [];
        BOSS_ORDER.forEach(order => {
            ordered.push(...bossList.filter(boss => boss.name.includes(order)));
        });
        if (ordered.length === 0) {
            ordered = bossList.slice();
        }
        bossOrderList = ordered;
        bossIndex = 0;
    }
}

// 辅助函数：获取当前Boss的生命值
function getCurrentBossHealth(boss) {
    if (typeof boss.health === 'number') {
        return boss.health;
    }
    if (typeof boss.defense === 'number') {
        return boss.defense;
    }
    return 0;
}

// 辅助函数：处理游戏胜利
function handleGameVictory() {
    clearBossDisplay('恭喜你，已通关！');
    if (checkVictoryCondition()) {
        safeLogGameEvent('恭喜！你已成功击败所有12个Boss！');
    }
}

// 辅助函数：获取下一个有效的Boss
function getNextValidBoss() {
    while (bossIndex < bossOrderList.length) {
        const boss = bossOrderList[bossIndex];
        const bossHealth = getCurrentBossHealth(boss);
        if (bossHealth > 0) {
            return boss;
        }
        bossIndex++;
    }
    return null;
}

export function autoDrawBoss(bossList) {
    if (!bossList || bossList.length === 0) {
        currentBoss = null;
        clearBossDisplay();
        return;
    }
    buildBossOrderList(bossList);
    // eslint-disable-next-line no-console
    console.log('bossOrderList:', bossOrderList);

    if (bossIndex >= bossOrderList.length) {
        currentBoss = null;
        handleGameVictory();
        return;
    }

    const nextBoss = getNextValidBoss();

    if (!nextBoss) {
        currentBoss = null;
        handleGameVictory();
        return;
    }

    currentBoss = nextBoss;
    displayBossInfo(currentBoss);
    bossIndex++;
}

export function updateBossCardColors() {
    const bossCards = document.querySelectorAll('.boss-card');
    const currentBossCard = DOM_ELEMENTS.currentBossCard();
    bossCards.forEach(card => {
        updateCardColor(card);
    });
    if (currentBossCard && currentBossCard.textContent.trim() !== '') {
        currentBossCard.classList.remove('red', 'black');
        updateCardColor(currentBossCard);
    }
}

// 辅助函数：更新单个卡片的颜色
function updateCardColor(card) {
    const suitSymbol = card.getAttribute('data-suit');
    if (!suitSymbol) {
        card.classList.add('black');
        return;
    }
    switch (suitSymbol) {
        case '❤':
        case '♦':
            card.classList.add('red');
            break;
        case '♣':
        case '♠':
            card.classList.add('black');
            break;
        default:
            card.classList.add('black');
    }
}

export function updateDefeatedBossCount() {
    const countDisplay = DOM_ELEMENTS.defeatedBossCount();
    if (countDisplay) {
        countDisplay.textContent = `已击败 Boss 数量: ${defeatedBossCount}`;
    }
}

// 显示胜利提示
export function showVictoryMessage() {
    // 跳转到胜利页面
    window.location.href = '/victory.html';
}

// 隐藏胜利提示
export function hideVictoryMessage() {
    const victoryModal = DOM_ELEMENTS.victoryModal();
    if (victoryModal) {
        victoryModal.classList.add('hidden');
    }
}

// 新增：允许外部同步currentBoss和defeatedBossCount
export function syncBossStateFromWindow() {
    if (typeof window.currentBoss !== 'undefined') currentBoss = window.currentBoss;
    if (typeof window.defeatedBossCount !== 'undefined') defeatedBossCount = window.defeatedBossCount;
    updateDefeatedBossCount();
}

// 恢复Boss状态
export function applyArchiveBossState(archive) {
    // 恢复boss相关变量
    if (typeof archive.currentBoss !== 'undefined') {
        // 直接赋值模块变量，确保currentBoss同步
        currentBoss = archive.currentBoss;
        window.currentBoss = archive.currentBoss;
        // 立即刷新Boss显示
        if (currentBoss) {
            // 重新渲染boss卡片
            const currentBossCard = document.querySelector('.current-boss-card');
            if (currentBossCard) {
                currentBossCard.classList.remove('hidden');
                currentBossCard.innerHTML = `${currentBoss.name}<br>生命: ${currentBoss.defense}<br>攻击: ${currentBoss.attack}`;
                currentBossCard.setAttribute('data-suit', currentBoss.suit);
            }
            const bossHealth = document.getElementById('boss-health');
            if (bossHealth) bossHealth.textContent = currentBoss.defense || '0';
            const bossAttack = document.getElementById('boss-attack');
            if (bossAttack) bossAttack.textContent = currentBoss.attack || '0';
        }
    }
    if (typeof archive.defeatedBossCount !== 'undefined') {
        defeatedBossCount = archive.defeatedBossCount;
        window.defeatedBossCount = archive.defeatedBossCount;
    }
    updateDefeatedBossCount();
}

// 核心胜利条件判断函数
export function checkVictoryCondition() {
    if (defeatedBossCount >= TOTAL_BOSS_COUNT) {
        showVictoryMessage();
        return true;
    }
    return false;
}

