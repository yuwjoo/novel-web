import { httpClient, HttpClient } from "../core/http-client";
import { htmlParser, HtmlParser } from "../core/html-parser";
import { logger } from "../core/logger";
import { config } from "../config";
import {
    ICrawler,
    CategoryInfo,
    NovelDetails,
    ChapterItem,
    SearchResultItem
} from "../types";
import { DbService } from "../database/db-service";

/**
 * Abstract BaseCrawler class that provides common functionalities and a structure for site-specific crawlers.
 * Each site-specific crawler should extend this class and implement the abstract methods.
 */
export abstract class BaseCrawler implements ICrawler {
    readonly siteIdentifier: string;
    readonly baseUrl: string;
    protected http: HttpClient;
    protected parser: HtmlParser;
    protected dbService: DbService; // Added DbService for potential direct use or for subclasses

    constructor(siteIdentifier: string, baseUrl: string, dbService: DbService) {
        this.siteIdentifier = siteIdentifier;
        this.baseUrl = baseUrl;
        this.http = httpClient; // Using the singleton instance
        this.parser = htmlParser; // Using the singleton instance
        this.dbService = dbService;
        logger.info(`Initializing crawler for site: ${this.siteIdentifier} with base URL: ${this.baseUrl}`);
    }

    /**
     * Abstract method to fetch all categories from the site.
     * Must be implemented by subclasses.
     */
    abstract getCategories(): Promise<CategoryInfo[]>;

    /**
     * Abstract method to fetch a list of novels for a given category URL.
     * Must be implemented by subclasses.
     */
    abstract getNovelsByCategory(categoryUrl: string, categoryName?: string, categorySiteId?: string): Promise<NovelDetails[]>;

    /**
     * Abstract method to fetch detailed information for a single novel.
     * Must be implemented by subclasses.
     */
    abstract getNovelDetails(novelUrl: string): Promise<NovelDetails | null>;

    /**
     * Abstract method to fetch the list of all chapters for a novel.
     * Must be implemented by subclasses.
     */
    abstract getChapterList(novelUrl: string, novelSiteId: string): Promise<ChapterItem[]>;

    /**
     * Abstract method to fetch the content of a single chapter.
     * Must be implemented by subclasses.
     */
    abstract getChapterContent(chapterUrl: string): Promise<string | null>;

    /**
     * Abstract method to search for novels based on a keyword.
     * Must be implemented by subclasses.
     */
    abstract searchNovels(keyword: string): Promise<SearchResultItem[]>;

    /**
     * Helper function to construct a full URL from a relative path.
     * @param relativePath - The relative path (e.g., /book/123.html)
     * @returns The full URL.
     */
    protected constructUrl(relativePath: string): string {
        if (relativePath.startsWith("http://") || relativePath.startsWith("https://")) {
            return relativePath; // Already a full URL
        }
        return `${this.baseUrl}${relativePath.startsWith("/") ? relativePath : "/" + relativePath}`;
    }

    /**
     * Provides default value for a field if the crawled value is null, undefined or empty string.
     * @param value The crawled value.
     * @param defaultValueKey The key for the default value in config.defaults.
     * @returns The original value or the default value.
     */
    protected getValueOrDefault<K extends keyof typeof config.defaults>(
        value: string | undefined | null,
        defaultValueKey: K
    ): string {
        if (value === null || value === undefined || value.trim() === "") {
            return config.defaults[defaultValueKey] as string;
        }
        return value.trim();
    }

     /**
     * Provides default value for a field if the crawled value is null or undefined.
     * This version is for non-string types or when empty string is a valid value.
     * @param value The crawled value.
     * @param defaultValue The default value to use.
     * @returns The original value or the default value.
     */
    protected getValueOrDefaultGeneric<T>(value: T | undefined | null, defaultValue: T): T {
        if (value === null || value === undefined) {
            return defaultValue;
        }
        return value;
    }
}

