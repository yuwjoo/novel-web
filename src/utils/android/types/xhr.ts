export type XMLHttpRequestForAndroid = XMLHttpRequest;

export interface AndroidRequestOptions {
  url: string; // 请求url
  method: string; // 请求方法
  headers: Record<string, string>; // 请求头
  timeout: number; // 超时时间
  body: string; // body数据
  multiparts: Multipart[]; // 分块数据集合
  cancelable: boolean; // 需要取消请求
}

export interface Multipart {
  type: "field" | "file"; // 类型
  name: string; // 名称
  value: string; // 值
  filename?: string; // 文件名称
  mimeType?: string; // 文件mime
}
