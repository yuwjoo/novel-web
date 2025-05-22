import { IGetDetailParams, IBook } from "@/crawler/books/type";
import { parseHTMLStr, request } from "@/crawler/utils";
import { bookOrigin } from "..";

/**
 * @description: 获取小说详情
 * @param {IGetDetailParams} params 参数
 * @return {Promise<IBook>} 结果
 */
export async function getDetail(params: IGetDetailParams): Promise<IBook> {
  const res = await request.get(`https://www3.lengku8.cc/book/${params.id}/`);
  const $ = parseHTMLStr(res.data);

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
  const classifyId =
    $(".BGsectionOne-top-right .category").eq(0).find("span a").eq(0).attr("href")?.match(/\d+/)?.[0] || ""; // 分类id
  const updateDate = $(".BGsectionOne-top-right .time").eq(0).children("span").text(); // 更新时间
  const cover = $(".BGsectionOne-top-left .lazyload").attr("_src") || ""; // 封面
  const intro = $(".BGsectionTwo-bottom").text(); // 简介
  const lastChapter = $(".BGsectionOne-top-right .newestChapter .r").text(); // 最新章节
  const lastChapterId =
    $(".BGsectionOne-top-right .newestChapter .r")
      .attr("href")
      ?.match(/(\d+)\.html/)?.[1] || ""; // 最新章节id

  return {
    id: params.id,
    title,
    cover,
    intro,
    author: {
      id: authorId,
      name: author
    },
    classify: {
      id: classifyId,
      name: categorys[0]
    },
    updateDate,
    lastChapter: {
      id: lastChapterId,
      title: lastChapter,
      isLock: false
    },
    state: ["连载", "完结"].indexOf(categorys[2]) as IBook["state"],
    origin: bookOrigin
  };
}
