import { useFly } from "@/hooks/fly";
import _$ from "jquery";

export const request = useFly(); // 请求接口函数

/**
 * @description: 解析html字符串
 * @param {string} html html字符串
 * @return {*} jquery实例
 */
export function parseHTMLStr(html: string): typeof jquery.find {
  const jquery = _$(_$.parseHTML(html));
  return jquery.find.bind(jquery);
}
