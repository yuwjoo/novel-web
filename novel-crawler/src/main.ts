import "reflect-metadata";
import { DbService } from "./database/db-service";
import { logger } from "./core/logger";
import { Bqg220Crawler } from "./crawlers/bqg220-crawler";
import { TbxswCrawler } from "./crawlers/tbxsw-crawler";
import { ICrawler } from "./types";

/**
 * Main application entry point.
 * This function initializes the database connection, instantiates crawlers,
 * and can be used to orchestrate crawling tasks.
 */
async function main() {
    logger.info("Application starting...");

    try {
        // Initialize database connection
        await DbService.init();
        logger.info("Database initialized successfully.");

        // Instantiate the database service
        const dbService = new DbService();

        // Instantiate crawlers
        const bqg220Crawler: ICrawler = new Bqg220Crawler(dbService);
        const tbxswCrawler: ICrawler = new TbxswCrawler(dbService);

        logger.info("Crawlers instantiated.");

        // --- Example Usage (Demonstration Purposes) ---
        // Note: The following are examples. Actual crawling logic will depend on specific needs.
        // The site-specific crawler methods (getCategories, getNovelDetails, etc.)
        // are currently placeholders and need to be implemented with actual selectors for each site.

        // Example: Fetch categories from bqg220 (will show a warning as it's not implemented)
        // logger.info("Attempting to fetch categories from bqg220...");
        // const bqgCategories = await bqg220Crawler.getCategories();
        // if (bqgCategories.length > 0) {
        //     logger.info(`Found ${bqgCategories.length} categories from bqg220. First category: ${bqgCategories[0].name}`);
        //     // You could then save these categories to the database
        //     // for (const cat of bqgCategories) {
        //     //     await dbService.saveCategory(cat);
        //     // }
        // } else {
        //     logger.warn("No categories fetched from bqg220 (implementation pending).");
        // }

        // Example: Search for a novel on tbxsw (will show a warning)
        // logger.info("Attempting to search for '斗罗大陆' on tbxsw...");
        // const searchResults = await tbxswCrawler.searchNovels("斗罗大陆");
        // if (searchResults.length > 0) {
        //    logger.info(`Found ${searchResults.length} search results on tbxsw. First result: ${searchResults[0].title}`);
        // } else {
        //     logger.warn("No search results from tbxsw (implementation pending).");
        // }

        logger.info("Main function execution example finished.");
        logger.warn("Please note: The actual crawling logic within site-specific crawlers (e.g., bqg220-crawler.ts, tbxsw-crawler.ts) needs to be completed by filling in the correct CSS selectors and parsing logic for each target website.");

    } catch (error) {
        logger.error("An error occurred in the main application:", (error as Error).message);
        if ((error as Error).stack) {
            logger.error("Stack trace:", (error as Error).stack);
        }
        // As per user requirement: "致命错误就直接退出程序"
        process.exit(1);
    } finally {
        // Gracefully close the database connection if it was initialized
        const dbInstance = new DbService(); // Re-instantiate to access close, or make AppDataSource accessible
        if (dbInstance) { // Check if dbService was successfully instantiated
            await dbInstance.close();
        }
        logger.info("Application finished and database connection closed.");
    }
}

// Execute the main function
main().catch(error => {
    // This catch is for unhandled promise rejections from main itself, though main() already has a try/catch.
    logger.error("Unhandled error during main execution:", error);
    process.exit(1);
});

