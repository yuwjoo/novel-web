import "reflect-metadata";
import { DataSource } from "typeorm";
import { Novel } from "./entities/Novel";
import { Chapter } from "./entities/Chapter";
import { Category } from "./entities/Category";
import path from "path";

// 使用 path.join 来构建数据库文件的绝对路径，确保跨平台兼容性
// __dirname 在 ES模块中不可用，但 TypeORM CLI 或 ts-node 运行时通常在 CommonJS 上下文，或者需要特定配置
// 为了简单起见，并假设项目根目录是执行上下文，我们将数据库文件放在项目根目录
// 更健壮的做法可能是通过环境变量或配置文件来指定数据库路径
const dbPath = process.env.NODE_ENV === "test" ? ":memory:" : path.join(process.cwd(), "novel-crawler.sqlite");

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: dbPath,
    synchronize: true, // 开发环境中设置为true，自动创建数据库表结构；生产环境应为false，并使用migrations
    logging: false, // 根据需要开启日志，可以是 true, "all", ["query", "error"]
    entities: [Novel, Chapter, Category],
    migrations: [], // 如果使用迁移，在此处指定迁移文件路径
    subscribers: [], // 如果使用订阅者，在此处指定
});

// 初始化数据源连接的函数
export async function initializeDataSource() {
    if (!AppDataSource.isInitialized) {
        try {
            await AppDataSource.initialize();
            console.log("Data Source has been initialized!");
        } catch (err) {
            console.error("Error during Data Source initialization:", err);
            process.exit(1); // 初始化失败则退出程序
        }
    }
    return AppDataSource;
}

