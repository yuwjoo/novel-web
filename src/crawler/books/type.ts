/**
 * 小说爬虫
 */
export interface IBookCrawler {
  origin: IOrigin; // 小说来源

  search(params: ISearchParams): Promise<ISearchResult>; // 模糊搜索小说

  getClassifyList(): Promise<IClassify[]>; // 获取分类列表

  getList(params: IGetListParams): Promise<IGetListResult>; // 获取小说列表

  getDetail(params: IGetDetailParams): Promise<IBook>; // 获取小说详情

  getChapterList(params: IGetChapterListParams): Promise<IChapter[]>; // 获取小说章节列表

  getBookContent(params: IGetBookContentParams): Promise<IGetBookContentResult>; // 获取小说内容
}

/**
 * 模糊查询参数
 */
export interface ISearchParams {
  searchValue: string; // 模糊查询值
  current: IPage["current"]; // 当前页
}

/**
 * 模糊查询结果
 */
export interface ISearchResult extends IPage {
  list: Pick<IBook, "id" | "classify" | "author" | "title" | "origin">[]; // 小说列表
}

/**
 * 获取小说列表参数
 */
export interface IGetListParams {
  current: IPage["current"]; // 当前页
  classifyId: IClassify["id"]; // 分类id
  noImageMode?: boolean; // 是否无图模式
}

/**
 * 获取小说列表结果
 */
export interface IGetListResult extends IPage {
  list: IBook[]; // 小说列表
}

/**
 * 获取小说详情参数
 */
export interface IGetDetailParams {
  id: IBook["id"]; // id
}

/**
 * 获取小说章节列表参数
 */
export interface IGetChapterListParams {
  id: IBook["id"]; // id
}

/**
 * 获取小说内容参数
 */
export interface IGetBookContentParams {
  id: IBook["id"]; // id
  chapterId: IChapter["id"]; // 章节id
}

/**
 * 获取小说内容结果
 */
export interface IGetBookContentResult {
  chapterId: IChapter["id"]; // 章节id
  title: IChapter["title"]; // 标题
  paragraphs: string[]; // 段落集合
  prevChapterId: IChapter["id"]; // 上一章id
  nextChapterId: IChapter["id"]; // 下一章id
}

/**
 * 小说数据
 */
export interface IBook {
  id: string; // id
  title: string; // 标题
  cover: string; // 封面
  intro: string; // 简介
  author: IAuthor; // 作者
  classify: IClassify; // 分类
  updateDate: string; // 更新日期
  lastChapter: IChapter; // 最新章节
  state: -1 | 0 | 1; // 状态："未知" | "连载" | "完结"
  origin: IOrigin; // 小说来源
}

/**
 * 小说作者
 */
export interface IAuthor {
  id: string; // 作者id
  name: string; // 作者名称
}

/**
 * 小说章节
 */
export interface IChapter {
  id: string; // 章节id
  title: string; // 章节标题
  isLock: boolean; // 是否锁定
}

/**
 * 小说分类
 */
export interface IClassify {
  id: string; // 分类id
  name: string; // 分类名称
}

/**
 * 小说来源
 */
export interface IOrigin {
  key: string; // 唯一标识
  name: string; // 名称
  url: string; // 地址
}

/**
 * 分页
 */
export interface IPage {
  current: number; // 当前页
  size: number; // 每页条数
  total: number; // 总条数
}
