package com.example.cardgame.web;

import com.example.cardgame.model.Card;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Controller
public class WebController {

    @GetMapping("/")
    public String home(Model model) {
        RestTemplate restTemplate = new RestTemplate();
        Map<String, List<Card>> cardsData = restTemplate.getForObject("http://localhost:8080/api/cards", Map.class);

        if (cardsData == null || cardsData.isEmpty()) {
            System.err.println("无法从 API 获取卡牌数据，使用默认卡牌数据！");
            List<Card> defaultCards = Arrays.asList(
                    new Card("1❤", 2, 3, "普通", null, "❤"),
                    new Card("2♦", 4, 6, "普通", null, "♦"),
                    new Card("3♣", 6, 9, "普通", null, "♣"),
                    new Card("4♠", 8, 12, "普通", null, "♠")
            );
            model.addAttribute("cards", defaultCards);
            return "forward:/index.html";
        }

        List<Card> allCards = new ArrayList<>();
        allCards.addAll(cardsData.getOrDefault("cards", new ArrayList<>()));
        allCards.addAll(cardsData.getOrDefault("bossCards", new ArrayList<>()));

        model.addAttribute("cards", allCards);
        return "forward:/index.html";
    }
}