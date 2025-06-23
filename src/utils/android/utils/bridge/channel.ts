import { EventEmitter } from "../eventEmitter";

export const channelMap: Map<string, Channel> = new Map(); // 通道map

export class Channel extends EventEmitter {}
