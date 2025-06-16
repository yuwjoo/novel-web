import type { IClassify } from "@/crawler/books/type";
import { parseHTMLStr, request } from "@/crawler/utils";

/**
 * @description: 获取分类列表
 * @return {Promise<IClassify[]>} 结果
 */
export async function getClassifyList(): Promise<IClassify[]> {
  const res = await request.get(`https://www3.lengku8.cc/category/`);
  const $ = parseHTMLStr(res.data);

  const list: IClassify[] = [];
  $(".CGsectionTwo-left a").each((i, el) => {
    if (!$(el).text()) return;
    list.push({
      id: $(el).attr("href")!.match(/\d+/)![0],
      name: $(el).text()
    });
  });

  return list;
}
