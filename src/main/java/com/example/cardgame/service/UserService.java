package com.example.cardgame.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cardgame.model.User;
import com.example.cardgame.repository.UserRepository;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public String register(String username, String password) {
        if (userRepository.findByUsername(username) != null) {
            return "用户名已存在";
        }
        User user = new User();
        user.setUsername(username);
        user.setPassword(password);
        userRepository.save(user);
        return "注册成功";
    }

    public User login(String username, String password) {
        User user = userRepository.findByUsername(username);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }

    public String saveProgress(String username) {
        User user = userRepository.findByUsername(username);
        if (user != null) {
            userRepository.save(user);
            return "进度已保存";
        }
        return "用户不存在";
    }

}
    

