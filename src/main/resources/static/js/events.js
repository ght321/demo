// 事件绑定与监听
// 负责绑定手牌点击、出牌按钮等用户交互事件。
// 通过事件驱动调用playCard等主流程函数。
import { playCard } from './play.js';
import { selectedCards } from './hand.js';
import { advanceToNextPhase } from './phases.js';

export function bindHandCardClick() {
    const handContainer = document.getElementById('hand-cards');
    if (handContainer) {
        // 先移除之前的事件监听，防止重复绑定
        const newHandContainer = handContainer.cloneNode(true);
        handContainer.parentNode.replaceChild(newHandContainer, handContainer);
        newHandContainer.addEventListener('click', (event) => {
            const cardElement = event.target.closest('.hand-card');
            if (!cardElement) return;
            if (selectedCards.includes(cardElement)) {
                selectedCards.splice(selectedCards.indexOf(cardElement), 1);
                cardElement.classList.remove('selected');
            } else {
                selectedCards.push(cardElement);
                cardElement.classList.add('selected');
            }
        });
    }
}

export function bindPlayButton() {
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.addEventListener('click', () => {
            playCard();
        });
    }
}

// 新增：导出 bindDiscardButton，确保其它模块可用
export function bindDiscardButton() {
    // 这段代码的作用：
    // 1. 获取页面上的“弃牌”按钮（id为 discard-btn）。
    // 2. 如果按钮存在，则给它绑定一个点击事件监听器。
    // 3. 当按钮被点击时，如果 window.discardSelectedCards 是一个函数，就调用它（执行弃牌逻辑）。
    const discardBtn = document.getElementById('discard-btn');
    if (discardBtn) {
        discardBtn.addEventListener('click', () => {
            if (typeof window.discardSelectedCards === 'function'&&window.currentPhase === 'discard') {
                window.discardSelectedCards();
                advanceToNextPhase('discard');
            }
        });
    }
}
