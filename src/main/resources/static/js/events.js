// 事件绑定与监听
import { playCard } from './play.js';
import { selectedCards } from './hand.js';

export function bindHandCardClick() {
    const handContainer = document.getElementById('hand-cards');
    if (handContainer) {
        handContainer.addEventListener('click', (event) => {
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
