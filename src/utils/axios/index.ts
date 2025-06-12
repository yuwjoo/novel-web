import axios, { InternalAxiosRequestConfig } from "axios";
import { onRequestFulfilled, onRequestRejected, onResponseFulfilled, onResponseRejected } from "./interceptor";

export const defaultConfig: Partial<InternalAxiosRequestConfig> = {
  timeout: 30000,
  sendEnv: "web"
};

export const request = axios.create(defaultConfig);

request.interceptors.request.use(onRequestFulfilled, onRequestRejected);
request.interceptors.response.use(onResponseFulfilled, onResponseRejected);
