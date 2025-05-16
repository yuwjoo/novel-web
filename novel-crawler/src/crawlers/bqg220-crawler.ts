import { BaseCrawler } from "./base-crawler";
import { logger } from "../core/logger";
import { config } from "../config";
import {
    CategoryInfo,
    NovelDetails,
    ChapterItem,
    SearchResultItem
} from "../types";
import { DbService } from "../database/db-service";

/**
 * Crawler implementation for the m.bqg220.cc website.
 */
export class Bqg220Crawler extends BaseCrawler {
    constructor(dbService: DbService) {
        super("bqg220", config.sites.bqg220.baseUrl, dbService);
    }

    async getCategories(): Promise<CategoryInfo[]> {
        logger.info(`[${this.siteIdentifier}] Fetching categories.`);
        const categories: CategoryInfo[] = [];
        // const url = this.constructUrl("/all/"); // Example: Adjust to actual category page URL
        // try {
        //     const response = await this.http.get(url);
        //     this.parser.loadHtml(response.data);

        //     // TODO: Replace with actual CSS selectors for m.bqg220.cc
        //     // Example: this.parser.find("ul.category-list > li > a").each((i, el) => {
        //     //     const name = this.parser.getText(el);
        //     //     const path = this.parser.getAttribute(el, "href");
        //     //     if (name && path) {
        //     //         const categoryId = path.split("/").pop() || path;
        //     //         categories.push({
        //     //             site: this.siteIdentifier,
        //     //             categoryId: categoryId,
        //     //             name: name,
        //     //             sourceUrl: this.constructUrl(path),
        //     //         });
        //     //     }
        //     // });
        // } catch (error) {
        //     logger.error(`[${this.siteIdentifier}] Error fetching categories: ${(error as Error).message}`);
        //     // According to user: fatal errors should exit, but here we might want to continue or return empty
        // }
        logger.warn(`[${this.siteIdentifier}] getCategories() is not fully implemented. Requires actual selectors for m.bqg220.cc.`);
        return categories;
    }

    async getNovelsByCategory(categoryUrl: string, categoryName?: string, categorySiteId?: string): Promise<NovelDetails[]> {
        logger.info(`[${this.siteIdentifier}] Fetching novels for category: ${categoryUrl}`);
        const novels: NovelDetails[] = [];
        // try {
        //     const response = await this.http.get(categoryUrl);
        //     this.parser.loadHtml(response.data);

        //     // TODO: Replace with actual CSS selectors for m.bqg220.cc novel list
        //     // Example: this.parser.find("div.novel-item").each((i, el) => {
        //     //     const title = this.parser.getText(el, ".title");
        //     //     const novelPath = this.parser.getAttribute(el, "a.link", "href");
        //     //     const author = this.parser.getText(el, ".author");
        //     //     const description = this.parser.getText(el, ".description");
        //     //     const coverUrl = this.parser.getAttribute(el, "img.cover", "src");
        //     //     if (title && novelPath) {
        //     //         const novelId = novelPath.match(/\/(\d+)\/?$/)?.[1] || novelPath;
        //     //         novels.push({
        //     //             site: this.siteIdentifier,
        //     //             novelId: novelId,
        //     //             title: title,
        //     //             author: this.getValueOrDefault(author, "author"),
        //     //             description: this.getValueOrDefault(description, "description"),
        //     //             coverUrl: coverUrl ? this.constructUrl(coverUrl) : config.defaults.coverUrl,
        //     //             categoryName: categoryName || config.defaults.categoryName,
        //     //             categoryId: categorySiteId,
        //     //             status: config.defaults.status, // Status might need to be extracted or defaulted
        //     //             sourceUrl: this.constructUrl(novelPath),
        //     //         });
        //     //     }
        //     // });
        // } catch (error) {
        //     logger.error(`[${this.siteIdentifier}] Error fetching novels from ${categoryUrl}: ${(error as Error).message}`);
        // }
        logger.warn(`[${this.siteIdentifier}] getNovelsByCategory() is not fully implemented. Requires actual selectors for m.bqg220.cc.`);
        return novels;
    }

    async getNovelDetails(novelUrl: string): Promise<NovelDetails | null> {
        logger.info(`[${this.siteIdentifier}] Fetching novel details for: ${novelUrl}`);
        // try {
        //     const response = await this.http.get(novelUrl);
        //     this.parser.loadHtml(response.data);
        //     const novelIdFromUrl = novelUrl.match(/\/(\d+)(?:\/|.html)?$/)?.[1] || novelUrl;

        //     // TODO: Replace with actual CSS selectors for m.bqg220.cc novel detail page
        //     // Example:
        //     // const title = this.parser.getText("h1.novel-title");
        //     // const author = this.parser.getText("p.author span"); // Assuming format "作者： Author Name"
        //     // const category = this.parser.getText("p.category a");
        //     // const categoryLink = this.parser.getAttribute("p.category a", "href");
        //     // const statusText = this.parser.getText("p.status span");
        //     // const lastUpdateText = this.parser.getText("p.last-update span");
        //     // const description = this.parser.getText("div.description-content");
        //     // const coverUrl = this.parser.getAttribute("img.cover-image", "src");
        //     // const latestChapterTitle = this.parser.getText("p.latest-chapter a");
        //     // const latestChapterLink = this.parser.getAttribute("p.latest-chapter a", "href");

        //     // if (!title) return null;

        //     // return {
        //     //     site: this.siteIdentifier,
        //     //     novelId: novelIdFromUrl,
        //     //     title: title,
        //     //     author: this.getValueOrDefault(author?.replace(/^作者：/, "").trim(), "author"),
        //     //     description: this.getValueOrDefault(description, "description"),
        //     //     coverUrl: coverUrl ? this.constructUrl(coverUrl) : config.defaults.coverUrl,
        //     //     categoryName: this.getValueOrDefault(category, "categoryName"),
        //     //     categoryId: categoryLink ? categoryLink.match(/\/(\w+)\/?$/)?.[1] : undefined,
        //     //     status: this.getValueOrDefault(statusText, "status"),
        //     //     lastUpdateTime: lastUpdateText ? new Date(lastUpdateText) : undefined, // Needs robust date parsing
        //     //     latestChapterTitle: this.getValueOrDefault(latestChapterTitle, "latestChapterTitle"),
        //     //     latestChapterId: latestChapterLink ? latestChapterLink.match(/\/(\d+)\.html$/)?.[1] : undefined,
        //     //     sourceUrl: novelUrl,
        //     // };
        // } catch (error) {
        //     logger.error(`[${this.siteIdentifier}] Error fetching novel details from ${novelUrl}: ${(error as Error).message}`);
        // }
        logger.warn(`[${this.siteIdentifier}] getNovelDetails() is not fully implemented. Requires actual selectors for m.bqg220.cc.`);
        return null;
    }

    async getChapterList(novelUrl: string, novelSiteId: string): Promise<ChapterItem[]> {
        logger.info(`[${this.siteIdentifier}] Fetching chapter list for novel ID: ${novelSiteId} from ${novelUrl}`);
        const chapters: ChapterItem[] = [];
        // let chapterPageUrl = novelUrl; // Often the detail page has the first page of chapters or a link to all chapters
        // if (!novelUrl.includes("list") && !novelUrl.includes("chapters")) { // Heuristic, adjust as needed
        //    chapterPageUrl = this.constructUrl(`/book/${novelSiteId}/all.html`); // Example: common pattern for all chapters
        // }

        // try {
        //     const response = await this.http.get(chapterPageUrl);
        //     this.parser.loadHtml(response.data);

        //     // TODO: Replace with actual CSS selectors for m.bqg220.cc chapter list page
        //     // Example: this.parser.find("ul.chapter-list li a").each((i, el) => {
        //     //     const title = this.parser.getText(el);
        //     //     const path = this.parser.getAttribute(el, "href");
        //     //     if (title && path) {
        //     //         const chapterId = path.match(/(\d+)\.html$/)?.[1] || path;
        //     //         chapters.push({
        //     //             novelSiteId: novelSiteId,
        //     //             chapterId: chapterId,
        //     //             title: title,
        //     //             order: i + 1, // Or extract order if available
        //     //             sourceUrl: this.constructUrl(path),
        //     //         });
        //     //     }
        //     // });
        // } catch (error) {
        //     logger.error(`[${this.siteIdentifier}] Error fetching chapter list for ${novelSiteId}: ${(error as Error).message}`);
        // }
        logger.warn(`[${this.siteIdentifier}] getChapterList() is not fully implemented. Requires actual selectors for m.bqg220.cc.`);
        return chapters;
    }

    async getChapterContent(chapterUrl: string): Promise<string | null> {
        logger.info(`[${this.siteIdentifier}] Fetching content for chapter: ${chapterUrl}`);
        // try {
        //     const response = await this.http.get(chapterUrl);
        //     this.parser.loadHtml(response.data);

        //     // TODO: Replace with actual CSS selector for m.bqg220.cc chapter content
        //     // Example: const content = this.parser.getHtml("div#content"); // Or .getText() if you want plain text
        //     // if (content) {
        //     //     return content.replace(/<br\s*\/?>/gi, "\n").trim(); // Basic cleanup
        //     // }
        // } catch (error) {
        //     logger.error(`[${this.siteIdentifier}] Error fetching chapter content from ${chapterUrl}: ${(error as Error).message}`);
        // }
        logger.warn(`[${this.siteIdentifier}] getChapterContent() is not fully implemented. Requires actual selectors for m.bqg220.cc.`);
        return null;
    }

    async searchNovels(keyword: string): Promise<SearchResultItem[]> {
        const searchUrlTemplate = config.sites.bqg220.searchUrl;
        if (!searchUrlTemplate) {
            logger.warn(`[${this.siteIdentifier}] Search URL not configured.`);
            return [];
        }
        const url = searchUrlTemplate.replace("{keyword}", encodeURIComponent(keyword));
        logger.info(`[${this.siteIdentifier}] Searching for novels with keyword: "${keyword}" at ${url}`);
        const results: SearchResultItem[] = [];

        // try {
        //     const response = await this.http.get(url);
        //     this.parser.loadHtml(response.data);

        //     // TODO: Replace with actual CSS selectors for m.bqg220.cc search results page
        //     // This is highly site-specific. Some sites return JSON, others HTML.
        //     // Example for HTML results:
        //     // this.parser.find("div.result-item").each((i, el) => {
        //     //     const title = this.parser.getText(el, ".title");
        //     //     const novelPath = this.parser.getAttribute(el, "a.link", "href");
        //     //     const author = this.parser.getText(el, ".author");
        //     //     if (title && novelPath) {
        //     //         const novelId = novelPath.match(/\/(\d+)\/?$/)?.[1] || novelPath;
        //     //         results.push({
        //     //             site: this.siteIdentifier,
        //     //             novelId: novelId,
        //     //             title: title,
        //     //             author: this.getValueOrDefault(author, "author"),
        //     //             sourceUrl: this.constructUrl(novelPath),
        //     //             // Other fields like description, coverUrl might be available on search page
        //     //         });
        //     //     }
        //     // });
        // } catch (error) {
        //     logger.error(`[${this.siteIdentifier}] Error searching novels for "${keyword}": ${(error as Error).message}`);
        // }
        logger.warn(`[${this.siteIdentifier}] searchNovels() is not fully implemented. Requires actual selectors/API analysis for m.bqg220.cc.`);
        return results;
    }
}

