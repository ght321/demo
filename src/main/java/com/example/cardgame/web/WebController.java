package com.example.cardgame.web;

import com.example.cardgame.model.Card;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList; // 新增：导入 ArrayList
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Controller
public class WebController {

    @GetMapping("/")
    public String home(Model model) {
        RestTemplate restTemplate = new RestTemplate();
        
        // 修改这里：使用 Map 来接收 API 响应
        Map<String, List<Card>> cardsData = restTemplate.getForObject("http://localhost:8080/api/cards", Map.class);

        if (cardsData == null || cardsData.isEmpty()) {
            // 提供默认卡牌数据
            List<Card> defaultCards = Arrays.asList(
                new Card("1❤", 2, 3, "普通", null, "❤"),
                new Card("2♦", 4, 6, "普通", null, "♦")
            );
            model.addAttribute("cards", defaultCards);
        } else {
            // 获取普通卡牌和 Boss 卡牌
            List<Card> allCards = new ArrayList<>(); // 使用 ArrayList 初始化
            allCards.addAll(cardsData.getOrDefault("cards", new ArrayList<>())); // 使用 ArrayList
            allCards.addAll(cardsData.getOrDefault("bossCards", new ArrayList<>())); // 使用 ArrayList
            
            model.addAttribute("cards", allCards); // 将所有卡牌传递给前端
        }

        return "forward:/index.html"; // 相对路径
    }
}