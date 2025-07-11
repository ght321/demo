// Boss 相关逻辑
export let currentBoss = null;
export let defeatedBossCount = 0; // 初始为0，只有在击败Boss后才增加

let bossOrderList = [];
let bossIndex = 0;

// 新增：递增击败Boss数量
export function increaseDefeatedBossCount() {
    defeatedBossCount++;
    updateDefeatedBossCount();
}

export function resetBossProgress() {
    bossOrderList = [];
    bossIndex = 0;
    defeatedBossCount = 0; // 重置击败的Boss数量
}

export function autoDrawBoss(bossList) {
    if (!bossList || bossList.length === 0) {
        currentBoss = null;
        const currentBossCard = document.querySelector('.current-boss-card');
        if (currentBossCard) {
            currentBossCard.classList.add('hidden');
            currentBossCard.innerHTML = '无Boss';
        }
        document.getElementById('boss-health').textContent = '0';
        document.getElementById('boss-attack').textContent = '0';
        return;
    }
    // 构建顺序队列：J→Q→K，且每局只构建一次
    if (!Array.isArray(bossOrderList) || bossOrderList.length === 0 || bossIndex >= bossOrderList.length) {
        bossOrderList = [];
        bossIndex = 0;
        const order = ['J', 'Q', 'K'];
        for (let o of order) {
            bossOrderList.push(...bossList.filter(boss => boss.name.includes(o)));
        }
    }
    // 切换到下一个 Boss
    if (bossIndex >= bossOrderList.length) {
        currentBoss = null;
        const currentBossCard = document.querySelector('.current-boss-card');
        if (currentBossCard) {
            currentBossCard.classList.add('hidden');
            currentBossCard.innerHTML = '恭喜你，已通关！';
        }
        document.getElementById('boss-health').textContent = '0';
        document.getElementById('boss-attack').textContent = '0';
        return;
    }
    // 检查当前 Boss 生命值，若为0则自动切换下一个 Boss
    let selectedCard = bossOrderList[bossIndex];
    // 如果当前 Boss 已经被打死（生命为0），则直接切换到下一个
    let bossHealth = selectedCard.defense;
    const bossHealthDom = document.getElementById('boss-health');
    if (bossHealthDom) {
        const domValue = parseInt(bossHealthDom.textContent);
        if (!isNaN(domValue)) bossHealth = domValue;
    }
    if (bossHealth === 0) {
        // 移除这里重复的计数器增加逻辑，保留play.js中的单一来源
        bossIndex++;
        // 若还有下一个 Boss，递归切换
        if (bossIndex < bossOrderList.length) {
            selectedCard = bossOrderList[bossIndex];
        } else {
            // 没有Boss了
            currentBoss = null;
            const currentBossCard = document.querySelector('.current-boss-card');
            if (currentBossCard) {
                currentBossCard.classList.add('hidden');
                currentBossCard.innerHTML = '恭喜你，已通关！';
            }
            document.getElementById('boss-health').textContent = '0';
            document.getElementById('boss-attack').textContent = '0';
            return;
        }
    }
    currentBoss = selectedCard;
    bossIndex++;
    const currentBossCard = document.querySelector('.current-boss-card');
    if (currentBossCard) {
        currentBossCard.classList.remove('hidden');
        const health = selectedCard.defense;
        const attack = selectedCard.attack;
        document.getElementById('boss-health').textContent = health;
        document.getElementById('boss-attack').textContent = attack;
        currentBossCard.innerHTML = `${selectedCard.name}<br>生命: ${health}<br>攻击: ${attack}`;
        currentBossCard.setAttribute('data-suit', selectedCard.suit);
    }
    if (currentBoss && currentBoss.health <= 0) {
        // 只有当当前Boss已经被击败时才增加计数器
        increaseDefeatedBossCount();
        logGameEvent('你击败了一个Boss！');
    }
    return;
}

export function updateBossCardColors() {
    const bossCards = document.querySelectorAll('.boss-card');
    bossCards.forEach(card => {
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
    });
    const currentBossCard = document.querySelector('.current-boss-card');
    if (currentBossCard && currentBossCard.textContent.trim() !== '') {
        const suitSymbol = currentBossCard.getAttribute('data-suit');
        currentBossCard.classList.remove('red', 'black');
        switch (suitSymbol) {
            case '❤':
            case '♦':
                currentBossCard.classList.add('red');
                break;
            case '♣':
            case '♠':
                currentBossCard.classList.add('black');
                break;
            default:
                currentBossCard.classList.add('black');
        }
    }
}

export function updateDefeatedBossCount() {
    const countDisplay = document.getElementById('defeated-boss-count');
    if (countDisplay) {
        countDisplay.textContent = `已击败 Boss 数量: ${defeatedBossCount}`;
    }
}