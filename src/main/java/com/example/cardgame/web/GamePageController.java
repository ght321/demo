package com.example.cardgame.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class GamePageController {
    @GetMapping("/")
    public String index() {
        return "forward:/index.html";
    }
}

