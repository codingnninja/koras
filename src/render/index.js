import { $render } from "./renderingEngine.js";
import { spreadKorasProps } from "../transformers/attributeTransformer.js";
import { stringify, $purify } from "./propSerializer.js";
import { __$createHydrationHandler } from "./clientHydration.js";
import { __$callMethod } from "./clientHydration.js";
import { __$setState } from "./stateManagement.js";
import { If } from "../components/if.js";
import { For } from "../components/for.js";

function registerInternalUtils() {
    globalThis.$render = $render;
    globalThis.If = If;
    globalThis.For = For;
    globalThis.stringify = stringify;
    globalThis.__trigger = __$createHydrationHandler;
    globalThis.__$c = __$callMethod;
    globalThis.$purify = $purify;
    globalThis.spreadKorasProps = spreadKorasProps;
    globalThis.__$setState = __$setState;
    globalThis.__$signal = {};
    globalThis.isClient = false;
  }
  
  registerInternalUtils();

  export {
    stringify,
    $purify,
    $render,
    If,
    For
  }