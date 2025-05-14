import { Book } from "@/types/entity/book";
import { Chapter } from "@/types/entity/chapter";
import { Classify } from "@/types/entity/classify";
import { Page } from "@/types/entity/page";

export type GetBookListParams = {
  current: Page["current"]; // 当前页
  classifyId: Classify["id"]; // 分类id
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

export type GetBookClassifyResult = Classify[];

/**
 * @description: 获取小说分类
 * @return {Promise<GetBookClassifyResult>} 请求结果
 */
export type GetBookClassify = () => Promise<GetBookClassifyResult>;

export type SearchBookParams = {
  searchValue: string; // 模糊搜索值
  current: Page["current"]; // 当前页
};

export type SearchBookResult = Page & {
  list: Pick<Book, "id" | "classify" | "author" | "title" | "origin">[]; // 小说列表
};

/**
 * @description: 模糊搜索小说
 * @param {SearchBookParams} params 请求参数
 * @return {Promise<SearchBookResult>} 请求结果
 */
export type SearchBook = (params: SearchBookParams) => Promise<SearchBookResult>;
