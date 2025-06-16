import type { ISearchParams, ISearchResult } from "@/crawler/books/type";
import { bookOrigin } from "..";
import { parseHTMLStr, request } from "@/crawler/utils";

/**
 * @description: 模糊搜索小说
 * @param {ISearchParams} params 参数
 * @return {Promise<ISearchResult>} 结果
 */
export async function search(params: ISearchParams): Promise<ISearchResult> {
  const res = await request.get(`https://www3.lengku8.cc/search/${params.searchValue}/${params.current}`);
  const $ = parseHTMLStr(res.data);

  const list: ISearchResult["list"] = [];
  $(".SHsectionThree-middle p").each((i, el) => {
    const span = $(el).children("span");
    list.push({
      id: span.eq(1).children("a").attr("href")?.match(/\d+/)?.[0] || "",
      classify: {
        id: span.eq(0).children("a").attr("href")?.match(/\d+/)?.[0] || "",
        name: span.eq(0).children("a").text()
      },
      title: span.eq(1).children("a").text(),
      author: {
        id: span.eq(2).children("a").attr("href")?.match(/\d+/)?.[0] || "",
        name: span.eq(2).children("a").text()
      },
      origin: bookOrigin
    });
  });
  const current = Number($(".CGsectionTwo-right-bottom-detail span").eq(0).text() || 0);
  const size = list.length;
  const total = Number($(".CGsectionTwo-right-bottom-detail span").eq(1).text() || 0) * size;

  return { list, current, size, total };
}
