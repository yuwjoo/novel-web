import _$ from "jquery";

/**
 * @description: 解析html字符串
 * @param {string} html html字符串
 * @return {*} jquery实例
 */
export function parseHTML(html: string): typeof jquery.find {
  const jquery = _$(_$.parseHTML(html));
  return jquery.find.bind(jquery);
}
