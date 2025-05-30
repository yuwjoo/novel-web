import dsBridge from "dsbridge";
import { AndroidRequest } from "../types/request";

export const request: AndroidRequest = (config) => {
  return new Promise((resolve, reject) => {
    dsBridge.call(
      "request",
      {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        headers: config.headers,
        params: config.params,
        data: config.data,
        timeout: config.timeout,
        responseType: config.responseType
      },
      (value) => {
        const res = JSON.parse(value);
        if (res.type === "uploadProgress") {
          config.onUploadProgress?.(res.data);
        } else if (res.type === "downloadProgress") {
          config.onDownloadProgress?.(res.data);
        } else if (res.type === "response") {
          resolve(res.data);
        } else if (res.type === "error") {
          reject(res.data);
        }
      }
    );
  });
};
