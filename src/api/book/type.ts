import { Book } from "@/interfaces/book";
import { Chapter } from "@/interfaces/chapter";
import { Classify } from "@/interfaces/classify";
import { Page } from "@/interfaces/page";

export type GetBookListParams = {
  current: Page["current"]; // 当前页
  classifyId: Classify["id"]; // 分类id
  noImageMode?: boolean; // 是否无图模式
};

export type GetBookListResult = Page & {
  list: Book[]; // 小说列表
};

/**
 * @description: 获取小说列表
 * @param {GetBookListParams} params 请求参数
 * @return {Promise<GetBookListResult>} 请求结果
 */
export type GetBookList = (params: GetBookListParams) => Promise<GetBookListResult>;

export type GetBookDetailParams = {
  id: Book["id"]; // id
};

export type GetBookDetailResult = Book;

/**
 * @description: 获取小说详情
 * @param {GetBookDetailParams} params 请求参数
 * @return {Promise<GetBookDetailResult>} 请求结果
 */
export type GetBookDetail = (params: GetBookDetailParams) => Promise<GetBookDetailResult>;

export type GetBookChapterListParams = {
  id: Book["id"]; // id
};

export type GetBookChapterListResult = Chapter[];

/**
 * @description: 获取小说章节列表
 * @param {GetBookChapterListParams} params 请求参数
 * @return {Promise<GetBookChapterListResult>} 请求结果
 */
export type GetBookChapterList = (params: GetBookChapterListParams) => Promise<GetBookChapterListResult>;

export type GetBookContentParams = {
  id: Book["id"]; // id
  chapterId: Chapter["id"]; // 章节id
};

export type GetBookContentResult = {
  chapterId: Chapter["id"]; // 章节id
  title: Chapter["title"]; // 标题
  paragraphs: string[]; // 段落集合
  prevChapterId?: Chapter["id"]; // 上一章id
  nextChapterId?: Chapter["id"]; // 下一章id
};

/**
 * @description: 获取小说内容
 * @param {GetBookContentParams} params 请求参数
 * @return {Promise<GetBookContentResult>} 请求结果
 */
export type GetBookContent = (params: GetBookContentParams) => Promise<GetBookContentResult>;

export type GetBookClassifyListResult = Classify[];

/**
 * @description: 获取小说分类列表
 * @return {Promise<GetBookClassifyListResult>} 请求结果
 */
export type GetBookClassifyList = () => Promise<GetBookClassifyListResult>;

export type SearchBookParams = {
  searchValue: string; // 模糊搜索值
  current: Page["current"]; // 当前页
};

export type SearchBookResult = Page & {
  list: Pick<Book, "id" | "classify" | "author" | "title" | "bookOrigin">[]; // 小说列表
};

/**
 * @description: 模糊搜索小说
 * @param {SearchBookParams} params 请求参数
 * @return {Promise<SearchBookResult>} 请求结果
 */
export type SearchBook = (params: SearchBookParams) => Promise<SearchBookResult>;
