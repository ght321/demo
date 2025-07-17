package com.example.cardgame.web;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cardgame.model.Archive;
import com.example.cardgame.repository.ArchiveRepository;

@RestController
@RequestMapping("/api/archive")
public class ArchiveController {

    @Autowired
    private ArchiveRepository archiveRepository;

    // 存档接口
    @PostMapping("/save")
    public String saveArchive(@RequestParam Long userId, @RequestBody String gameState) {
        if (userId == null || gameState == null || gameState.trim().isEmpty()) {
            return "参数错误";
        }
        // 调试：打印收到的gameState，确保是最新的游戏局面
        System.out.println("存档请求 userId=" + userId + " gameState=" + gameState);

        Archive archive = new Archive();
        archive.setUserId(userId);
        archive.setGameState(gameState); // 这里将前端传来的游戏状态字符串存入数据库
        archive.setSaveTime(LocalDateTime.now());
        archiveRepository.save(archive); // 这里负责将存档写入数据库
        return "存档成功";
    }

    // 读档接口
    @GetMapping("/load")
    public String loadArchive(@RequestParam Long userId) {
        return archiveRepository.findTopByUserIdOrderBySaveTimeDesc(userId)
                .map(Archive::getGameState)
                .orElse("");
    }
}
