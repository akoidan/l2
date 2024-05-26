import { getConsts } from "./build/utils";
import { getConfig } from "./build/vite";

const consts = await getConsts();

export default {
  main: await getConfig(consts),
  preload: await getConfig(consts),
  renderer: await getConfig(consts),
}
