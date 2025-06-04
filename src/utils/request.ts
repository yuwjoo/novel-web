import axios from "axios";
import { androidApi } from "./android";

export const request = axios.create();

export const requestApp = axios.create({
  adapter: async (config) => {
    const res = await androidApi.request({
      url: config.url || "",
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers,
      params: config.params,
      data: config.data,
      timeout: config.timeout,
      responseType: config.responseType,
      onUploadProgress: config.onUploadProgress,
      onDownloadProgress: config.onDownloadProgress,
      abortSignal: (config.cancelToken as any)?.toAbortSignal()
    });

    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      config
    };
  }
});
