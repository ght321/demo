function shuffleDeck(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]]; // 洗牌逻辑
    }
}

function initializeDeck(cards) {
    // 使用所有卡牌
    deck = cards;

    console.log("初始化卡牌堆:", deck); // 调试日志

    if (!Array.isArray(deck) || deck.length === 0) {
        console.error("卡牌堆初始化失败，未找到符合条件的卡牌！");
        // 提供默认卡牌数据
        deck = [
            { name: "1❤", attack: 2, defense: 3, type: "普通", skill: null, suit: "❤" },
            { name: "2♦", attack: 4, defense: 6, type: "普通", skill: null, suit: "♦" }
        ];
    }

    shuffleDeck(deck); // 洗牌

    // 更新卡牌堆显示
    updateDeckDisplay();
}

// 新增全局变量声明
let hand = []; // 手牌数组
let discardPile = []; // 弃牌堆数组
let currentBoss = null; // 当前 Boss
let defeatedBossCount = 0; // 已击败 Boss 数量

function updateDeckDisplay() {
    const deckText = document.querySelector('.deck-text');
    if (deckText) {
        deckText.textContent = `卡牌堆 (${deck.length})`;
    } else {
        console.error("未找到抽卡堆文本元素！");
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

// 新增：将 cardRank 定义为全局变量
const cardRank = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function getCardRank(name) {
    console.log("解析卡牌名称:", name); // 调试日志
    const match = name.match(/^(\d+|[^0-9]+)/); // 匹配数字或非数字部分
    if (match && match[1]) {
        const value = match[1];
        return isNaN(value) ? cardRank.indexOf(value) : parseInt(value, 10);
    }
    console.error("无法解析卡牌名称:", name); // 调试日志
    return -1; // 默认返回无效值
}

function sortHandCards() {
    console.log("开始排序手牌..."); // 调试日志

    // 定义卡牌大小和花色的排序规则
    const suitOrder = ['❤', '♦', '♣', '♠']; // 花色随机生成的规则

    hand.sort((a, b) => {
        // 解析卡牌名称中的数字部分
        const rankA = getCardRank(a.name);
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

function drawCard() {
    if (deck.length === 0) {
        console.error("抽卡堆已空！");
        return;
    }

    // 检查手牌是否已满
    if (hand.length >= 12) {
        alert("手牌已满，无法继续抽卡！");
        return;
    }

    // 从卡牌堆顶部抽取一张卡牌
    const drawnCard = deck.pop();

    // 将抽到的卡牌添加到手牌数组
    hand.push(drawnCard);

    // 排序手牌
    sortHandCards();

    // 更新卡牌堆剩余数量显示
    updateDeckCount();
    updateDeckDisplay(); // 新增：同步更新卡牌堆显示

    // 清空选中状态
    selectedCards = [];
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
    const drawBtn = document.getElementById('draw-btn');
    if (drawBtn) {
        drawBtn.addEventListener('click', drawCard);
    } else {
        console.error("未找到抽卡按钮！");
    }
});

// 为挑战按钮绑定点击事件
document.addEventListener('DOMContentLoaded', () => {
    const challengeBtn = document.getElementById('challenge-btn');
    if (challengeBtn) {
        challengeBtn.addEventListener('click', drawBoss);
    } else {
        console.error("未找到挑战按钮！");
    }
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
        playBtn.addEventListener('click', playCard);
    } else {
        console.error("未找到出牌按钮！");
    }
});

function playCard() {
    if (selectedCards.length === 0) {
        alert("请先选择要出的手牌！");
        return;
    }

    // 获取选中的卡牌数据
    const playedCards = selectedCards.map(card => {
        const name = card.textContent;
        const index = hand.findIndex(cardObj => cardObj.name === name);
        if (index > -1) {
            return hand.splice(index, 1)[0]; // 从手牌数组中移除并返回
        }
        return null;
    }).filter(card => card !== null);

    // 计算总攻击力
    const totalAttack = playedCards.reduce((sum, card) => sum + card.attack, 0);

    // 更新当前 Boss 的生命值
    const bossHealth = parseInt(document.getElementById('boss-health').textContent);
    const newBossHealth = Math.max(0, bossHealth - totalAttack);

    // 将选中的牌加入弃牌堆
    discardPile.push(...playedCards); // 立即将选中的牌加入弃牌堆

    // 更新 Boss 生命值显示
    document.getElementById('boss-health').textContent = newBossHealth;

    // 检查战斗结果
    if (newBossHealth <= 0) {
        // 新增逻辑：判断是否感化或击败
        if (totalAttack === bossHealth) {
            alert("你感化了该 Boss！将其加入你的牌库。");
            // 将 Boss 加入手牌区
            const currentBossCard = document.querySelector('.current-boss-card');
            if (currentBossCard) {
                const bossName = currentBossCard.textContent.split('<br>')[0].trim(); // 提取Boss名称
                const matchingBoss = window.bossCards.find(card => card.name === bossName);
                if (matchingBoss) {
                    hand.push(matchingBoss); // 将Boss加入手牌
                }
            }
        } else {
            alert("你击败了该 Boss！");
            // 不需要额外处理，因为已经将选中的牌加入弃牌堆
        }

        // 更新弃牌堆显示
        updateDiscardPileDisplay();

        // 如果还有 Boss 卡，则翻开下一张 Boss 卡
        drawNextBoss();
    } else {
        alert("Boss 还未被击败，准备承受反击！");
        // 承受 Boss 反击
        takeBossCounterAttack(totalAttack);
    }

    // 清空选中状态
    clearSelectedCards(); // 调用公共方法
    sortHandCards(); // 排序手牌
    updateHandCount(); // 更新手牌数显示
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
    } else {
        alert("没有更多的 Boss 卡可供挑战！");
    }
}

// 新增：清除事件监听器的公共方法
function clearEventListeners() {
    const handContainer = document.getElementById('hand-cards');

    if (handContainer) {
        // 移除手牌容器的所有点击事件监听器
        const clickHandlers = handContainer._clickHandlers || [];
        clickHandlers.forEach(handler => {
            handContainer.removeEventListener('click', handler);
        });
        handContainer._clickHandlers = []; // 清空存储的事件处理器
    }
}

function takeBossCounterAttack(playerAttack) {
    const bossAttack = parseInt(document.getElementById('boss-attack').textContent);
    const requiredHealth = bossAttack;

    // 提示玩家选择弃牌
    alert(`Boss 的攻击力为 ${bossAttack}，请选择手牌总攻击力不低于此值的牌进行弃牌！`);

    // 计算当前手牌总攻击力
    const totalHandValue = hand.reduce((sum, card) => sum + card.attack, 0);

    if (totalHandValue < requiredHealth) {
        console.log("手牌总攻击力不足，无法抵挡 Boss 攻击！");
        alert(`你的手牌总攻击力(${totalHandValue})不足以抵挡 Boss 的攻击力(${requiredHealth})`);
        gameOver(); // 调用游戏结束逻辑
        return;
    }

    // 清除已有事件监听器（避免重复绑定）
    clearEventListeners();

    // 新增：允许用户逐步选择弃牌
    let selectedCardsForDiscard = []; // 存储用户选择的手牌

    // 获取手牌容器和弃牌按钮
    const handContainer = document.getElementById('hand-cards');
    const discardBtn = document.getElementById('discard-btn');

    if (!handContainer || !discardBtn) {
        console.error("未找到手牌容器或弃牌按钮！");
        return;
    }

    // 新增：为手牌添加点击事件以实现选中/取消选中
    function handleCardClick(event) {
        const cardElement = event.target.closest('.hand-card');
        if (!cardElement) return;

        // 切换选中状态
        if (selectedCardsForDiscard.includes(cardElement)) {
            selectedCardsForDiscard = selectedCardsForDiscard.filter(c => c !== cardElement);
            cardElement.classList.remove('selected');
        } else {
            selectedCardsForDiscard.push(cardElement);
            cardElement.classList.add('selected');
        }

        // 动态提示当前选中的总攻击力
        const totalSelectedAttack = selectedCardsForDiscard.reduce((sum, cardElement) => {
            const cardName = cardElement.textContent;
            const card = hand.find(cardObj => cardObj.name === cardName);
            return sum + (card ? card.attack : 0); // 累加攻击力
        }, 0);

        console.log(`当前选中的总攻击力: ${totalSelectedAttack}`);
    }

    // 绑定手牌点击事件
    handContainer._clickHandlers = [handleCardClick]; // 存储事件处理器
    handContainer.addEventListener('click', handleCardClick);

    // 定义弃牌按钮点击事件
    function handleDiscardClick() {
        // 动态计算当前选中的手牌总攻击力
        const totalSelectedAttack = selectedCardsForDiscard.reduce((sum, cardElement) => {
            const cardName = cardElement.textContent;
            const card = hand.find(cardObj => cardObj.name === cardName);
            return sum + (card ? card.attack : 0); // 累加攻击力
        }, 0);

        if (totalSelectedAttack >= requiredHealth) {
            alert("成功承受反击！");

            // 只移除选中的手牌
            selectedCardsForDiscard.forEach(cardElement => {
                const cardName = cardElement.textContent;
                const index = hand.findIndex(cardObj => cardObj.name === cardName);
                if (index > -1) {
                    hand.splice(index, 1); // 从手牌数组中移除选中的卡牌
                }
            });

            sortHandCards(); // 排序手牌
            updateHandCount(); // 更新手牌数显示

            // 清空选中状态
            clearSelectedCards();
            selectedCardsForDiscard = []; // 清空临时存储的选中卡片

            // 检查剩余手牌是否仍不足以抵挡 Boss 攻击
            const remainingTotalHandValue = hand.reduce((sum, card) => sum + card.attack, 0);
            if (remainingTotalHandValue < requiredHealth) {
                alert(`你的剩余手牌总攻击力(${remainingTotalHandValue})仍不足以抵挡 Boss 的攻击力(${requiredHealth})`);
                gameOver(); // 调用游戏结束逻辑
            }
        } else {
            alert("手牌总攻击力不足，请重新选择！");
        }
    }

    // 绑定弃牌按钮点击事件
    discardBtn.addEventListener('click', handleDiscardClick);
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
        discardText.textContent = `弃牌堆 (${discardPile.length})`;
    } else {
        console.error("未找到弃牌堆文本元素！");
    }
}
