# Copilot Instructions for `cardgame` Project

## 项目架构概览
- **Spring Boot + 前后端分离卡牌游戏**，后端为 RESTful API，前端为静态页面+JS。
- 主要目录结构：
  - `src/main/java/com/example/cardgame/`：核心 Java 代码
    - `controller/`：游戏主流程控制器（如 `CardGameController.java`）
    - `model/`：领域模型（如 `Card.java`, `Boss.java`, `Player.java`）
    - `repository/`：数据持久化接口（JPA Repository）
    - `service/`：业务逻辑服务层
    - `web/`：REST API 控制器（如 `CardApiController.java`）
  - `src/main/resources/static/`：前端静态资源（HTML/JS/CSS）
  - `src/main/resources/application.properties`：Spring Boot 配置

## 关键开发工作流
- **构建/运行**：
  - 使用 `mvn spring-boot:run` 启动后端服务，端口默认 8080。
  - 也可用 `mvn clean package` 生成 jar 包后 `java -jar target/cardgame-1.0-SNAPSHOT.jar` 运行。
- **前端开发**：
  - 直接编辑 `static/` 下的 HTML/JS/CSS 文件，保存后自动热更新（依赖 devtools）。
- **数据库**：
  - 默认使用 H2 内存数据库，配置见 `application.properties`。
  - 启用 H2 控制台：访问 `/h2-console`。

## 项目特有约定与模式
- **卡牌/玩家/Boss 结构**：
  - `Card` 为基础类，`Boss` 继承自 `Card` 并扩展生命值/免疫等属性。
  - `Player` 拥有手牌、出牌、承伤等方法。
- **API 设计**：
  - `/api/cards` 提供所有卡牌和 Boss 卡数据，供前端初始化。
- **前后端通信**：
  - 前端通过 fetch `/api/cards` 获取卡牌数据，JS 入口为 `game.js`。
- **国际化/注释**：
  - 代码和注释多为中文，变量/类名多为英文。

## 重要文件示例
- `CardGameController.java`：游戏主流程与牌堆初始化
- `Card.java`/`Boss.java`/`Player.java`：核心数据结构
- `CardApiController.java`：卡牌数据 API
- `static/js/game.js`：前端主入口，负责数据加载与 UI 初始化

## 其他说明
- **依赖管理**：见 `pom.xml`，主要依赖 Spring Boot、JPA、H2。
- **热部署**：已集成 `spring-boot-devtools`，便于开发调试。
- **测试**：测试代码位于 `src/test/java/`，但当前未发现详细测试约定。

---
如需扩展新卡牌/技能，建议先在 `model/` 下定义数据结构，再在 `controller/` 和 `web/` 层补充逻辑和 API。

