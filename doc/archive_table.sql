-- 存档与读档功能所需的数据库表设计
CREATE TABLE IF NOT EXISTS archive (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    username VARCHAR(64),
    save_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    game_state LONGTEXT NOT NULL,
    INDEX idx_user_id (user_id)
);

-- 除了 archive 存档表外，通常还需要如下表：

-- 用户表（如有用户系统）
-- 注意：表名应为 users，字段需与前端和实体类一致
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
    -- defeated_boss_count 字段已移除
);

-- 其他业务表（如有）可根据实际需求设计
-- 例如：卡牌表、日志表等

-- 但实现存档与读档功能，最核心的是 user 表和 archive 表

-- 存档和读档功能的实现思路如下：

-- 1. 用户注册/登录后，前端获得 user_id。
-- 2. 游戏过程中，前端收集当前游戏状态（如手牌、牌堆、Boss等），序列化为 JSON 字符串。
-- 3. 存档时，前端通过 POST /api/archive/save?userId=xxx，body为gameState（JSON字符串），后端将数据插入 archive 表。
-- 4. 读档时，前端通过 GET /api/archive/load?userId=xxx，后端查找 archive 表中该用户最新一条记录，返回 game_state 字段内容，前端反序列化并恢复游戏状态。
-- 5. 用户表 user 用于管理用户信息，archive 表用于存储每个用户的存档历史。

-- 关键SQL操作示例：
-- 存档：INSERT INTO archive (user_id, username, game_state, save_time) VALUES (?, ?, ?, NOW());
-- 读档：SELECT game_state FROM archive WHERE user_id=? ORDER BY save_time DESC LIMIT 1;

-- 修正：你的数据库表名应为 user，而不是 users
-- 但如果你的实体类或JPA注解写的是 @Table(name="users")，则应建表为 users

-- 解决办法1：建表名为 users（推荐与实体类保持一致）
CREATE TABLE IF NOT EXISTS users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
    -- defeated_boss_count 字段已移除
);


-- 只需保证数据库实际表名和JPA实体类注解一致即可解决  Table 'cardgame.users' doesn't exist 报错

-- 实现存档与读档功能，通常只需要2个核心表：
-- 1. user  用户表
-- 2. archive  存档表

-- 其他表（如卡牌表、日志表等）可根据业务扩展，但不是存档/读档功能的必需部分。
-- 所以只需 user 和 archive 两张表即可实现基本的存档与读档功能。

-- 修正：你的 user 表缺少 defeated_boss_count 字段，导致注册时报 Unknown column 'user0_.defeated_boss_count' in 'field list'
-- ALTER TABLE user ADD COLUMN defeated_boss_count INT DEFAULT 0;

-- 如果你的实体类 User 有其他新增字段，也需要同步在 user 表中添加对应字段
-- 确保数据库表结构与实体类字段完全一致，否则JPA/Hibernate会报错

-- 报错原因说明：
-- 1. 如果你的实体类或JPA注解写的是 @Table(name="users")，但数据库中没有 users 表，就会报 Table 'cardgame.users' doesn't exist。
-- 2. 如果你的 User 实体类有 defeatedBossCount 字段，但数据库表没有 defeated_boss_count 字段，就会报 Unknown column 'user0_.defeated_boss_count' in 'field list'。
-- 3. JPA/Hibernate 要求实体类字段和数据库表结构完全一致，否则会抛出 SQLGrammarException 或 SQLSyntaxErrorException。

-- 解决方法：
-- - 保证实体类 @Table(name="users") 和数据库表名一致（都用 users）。
-- - 保证实体类所有字段在数据库表中都存在（如 defeated_boss_count）。
-- - 每次修改实体类字段后，同步更新数据库表结构。

-- 说明：
-- 当点击“手动存档”或“进入存档”按钮时，前端要求用户先登录或注册，说明存档和读档操作必须与用户身份（userId）关联。
-- 只有登录后，前端才能获取到 userId，并将其作为参数传递给后端接口（如 /api/archive/save?userId=xxx）。
-- 这样可以确保每个用户的存档数据互不干扰，且能正确恢复自己的游戏进度。
-- 所以，用户系统（users表）和用户登录状态是实现存档/读档功能的前提条件。
