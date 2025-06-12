import { request } from "./handler/request";
import { XHR } from "./handler/xhr";

export const androidApi = {
  request,
  XMLHttpRequestForAndroid: XHR
};
