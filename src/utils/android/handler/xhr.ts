import { AndroidRequestOptions, XMLHttpRequestForAndroid } from "../types/xhr";

export class XHR implements XMLHttpRequestForAndroid {
  private options: AndroidRequestOptions;

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
    if (this.options.headers["accept"] === undefined) {
      this.options.headers["accept"] = "*/*";
    }
    if (this.options.headers["content-type"] === undefined) {
      if (body instanceof FormData) {
        this.options.headers["content-type"] = "multipart/form-data";
      } else {
        this.options.headers["content-type"] = "text/plain";
      }
    }
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
