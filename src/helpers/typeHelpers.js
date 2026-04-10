  export function isObject(obj){
    return Object.prototype.toString.call(obj) === '[object Object]';
  }

  export const getType = (value) => {
    return Object.prototype.toString.call(value).slice(8, -1);
  };
  
  export const isPromise = value => value?.then instanceof Function;

  export function normalizeNumberOrBoolean(paramValue) {
    if (/^\d+$/.test(paramValue)) {
      return Number(paramValue);
    } else if (/^(true|false)$/.test(paramValue)) {
      paramValue = paramValue === "true";
      return paramValue;
    }
    return paramValue;
  }
  
  const allowedData = {
    Array: "Array",
    Function: "Function",
    Object: "Object"
  };
  
  export function isAllowed(data) {
    if (banList(data)) {
      throw new Error("Data type not allowed. Wrap it in a function instead");
    }
    return allowedData[getType(data)] ? true : false;
  }
  
  export function banList(value) {
    let banned = false;
    if (value instanceof Date) {
      banned = true;
    } else if (value instanceof Map) {
      banned = true;
    } else if (value instanceof Set) {
      banned = true;
    } else if (value instanceof WeakMap) {
      banned = true;
    } else if (value instanceof WeakSet) {
      banned = true;
    } else if (typeof value === "symbol") {
      banned = true;
    } else if (value instanceof RegExp) {
      banned = true;
    } else if (typeof value === "bigint") {
      banned = true;
    }
    return banned;
  }
  