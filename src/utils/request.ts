import axios from "axios";
import { androidApi } from "./android";

export const request = axios.create();

export const requestApp = axios.create({
  adapter: async (config) => {
    const res = await androidApi.request({ url: config.url!, ...config });
    return {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      config
    };
  }
});
