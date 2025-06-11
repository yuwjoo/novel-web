import dsBridge from "dsbridge";
import { AndroidRequest, AndroidRequestConfig } from "../types/request";

/**
 * @description: 发送网络请求
 */
export const request: AndroidRequest = (config) => {
  return new Promise((resolve, reject) => {
    const cancelable = !!config.abortSignal; // 该请求是可以被取消的
    const options = {
      url: new URL(config.url, config.baseURL || location.origin).href,
      method: config.method || "get",
      headers: handleHeaders(config),
      params: config.params,
      data: handleData(config),
      timeout: config.timeout || 0,
      responseType: config.responseType,
      cancelable
    };
    let cancelToken: string;
    const handler = (value: string) => {
      const { type, data } = JSON.parse(value);
      switch (type) {
        case "setCancelToken":
          cancelToken = data;
          callCancel();
          break;
        case "uploadProgress":
          config.onUploadProgress?.(data);
          break;
        case "downloadProgress":
          config.onDownloadProgress?.(data);
          break;
        case "response":
          resolve(data);
          break;
        case "error":
          reject(data);
          break;
      }
    };
    const callCancel = () => {
      if (!config.abortSignal!.aborted) return;
      dsBridge.call("cancelRequest", cancelToken);
      reject((config.abortSignal as any)!.reason);
    };

    if (cancelable) {
      config.abortSignal!.onabort = callCancel;
    }
    dsBridge.call("request", options, handler);
  });
};

/**
 * @description: 处理请求头
 * @param {AndroidRequestConfig} config 请求配置
 * @return {Record<string, any>} 处理设置后的请求头
 */
function handleHeaders(config: AndroidRequestConfig): Record<string, any> {
  const headers = config.headers || {};
  headers["User-Agent"] = headers["User-Agent"] ?? navigator.userAgent;
  if (config.data === undefined || config.data === null) {
    delete headers["Content-Type"];
  }
  return headers;
}

/**
 * @description: 处理body数据
 * @param {AndroidRequestConfig} config 请求配置
 * @return {any} 处理设置后的body数据
 */
function handleData(config: AndroidRequestConfig): any {
  if (!config.data) return undefined; // 如果没有数据，直接返回undefined
  let data: any;
  if (typeof FormData !== "undefined" && config.data instanceof FormData) {
    data = {};
    for (const [key, value] of config.data.entries()) {
      data[key] = value;
    }
  } else {
    data = config.data;
  }

  return data;
}
