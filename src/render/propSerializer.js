import { 
  isAllowed, 
  banList, 
  normalizeNumberOrBoolean 
} from "../helpers/typeHelpers.js";

import { callRenderErrorLogger } from "../loggers/errorLogger.js";

import { 
  sanitizeString, 
  deSanitizeString,
  escapeString,
  unescapeQuotes,
  preventXss 
 } from "../helpers/securityHelpers.js";

import { encodeNewlinesExact } from "../transformers/attributeTransformer.js";

const renderIdentity = "_9s35Ufa7M67wghwT_";

function jsonStringify(data) {
    guard(data);
  
    const p = stringifyPrimitive(data);
    if (p !== null) {
      return p;
    }
  
    if (Array.isArray(data)){
      return stringifyArray(data);
    }
  
    return stringifyObject(data);
  }
  
  function stringifyObject(data) {
    const quotes = '"';
    let result = "{";
    let first = true;
  
    const entries = Object.entries(data);
  
    for (let i = 0; i < entries.length; i++) {
      let [key, value] = entries[i];
  
      banList(value);
  
      if (typeof value === "function") {
        const s = encodeNewlinesExact(preventXss(value.toString()));
        value = `__function__:${s}`;
      }
  
      if (
        typeof key !== "symbol" &&
        value !== "undefined" &&
        typeof value !== "function" &&
        typeof value !== "symbol"
      ) {
        if (!first) result += ",";
        result += quotes + key + quotes + ":" + jsonStringify(value);
        first = false;
      }
    }
  
    return result + "}";
  }
  
  function stringifyArray(data) {
    let result = "[";
    let first = true;
  
    for (let i = 0; i < data.length; i++) {
      if (!first) result += ",";
      result += jsonStringify(data[i]);
      first = false;
    }
  
    return result + "]";
  }
  
  function stringifyPrimitive(data) {
    const quotes = '"';
    const type = typeof data;
  
    if (data === null) return "null";
  
    if (type === "number") {
      if (Number.isNaN(data) || !Number.isFinite(data)) return "null";
      return String(data);
    }
  
    if (type === "boolean") return String(data);
  
    if (type === "function") {
      const s = encodeNewlinesExact(preventXss(data.toString()));
      return `__function__:${s}`;
    }
  
    if (type === "undefined") return undefined;
  
    if (type === "string") {
      return quotes + escapeString(data) + quotes;
    }
  
    if (typeof data.toJSON === "function") {
      return jsonStringify(data.toJSON());
    }
  
    return null;
  }
  
  function guard(data) {
    if (banList(data)) {
      throw new Error(
        `${getType(data)} is not allowed as a prop. Wrap it in a function instead.`
      );
    }
  
    if (isCyclic(data)) {
      throw new TypeError(
        "props={props} or props=${props} is not allowed. Use {...props} instead"
      );
    }
  
    if (typeof data === "bigint") {
      throw new TypeError(
        "BigInt is not expected to be used as a prop. Wrap it in a function instead."
      );
    }
  }
  
  export function stringify(...args) {
  
    if(args.length > 2) {
      throw('An argument is expect. If you want more more, pass an object')
    }
  
    const prop = args[0];
    const component = args[1];
  
    try {
      if (
        typeof prop === "string" &&
        prop.includes("NaN") |
        prop.includes("[object Object]") |
        prop.includes("undefined")
      ) {
        return "null";
      }
  
      if(prop && typeof prop === "string" || typeof prop === "number"){
        return `${renderIdentity}${sanitizeString(String(prop))}${renderIdentity}`;
      }
      
      if (!isAllowed(prop)) {
        return sanitizeString(String(prop));
      }
  
      const stringifyProp = jsonStringify(prop);
      return `${renderIdentity}${sanitizeString(stringifyProp)}${renderIdentity}`;
  
    } catch (error) {
      callRenderErrorLogger({
        error,
        component
      });
      console.error(`${error} in ${component}`);
    }
  }
  
  function isInvalidProps(props){
    if(props === "{}") return true;
    if(props === "[]") return true;
    if (typeof props !== "string") return true;
    return false;
  }
  
  export function $purify(props, component) {
    if(isInvalidProps(props)){
      return props;
    }
    
    try {
      if (props.startsWith(renderIdentity)) {
        props = deSanitizeString(props.slice(18, -18));
        if(props.startsWith("__function__:")){
          return preprocessFunction(props);
        }
      }
      if (!props.includes('"', 0)) {
        props = '"' + props + '"';
      }
  
      if (props.includes(renderIdentity)) {
        return ("You're not allowed to use reserved ID (_9s35Ufa7M67wghwT_) in data");
      }
  
      return normalizeNumberOrBoolean(JSON.parse(unescapeQuotes(props)));
    } catch (error) {
      callRenderErrorLogger({
        error,
        component
      });
      console.error(`${error} in ${component}`);
    }
  }
  
  const isCyclic = (input) => {
    const seen = new Set();
  
    const dfsHelper = (obj) => {
      if (typeof obj !== "object" || obj === null) return false;
      seen.add(obj);
      return Object.values(obj).some(
        (value) => seen.has(value) || dfsHelper(value)
      );
    };
  
    return dfsHelper(input);
  };
  