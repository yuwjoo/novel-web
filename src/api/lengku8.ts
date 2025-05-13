import { useFly } from "@/hooks/fly";
import { parseHTML } from "@/utils/html";

export interface BookChapter {
  id: string; // 章节id
  title: string; // 章节标题
}

export interface BookClassify {
  id: string; // 分类id
  title: string; // 分类标题
}

export interface SearchBookItem {
  id: string; // id
  classify: string; // 分类
  title: string; // 标题
  author: string; // 作者
  authorId: string; // 作者id
}

export interface GetBookListParams {
  current: number; // 当前页
  classify: string; // 分类
}

export interface GetBookListResult {
  data: {
    id: string; // id
    bookInfo: {
      title: string; // 标题
      author: string; // 作者
      describe: string; // 简介
      updateDate: string; // 更新时间
    };
  }[];
  total: number; // 总条数
  current: number; // 当前页
  size: number; // 每页条数
}

export interface GetBookDetailParams {
  id: string; // id
}

export interface GetBookDetailResult {
  id: string; // id
  title: string; // 标题
  author: string; // 作者
  authorId: string; // 作者id
  categorys: string[]; // 分类集合
  updateData: string; // 更新日期
  cover: string; // 封面
  intro: string; // 简介
  lastChapter: string; // 最新章节
}

export interface GetBookChaptersParams {
  id: string; // id
}

export type GetBookChaptersResult = BookChapter[];

export interface GetBookContentParams {
  id: string; // id
  chapterId: string; // 章节id
}

export interface GetBookContentResult {
  chapterId: string; // 章节id
  title: string; // 标题
  contents: string[]; // 段落集合
  preChapterId?: string; // 上一章id
  nextChapterId?: string; // 下一章id
}

export type GetBookClassifyResult = BookClassify[];

export interface SearchBookParams {
  searchValue: string; // 模糊搜索值
  current: number; // 当前页
}

export interface SearchBookResult {
  list: SearchBookItem[]; // 小说列表
  currentPage: number; // 当前页
  totalPage: number; // 总页数
}

/**
 * @description: 获取小说列表
 * @param {GetBookListParams} params 请求参数
 * @return {Promise<GetBookListResult>} 请求结果
 */
export async function getBookList(params: GetBookListParams): Promise<GetBookListResult> {
  const res = await useFly().get(`https://www3.lengku8.cc/category/${params.classify}/${params.current}.html`);
  const $ = parseHTML(res.data);

  const list = $(".CGsectionTwo-right-content")
    .children()
    .map((_i, el) => {
      const id =
        $(el)
          .find(".title")
          .attr("href")
          ?.match(/\/book\/(\d+)\//)?.[1] || "";
      const title = $(el).find(".title").text();
      const author = $(el).find("a.b").text();
      const describe = $(el).children("p").eq(2).text();
      const updateDate =
        $(el)
          .children("p")
          .eq(3)
          .text()
          .match(/[\d-]+/)?.[0] || "";
      return {
        id,
        bookInfo: {
          title,
          author,
          describe,
          updateDate
        }
      };
    })
    .toArray();
  const current = Number($(".CGsectionTwo-right-bottom-detail span").eq(0).text() || 0);
  const size = Number($(".CGsectionTwo-right-bottom-detail span").eq(2).text() || 0);
  const total = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text() || 0) * size;

  return { data: list, total, current, size };
}

/**
 * @description: 获取小说详情
 * @param {GetBookDetailParams} params 请求参数
 * @return {Promise<GetBookDetailResult>} 请求结果
 */
export async function getBookDetail(params: GetBookDetailParams): Promise<GetBookDetailResult> {
  const res = await useFly().get(`https://www3.lengku8.cc/book/${params.id}/`);
  const $ = parseHTML(res.data);

  const title = $(".BGsectionOne-top-right .title").eq(0).text(); // 标题
  const author = $(".BGsectionOne-top-right .author .b").eq(0).text(); // 作者
  const authorId = $(".BGsectionOne-top-right .author .b")
    .eq(0)
    .attr("href")!
    .match(/\/writer\/(\d+)\//)![1]; // 作者id
  const categorys = $(".BGsectionOne-top-right .category")
    .eq(0)
    .children("span")
    .map((i, el) => $(el).text())
    .toArray(); // 类别
  const updateData = $(".BGsectionOne-top-right .time").eq(0).children("span").text(); // 更新时间
  const cover = $(".BGsectionOne-top-left .lazyload").attr("_src") || ""; // 封面
  const intro = $(".BGsectionTwo-bottom").text(); // 简介
  const lastChapter = $(".BGsectionOne-top-right .newestChapter .r").text(); // 最新章节

  return { id: params.id, title, author, authorId, categorys, updateData, cover, intro, lastChapter };
}

/**
 * @description: 获取小说目录
 * @param {GetBookChaptersParams} params 请求参数
 * @return {Promise<GetBookChaptersResult>} 请求结果
 */
export async function getBookChapters(params: GetBookChaptersParams): Promise<GetBookChaptersResult> {
  const list: BookChapter[] = [];
  let currentPage = 1;
  let totalPage = 0;
  do {
    const res = await useFly().get(`https://www3.lengku8.cc/book/${params.id}/catalog/${currentPage}.html`);
    const $ = parseHTML(res.data);

    const originalOrderArrStr = res.data.match(/var originalOrder = \[(.+)\];/)?.[1]; // 章节排序映射规则数组字符串
    const tempList: BookChapter[] = [];

    if (originalOrderArrStr) {
      const originalOrder = originalOrderArrStr.split(","); // 章节排序映射规则
      $(".BCsectionTwo-top .BCsectionTwo-top-chapter a").each((i, el) => {
        tempList[originalOrder[i]] = {
          id: $(el)
            .attr("href")!
            .match(/(\d+)\.html/)![1],
          title: $(el).attr("data-real")!
        };
      });
    } else {
      $(".BCsectionTwo-top .BCsectionTwo-top-chapter").each((i, el) => {
        const pos = $(el).attr("data-x")!;
        const a = $(el).children("a");
        if (a.attr("data-link")) {
          tempList[pos] = {
            id: atob(a.attr("data-link")!).match(/(\d+)\.html/)![1],
            title: a.attr("abc-title")!
          };
        } else {
          tempList[pos] = {
            id: atob(a.attr("data-sb")!).match(/(\d+)\.html/)![1],
            title: a.attr("uc-title")!
          };
        }
      });
    }

    list.push(...tempList);
    totalPage = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text() || 0);
    currentPage++;
  } while (currentPage <= totalPage);

  return list;
}

/**
 * @description: 获取小说内容
 * @param {GetBookContentParams} params 请求参数
 * @return {Promise<GetBookContentResult>} 请求结果
 */
export async function getBookContent(params: GetBookContentParams): Promise<GetBookContentResult> {
  const res = await useFly().get(`https://www3.lengku8.cc/book/${params.id}/${params.chapterId}.html`);
  const $ = parseHTML(res.data);

  const contents: string[] = [];
  let isEnd = false;
  $(".RBGsectionThree-content p").each((i, el) => {
    if ($(el).attr("style") === "color:orange;") isEnd = true;
    if (isEnd) return;
    contents.push($(el).text());
  });
  const title = $("#chapterTitle").text(); // 章节标题
  const preChapterId = ($(".RBGsectionTwo-left .qian_page")
    .attr("href")!
    .match(/(\d+)\.html/) || [])![1]; // 上一章id
  const nextChapterId = ($(".RBGsectionTwo-right .hou_page")
    .eq(0)
    .attr("href")!
    .match(/(\d+)\.html/) || [])![1]; // 下一章id

  return { chapterId: params.chapterId, title, contents, preChapterId, nextChapterId };
}

/**
 * @description: 获取小说分类
 * @return {Promise<GetBookClassifyResult>} 请求结果
 */
export async function getBookClassify(): Promise<GetBookClassifyResult> {
  const res = await useFly().get(`https://www3.lengku8.cc/category/`);
  const $ = parseHTML(res.data);

  const list: BookClassify[] = [];
  $(".CGsectionTwo-left a").each((i, el) => {
    if (!$(el).text()) return;
    list.push({
      id: $(el).attr("href")!.match(/\d+/)![0],
      title: $(el).text()
    });
  });

  return list;
}

/**
 * @description: 模糊搜索小说
 * @param {SearchBookParams} params 请求参数
 * @return {Promise<SearchBookResult>} 请求结果
 */
export async function searchBook(params: SearchBookParams): Promise<SearchBookResult> {
  const res = await useFly().get(`https://www3.lengku8.cc/search/${params.searchValue}/${params.current}`);
  const $ = parseHTML(res.data);

  const list: SearchBookItem[] = [];
  $(".SHsectionThree-middle p").each((i, el) => {
    const span = $(el).children("span");
    list.push({
      id: span.eq(1).children("a").attr("href")?.match(/\d+/)?.[0] || "",
      classify: span.eq(0).children("a").text(),
      title: span.eq(1).children("a").text(),
      author: span.eq(2).children("a").text(),
      authorId: span.eq(2).children("a").attr("href")?.match(/\d+/)?.[0] || ""
    });
  });
  const currentPage = Number($(".CGsectionTwo-right-bottom-detail span").eq(0).text());
  const totalPage = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text());

  return { list, currentPage, totalPage };
}
