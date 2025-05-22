import { IGetListParams, IGetListResult, IBook } from "@/crawler/books/type";
import { parseHTMLStr, request } from "@/crawler/utils";
import { bookOrigin } from "..";
import { getDetail } from "./getDetail";

/**
 * @description: 获取小说列表
 * @param {IGetListParams} params 参数
 * @return {Promise<IGetListResult>} 结果
 */
export async function getList(params: IGetListParams): Promise<IGetListResult> {
  const res = await request.get(`https://www3.lengku8.cc/category/${params.classifyId}/${params.current}.html`);
  const $ = parseHTMLStr(res.data);

  const listPromise = $(".CGsectionTwo-right-content")
    .children()
    .map<Promise<IBook>>((_i, el) => {
      const id =
        $(el)
          .find(".title")
          .attr("href")
          ?.match(/\/book\/(\d+)\//)?.[1] || "";
      if (params.noImageMode) {
        const title = $(el).find(".title").text();
        const author = $(el).find("a.b").text();
        const authorId = $(el)
          .find("a.b")
          .attr("href")!
          .match(/\/writer\/(\d+)\//)![1]; // 作者id
        const intro = $(el).children("p").eq(2).text();
        const updateDate =
          $(el)
            .children("p")
            .eq(3)
            .text()
            .match(/[\d-]+/)?.[0] || "";
        return Promise.resolve({
          id,
          title,
          cover: "",
          intro,
          author: {
            id: authorId,
            name: author
          },
          classify: {
            id: "",
            name: ""
          },
          updateDate,
          lastChapter: {
            id: "",
            title: "",
            isLock: false
          },
          state: -1,
          origin: bookOrigin
        });
      } else {
        return getDetail({ id });
      }
    })
    .toArray();
  const list = await Promise.all(listPromise);
  const current = Number($(".CGsectionTwo-right-bottom-detail span").eq(0).text() || 0);
  const size = Number($(".CGsectionTwo-right-bottom-detail span").eq(2).text() || 0);
  const total = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text() || 0) * size;

  return { current, size, total, list };
}
