package com.example.cardgame.web;

import org.springframework.stereotype.Controller;

@Controller
public class WebController {

// 删除或注释掉 @GetMapping("/") 相关方法，避免与 GamePageController#index() 冲突
//    @GetMapping("/")
//    public String home(Model model) {
//        RestTemplate restTemplate = new RestTemplate();
//        Map<String, List<Card>> cardsData = restTemplate.getForObject("http://localhost:8080/api/cards", Map.class);
//
//        if (cardsData == null || cardsData.isEmpty()) {
//            System.err.println("无法从 API 获取卡牌数据，使用默认卡牌数据！");
//            List<Card> defaultCards = Arrays.asList(
//                    new Card("1❤", 2, 3, "普通", null, "❤"),
///                    new Card("2♦", 4, 6, "普通", null, "♦"),
///                    new Card("3♣", 6, 9, "普通", null, "♣"),
///                    new Card("4♠", 8, 12, "普通", null, "♠")
//            );
//            model.addAttribute("cards", defaultCards);
//            return "forward:/index.html";
//        }
//
//        List<Card> allCards = new ArrayList<>();
//        allCards.addAll(cardsData.getOrDefault("cards", new ArrayList<>()));
//        allCards.addAll(cardsData.getOrDefault("bossCards", new ArrayList<>()));
//
//        model.addAttribute("cards", allCards);
//        return "forward:/index.html";
//    }
}