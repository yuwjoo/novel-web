import "axios";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    sendEnv: "web" | "android"; // 发送请求的环境
  }
}
