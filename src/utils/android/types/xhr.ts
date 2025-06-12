export type XMLHttpRequestForAndroid = XMLHttpRequest;

export interface AndroidRequestOptions {
  url: string; // 请求url
  method: string; // 请求方法
  headers: Record<string, string>; // 请求头
  timeout: number; // 超时时间
  body: string; // body数据
  cancelable: boolean; // 需要取消请求
}
