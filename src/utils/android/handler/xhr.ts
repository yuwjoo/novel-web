import { AndroidRequestOptions, Multipart, XMLHttpRequestForAndroid } from "../types/xhr";
import dsBridge from "dsbridge";

export class XHR implements XMLHttpRequestForAndroid {
  private options: AndroidRequestOptions;
  private requestId: string;

  onreadystatechange: ((this: XMLHttpRequest, ev: Event) => any) | null;
  readyState: number;
  response: any;
  responseText: string;
  responseType: XMLHttpRequestResponseType;
  responseURL: string;
  responseXML: Document | null;
  status: number;
  statusText: string;
  timeout: number;
  upload: XMLHttpRequestUploadForAndroid;
  withCredentials: boolean;

  UNSENT: 0;
  OPENED: 1;
  HEADERS_RECEIVED: 2;
  LOADING: 3;
  DONE: 4;

  onabort: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onerror: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onload: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onloadend: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onloadstart: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onprogress: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  ontimeout: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;

  composing?: boolean | undefined;

  constructor() {
    this.options = {
      url: "",
      method: "",
      headers: {},
      timeout: 0,
      body: "",
      multiparts: [],
      cancelable: false
    };

    this.onreadystatechange = null;
    this.readyState = 0;
    this.responseText = "";
    this.responseType = "";
    this.responseURL = "";
    this.responseXML = null;
    this.status = 0;
    this.statusText = "";
    this.upload = new XMLHttpRequestUploadForAndroid();
    this.timeout = 0;
    this.withCredentials = false;

    this.UNSENT = 0;
    this.OPENED = 1;
    this.HEADERS_RECEIVED = 2;
    this.LOADING = 3;
    this.DONE = 4;

    this.onabort = null;
    this.onerror = null;
    this.onload = null;
    this.onloadend = null;
    this.onloadstart = null;
    this.onprogress = null;
    this.ontimeout = null;
  }

  abort(): void {
    throw new Error("Method not implemented.");
  }
  getAllResponseHeaders(): string {
    throw new Error("Method not implemented.");
  }
  getResponseHeader(name: string): string | null {
    throw new Error("Method not implemented.");
  }
  open(method: string, url: string | URL): void;
  open(method: string, url: string | URL, async: boolean, username?: string | null, password?: string | null): void;
  open(method: unknown, url: unknown, async?: unknown, username?: unknown, password?: unknown): void {
    this.options.method = (<string>method || "GET").toUpperCase();
    this.options.url = typeof url === "string" ? url : (<URL>url).toString();
  }
  overrideMimeType(mime: string): void {
    throw new Error("Method not implemented.");
  }
  send(body?: Document | XMLHttpRequestBodyInit | null): void {
    let bodyContentType: string;

    switch (Object.prototype.toString.call(body)) {
      case "[object FormData]": {
        bodyContentType = "multipart/form-data";
        (body as FormData).forEach((value, key) => {
          let multipart: Multipart;
          if (value instanceof File) {
            multipart = {
              type: "file",
              name: key,
              value: value.webkitRelativePath,
              filename: value.name,
              mimeType: value.type
            };
          } else {
            multipart = {
              type: "field",
              name: key,
              value
            };
          }
          this.options.multiparts.push(multipart);
        });
        break;
      }
      case "[object URLSearchParams]": {
        bodyContentType = "application/x-www-form-urlencoded";
        this.options.body = (body as URLSearchParams).toString();
        break;
      }
      default: {
        bodyContentType = "text/plain";
        this.options.body = body?.toString() || "";
      }
    }
    this.options.headers["content-type"] = this.options.headers["content-type"] ?? bodyContentType;
    this.options.headers["accept"] = this.options.headers["accept"] ?? "*/*";
    this.options.timeout = this.timeout;

    dsBridge.call("request", this.options, (result: string) => {
      const { type, data } = JSON.parse(result);
      switch (type) {
        case "requestId":
          this.requestId = data;
          // callCancel();
          break;
        case "uploadProgress":
          // config.onUploadProgress?.(data);
          break;
        case "downloadProgress":
          // config.onDownloadProgress?.(data);
          break;
        case "response":
          // resolve(data);
          break;
        case "error":
          // reject(data);
          break;
      }
    });
  }
  setRequestHeader(name: string, value: string): void {
    const lName = name.toLowerCase();
    const oldValue = this.options.headers[lName];
    this.options.headers[lName] = oldValue !== undefined ? `${oldValue}, ${value}` : value;
  }
  addEventListener<K extends keyof XMLHttpRequestEventMap>(
    type: K,
    listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(type: unknown, listener: unknown, options?: unknown): void {
    throw new Error("Method not implemented.");
  }
  removeEventListener<K extends keyof XMLHttpRequestEventMap>(
    type: K,
    listener: (this: XMLHttpRequest, ev: XMLHttpRequestEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(type: unknown, listener: unknown, options?: unknown): void {
    throw new Error("Method not implemented.");
  }
  dispatchEvent(event: Event): boolean {
    throw new Error("Method not implemented.");
  }
}

class XMLHttpRequestUploadForAndroid implements XMLHttpRequestUpload {
  onabort: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onerror: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onload: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onloadend: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onloadstart: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  onprogress: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  ontimeout: ((this: XMLHttpRequest, ev: ProgressEvent) => any) | null;
  composing?: boolean | undefined;

  constructor() {
    this.onabort = null;
    this.onerror = null;
    this.onload = null;
    this.onloadend = null;
    this.onloadstart = null;
    this.onprogress = null;
    this.ontimeout = null;
  }

  addEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(
    type: K,
    listener: (this: XMLHttpRequestUpload, ev: XMLHttpRequestEventTargetEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(type: unknown, listener: unknown, options?: unknown): void {
    throw new Error("Method not implemented.");
  }
  removeEventListener<K extends keyof XMLHttpRequestEventTargetEventMap>(
    type: K,
    listener: (this: XMLHttpRequestUpload, ev: XMLHttpRequestEventTargetEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(type: unknown, listener: unknown, options?: unknown): void {
    throw new Error("Method not implemented.");
  }
  dispatchEvent(event: Event): boolean {
    throw new Error("Method not implemented.");
  }
}
