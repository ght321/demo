// 游戏状态同步与监听增强
// 拦截 increaseDefeatedBossCount 调用，自动同步 gameState
import { increaseDefeatedBossCount as originalIncreaseDefeatedBossCount } from './boss.js';

window.increaseDefeatedBossCount = function(...args) {
    const result = originalIncreaseDefeatedBossCount.apply(this, args);
    if (typeof window.updateGameState === 'function') {
        window.updateGameState();
    }
    return result;
};

// 可选：自动替换全局引用（如直接调用 window.increaseDefeatedBossCount）
export function patchIncreaseDefeatedBossCount() {
    window.increaseDefeatedBossCount = window.increaseDefeatedBossCount;
}
