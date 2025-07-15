package com.example.cardgame.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cardgame.model.User;
import com.example.cardgame.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestParam String username, @RequestParam String password) {
        return userService.register(username, password);
    }

    @PostMapping("/login")
    public User login(@RequestParam String username, @RequestParam String password) {
        return userService.login(username, password);
    }


    @PostMapping("/saveProgress")
    public String saveProgress(@RequestParam String username, @RequestParam int defeatedBossCount) {
        return userService.saveProgress(username, defeatedBossCount);
    }


    @GetMapping("/progress")
    public Integer getProgress(@RequestParam String username) {
        return userService.getProgress(username);
    }
}

