import { IGetBookContentParams, IGetBookContentResult } from "@/crawler/books/type";
import { parseHTMLStr, request } from "@/crawler/utils";

/**
 * @description: 获取小说内容
 * @param {IGetBookContentParams} params 参数
 * @return {Promise<IGetBookContentResult>} 结果
 */
export async function getBookContent(params: IGetBookContentParams): Promise<IGetBookContentResult> {
  const res = await request.get(`https://www3.lengku8.cc/book/${params.id}/${params.chapterId}.html`);
  const $ = parseHTMLStr(res.data);

  const paragraphs: string[] = [];
  let isEnd = false;
  $(".RBGsectionThree-content p").each((i, el) => {
    if ($(el).attr("style") === "color:orange;") isEnd = true;
    if (isEnd) return;
    paragraphs.push($(el).text());
  });
  const title = $("#chapterTitle").text(); // 章节标题
  const prevChapterId = ($(".RBGsectionTwo-left .qian_page")
    .attr("href")!
    .match(/(\d+)\.html/) || [])![1]; // 上一章id
  const nextChapterId = ($(".RBGsectionTwo-right .hou_page")
    .eq(0)
    .attr("href")!
    .match(/(\d+)\.html/) || [])![1]; // 下一章id

  return { chapterId: params.chapterId, title, paragraphs, prevChapterId, nextChapterId };
}
