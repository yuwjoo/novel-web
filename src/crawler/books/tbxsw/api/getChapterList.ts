import type { IGetChapterListParams, IChapter } from "@/crawler/books/type";
import { parseHTMLStr, request } from "@/crawler/utils";

/**
 * @description: 获取小说章节列表
 * @param {IGetChapterListParams} params 参数
 * @return {Promise<IChapter[]>} 结果
 */
export async function getChapterList(params: IGetChapterListParams): Promise<IChapter[]> {
  const list: IChapter[] = [];
  let currentPage = 1;
  let totalPage = 0;
  do {
    const res = await request.get(`https://www3.lengku8.cc/book/${params.id}/catalog/${currentPage}.html`);
    const $ = parseHTMLStr(res.data);

    const originalOrderArrStr = res.data.match(/var originalOrder = \[(.+)\];/)?.[1]; // 章节排序映射规则数组字符串
    const tempList: IChapter[] = [];

    if (originalOrderArrStr) {
      const originalOrder = originalOrderArrStr.split(","); // 章节排序映射规则
      $(".BCsectionTwo-top .BCsectionTwo-top-chapter a").each((i, el) => {
        tempList[originalOrder[i]] = {
          id: $(el)
            .attr("href")!
            .match(/(\d+)\.html/)![1],
          title: $(el).attr("data-real")!,
          isLock: false
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
