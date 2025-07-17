// 事件绑定与监听
// 负责绑定手牌点击、出牌按钮等用户交互事件。
// 通过事件驱动调用playCard等主流程函数。
import { playCard } from './play.js';
import { selectedCards } from './hand.js';

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
    // ...existing code...
}
