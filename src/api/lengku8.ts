import { useFly } from "@/hooks/fly";
import _$ from "jquery";

export interface BookChapter {
  id: string;
  title: string;
}

export interface BookClassify {
  id: string;
  title: string;
}

export interface GetBookContentReturn {
  chapterId: string;
  title: string;
  contents: string[];
  preChapterId?: string;
  nextChapterId?: string;
}

export interface SearchBookResult {
  id: string;
  classify: string;
  title: string;
  author: string;
  authorId: string;
}

/**
 * @description: 获取小说列表
 * @param {*} current 当前页
 * @param {*} classify 分类
 * @return {*}
 */
export function getBookList({ current, classify }) {
  return useFly()
    .get(`https://www3.lengku8.cc/category/${classify}/${current}.html`)
    .then((res) => {
      const jquery = _$(_$.parseHTML(res.data));
      const $ = (selector) => jquery.find(selector);
      const list = $(".CGsectionTwo-right-content")
        .children()
        .map((_i, el) => {
          return {
            id: $(el)
              .find(".title")
              .attr("href")!
              .match(/\/book\/(\d+)\//)![1],
            bookInfo: {
              title: $(el).find(".title").text(),
              author: $(el).find("a.b").text(),
              describe: $(el).children("p").eq(2).text(),
              updateDate: ($(el)
                .children("p")
                .eq(3)
                .text()
                .match(/[\d-]+/) || [])[0]
            }
          };
        })
        .toArray();
      const current = Number($(".CGsectionTwo-right-bottom-detail span").eq(0).text() || 0);
      const size = Number($(".CGsectionTwo-right-bottom-detail span").eq(2).text() || 0);
      const total = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text() || 0) * size;

      return { data: list, total, current, size };
    });
}

/**
 * @description: 获取小说详情
 * @param {*} id 小说id
 * @return {*}
 */
export function getBookDetail({ id }) {
  return useFly()
    .get(`https://www3.lengku8.cc/book/${id}/`)
    .then((res) => {
      const jquery = _$(_$.parseHTML(res.data));
      const $ = (selector) => jquery.find(selector);
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
      const cover = $(".BGsectionOne-top-left .lazyload").attr("_src"); // 封面
      const intro = $(".BGsectionTwo-bottom").text(); // 简介
      const lastChapter = $(".BGsectionOne-top-right .newestChapter .r").text(); // 最新章节
      return {
        id,
        title,
        author,
        authorId,
        categorys,
        updateData,
        cover,
        intro,
        lastChapter
      };
    });
}

/**
 * @description: 获取小说目录
 * @param {*} id 小说id
 * @return {*}
 */
export async function getBookChapters({ id }) {
  const list: BookChapter[] = [];
  let currentPage = 1;
  let totalPage = 0;
  do {
    const res = await useFly().get(`https://www3.lengku8.cc/book/${id}/catalog/${currentPage}.html`);
    const jquery = _$(_$.parseHTML(res.data));
    const $ = (selector) => jquery.find(selector);

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
 * @param {*} id 小说id
 * @param {*} chapterId 目录id
 * @return {*}
 */
export async function getBookContent({ id, chapterId }): Promise<GetBookContentReturn> {
  const res = await useFly().get(`https://www3.lengku8.cc/book/${id}/${chapterId}.html`);
  const jquery = _$(_$.parseHTML(res.data));
  const $ = (selector) => jquery.find(selector);
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
  return { chapterId, title, contents, preChapterId, nextChapterId };
}

/**
 * @description: 获取小说分类
 * @return {*}
 */
export async function getBookClassify() {
  const res = await useFly().get(`https://www3.lengku8.cc/category/`);
  const jquery = _$(_$.parseHTML(res.data));
  const $ = (selector) => jquery.find(selector);
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
 * @param {*} searchValue 模糊搜索值
 * @param {*} current 当前页
 * @return {*}
 */
export async function searchBook({ searchValue, current }) {
  const res = await useFly().get(`https://www3.lengku8.cc/search/${searchValue}/${current}`);
  const jquery = _$(_$.parseHTML(res.data));
  const $ = (selector) => jquery.find(selector);
  const list: SearchBookResult[] = [];
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
