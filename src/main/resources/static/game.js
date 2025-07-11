function shuffleDeck(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]]; // 洗牌逻辑
    }
}

function initializeDeck(cards) {
    deck = cards;

    console.log("初始化卡牌堆:", deck); // 调试日志

    if (!Array.isArray(deck) || deck.length === 0) {
        console.error("卡牌堆初始化失败，未找到符合条件的卡牌！");
        deck = [
            { name: "1❤", attack: 2, defense: 3, type: "普通", skill: null, suit: "❤" },
            { name: "2♦", attack: 4, defense: 6, type: "普通", skill: null, suit: "♦" },
            { name: "3♣", attack: 6, defense: 9, type: "普通", skill: null, suit: "♣" },
            { name: "4♠", attack: 8, defense: 12, type: "普通", skill: null, suit: "♠" }
        ];
    }

    shuffleDeck(deck); // 洗牌

    const initialHandSize = 12;
    while (hand.length < initialHandSize && deck.length > 0) {
        hand.push(deck.shift()); // 从卡组顶部抽取一张牌
    }

    updateDeckDisplay();
    updateHandCount();
    updateDeckCount();
    sortHandCards();

    autoDrawBoss();
}

// 新增方法：自动抽取 Boss
function autoDrawBoss() {
    if (!currentBoss) {
        if (!window.bossCards || window.bossCards.length === 0) {
            console.error("未找到可用的 Boss 数据！");
            alert("无法加载 Boss 数据，请检查配置！");
            return;
        }

        const randomIndex = Math.floor(Math.random() * window.bossCards.length);
        const selectedCard = window.bossCards[randomIndex];

        currentBoss = selectedCard.name;

        const currentBossCard = document.querySelector('.current-boss-card');
        if (currentBossCard) {
            currentBossCard.classList.remove('hidden');

            const health = selectedCard.defense;
            const attack = selectedCard.attack;

            document.getElementById('boss-health').textContent = health;
            document.getElementById('boss-attack').textContent = attack;

            currentBossCard.innerHTML = `${selectedCard.name}<br>生命: ${health}<br>攻击: ${attack}`;
            currentBossCard.setAttribute('data-suit', selectedCard.suit);

            updateBossCardColors();
        } else {
            console.error("未找到当前 Boss 卡显示元素！");
        }

        defeatedBossCount++;
        updateDefeatedBossCount();
    }
}

function updateHandCount() {
    const handCountDisplay = document.getElementById('hand-count-display');
    if (handCountDisplay) {
        handCountDisplay.textContent = `手牌数: ${hand.length}`;
    } else {
        console.error("未找到手牌数显示元素！");
    }
}

function updateDeckCount() {
    const deckCountDisplay = document.getElementById('deck-count-display');
    if (deckCountDisplay) {
        deckCountDisplay.textContent = `抽卡堆剩余卡牌数: ${deck.length}`;
    } else {
        console.error("未找到抽卡堆剩余卡牌数显示元素！");
    }
}

// 新增方法：获取卡牌数值
function getCardRank(cardName) {
    if (/^\d+$/.test(cardName)) { // 如果卡牌名称是纯数字
        return parseInt(cardName, 10);
    } else {
        // 解析卡牌名称中的数字部分
        const match = cardName.match(/^(\d+)/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
    }
    return 0; // 默认返回 0
}

function sortHandCards() {
    console.log("开始排序手牌..."); // 调试日志

    // 定义卡牌大小和花色的排序规则
    const suitOrder = ['❤', '♦', '♣', '♠']; // 花色随机生成的规则

    hand.sort((a, b) => {
        // 解析卡牌名称中的数字部分
        const rankA = getCardRank(a.name); // 使用新增的 getCardRank 方法
        const rankB = getCardRank(b.name);

        if (rankA !== rankB) {
            return rankA - rankB; // 卡牌大小优先级
        }

        // 如果卡牌大小相同，则按花色排序
        const suitIndexA = suitOrder.indexOf(a.suit);
        const suitIndexB = suitOrder.indexOf(b.suit);
        return suitIndexA - suitIndexB;
    });

    // 更新手牌容器显示
    const handContainer = document.getElementById('hand-cards');
    if (handContainer) {
        handContainer.innerHTML = ''; // 清空手牌容器
        for (const card of hand) {
            const cardElement = document.createElement('div');
            cardElement.className = 'hand-card';

            // 根据花色设置颜色
            switch (card.suit) {
                case '❤':
                    cardElement.style.color = 'red';
                    break;
                case '♦':
                    cardElement.style.color = 'red';
                    break;
                case '♣':
                    cardElement.style.color = 'black';
                    break;
                case '♠':
                    cardElement.style.color = 'black';
                    break;
                default:
                    cardElement.style.color = 'black'; // 默认黑色
            }

            cardElement.textContent = `${card.name}`;
            handContainer.appendChild(cardElement);
        }
    } else {
        console.error("未找到手牌容器元素！");
    }

    // 更新手牌数显示
    updateHandCount();
}

function parseCardInfo(cardText) {
    const match = cardText.match(/^([^\d\s]+)([❤♦♣♠])$/);
    if (!match) {
        console.error(`无法解析卡牌名称: ${cardText}`);
        return { type: '', suit: '' };
    }
    return { type: match[1], suit: match[2] };
}

function drawBoss() {
    if (!currentBoss) {
        const bossCards = document.querySelectorAll('.boss-card');
        if (bossCards.length === 0) {
            console.error("没有可用的 Boss 卡！");
            alert("没有可以用的 Boss 卡！");
            return;
        }

        // 定义 Boss 类型的优先级
        const bossPriority = ['J', 'Q', 'K'];

        let selectedCard = null;

        // 按照优先级顺序查找并随机选择一张 Boss 卡
        for (const type of bossPriority) {
            const filteredCards = Array.from(bossCards).filter(card => card.textContent.includes(type));
            if (filteredCards.length > 0) {
                const randomIndex = Math.floor(Math.random() * filteredCards.length);
                selectedCard = filteredCards[randomIndex];
                break; // 找到后立即退出循环
            }
        }

        if (!selectedCard) {
            console.error("未找到符合条件的 Boss 卡！");
            alert("未找到符合条件的 Boss 卡！");
            return;
        }

        // 更新当前 Boss 显示
        currentBoss = selectedCard.textContent;

        const currentBossCard = document.querySelector('.current-boss-card');
        if (currentBossCard) {
            currentBossCard.classList.remove('hidden');

            // ✅ 修改点：修复花色提取逻辑
            const parsedInfo = parseCardInfo(currentBoss); // 解析卡牌名称
            const bossName = parsedInfo.type; // 提取 Boss 名称（如 "骑士"）
            const bossSuit = parsedInfo.suit || selectedCard.getAttribute('data-suit'); // 优先使用解析结果

            if (!bossSuit) {
                console.error("无法获取 Boss 花色符号！");
                alert("无法加载 Boss 数据，请检查卡牌配置！");
                return;
            }

            let health, attack;

            // 根据 Boss 名称和类型查找对应的生命值和攻击力
            const matchingBoss = window.bossCards.find(card =>
                card.name.startsWith(bossName) && card.suit === bossSuit
            );

            if (matchingBoss) {
                health = matchingBoss.defense; // 生命值等于防御值
                attack = matchingBoss.attack;
            } else {
                console.error("未找到匹配的 Boss 数据！", { name: bossName, suit: bossSuit });
                health = 20; // 默认生命值
                attack = 10; // 默认攻击力
            }

            // 动态更新 Boss 的生命值和攻击力显示
            document.getElementById('boss-health').textContent = health;
            document.getElementById('boss-attack').textContent = attack;

            currentBossCard.innerHTML = `${currentBoss}<br>生命: ${health}<br>攻击: ${attack}`;

            // 设置 data-suit 属性以便后续颜色更新
            currentBossCard.setAttribute('data-suit', bossSuit);

            // 更新颜色
            updateBossCardColors();
        } else {
            console.error("未找到当前 Boss 卡显示元素！");
        }

        // 更新已击败 Boss 数量
        defeatedBossCount++;
        updateDefeatedBossCount();
    } else {
        alert("已经有 Boss 在场，请先完成当前战斗！");
    }
}

function updateBossCardColors() {
    // 更新所有 boss 卡的颜色
    const bossCards = document.querySelectorAll('.boss-card');
    bossCards.forEach(card => {
        const suitSymbol = card.getAttribute('data-suit'); // 使用 data-suit 属性获取花色
        if (!suitSymbol) {
            console.warn("Boss 卡缺少花色信息，使用默认黑色");
            card.classList.add('black'); // 默认黑色类
            return;
        }

        switch (suitSymbol) {
            case '❤':
            case '♦':
                card.classList.add('red'); // 添加红色类
                break;
            case '♣':
            case '♠':
                card.classList.add('black'); // 添加黑色类
                break;
            default:
                console.warn("未知花色符号，使用默认黑色");
                card.classList.add('black'); // 默认黑色类
        }
    });

    // 更新当前 Boss 卡的颜色
    const currentBossCard = document.querySelector('.current-boss-card');
    if (currentBossCard && currentBossCard.textContent.trim() !== '') {
        const suitSymbol = currentBossCard.getAttribute('data-suit'); // 使用 data-suit 属性获取花色
        if (!suitSymbol) {
            console.warn("当前 Boss 卡缺少花色信息，使用默认黑色");
            currentBossCard.classList.add('black'); // 默认黑色类
            return;
        }

        // 清除之前的颜色类
        currentBossCard.classList.remove('red', 'black');

        // 根据花色符号设置颜色
        switch (suitSymbol) {
            case '❤':
            case '♦':
                currentBossCard.classList.add('red'); // 添加红色类
                break;
            case '♣':
            case '♠':
                currentBossCard.classList.add('black'); // 添加黑色类
                break;
            default:
                console.warn("未知花色符号，使用默认黑色");
                currentBossCard.classList.add('black'); // 默认黑色类
        }
    } else {
        console.warn("当前 Boss 卡为空或未找到！");
    }
}

function updateDefeatedBossCount() {
    const countDisplay = document.getElementById('defeated-boss-count');
    if (countDisplay) {
        countDisplay.textContent = `已击败 Boss 数量: ${defeatedBossCount}`;
    } else {
        console.error("未找到已击败 Boss 数量显示元素！");
    }
}

function sortBossCards() {
    const bossArea = document.querySelector('.boss-area');
    if (!bossArea) {
        console.error("未找到 boss 区域！");
        return;
    }

    // 获取所有 Boss 卡元素
    const bossCards = Array.from(bossArea.querySelectorAll('.boss-card'));
    if (bossCards.length === 0) {
        console.warn("没有可用的 Boss 卡可以排序！");
        return;
    }

    // 定义卡牌大小和花色的排序规则
    const cardRank = ['J', 'Q', 'K']; // Boss 类型优先级
    const suitOrder = ['❤', '♦', '♣', '♠']; // 花色随机生成的规则

    // 解析卡牌名称中的类型和花色
    function parseCardInfo(cardText) {
        const match = cardText.match(/^([^\d\s]+)([❤♦♣♠])$/);
        if (!match) {
            console.error(`无法解析卡牌名称: ${cardText}`);
            return { type: '', suit: '' };
        }
        return { type: match[1], suit: match[2] };
    }

    // 排序逻辑
    bossCards.sort((a, b) => {
        const infoA = parseCardInfo(a.textContent);
        const infoB = parseCardInfo(b.textContent);

        // 按照类型优先级排序
        const rankA = cardRank.indexOf(infoA.type);
        const rankB = cardRank.indexOf(infoB.type);
        if (rankA !== rankB) {
            return rankA - rankB;
        }

        // 如果类型相同，则按花色排序
        const suitIndexA = suitOrder.indexOf(infoA.suit);
        const suitIndexB = suitOrder.indexOf(infoB.suit);
        return suitIndexA - suitIndexB;
    });

    // 更新 DOM 显示
    bossArea.innerHTML = ''; // 清空 boss 区域
    bossCards.forEach(card => bossArea.appendChild(card));
}

// 在页面加载完成后调用排序函数
document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/cards')
        .then(response => response.json())
        .then(cardsData => {
            if (!cardsData || !Array.isArray(cardsData.cards) || !Array.isArray(cardsData.bossCards)) {
                console.error("获取到的卡牌数据格式不正确！");
                // 提供完整的默认卡牌数据
                window.cards = [
                    { name: "1❤", attack: 2, defense: 3, type: "普通", skill: null, suit: "❤" },
                    { name: "2♦", attack: 4, defense: 6, type: "普通", skill: null, suit: "♦" }
                ];
                window.bossCards = [
                    { name: "骑士❤", attack: 10, defense: 20, type: "Boss", skill: null, suit: "❤" },
                    { name: "皇后♦", attack: 15, defense: 30, type: "Boss", skill: null, suit: "♦" },
                    { name: "国王♠", attack: 20, defense: 40, type: "Boss", skill: null, suit: "♠" }
                ];

                initializeDeck(window.cards);

                // 初始化手牌数和抽卡堆剩余卡牌数显示
                updateHandCount();
                updateDeckCount();
                updateDeckDisplay();

                // 更新 boss 区域卡牌颜色
                updateBossCardColors();

                // 排序 boss 区域卡牌
                sortBossCards();

                // 将 boss 卡添加到页面
                const bossArea = document.querySelector('.boss-area');
                if (bossArea) {
                    bossArea.innerHTML = ''; // 清空 boss 区域
                    window.bossCards.forEach(card => {
                        const cardElement = document.createElement('div');
                        cardElement.className = 'boss-card';
                        cardElement.textContent = card.name;
                        bossArea.appendChild(cardElement);
                    });
                } else {
                    console.error("未找到 boss 区域！");
                }
                return;
            }

            window.cards = cardsData.cards;
            window.bossCards = cardsData.bossCards;

            initializeDeck(window.cards);

            // 初始化手牌数和抽卡堆剩余卡牌数显示
            updateHandCount();
            updateDeckCount();
            updateDeckDisplay();

            // 更新 boss 区域卡牌颜色
            updateBossCardColors();

            // 排序 boss 区域卡牌
            sortBossCards();

            // 将 boss 卡添加到页面
            const bossArea = document.querySelector('.boss-area');
            if (bossArea) {
                bossArea.innerHTML = ''; // 清空 boss 区域
                window.bossCards.forEach(card => {
                    const cardElement = document.createElement('div');
                    cardElement.className = 'boss-card';
                    cardElement.textContent = card.name;
                    bossArea.appendChild(cardElement);
                });
            } else {
                console.error("未找到 boss 区域！");
            }
        })
        .catch(error => {
            console.error("无法加载卡牌数据！", error);
            // 提供完整的默认卡牌数据以避免程序崩溃
            window.cards = [
                { name: "1❤", attack: 2, defense: 3, type: "普通", skill: null, suit: "❤" },
                { name: "2♦", attack: 4, defense: 6, type: "普通", skill: null, suit: "♦" }
            ];
            window.bossCards = [
                { name: "骑士❤", attack: 10, defense: 20, type: "Boss", skill: null, suit: "❤" },
                { name: "皇后♦", attack: 15, defense: 30, type: "Boss", skill: null, suit: "♦" },
                { name: "国王♠", attack: 20, defense: 40, type: "Boss", skill: null, suit: "♠" }
            ];

            initializeDeck(window.cards);

            // 初始化手牌数和抽卡堆剩余卡牌数显示
            updateHandCount();
            updateDeckCount();
            updateDeckDisplay();

            // 更新 boss 区域卡牌颜色
            updateBossCardColors();

            // 排序 boss 区域卡牌
            sortBossCards();

            // 将 boss 卡添加到页面
            const bossArea = document.querySelector('.boss-area');
            if (bossArea) {
                bossArea.innerHTML = ''; // 清空 boss 区域
                window.bossCards.forEach(card => {
                    const cardElement = document.createElement('div');
                    cardElement.className = 'boss-card';
                    cardElement.textContent = card.name;
                    bossArea.appendChild(cardElement);
                });
            } else {
                console.error("未找到 boss 区域！");
            }
        });
});

// 为抽卡按钮绑定点击事件
document.addEventListener('DOMContentLoaded', () => {

});

// 新增全局变量：用于存储当前选中的手牌
let selectedCards = [];

// 新增：为手牌添加点击事件以实现选中/取消选中
document.addEventListener('DOMContentLoaded', () => {
    const handContainer = document.getElementById('hand-cards');
    if (handContainer) {
        handContainer.addEventListener('click', (event) => {
            const cardElement = event.target.closest('.hand-card');
            if (!cardElement) return;

            // 切换选中状态
            if (selectedCards.includes(cardElement)) {
                // 取消选中
                selectedCards = selectedCards.filter(c => c !== cardElement);
                cardElement.classList.remove('selected');
            } else {
                // 添加选中
                selectedCards.push(cardElement);
                cardElement.classList.add('selected');
            }
        });
    }
});

// 新增：出牌按钮点击事件
document.addEventListener('DOMContentLoaded', () => {
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            playCard();
        });
    } else {
        console.error("未找到出牌按钮！");
    }
});

// 新增全局变量：用于存储当前游戏阶段
let currentPhase = 'draw'; // 初始阶段为抽牌阶段

function initializeGame() {
    console.log("游戏初始化...");
    initializeDeck(window.cards); // 初始化卡牌堆
    autoDrawBoss(); // 自动抽取 Boss
    advanceToNextPhase(); // 进入下一个阶段
}

function playCard() {
    console.log("开始出牌操作...");
    // 判断当前是否处于弃牌阶段
    if (currentPhase === 'discard') {
        console.log("当前处于弃牌阶段，无法出牌！");
        alert("当前处于弃牌阶段，无法出牌！");
        logGameEvent("尝试出牌失败：当前处于弃牌阶段，无法出牌！"); // 新增日志记录
        return;
    }

    // 检查是否有选中的手牌
    if (selectedCards.length === 0) {
        console.log("未选择任何手牌，无法出牌！");
        alert("请先选择要出的手牌！");
        return;
    }

    console.log(`已选择的手牌: ${selectedCards.map(card => card.textContent).join(', ')}`);

    // 处理出牌逻辑
    const playedCards = selectedCards.map(card => {
        const name = card.textContent;
        const index = hand.findIndex(cardObj => cardObj.name === name);
        if (index > -1) {
            const cardObj = hand.splice(index, 1)[0];
            discardPile.push(cardObj); // 将打出的卡牌移入弃牌堆
            updateDiscardPileDisplay(); // 实时更新弃牌堆显示
            console.log(`打出卡牌: ${cardObj.name}`);
            return cardObj;
        }
        return null;
    }).filter(card => card !== null);

    let totalAttack = playedCards.reduce((sum, card) => sum + card.attack, 0);
    console.log(`总攻击力: ${totalAttack}`);

    // 激活技能阶段
    playedCards.forEach(card => {
        activateSkill(card); // 调用技能激活函数
        if (card.suit === '♣') { // 草花牌额外处理
            totalAttack *= 2; // 确保草花牌攻击力翻倍
            console.log(`草花攻击生效！原始攻击力: ${playedCards.reduce((sum, c) => sum + c.attack, 0)} -> 翻倍后攻击力: ${totalAttack}`);
        }
    });

    // 更新当前 Boss 的生命值
    const bossHealth = parseInt(document.getElementById('boss-health').textContent);
    const newBossHealth = Math.max(0, bossHealth - totalAttack);

    document.getElementById('boss-health').textContent = newBossHealth;

    logGameEvent(`玩家使用了 ${playedCards.map(c => c.name).join(', ')}，造成 ${totalAttack} 点伤害！`);

    if (newBossHealth <= 0) {
        console.log("成功击败 Boss！");
        alert("你击败了该 Boss！");
        drawNextBoss(); // 继续挑战下一个 Boss
        advanceToNextPhase(); // 回到出牌阶段
    } else {
        const bossAttack = parseInt(document.getElementById('boss-attack').textContent);
        if (bossAttack === 0) {
            console.log("Boss 已无攻击力！");
            alert("Boss 已无攻击力！");
            drawNextBoss(); // 继续挑战下一个 Boss
            advanceToNextPhase(); // 回到出牌阶段
        } else {
            console.log("Boss 还未被击败，准备承受反击！");
            alert("Boss 还未被击败，准备承受反击！");
            takeBossCounterAttack(totalAttack); // 进入弃牌阶段
        }
    }

    clearSelectedCards();
    sortHandCards();
    updateHandCount();
}

function takeBossCounterAttack(playerAttack) {
    
  // 修改：设置当前阶段为弃牌阶段
    currentPhase = 'discard';

    console.log("进入弃牌阶段，准备抵挡 Boss 反击...");

   

    // 清除之前的事件监听器以避免重复绑定
    clearEventListeners();

    const bossHealth = parseInt(document.getElementById('boss-health').textContent);
    const bossAttack = parseInt(document.getElementById('boss-attack').textContent);

    console.log(`Boss 健康值: ${bossHealth}, 攻击力: ${bossAttack}`);

    if (bossHealth <= 0 || bossAttack === 0) {
        console.log("Boss 已被击败或无攻击力，自动进入下一阶段！");
        drawNextBoss(); // 确保切换到下一个 Boss
        currentPhase= 'play'; // 重置阶段为出牌阶段
        advanceToNextPhase(); // 回到出牌阶段
        return;
    }

    logGameEvent(`Boss 攻击力为 ${bossAttack}，玩家需要弃牌抵挡反击！`);

    console.log(`Boss 的攻击力为 ${bossAttack}，请选择手牌总攻击力不低于此值的牌进行弃牌！`);

    let totalHandValue = hand.reduce((sum, card) => sum + card.attack, 0);
    console.log(`当前手牌总攻击力: ${totalHandValue}`);

    if (totalHandValue < bossAttack) {
        console.log(`手牌总攻击力不足，无法抵挡 Boss 攻击！`);
        gameOver();
        return;
    }

    let selectedCardsForDiscard = [];

    const handContainer = document.getElementById('hand-cards');
    const discardBtn = document.getElementById('discard-btn');

    if (!handContainer || !discardBtn) {
        console.error("未找到手牌容器或弃牌按钮！");
        return;
    }

    function handleCardClick(event) {
        const cardElement = event.target.closest('.hand-card');
        if (!cardElement) return;

        if (selectedCardsForDiscard.includes(cardElement)) {
            selectedCardsForDiscard = selectedCardsForDiscard.filter(c => c !== cardElement);
            cardElement.classList.remove('selected');
        } else {
            selectedCardsForDiscard.push(cardElement);
            cardElement.classList.add('selected');
        }

        totalHandValue = selectedCardsForDiscard.reduce((sum, cardElement) => {
            const cardName = cardElement.textContent;
            const card = hand.find(cardObj => cardObj.name === cardName);
            return sum + (card ? card.attack : 0);
        }, 0);

        console.log(`当前选中的总攻击力: ${totalHandValue}`);
    }

    handContainer.addEventListener('click', handleCardClick);

    function handleDiscardClick() {
        if (totalHandValue >= bossAttack) {
            console.log("成功承受反击！");

            selectedCardsForDiscard.forEach(cardElement => {
                const cardName = cardElement.textContent;
                const index = hand.findIndex(cardObj => cardObj.name === cardName);
                if (index > -1) {
                    const discardedCard = hand.splice(index, 1)[0];
                    discardPile.push(discardedCard); // 将弃掉的卡牌移入弃牌堆
                    updateDiscardPileDisplay(); // 实时更新弃牌堆显示
                    console.log(`弃掉了 ${discardedCard.name} (${discardedCard.attack} 攻击力)`);
                }
            });

            logGameEvent(`玩家弃掉了 ${selectedCardsForDiscard.map(c => c.textContent).join(', ')}，成功抵挡 Boss 反击！`);

            sortHandCards();
            updateHandCount();

            clearSelectedCards();
            selectedCardsForDiscard = [];

            totalHandValue = hand.reduce((sum, card) => sum + card.attack, 0);
            if (totalHandValue < bossAttack) {
                console.log(`你的剩余手牌总攻击力(${totalHandValue})仍不足以抵挡 Boss 的攻击力(${bossAttack})`);
                gameOver();
            } else {
                advanceToNextPhase(); // 回到出牌阶段
            }
        } else {
            console.log("手牌总攻击力不足，请重新选择！");
        }
    }

    discardBtn.addEventListener('click', handleDiscardClick);

    // 存储事件处理器以便后续清理
    handContainer._clickHandlers = [handleCardClick];
    discardBtn._clickHandlers = [handleDiscardClick];

  
}

function advanceToNextPhase() {
    console.log(`当前游戏阶段: ${currentPhase}`);
    if (currentPhase === 'draw') {
        console.log("进入抽牌阶段...");
        // 抽牌阶段：初始化手牌
        const initialHandSize = 12;
        while (hand.length < initialHandSize && deck.length > 0) {
            hand.push(deck.shift()); // 从卡组顶部抽取一张牌
        }
        sortHandCards(); // 排序手牌
        updateHandCount(); // 更新手牌数显示
        currentPhase = 'play'; // 进入出牌阶段
        logGameEvent("进入出牌阶段..."); // 新增：记录当前阶段
    } else if (currentPhase === 'play') {
        console.log("进入出牌阶段...");
        // 出牌阶段：等待玩家操作
        logGameEvent("当前处于出牌阶段..."); // 新增：记录当前阶段
    } else if (currentPhase === 'discard') {
        console.log("进入弃牌阶段...");
        // 弃牌阶段：等待玩家操作
        logGameEvent("当前处于弃牌阶段..."); // 新增：记录当前阶段
        // 确保不会跳过弃牌阶段
        return;
    }
}

// 新增：清除事件监听器的公共方法
function clearEventListeners() {
    const handContainer = document.getElementById('hand-cards');
    const discardBtn = document.getElementById('discard-btn');

    if (handContainer) {
        const clickHandlers = handContainer._clickHandlers || [];
        clickHandlers.forEach(handler => {
            handContainer.removeEventListener('click', handler);
        });
        delete handContainer._clickHandlers; // 删除存储的事件处理器
    }

    if (discardBtn) {
        const clickHandlers = discardBtn._clickHandlers || [];
        clickHandlers.forEach(handler => {
            discardBtn.removeEventListener('click', handler);
        });
        delete discardBtn._clickHandlers; // 删除存储的事件处理器
    }
}

// 新增：红桃技能逻辑
function activateSkill(card) {
    switch (card.suit) {
        case '❤':
            console.log(`红桃治疗生效！从弃牌堆抽取 ${getCardValue(card)} 张牌并放回卡组底部。`);
            const drawCount = Math.min(discardPile.length, getCardValue(card));
            for (let i = 0; i < drawCount; i++) {
                const drawnCard = discardPile.pop(); // 从弃牌堆顶部取出一张牌
                deck.unshift(drawnCard); // 将牌放回卡组底部
            }
            updateDeckDisplay(); // 更新卡牌堆显示
            updateDiscardPileDisplay(); // 更新弃牌堆显示
            updateDeckCount(); // 实时更新抽卡堆剩余卡牌数

            logGameEvent(`红桃治疗生效！从弃牌堆抽取了 ${drawCount} 张牌并放回卡组底部。`);
            break;
        case '♦':
            console.log(`方片抽牌生效！从卡组抽取 ${getCardValue(card)} 张牌。`);
            const drawFromDeckCount = Math.min(deck.length, getCardValue(card));
            for (let i = 0; i < drawFromDeckCount && hand.length < 12; i++) { // 增加手牌上限检查
                if (deck.length > 0) { // 修改：使用 length 属性检查是否为空
                    hand.push(deck.shift()); // 从卡组顶部抽取一张牌
                }
            }
            sortHandCards(); // 排序手牌
            updateHandCount(); // 更新手牌数显示
            updateDeckDisplay(); // 实时更新卡牌堆显示
            updateDeckCount(); // 实时更新抽卡堆剩余卡牌数

            logGameEvent(`方片抽牌生效！从卡组抽取了 ${drawFromDeckCount} 张牌。`);
            break;
        case '♣':
            console.log(`草花攻击生效！造成双倍伤害！`);
            logGameEvent(`草花攻击生效！造成双倍伤害！`);
            break;
        case '♠':
            console.log(`黑桃防御生效！Boss 攻击力永久降低了 ${getCardValue(card)} 点。`);
            const bossAttackElement = document.getElementById('boss-attack');
            if (bossAttackElement) {
                let currentAttack = parseInt(bossAttackElement.textContent);
                const defenseValue = getCardValue(card);
                currentAttack = Math.max(0, currentAttack - defenseValue);
                bossAttackElement.textContent = currentAttack;

                logGameEvent(`黑桃防御生效！Boss 攻击力永久降低了 ${defenseValue} 点。`);
            }
            break;
    }
}

// 新增方法：获取卡牌数值
function getCardValue(card) {
    const name = card.name;
    if (/^\d+$/.test(name)) { // 如果卡牌名称是纯数字
        return parseInt(name, 10);
    } else {
        // 解析卡牌名称中的数字部分
        const match = name.match(/^(\d+)/);
        if (match && match[1]) {
            return parseInt(match[1], 10);
        }
    }
    return 0; // 默认返回 0
}

// 新增：绘制下一个Boss
function drawNextBoss() {
    if (!currentBoss) {
        console.error("没有当前 Boss，无法切换！");
        return;
    }

    // 查找下一个可用的 Boss 卡
    const bossCards = document.querySelectorAll('.boss-card');
    let nextBossCard = null;

    for (const card of bossCards) {
        if (card.textContent.trim() !== currentBoss) {
            nextBossCard = card;
            break;
        }
    }

    if (nextBossCard) {
        // 更新当前 Boss 显示
        currentBoss = nextBossCard.textContent;

        const currentBossCard = document.querySelector('.current-boss-card');
        if (currentBossCard) {
            currentBossCard.classList.remove('hidden');

            // 解析卡牌名称
            const parsedInfo = parseCardInfo(currentBoss);
            const bossName = parsedInfo.type;
            const bossSuit = parsedInfo.suit || nextBossCard.getAttribute('data-suit');

            if (!bossSuit) {
                console.error("无法获取 Boss 花色符号！");
                alert("无法加载 Boss 数据，请检查卡牌配置！");
                return;
            }

            let health, attack;

            // 根据 Boss 名称和类型查找对应的生命值和攻击力
            const matchingBoss = window.bossCards.find(card =>
                card.name.startsWith(bossName) && card.suit === bossSuit
            );

            if (matchingBoss) {
                health = matchingBoss.defense; // 生命值等于防御值
                attack = matchingBoss.attack;
            } else {
                console.error("未找到匹配的 Boss 数据！", { name: bossName, suit: bossSuit });
                health = 20; // 默认生命值
                attack = 10; // 默认攻击力
            }

            // 动态更新 Boss 的生命值和攻击力显示
            document.getElementById('boss-health').textContent = health;
            document.getElementById('boss-attack').textContent = attack;

            currentBossCard.innerHTML = `${currentBoss}<br>生命: ${health}<br>攻击: ${attack}`;

            // 设置 data-suit 属性以便后续颜色更新
            currentBossCard.setAttribute('data-suit', bossSuit);

            // 更新颜色
            updateBossCardColors();
        } else {
            console.error("未找到当前 Boss 卡显示元素！");
        }

        // 更新已击败 Boss 数量
        defeatedBossCount++;
        updateDefeatedBossCount();

        logGameEvent(`成功击败了 ${currentBoss}，继续挑战下一个 Boss！`); // 修复：将 previousBoss 替换为 currentBoss
    } else {
        logGameEvent("没有更多的 Boss 卡可供挑战！");
        alert("没有更多的 Boss 卡可供挑战！");
    }
}

// 新增：清空选中状态的公共方法
function clearSelectedCards() {
    console.log("清空选中状态...");
    selectedCards = []; // 清空选中数组
    const handContainer = document.getElementById('hand-cards');
    if (handContainer) {
        const allCards = handContainer.querySelectorAll('.hand-card');
        allCards.forEach(card => card.classList.remove('selected')); // 移除所有选中样式
    }
}

function gameOver() {
    alert("游戏结束！");
    // 清理游戏状态
    deck = [];
    hand = [];
    discardPile = [];
    currentBoss = null;
    defeatedBossCount = 0;

    // 更新显示
    updateDeckDisplay();
    updateHandCount();
    updateDiscardPileDisplay();
    updateDefeatedBossCount();
}

function updateDiscardPileDisplay() {
    const discardText = document.querySelector('.discard-text');
    if (discardText) {
        console.log(`更新弃牌堆显示: 当前弃牌堆大小为 ${discardPile.length}`);
        discardText.textContent = `弃牌堆 (${discardPile.length})`;
    } else {
        console.error("未找到弃牌堆文本元素！");
    }
}

// 更新卡牌堆显示
function updateDeckDisplay() {
    const deckText = document.querySelector('.deck-text');
    if (deckText) {
        console.log(`更新卡牌堆显示: 当前卡牌堆大小为 ${deck.length}`);
        deckText.textContent = `卡牌堆 (${deck.length})`;
    } else {
        console.error("未找到卡牌堆文本元素！");
    }
}

// 新增方法：监听游戏状态更新事件
function listenForGameStateUpdates() {
    const socketUrl = "ws://localhost:8080"; // WebSocket 地址
    let socket;

    function connectWebSocket() {
        try {
            console.log("尝试连接 WebSocket...");
            socket = new WebSocket(socketUrl);

            // 监听 WebSocket 打开事件
            socket.onopen = function(event) {
                console.log("WebSocket 连接已成功建立！");
            };

            // 监听 WebSocket 消息事件
            socket.onmessage = function(event) {
                const data = JSON.parse(event.data);
                if (data.type === 'stateUpdated') {
                    console.log("收到游戏状态更新通知！");
                    updateBossDeckDisplay(); // 更新 Boss 卡组显示
                    updateDiscardPileDisplay(); // 更新弃牌堆显示
                    updateDeckDisplay(); // 更新卡牌堆显示
                }
            };

            // 监听 WebSocket 错误事件
            socket.onerror = function(error) {
                console.error("WebSocket 连接发生错误:", error);
                alert("无法连接到服务器，请检查网络或服务器配置！");
                setTimeout(connectWebSocket, 5000); // 5秒后尝试重新连接
            };

            // 监听 WebSocket 关闭事件
            socket.onclose = function(event) {
                console.warn("WebSocket 连接已关闭。原因:", event.reason || "未知原因");
                alert("与服务器的连接已断开，请刷新页面重试！");
                setTimeout(connectWebSocket, 5000); // 5秒后尝试重新连接
            };
        } catch (e) {
            console.error("WebSocket 初始化失败:", e);
            alert("WebSocket 初始化失败，请检查地址是否正确！");
        }
    }

    // 在页面加载完成后启动监听
    document.addEventListener('DOMContentLoaded', () => {
        connectWebSocket();
    });
}

// 在页面加载完成后启动监听
document.addEventListener('DOMContentLoaded', () => {
    listenForGameStateUpdates();
});

// 新增：抽卡函数
function drawCard() {
    if (deck.length === 0) {
        alert("卡组已空！");
        return;
    }

    // 从卡组顶部抽取一张牌
    const drawnCard = deck.shift();
    hand.push(drawnCard); // 将抽到的牌加入手牌

    // 更新手牌和卡组显示
    sortHandCards(); // 排序手牌
    updateHandCount(); // 更新手牌数显示
    updateDeckDisplay(); // 更新卡牌堆显示
    updateDeckCount(); // 更新抽卡堆剩余卡牌数显示

    console.log(`成功抽取了一张牌: ${drawnCard.name}`);
}

// 新增：日志记录函数
function logGameEvent(message) {
    const logContainer = document.getElementById('game-log');
    if (!logContainer) {
        console.error("未找到日志容器！");
        return;
    }

    const logEntry = document.createElement('p');
    logEntry.textContent = message;
    logContainer.appendChild(logEntry);

    // 滚动到底部
    logContainer.scrollTop = logContainer.scrollHeight;
}
