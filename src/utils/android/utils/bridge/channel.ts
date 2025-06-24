import { EventEmitter } from "../eventEmitter";

export class Channel extends EventEmitter {
  public readonly id: string; // 通道id

  constructor(id: string) {
    super();
    this.id = id;
  }
}
