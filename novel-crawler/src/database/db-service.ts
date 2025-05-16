import { AppDataSource, initializeDataSource } from "./data-source";
import { Novel } from "./entities/Novel";
import { Chapter } from "./entities/Chapter";
import { Category } from "./entities/Category";
import { DeepPartial, FindOptionsWhere, Repository } from "typeorm";

/**
 * DbService provides an abstraction layer for database operations.
 * It handles the initialization of the data source and provides methods
 * for common CRUD operations on entities.
 */
export class DbService {
    private novelRepository: Repository<Novel>;
    private chapterRepository: Repository<Chapter>;
    private categoryRepository: Repository<Category>;

    constructor() {
        // Repositories are initialized after data source is ready
        if (!AppDataSource.isInitialized) {
            // This is a fallback, ideally initializeDataSource should be called at application startup.
            console.warn("DataSource not initialized. Attempting to initialize now. Call initializeDataSource() at app start.");
            // We cannot await here in constructor, so this is problematic.
            // The proper way is to ensure initializeDataSource is called and awaited before DbService is instantiated.
            // For now, we'll assume it will be initialized or throw error if used before ready.
        }
        this.novelRepository = AppDataSource.getRepository(Novel);
        this.chapterRepository = AppDataSource.getRepository(Chapter);
        this.categoryRepository = AppDataSource.getRepository(Category);
    }

    /**
     * Ensures the database connection is established.
     * This should be called once at the application startup.
     */
    static async init(): Promise<void> {
        await initializeDataSource();
    }

    /**
     * Saves a new novel or updates an existing one.
     * @param novelData - The novel data to save.
     * @returns The saved novel entity.
     */
    async saveNovel(novelData: DeepPartial<Novel>): Promise<Novel> {
        // Check if novel already exists by site and novelId
        const existingNovel = await this.novelRepository.findOne({
            where: { site: novelData.site, novelId: novelData.novelId }
        });

        if (existingNovel) {
            // Update existing novel
            Object.assign(existingNovel, novelData);
            return this.novelRepository.save(existingNovel);
        }
        // Create new novel
        const novel = this.novelRepository.create(novelData);
        return this.novelRepository.save(novel);
    }

    /**
     * Finds a novel by its site and novel ID.
     * @param site - The site identifier.
     * @param novelId - The novel ID on the source site.
     * @returns The found novel entity or null.
     */
    async findNovelBySiteId(site: string, novelId: string): Promise<Novel | null> {
        return this.novelRepository.findOne({ where: { site, novelId }, relations: ["chapters"] });
    }

    /**
    * Saves a new chapter or updates an existing one for a novel.
    * @param novel - The parent novel entity.
    * @param chapterData - The chapter data to save.
    * @returns The saved chapter entity.
    */
    async saveChapter(novel: Novel, chapterData: DeepPartial<Chapter>): Promise<Chapter> {
        const existingChapter = await this.chapterRepository.findOne({
            where: {
                novel: { id: novel.id }, // Query by novel's primary key
                chapterId: chapterData.chapterId
            }
        });

        if (existingChapter) {
            Object.assign(existingChapter, chapterData);
            existingChapter.novel = novel; // Ensure relation is set
            return this.chapterRepository.save(existingChapter);
        }

        const chapter = this.chapterRepository.create({
            ...chapterData,
            novel: novel, // Associate with the novel entity instance
        });
        return this.chapterRepository.save(chapter);
    }

    /**
     * Saves multiple chapters for a novel.
     * @param novel - The parent novel entity.
     * @param chaptersData - An array of chapter data to save.
     * @returns An array of saved chapter entities.
     */
    async saveChapters(novel: Novel, chaptersData: DeepPartial<Chapter>[]): Promise<Chapter[]> {
        const chapters: Chapter[] = [];
        for (const chapterData of chaptersData) {
            chapters.push(await this.saveChapter(novel, chapterData));
        }
        return chapters;
    }

    /**
     * Finds a chapter by its novel and chapter ID.
     * @param novelId - The ID of the parent novel.
     * @param chapterId - The chapter ID on the source site.
     * @returns The found chapter entity or null.
     */
    async findChapterByNovelAndChapterId(novelPkId: number, chapterId: string): Promise<Chapter | null> {
        return this.chapterRepository.findOne({ where: { novel: { id: novelPkId }, chapterId } });
    }

    /**
     * Saves a new category or updates an existing one.
     * @param categoryData - The category data to save.
     * @returns The saved category entity.
     */
    async saveCategory(categoryData: DeepPartial<Category>): Promise<Category> {
        const existingCategory = await this.categoryRepository.findOne({
            where: { site: categoryData.site, categoryId: categoryData.categoryId }
        });

        if (existingCategory) {
            Object.assign(existingCategory, categoryData);
            return this.categoryRepository.save(existingCategory);
        }
        const category = this.categoryRepository.create(categoryData);
        return this.categoryRepository.save(category);
    }

    /**
     * Finds a category by its site and category ID.
     * @param site - The site identifier.
     * @param categoryId - The category ID on the source site.
     * @returns The found category entity or null.
     */
    async findCategoryBySiteId(site: string, categoryId: string): Promise<Category | null> {
        return this.categoryRepository.findOne({ where: { site, categoryId } });
    }

    /**
     * Finds all categories for a given site.
     * @param site - The site identifier.
     * @returns An array of category entities.
     */
    async findCategoriesBySite(site: string): Promise<Category[]> {
        return this.categoryRepository.find({ where: { site } });
    }

    /**
     * Generic find method for novels.
     * @param options - Find options.
     * @returns An array of novel entities.
     */
    async findNovels(options?: FindOptionsWhere<Novel> | FindOptionsWhere<Novel>[]): Promise<Novel[]> {
        return this.novelRepository.find({ where: options });
    }

    /**
     * Closes the database connection.
     */
    async close(): Promise<void> {
        if (AppDataSource.isInitialized) {
            await AppDataSource.destroy();
            console.log("Data Source has been closed!");
        }
    }
}

