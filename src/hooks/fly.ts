import "dsbridge";
import EngineWrapper from "flyio/dist/npm/engine-wrapper";
import adapter from "flyio/dist/npm/adapter/dsbridge";
import FlyConstructor from "flyio/dist/npm/fly";
import type { Fly } from "flyio";

const dsEngine = EngineWrapper(adapter);
const fly: Fly = new FlyConstructor(dsEngine);

export function useFly() {
  return fly;
}
