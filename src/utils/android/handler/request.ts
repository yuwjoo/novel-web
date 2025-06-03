import dsBridge from "dsbridge";
import { AndroidRequest } from "../types/request";

/**
 * @description: 发送网络请求
 */
export const request: AndroidRequest = (config) => {
  (config as any).cancelToken.promise
    .then((res) => {
      console.log("成功", res);
    })
    .catch((err) => {
      console.log("取消", err);
    });
  console.log(config);
  return new Promise((resolve, reject) => {
    const options = {
      url: new URL(config.url, config.baseURL || location.origin).href,
      method: config.method || "get",
      headers: config.headers || {},
      params: config.params,
      data: config.data,
      timeout: config.timeout || 0,
      responseType: config.responseType
    };
    const handler = (value: string) => {
      const { type, data } = JSON.parse(value);
      switch (type) {
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

    dsBridge.call("request", options, handler);
  });
};
