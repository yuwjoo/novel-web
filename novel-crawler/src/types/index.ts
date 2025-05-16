/**
 * Represents the detailed information of a novel.
 */
export interface NovelDetails {
    site: string;            // Source site identifier (e.g., "bqg220")
    novelId: string;         // Novel ID on the source site
    title: string;
    author?: string;
    authorId?: string;       // Author ID on the source site, if available
    description?: string;
    coverUrl?: string;
    categoryName?: string;
    categoryId?: string;     // Category ID on the source site, if available
    latestChapterTitle?: string;
    latestChapterId?: string; // Latest chapter ID on the source site, if available
    status: string;          // e.g., "连载中", "已完结"
    lastUpdateTime?: Date;   // Parsed date object
    sourceUrl: string;       // URL of the novel detail page
}

/**
 * Represents a chapter of a novel.
 */
export interface ChapterItem {
    novelSiteId: string;     // Novel ID on the source site (to link back)
    chapterId: string;       // Chapter ID on the source site
    title: string;
    order: number;           // Order of the chapter
    sourceUrl: string;       // URL of the chapter page
    content?: string;        // Chapter content, fetched separately
}

/**
 * Represents a category on a novel site.
 */
export interface CategoryInfo {
    site: string;            // Source site identifier
    categoryId: string;      // Category ID on the source site
    name: string;
    sourceUrl: string;       // URL of the category page
}

/**
 * Represents a search result item.
 */
export interface SearchResultItem extends Partial<NovelDetails> {
    // NovelDetails already covers most fields. Add any search-specific fields if necessary.
    // For now, we assume search results provide enough info to be a partial NovelDetails.
    // Ensure `site`, `novelId`, `title`, and `sourceUrl` are present for usability.
    site: string;
    novelId: string;
    title: string;
    sourceUrl: string;
}

/**
 * Interface for a novel crawler.
 * Defines the common methods that each site-specific crawler must implement.
 */
export interface ICrawler {
    siteIdentifier: string;
    baseUrl: string;

    /** Fetches all categories from the site. */
    getCategories(): Promise<CategoryInfo[]>;

    /** Fetches a list of novels for a given category URL. */
    getNovelsByCategory(categoryUrl: string, categoryName?: string, categorySiteId?: string): Promise<NovelDetails[]>;

    /** Fetches detailed information for a single novel. */
    getNovelDetails(novelUrl: string): Promise<NovelDetails | null>;

    /** Fetches the list of all chapters for a novel. */
    getChapterList(novelUrl: string, novelSiteId: string): Promise<ChapterItem[]>;

    /** Fetches the content of a single chapter. */
    getChapterContent(chapterUrl: string): Promise<string | null>;

    /** Searches for novels based on a keyword. */
    searchNovels(keyword: string): Promise<SearchResultItem[]>;
}

