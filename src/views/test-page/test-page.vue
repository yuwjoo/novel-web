<template>
  <div class="test-page">
    <book-reader />
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import BookReader from "./components/book-reader/book-reader.vue";
import { request } from "@/utils/axios";
// import { crawlers } from "@/utils/crawler";

defineOptions({
  name: "test-page"
});

// const name = "lengku8";

// console.log("aa", crawlers[name]);

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

const formData = new FormData();
formData.append("keyword", "姐姐");
formData.append("page", "2");
formData.append("size", "10");

const urlParams = new URLSearchParams();
urlParams.append("keyword", "姐姐");
urlParams.append("page", "2");
urlParams.append("size", "10");

// requestApp({
//   url: "http://192.168.0.108:3000/test-post",
//   method: "post",
//   params: {
//     name: "test22",
//     age: 18
//   },
//   cancelToken: source.token,
//   headers: {
//     // "Content-Type": "text/plain"
//   },
//   data: {
//     aa: 1,
//     bb: 2
//   }
// })
//   .then((res) => {
//     console.log("请求成功", res);
//   })
//   .catch((err) => {
//     if (axios.isCancel(err)) {
//       console.log("请求被取消", err.message);
//     } else {
//       console.error("请求失败", err);
//     }
//   });

request({
  url: "http://192.168.0.106:3000/test-post",
  method: "post",
  params: {
    name: "test22",
    age: 18
  },
  cancelToken: source.token,
  // data: {
  //   aa: 1,
  //   bb: 2
  // },
  data: urlParams,
  sendEnv: "android"
})
  .then((res) => {
    console.log("请求成功1", res);
  })
  .catch((err) => {
    if (axios.isCancel(err)) {
      console.log("请求被取消", err.message);
    } else {
      console.error("请求失败", err);
    }
  });

// setTimeout(() => {
//   source.cancel("3333");
// }, 2000);

interface BridgeApiFun<TData = unknown, TResult = unknown, TOn = unknown, TSend = unknown> {
  (data: TData, options?: BridgeApiFunOptions): BridgeApiFunHandler<TResult, TOn, TSend>;
}

interface BridgeApiFunOptions {
  timeout?: number;
}

interface BridgeApiFunHandler<TResult = unknown, TOn = unknown, TSend = unknown> {
  promise: Promise<TResult>;
  on: BridgeApiFunHandlerOn<TOn>;
  send: BridgeApiFunHandlerSend<TSend>;
  done: BridgeApiFunHandlerDone<TSend>;
}

interface BridgeApiFunHandlerOn<T = unknown> {
  <K extends keyof T>(name: K, callback: (result: T[K]) => void): void;
}

interface BridgeApiFunHandlerSend<T = unknown> {
  <K extends keyof T>(name: K, data?: T[K]): void;
}

interface BridgeApiFunHandlerDone<T = unknown> {
  <K extends keyof T>(name?: K, data?: T[K]): void;
}

interface RequestData {
  url: string;
  method: string;
}

interface RequestOnEvent {
  uploadProgress: {
    loaded: number; // 当前数据量
    total: number; // 总数据量
    lengthComputable: boolean; // 进度是否可以被测量
  };
  downloadProgress: {
    loaded: number; // 当前数据量
    total: number; // 总数据量
    lengthComputable: boolean; // 进度是否可以被测量
  };
  response: {
    status: number; // 状态码
    statusText: string; // 状态文本
    headers: Record<string, string>; // 响应头集合
    body: string; // body数据
    url: string; // 响应url
  };
  error: {
    type: "error"; // 类型
    data: "timeout" | "other"; // 失败类型
  };
}

interface RequestSendEvent {
  cancelRequest: undefined;
}

interface BridgeApi {
  request: BridgeApiFun<RequestData, RequestOnEvent["response"], RequestOnEvent, RequestSendEvent>;
}

interface TargetObject {
  keys: (string | symbol)[];
}

const createTarget = (keys: (string | symbol)[]): TargetObject => {
  const target = () => {
    /** empty */
  };
  target.keys = keys;
  return target;
};

const handler = {
  get(target: TargetObject, prop: string | symbol): TargetObject {
    return new Proxy(createTarget([...target.keys, prop]), handler);
  },
  apply(target: TargetObject, _thisArg: TargetObject, argArray: any[]) {
    window["androidBridgeNative"].call({
      id: Date.now(),
      callPath: target.keys,
      data: argArray[0],
      options: argArray[1]
    });
    return 88;
  }
};

const bridgeApi: BridgeApi = new Proxy<any>(createTarget([]), handler);

console.time();
const res = bridgeApi.request({
  url: "",
  method: ""
});
res.on("response", (result) => {
  console.log(result);
});
console.timeEnd();
</script>

<style lang="scss" scoped>
.test-page {
}
</style>
