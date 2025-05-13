import "dsbridge";
import EngineWrapper from "flyio/dist/npm/engine-wrapper";
import adapter from "flyio/dist/npm/adapter/dsbridge";
import Fly from "flyio/dist/npm/fly";

const dsEngine = EngineWrapper(adapter);
const fly = new Fly(dsEngine);

export function useFly() {
  return fly;
}
