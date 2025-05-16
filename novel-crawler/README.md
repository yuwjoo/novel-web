# Node.js 小说爬虫项目

## 项目概述

本项目是一个使用 TypeScript、Node.js、Axios、Cheerio 和 TypeORM 构建的小说爬虫程序。旨在从指定的小说网站抓取小说列表、分类、详情、章节列表和章节内容，并将数据存储到 SQLite 数据库中。

## 功能特性

- **模块化设计**：代码结构清晰，各模块职责分明，易于维护和扩展。
- **TypeScript 编写**：提供静态类型检查，增强代码健壮性和可读性。
- **数据持久化**：使用 TypeORM 将抓取的数据（小说、章节、分类）保存到 SQLite 数据库。
- **可配置的反爬虫策略**：
    - 随机 User-Agent：从预设列表中随机选择 User-Agent 发送请求。
    - 请求频率限制：可配置的请求延迟，避免对目标服务器造成过大压力。
- **站点特定爬虫**：为每个目标网站（`m.bqg220.cc` 和 `m.tbxsw.cc`）预留了爬虫实现骨架，用户需根据实际网站结构填充 CSS 选择器或 API 调用逻辑。
- **错误处理与日志**：基本的错误处理和日志记录，致命错误会导致程序退出并打印错误信息到控制台。
- **默认值处理**：当某些字段抓取不到时，会使用预设的合理默认值。

## 项目结构

```
novel-crawler/
├── dist/                     # TypeScript 编译后的 JavaScript 文件
├── node_modules/             # 项目依赖
├── src/
│   ├── main.ts               # 主程序入口
│   ├── core/
│   │   ├── http-client.ts    # 封装的 HTTP 请求模块 (Axios)
│   │   ├── html-parser.ts    # 封装的 HTML 解析模块 (Cheerio)
│   │   └── logger.ts         # 日志模块
│   ├── database/
│   │   ├── entities/         # TypeORM 实体定义 (Novel, Chapter, Category)
│   │   │   ├── Novel.ts
│   │   │   ├── Chapter.ts
│   │   │   └── Category.ts
│   │   ├── data-source.ts    # TypeORM DataSource 配置
│   │   └── db-service.ts     # 数据库操作服务
│   ├── crawlers/
│   │   ├── base-crawler.ts   # 爬虫基类/接口
│   │   ├── bqg220-crawler.ts # 针对 m.bqg220.cc 的爬虫实现 (骨架)
│   │   └── tbxsw-crawler.ts  # 针对 m.tbxsw.cc 的爬虫实现 (骨架)
│   ├── config/
│   │   └── index.ts          # 配置文件 (目标网址, User-Agents, 延迟等)
│   └── types/
│       └── index.ts          # TypeScript 类型定义
├── .env                      # (可选) 环境变量, 例如数据库路径
├── .gitignore
├── package.json
├── tsconfig.json
├── todo.md                   # 项目开发任务清单
└── README.md                 # 项目说明文档
```

## 安装与运行

### 1. 环境准备

- Node.js (推荐 v16 或更高版本)
- npm (通常随 Node.js 一起安装)

### 2. 克隆与安装依赖

```bash
# 假设您已将项目文件放置在 novel-crawler 目录中
cd novel-crawler
npm install
```

### 3. 配置 (可选)

- **User-Agents 和请求延迟**：可以在 `src/config/index.ts` 文件中修改 `userAgents` 列表和 `requestDelay` 值。
- **数据库文件名**：SQLite 数据库文件默认为项目根目录下的 `novel-crawler.sqlite`，此配置在 `src/database/data-source.ts` 中。

### 4. **重要：填充站点特定选择器**

本项目提供了爬虫的骨架 (`src/crawlers/bqg220-crawler.ts` 和 `src/crawlers/tbxsw-crawler.ts`)。**您必须手动分析目标网站的 HTML 结构或 API 接口，并在这两个文件中填充正确的 CSS 选择器和数据提取逻辑。** 文件中已包含大量 `// TODO:` 注释，指引您需要修改的部分。

例如，在 `bqg220-crawler.ts` 的 `getCategories()` 方法中，您需要找到实际的分类列表元素的选择器来替换示例代码。

```typescript
// src/crawlers/bqg220-crawler.ts (示例片段)
async getCategories(): Promise<CategoryInfo[]> {
    // ...
    // TODO: Replace with actual CSS selectors for m.bqg220.cc
    // Example: this.parser.find("ul.actual-category-list > li > a").each((i, el) => {
    //     // ... 您的解析逻辑 ...
    // });
    // ...
}
```

模糊查询功能 (`searchNovels`) 可能需要分析网站的搜索是如何通过 API 调用或表单提交实现的，并相应地调整 `http-client.ts` 或特定爬虫中的请求方式。

### 5. 编译 TypeScript

```bash
npm run build
```

(此命令需要在 `package.json` 的 `scripts` 中定义，例如：`"build": "tsc"`。如果 `package.json` 中没有 `build`脚本，请添加或直接使用 `npx tsc`。)

为了方便，您可以修改 `package.json` 的 `scripts` 部分：
```json
{
  // ... other package.json content
  "main": "dist/main.js", // 确保 main 指向编译后的文件
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "tsc",
    "start": "node dist/main.js",
    "dev": "nodemon --watch src --exec ts-node src/main.ts" // 需要 ts-node 和 nodemon
  }
  // ...
}
```

### 6. 运行主程序

编译后，可以运行主程序：

```bash
npm start
```

或者，如果您配置了 `dev` 脚本并安装了 `ts-node` 和 `nodemon`，可以直接运行 TypeScript 文件进行开发：

```bash
npm run dev
```

`src/main.ts` 文件中包含了一些示例调用，您可以根据需要修改它们来启动特定网站的爬取任务。

## 注意事项

- **遵守 Robots.txt**：在对任何网站进行爬取之前，请检查其 `robots.txt` 文件，并遵守其规定。
- **法律与道德**：请确保您的爬虫行为符合相关法律法规，并尊重网站的版权和用户条款。
- **反爬虫机制**：目标网站可能会更新其反爬虫策略。如果爬虫失效，您可能需要更新 CSS 选择器、请求头或请求逻辑。
- **错误处理**：当前错误处理机制较为简单，对于生产环境可能需要更完善的重试和错误上报机制。
- **CSS 选择器和 API 依赖**：爬虫的核心功能高度依赖于目标网站的 HTML 结构和（如果使用的话）API 接口。网站结构的任何更改都可能导致爬虫失效，需要及时维护。

## 未来可能的改进

- 实现更复杂的命令行参数解析，允许用户指定目标站点、抓取范围（如特定小说、全部分类等）。
- 增加更完善的错误重试机制。
- 支持代理 IP 池。
- 实现增量更新功能，只抓取新增或更新的章节。
- 为站点特定爬虫添加单元测试或集成测试。

## 贡献

由于 CSS 选择器和网站结构会频繁变动，本项目主要提供一个可扩展的爬虫框架。欢迎您根据实际需求填充和完善特定站点的爬虫逻辑。

