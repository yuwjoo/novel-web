import dsBridge from "dsbridge";
import { AndroidRequest } from "../types/request";

/**
 * @description: 发送网络请求
 */
export const request: AndroidRequest = (config) => {
  return new Promise((resolve, reject) => {
    const cancelable = !!config.abortSignal; // 该请求是可以被取消的
    const options = {
      url: new URL(config.url, config.baseURL || location.origin).href,
      method: config.method || "get",
      headers: config.headers || {},
      params: config.params,
      data: config.data,
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
