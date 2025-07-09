// ... existing code ...
package com.example.cardgame.view;

import com.example.cardgame.model.Card;
import com.example.cardgame.model.Player;

import java.util.Scanner;

public class CardGameView {
    private Scanner scanner;

    public CardGameView() {
        scanner = new Scanner(System.in);
    }

    public void showWelcomeMessage() {
        System.out.println("欢迎来到卡牌对战小游戏！");
    }

    public void showPlayerCard(Player player) {
        System.out.println(player.getName() + " 出的卡是：" + player.getCard());
    }

    public void showBattleResult(Player player1, Player player2) {
        Card card1 = player1.getCard();
        Card card2 = player2.getCard();

        System.out.println("\n=== 战斗开始 ===");
        if (card1.getAttack() > card2.getDefense()) {
            System.out.println(player1.getName() + " 的 " + card1.getName() +
                    " 攻击成功！" + player2.getName() + " 的 " + card2.getName() + " 被击败！");
        } else if (card2.getAttack() > card1.getDefense()) {
            System.out.println(player2.getName() + " 的 " + card2.getName() +
                    " 攻击成功！" + player1.getName() + " 的 " + card1.getName() + " 被击败！");
        } else {
            System.out.println("双方势均力敌，平局！");
        }
        System.out.println("==================\n");
    }

    public void promptForNextRound() {
        System.out.print("是否继续下一轮？(y/n): ");
    }

    public boolean isContinue() {
        return scanner.next().equalsIgnoreCase("y");
    }
}