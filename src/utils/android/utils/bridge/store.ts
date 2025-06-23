import type { Channel } from "./channel";

export const ANDROID_INTERFACE_KEY = "__bridgeInterfaceForAndroid__"; // android接口对象key
export const WEB_INTERFACE_KEY = "__bridgeInterfaceForWeb__"; // web接口对象key

export const SUCCESS_CALLBACK_KEY = Symbol("SUCCESS_CALLBACK_KEY"); // 成功回调key
export const FAIL_CALLBACK_KEY = Symbol("FAIL_CALLBACK_KEY"); // 失败回调key

export const channelMap: Map<string, Channel> = new Map(); // 通道map
