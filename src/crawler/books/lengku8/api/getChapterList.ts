import { IGetChapterListParams, IChapter } from "@/crawler/books/type";
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
        const pos = $(el).attr("data-x") ?? $(el).attr("data-iddd")!;
        const a = $(el).children("a");
        const bookContentLink = a.attr("data-link") ?? a.attr("data-sb") ?? a.attr("data-wawa")!;
        const id = atob(bookContentLink).match(/(\d+)\.html/)![1];
        const title = a.attr("abc-title") ?? a.attr("uc-title") ?? a.attr("data-btbt") ?? a.text().trim();

        tempList[pos] = { id, title };
      });
    }

    list.push(...tempList);
    totalPage = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text() || 0);
    currentPage++;
  } while (currentPage <= totalPage);

  return list;
}
