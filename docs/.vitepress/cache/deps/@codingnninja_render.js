import {
  __require
} from "./chunk-6YEEIP7I.js";

// node_modules/@codingnninja/render/dist/esm/render.min.js
var _$;
var renderIdentity = "_9s35Ufa7M67wghwT_";
var STRING = "string";
var NUMBER = "number";
var FUNCTION = "function";
var ZERO = 0;
var ONE = 1;
var BOOLEAN = "boolean";
var SYMBOL = "symbol";
var BIG_INT = "bigint";
var UNDEFINED = "undefined";
var CONSTANT = {
  cap: "cap",
  isFirstLetterCapped: "isFirstLetterCapped",
  isComponentCloseTag: "isComponentCloseTag",
  isNotTag: "isNotTag"
};
if (typeof document !== UNDEFINED) {
  _$ = document.querySelectorAll.bind(document);
}
function callRenderErrorLogger(error2) {
  if (!globalThis["RenderErrorLogger"])
    return false;
  const component = globalThis["RenderErrorLogger"];
  $render(component, { error: error2 });
}
function removeWhiteSpaceInOpeningTag(code) {
  return code.replace(/<(\w+)\s+>/g, "<$1>");
}
function removeJsComments(code) {
  return code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, " ");
}
function sanitizeString(str) {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/`/g, "&#96").replace(/\//g, "&#x2F;");
}
function deSanitizeString(str) {
  const props = str.replace(/\\$/g, "\\\\$").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/\\r/g, "\r").replace(/\\n/g, "\n").replace(/&#96/g, "`").replace(/&#x2F;/g, "/");
  return props;
}
function spreadProps(props) {
  let result = "";
  const entries = Object.entries(props);
  let depth = ZERO;
  while (depth < entries.length) {
    const [key, value] = entries[depth];
    result += `${key}=${stringify(value)}`;
    if (depth !== entries.length - ONE) {
      result += " ";
    }
    depth++;
  }
  return result;
}
function normalizeNumberOrBoolean(paramValue) {
  if (/^\d+$/.test(paramValue)) {
    return Number(paramValue);
  } else if (/^(true|false)$/.test(paramValue)) {
    paramValue = paramValue === "true";
    return paramValue;
  }
  return paramValue;
}
function splitAttributes(input) {
  const pairs = [];
  let attrName = "";
  let attrValue = "";
  let inQuotes = false;
  let capturingValue = false;
  for (let i = ZERO; i < input.length; i++) {
    const char = input[i];
    if (capturingValue) {
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
        attrValue += char;
      } else if (!inQuotes && char === " " || i === input.length - ONE) {
        if (i === input.length - ONE && char !== " ") {
          attrValue += char;
        }
        pairs.push(`${attrName}=${attrValue}`);
        attrName = "";
        attrValue = "";
        capturingValue = false;
      } else {
        attrValue += char;
      }
    } else {
      if (char === "=") {
        capturingValue = true;
      } else if (char !== " ") {
        attrName += char;
      }
    }
  }
  return pairs;
}
function parseProps(spreadedProps) {
  const parsedProps = {};
  const propsSplittingRegex = /([\S]+=[`"']?_9s35Ufa7M67wghwT_([^]*?)_9s35Ufa7M67wghwT_[`"']?)/g;
  const trimmedProps = spreadedProps.trim().slice(ZERO, -1);
  let keyValuePairs = trimmedProps.match(propsSplittingRegex) ?? [];
  const primitiveData = spreadedProps.replace(propsSplittingRegex, "") ?? [];
  keyValuePairs = [...keyValuePairs, ...splitAttributes(primitiveData)];
  let depth = 0;
  while (depth < keyValuePairs.length) {
    const pair = keyValuePairs[depth];
    let splitParam = pair.includes(renderIdentity) ? `=${renderIdentity}` : "=";
    if (pair.includes('="' + renderIdentity) || pair.includes("='" + renderIdentity)) {
      splitParam = pair.includes('="' + renderIdentity) ? `="${renderIdentity}` : `='${renderIdentity}`;
    }
    let [key, value] = pair.split(splitParam);
    value = value.split(renderIdentity);
    parsedProps[key] = normalizeNumberOrBoolean(
      $purify(preprocessFunction(value[ZERO]))
    );
    depth++;
  }
  return parsedProps;
}
function preprocessFunction(prop) {
  if (!prop.startsWith("__function__:"))
    return prop;
  prop = normailzeQuotesInFunctionString(prop);
  const normalizedString = normalizeHTML(removeComment(prop.slice(13)));
  return new Function(`return ${normalizedString}`)();
}
function formatKeyValuePairs(input) {
  return input.replace(/(\w+)=\${(.*?)}/g, (match, key, value) => {
    return key + '="${' + value + '}"';
  });
}
function convertEventHandler(input) {
  const regex = /(\w+)=["']?(\{|\$\{)\s*?([\w.]+)\(([\s\S]*?)\)\s*?\}["']?/g;
  const replaceFunction = (match, event, p1, functionName, args) => {
    if (match.includes("${stringify")) {
      return match;
    }
    if (functionName.includes("console.log")) {
      return `${event}="${functionName}(${args})"`;
    }
    return `${event}="\${$trigger(${functionName}, ${args})}"`;
  };
  return input.replace(regex, replaceFunction);
}
async function checkForJsQuirks(input, component) {
  input = isPromise(input) ? await input : input;
  if (input.includes("[object Object]")) {
    const errorMsg = `You are expected to pass an object or an array of object(s) with {} but you used \${} in ${component}`;
    callRenderErrorLogger(errorMsg);
  }
  if (input.includes("NaN")) {
    const errorMsg = `NaN is found. This component probably expects an object or array of object as props or you use falsy props in ${component}.`;
    callRenderErrorLogger(errorMsg);
  }
  if (input.includes(UNDEFINED) || input.includes("null")) {
    const errorMsg = `undefined or null is found. This component probably expects an object or array of object as props or you use falsy props in ${component}.`;
    callRenderErrorLogger(errorMsg);
  }
  return input;
}
function isPromise(value) {
  return Boolean(value && typeof value.then === FUNCTION);
}
function removeScript(str) {
  return str.replace(/<script[^>]*>([^]*?)<\/script>/g, "");
}
function correctBracket(str) {
  return str.replace(/("[^<>\/"]*)<([^<>\/"]+)>([^<>\/"]*")/g, '"$1|$2|$3"');
}
function removeComment(str) {
  return str.replace(/<!--[^>]*-->/g, "");
}
function removeBreakLine(str) {
  return str.replace(/[\t\b\n\r]/g, "");
}
function getBodyIfHave(str) {
  const match = str.match(/<body[^>]*>([^]*)<\/body>/);
  if (!match) {
    return str;
  }
  return match[ONE];
}
var patterns = {
  anyNode: /(<[^<>]+>)/,
  cap: /[A-Z]/,
  self: /<([^\s<>]+) ?([^<>]*) \/>/,
  close: /<\/([^\s<>]+)>/,
  start: /<([^\s<>]+) ?([^<>]*)>/,
  text: /<(?:\/?[A-Za-z]+\b[^>]*>|!--.*?--)>/,
  isFirstLetterCapped: /<([A-Z][A-Za-z0-9]*)/,
  isComponentCloseTag: /<\/[A-Z][A-Za-z0-9]*>/,
  isNotTag: /^(?!<\w+\/?>$).+$/
};
function isLine(property, line) {
  return patterns[property].test(line);
}
var NODE_TYPE = {
  text: "text",
  self: "self",
  close: "close",
  // start or total
  start: "start",
  element: "element"
};
function isComponent(line) {
  return isLine(CONSTANT.isFirstLetterCapped, line);
}
function normalizeHTML(str) {
  return correctBracket(
    getBodyIfHave(removeBreakLine(removeComment(removeScript(removeWhiteSpaceInOpeningTag(str)))))
  );
}
function convertStackOfHTMLToString(stack) {
  let html = ``;
  if (stack.length > ZERO) {
    let index = 0;
    while (index < stack.length) {
      const node = stack[index];
      const trimmedNode = node.trim();
      if (isLine(NODE_TYPE.close, node)) {
        if (isLine(CONSTANT.isComponentCloseTag, trimmedNode)) {
          html += "</div>";
        } else if (!isLine(CONSTANT.isFirstLetterCapped, trimmedNode) && stack[index - ONE] === "__placeholder") {
          html += "";
        } else if (!isLine(CONSTANT.isFirstLetterCapped, trimmedNode) && stack[index - ONE].trim() !== "__placeholder") {
          html += trimmedNode;
        }
      } else if (trimmedNode === ",") {
        html += "";
      } else if (isLine(NODE_TYPE.start, trimmedNode)) {
        html += trimmedNode;
      } else if (isLine(CONSTANT.isNotTag, trimmedNode) && trimmedNode !== "__placeholder") {
        html += trimmedNode;
      }
      index++;
    }
  }
  return html;
}
async function parseComponent(str) {
  if (!str) {
    return null;
  }
  try {
    let extensibleStr = str.split(patterns.anyNode);
    const stack = [];
    let depth = 0;
    while (extensibleStr.length > depth) {
      const currentElement = extensibleStr[depth].trim();
      if (currentElement === "") {
        depth++;
        continue;
      }
      if (isComponent(currentElement)) {
        extensibleStr = await parseChildrenComponents(
          extensibleStr,
          currentElement
        );
      } else {
        stack.push(deSanitizeOpeningTagAttributes(currentElement));
        depth++;
      }
    }
    return convertStackOfHTMLToString(stack);
  } catch (error2) {
    callRenderErrorLogger(error2);
    console.error(error2);
  }
}
async function parseChildrenComponents(extensibleStr, currentElement) {
  const line = currentElement;
  const regularMatch = line.match(patterns.start);
  const selfClosingMatch = line.match(patterns.self);
  const node = regularMatch ? regularMatch : selfClosingMatch;
  const dependencies = {
    tagName: node[ONE],
    props: parseProps(deSanitizeString(node[2])),
    children: selfClosingMatch ? "" : "__placeholder"
  };
  try {
    let calledComponent = await callComponent(dependencies);
    const component = normalizeHTML(
      sanitizeOpeningTagAttributes(calledComponent)
    );
    const indexOfCurrentElement = extensibleStr.indexOf(currentElement);
    const result = component.split(patterns.anyNode);
    if (indexOfCurrentElement !== -1) {
      extensibleStr.splice(indexOfCurrentElement, ONE, ...result);
      return extensibleStr;
    }
  } catch (error2) {
    callRenderErrorLogger(error2);
    console.error(error2);
  }
}
async function callComponent(element) {
  try {
    const component = globalThis[element.tagName];
    const children = element.children;
    let props = element.props;
    if (Object.keys(props).length === ZERO && !element.children) {
      return checkForJsQuirks(component(), component);
    } else {
      if (element.children) {
        props.children = children;
      }
      const calledComponent = checkForJsQuirks(component(props), component);
      const resolvedComponent = isPromise(calledComponent) ? await calledComponent : calledComponent;
      return resolvedComponent;
    }
  } catch (error2) {
    const componentName = element.tagName;
    callRenderErrorLogger({ error: error2, component: componentName });
    console.error(
      `${error2} in ${globalThis[element.tagName] ? globalThis[element.tagName] : element.tagName}`
    );
  }
}
async function processJSX(str) {
  try {
    let _str = sanitizeOpeningTagAttributes(str) || "";
    _str = normalizeHTML(_str);
    const a = await parseComponent(_str);
    return a;
  } catch (error2) {
    callRenderErrorLogger(error2);
    console.error(error2);
  }
}
var isBrowser = (_) => {
  if (typeof process === "object" && typeof __require === FUNCTION) {
    return false;
  }
  if (typeof importScripts === FUNCTION) {
    return false;
  }
  if (typeof globalThis === "object") {
    return true;
  }
};
function isInitialLetterUppercase(func, context) {
  if (typeof func !== FUNCTION) {
    throw `Use ${context}(functionName, arg) instead of ${context}(funcationName(arg)) or the first argument you provided is a function.`;
  }
  const initialLetter = func.name.charAt(ZERO);
  return initialLetter === initialLetter.toUpperCase();
}
async function $render(component, props) {
  if (!isInitialLetterUppercase(component, "$render")) {
    throw new Error("A component must start with a capital letter");
  }
  const updatedComponent = makeFunctionFromString(component.toString());
  try {
    if (isBrowser() && typeof document !== UNDEFINED) {
      let renderedApp;
      if (document.readyState === "complete") {
        executeFallback(updatedComponent.toString());
        renderedApp = await handleClientRendering(updatedComponent, props);
        return renderedApp;
      } else {
        window.addEventListener("DOMContentLoaded", async () => {
          renderedApp = await handleClientRendering(updatedComponent, props);
          return renderedApp;
        });
      }
    }
    const resolvedComponent = await resolveComponent(updatedComponent, props);
    const result = await processJSX(
      sanitizeOpeningTagAttributes(resolvedComponent)
    );
    return result;
  } catch (error2) {
    callRenderErrorLogger({ error: error2, component });
    console.error(
      `${error2} in ${globalThis[component.name] ? globalThis[component.name] : component.name}`
    );
  }
}
async function resolveComponent(component, arg) {
  const props = typeof arg === FUNCTION ? arg : $purify(arg, component);
  let resolvedComponent = arg ? component(props) : component();
  if (isPromise(resolvedComponent)) {
    const result = await resolvedComponent;
    return result;
  }
  if (typeof resolvedComponent !== STRING) {
    throw "A component must return a string";
  }
  return checkForJsQuirks(resolvedComponent, component);
}
function isFetcher(parsedComponent) {
  if (parsedComponent.dataset.append || parsedComponent.dataset.prepend || parsedComponent.dataset.replace) {
    return true;
  }
  return false;
}
function extractFetcherAttributes(functionString) {
  const fallbackMatcher = /data-(fallback)="([^"]*)"/;
  const componentMatcher = /data-(replace|prepend|append)="([^"]*)/;
  const fetcherAttributes = {};
  const matchedFallback = fallbackMatcher.exec(functionString);
  const matchedComponent = componentMatcher.exec(functionString);
  matchedFallback ? fetcherAttributes[matchedFallback[ONE]] = matchedFallback[2] : fetcherAttributes["data-fallback"] = matchedFallback;
  matchedComponent ? fetcherAttributes["componentId"] = matchedComponent[2] : fetcherAttributes["componentId"] = matchedComponent;
  fetcherAttributes["action"] = matchedComponent ? matchedComponent[ONE] : null;
  return fetcherAttributes;
}
function executeFallback(value) {
  const fetcherAttributes = extractFetcherAttributes(value.toString());
  if (fetcherAttributes.componentId && fetcherAttributes.componentId.startsWith("#")) {
    const targetComponent = document.querySelector(
      fetcherAttributes.componentId
    );
    const component = globalThis[fetcherAttributes["fallback"]];
    const modifiedComponent = component ? makeFunctionFromString(component.toString()) : "";
    const fallback = document.createElement("div");
    fallback.id = "render-fallback";
    const content = `${modifiedComponent && fetcherAttributes.componentId ? modifiedComponent(targetComponent.id) : "Loading..."}`;
    const resolvedDefaultFallback = !component && fetcherAttributes["fallback"] ? fetcherAttributes["fallback"] : content;
    fallback.innerHTML = resolvedDefaultFallback;
    fetcherAttributes.action == "prepend" ? targetComponent.prepend(fallback) : targetComponent.append(fallback);
    return true;
  }
}
function removeFallback(target) {
  if (!target) {
    return false;
  }
  const fallback = document.querySelector(`${target}>#render-fallback`);
  fallback.remove();
  return true;
}
function insertElementsIntoParent(parent, elements, parseComponent2) {
  if (parent && elements && isBrowser()) {
    const fragment = document.createDocumentFragment();
    let depth = 0;
    while (depth < elements.length) {
      const element = elements[depth];
      if (element instanceof Node) {
        fragment.appendChild(element);
      }
      depth++;
    }
    if (parseComponent2.dataset.append) {
      parent.appendChild(fragment);
    } else if (parseComponent2.dataset.prepend) {
      parent.prepend(fragment);
    }
  } else {
    const errorMsg = `Invalid parameters. You need to add data-render="defer" to the wrapping div of a component to defer its execution to the client or you need to add data-replace, data-append or data-prepend to the target container to update the content of a fetcher. Solution: (link to docs)`;
    error.messge += errorMsg;
    callRenderErrorLogger(error);
    console.error(error);
  }
}
function stopIfNotStartWithHash(selector, insertionType) {
  if (!/^#/.test(selector)) {
    callRenderErrorLogger({
      error,
      selector,
      message: `${insertionType}value must start with #`
    });
    console.error(`${insertionType} value must start with #`);
  }
}
function sanitizeOpeningTagAttributes(tag) {
  const regex = /(\w+)=("[^"]*"|'[^']*')/g;
  return normalizeHTML(
    tag.replace(regex, (match, attributeName, attributeValue) => {
      const sanitizedValue = attributeValue.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `${attributeName}=${sanitizedValue}`;
    })
  );
}
function deSanitizeOpeningTagAttributes(tag) {
  const regex = /(\w+)=("[^"]*"|'[^']*')/g;
  return normalizeHTML(
    tag.replace(regex, (match, attributeName, attributeValue) => {
      const sanitizedValue = attributeValue.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      return `${attributeName}=${sanitizedValue}`;
    })
  );
}
async function handleClientRendering(component, arg) {
  const parser = new DOMParser();
  const resolvedComponent = await resolveComponent(component, arg);
  if (!resolvedComponent) {
    return resolvedComponent;
  }
  let processedComponent = await processJSX(
    sanitizeOpeningTagAttributes(resolvedComponent)
  );
  const componentEl = parser.parseFromString(processedComponent, "text/html");
  const parsedComponent = componentEl.querySelector("body > div");
  if (!parsedComponent) {
    throw "A component must be wrapped with a <div> (nothing else)";
  }
  if (parsedComponent.id === "") {
    throw "A reRenderable component wrapping div must have an ID";
  }
  let el = $el(parsedComponent.id);
  if (el && !isFetcher(parsedComponent)) {
    el.parentNode.replaceChild(parsedComponent, el);
  } else if (el && el.dataset.render === "defer") {
    el.parentNode.replaceChild(parsedComponent, el);
  } else if (el && parsedComponent.dataset.replace) {
    stopIfNotStartWithHash(parsedComponent.dataset.replace, "data.replace");
    el.parentNode.replaceChild(parsedComponent, el);
  } else if (el && parsedComponent.dataset.append) {
    removeFallback(parsedComponent.dataset.append);
    stopIfNotStartWithHash(parsedComponent.dataset.append, "data.append");
    const component2 = $select(`${parsedComponent.dataset.append}`);
    const latestChildren = parsedComponent.querySelectorAll(
      `${parsedComponent.dataset.append}> *`
    );
    insertElementsIntoParent(component2, latestChildren, parsedComponent);
  } else if (el && parsedComponent.dataset.prepend) {
    removeFallback(parsedComponent.dataset.prepend);
    stopIfNotStartWithHash(parsedComponent.dataset.prepend, "data.prepend");
    const component2 = $select(`${parsedComponent.dataset.prepend}`);
    const latestChildren = parsedComponent.querySelectorAll(
      `${parsedComponent.dataset.prepend}> *`
    );
    insertElementsIntoParent(component2, latestChildren, parsedComponent);
  } else {
    useRoot(processedComponent);
  }
  return processedComponent;
}
function makeFunctionFromString(functionString) {
  return Function(`return ${replaceValueWithStringify(functionString)}`)();
}
function normailzeQuotesInFunctionString(funcStr) {
  return funcStr.replace(/"(\w+)"\s*:/g, "'$1':").replace(/:\s*"([^"]*)"/g, ": `$1`").replace(/"/g, "`");
}
function replaceSpreadPropsInTags(input) {
  const tagRegex = /<([a-zA-Z_$][\w\-]*)\s*([^>]*)>/g;
  return input.replace(tagRegex, (match, tagName, attributes) => {
    try {
      const newAttributes = replaceSpreadPropsInAttributes(attributes);
      return `<${tagName} ${newAttributes}>`;
    } catch (error2) {
      throw new Error(`Error processing tag <${tagName}>: ${error2.message}`);
    }
  });
}
function replaceSpreadPropsInAttributes(attributes) {
  const spreadRegex = /\{\.{3}([a-zA-Z_$][0-9a-zA-Z_$]*)\}/g;
  return attributes.replace(spreadRegex, (spreadMatch, variable) => {
    if (spreadMatch.includes("...")) {
      return `\${spreadProps(${variable})}`;
    }
  });
}
function replaceValueWithStringify(functionString) {
  let func = formatKeyValuePairs(functionString);
  func = convertEventHandler(func);
  func = func.replace(
    //matches attribue and {values}
    /(\w+)=["']?\$?\{([^'$][^{}]+)\}["']?/g,
    (match, key, value) => {
      if (match.includes("{{")) {
        return key + "=${stringify(" + value + "})}";
      }
      return key + "=${stringify(" + value + ")}";
    }
  );
  func = func.replace(
    /(\w+)="*\$render\s*\(\s*([^{}]+)\s*\,\s*\$?\{([\s\S]*?)\}\s*\)"/g,
    (match, key, component, prop) => {
      return key + '="$render(' + component + ",'${stringify(" + prop + `)}')"`;
    }
  );
  return replaceSpreadPropsInTags(func);
}
function $register(...args) {
  const components = [...args];
  let depth = ZERO;
  while (components.length > depth) {
    const component = components[depth];
    if (typeof component !== FUNCTION) {
      throw "Only function is expected";
    }
    globalThis[component.name] = makeFunctionFromString(component.toString());
    depth++;
  }
  return globalThis;
}
function isNativeCode(fn) {
  return typeof fn === FUNCTION && /\{\s*\[native code\]\s*\}/.test(fn.toString());
}
function callFunctionWithElementsAndData(func, data) {
  if (typeof func === FUNCTION) {
    const funca = isNativeCode(func) ? func : new Function(`return ${normailzeQuotesInFunctionString(removeBreakLine(func.toString()))}`)();
    let cleanedData;
    if (!data) {
      cleanedData = data;
    } else {
      cleanedData = typeof data === STRING ? stringify(normalizeHTML(data)) : stringify(data);
    }
    const restructuredFunction = !cleanedData ? `(${funca})()` : `(${funca})($purify('${cleanedData}', '${func.name ?? func}'))`;
    return isNativeCode(funca) ? `${funca.name ?? func}($purify('${cleanedData}'))` : restructuredFunction;
  }
  throw `There is an error in ${func.name ?? func} or the first argument passed to $trigger is not a function`;
}
function $trigger(func, data) {
  if (!isBrowser()) {
    throw "You cannot use $trigger on the server";
  }
  try {
    let result = isBrowser() && callFunctionWithElementsAndData(func, data);
    return result;
  } catch (error2) {
    callRenderErrorLogger(error2);
    console.error(
      `${error2} but ${func.name ? `${typeof func.name}` : typeof func} is provided in ${func.name ?? func}`
    );
  }
}
function $el(elementId) {
  return document.getElementById(elementId);
}
function useRoot(component) {
  $el("root").innerHTML = component;
}
var isCyclic = (input) => {
  const seen = /* @__PURE__ */ new Set();
  const dfsHelper = (obj) => {
    if (typeof obj !== "object" || obj === null)
      return false;
    seen.add(obj);
    return Object.values(obj).some(
      (value) => seen.has(value) || dfsHelper(value)
    );
  };
  return dfsHelper(input);
};
function escapeString(str) {
  return str.replace(new RegExp("(?<!\\\\\\\\)[$^&]", "g"), "\\$&").replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\b/g, "").replace(/\f/g, "\\f").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}
var getType = (value) => {
  return Object.prototype.toString.call(value).slice(8, -1);
};
function banList(value) {
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
  } else if (typeof value === SYMBOL) {
    banned = true;
  } else if (value instanceof RegExp) {
    banned = true;
  } else if (typeof value === BIG_INT) {
    banned = true;
  }
  return banned;
}
function jsonStringify(data) {
  if (banList(data)) {
    throw new Error(`${getType(
      data
    )} is not allowed as a prop. Wrap it in a function instead.`);
  }
  const quotes = '"';
  if (isCyclic(data)) {
    throw new TypeError("props={props} or props=${props} is not allowed. Use {...props} instead");
  }
  if (typeof data === BIG_INT) {
    throw new TypeError(
      "BigInt is not expected to be used as a prop. Wrap it in a function instead."
    );
  }
  if (data === null) {
    return "null";
  }
  const type = typeof data;
  if (type === NUMBER) {
    if (Number.isNaN(data) || !Number.isFinite(data)) {
      return "null";
    }
    return String(data);
  }
  if (type === BOOLEAN)
    return String(data);
  if (type === FUNCTION) {
    const sanitizedString = normalizeHTML(removeJsComments(data.toString()));
    return `__function__:${sanitizedString}`;
  }
  if (type === UNDEFINED) {
    return void 0;
  }
  if (type === STRING) {
    return quotes + escapeString(data) + quotes;
  }
  if (typeof data.toJSON === FUNCTION) {
    return jsonStringify(data.toJSON());
  }
  if (Array.isArray(data)) {
    let result2 = "[";
    let first2 = true;
    for (let i2 = ZERO; i2 < data.length; i2++) {
      if (!first2) {
        result2 += ",";
      }
      result2 += jsonStringify(data[i2]);
      first2 = false;
    }
    result2 += "]";
    return result2;
  }
  let result = "{";
  let first = true;
  const entries = Object.entries(data);
  let i = ZERO;
  while (i < entries.length) {
    const [key, value] = entries[i];
    banList(value);
    if (typeof value === FUNCTION) {
      console.error(
        "functions are not expected in an object, for example, use <Home userImage={image} userAction={play} /> instead of <Home user={{image, play}} />"
      );
    }
    if (typeof key !== SYMBOL && value !== UNDEFINED && typeof value !== FUNCTION && typeof value !== SYMBOL) {
      if (!first) {
        result += ",";
      }
      result += quotes + key + quotes + ":" + jsonStringify(value);
      first = false;
    }
    i++;
  }
  result += "}";
  return result;
}
var allowedData = {
  Array: "Array",
  Function: "Function",
  Object: "Object"
};
function isAllowed(data) {
  if (banList(data)) {
    throw new Error("You're not allowed to use reserved ID (_9s35Ufa7M67wghwT_) in data");
  }
  return allowedData[getType(data)] ? true : false;
}
function stringify(prop) {
  try {
    if (typeof prop === STRING && prop.includes("NaN") | prop.includes("[object Object]") | prop.includes(UNDEFINED)) {
      return "null";
    }
    if (!isAllowed(prop)) {
      return sanitizeString(String(prop));
    }
    const stringifyProp = jsonStringify(prop);
    return `${renderIdentity}${sanitizeString(stringifyProp)}${renderIdentity}`;
  } catch (error2) {
    callRenderErrorLogger(error2);
    console.error(error2);
  }
}
function $purify(props, compnent) {
  if (typeof props !== STRING)
    return props;
  try {
    if (props.startsWith(renderIdentity)) {
      props = props.slice(18, -18);
    }
    if (!props.includes('"', ZERO)) {
      props = '"' + props + '"';
    }
    if (props.includes(renderIdentity)) {
      return "You're not allowed to use reserved ID (_9s35Ufa7M67wghwT_) in data";
    }
    return normalizeNumberOrBoolean(JSON.parse(props));
  } catch (error2) {
    callRenderErrorLogger({ error: error2, compnent });
    console.error(`${error2} in ${compnent}`);
  }
}
function buildDataStructureFrom(queryString) {
  let [selector, constraints] = resolveActionAndConstraints(queryString);
  if (constraints === UNDEFINED) {
    return [selector];
  }
  if (/(\S+|\[\S+\])\[(\d+)\]/.test(queryString)) {
    return [selector, constraints];
  }
  constraints = resolveMultipleAttributes(constraints.split(","));
  return [selector, constraints];
}
function resolveActionAndConstraints(queryString) {
  const regex = /(\S+|\[\S+\])\[(\d+)\]/;
  const match = queryString.match(regex);
  if (match) {
    return [match[ONE], match[2]];
  }
  if (!queryString.includes("|") || queryString.includes("|=")) {
    return [queryString.trim(), UNDEFINED];
  }
  const splittedQuery = queryString.split("[").filter(Boolean);
  if (splittedQuery.length === 2) {
    const selector2 = splittedQuery[ZERO].endsWith("]") ? `[${splittedQuery[ZERO]}` : splittedQuery[ZERO];
    const constraints2 = splittedQuery[ONE].split("]")[ZERO];
    return [selector2.trim(), constraints2.trim()];
  }
  const selector = `${splittedQuery[ZERO]}[${splittedQuery[ONE]}`;
  const constraints = splittedQuery[2].split("]")[ZERO];
  return [selector.trim(), constraints.trim()];
}
function resolveMultipleAttributes(constraints) {
  let processedConstraints = [];
  let depth = ZERO;
  while (depth < constraints.length) {
    let splittedConstraints = constraints[depth].split("|").filter(Boolean);
    const [action, paramString] = splittedConstraints;
    const param = paramString.split(/(\w+)(\!=|\-=|\+=|=\*|>=?|<=?|={1,2})(.+)/).filter(Boolean);
    processedConstraints.push([action.trim(), param]);
    depth++;
  }
  return processedConstraints;
}
function $select(str, offSuperpowers = false) {
  if (!isBrowser()) {
    throw new Error("You cannot use $select on the server");
  }
  if (typeof str !== STRING || str === "") {
    throw new Error("$select expects a string of selectors");
  }
  try {
    const selectors = str.split(/,(?![^\[]*\])/);
    let elements = [];
    let depth = ZERO;
    while (selectors.length > depth) {
      const selectorWithConstraints = selectors[depth];
      const [selector, constraints] = buildDataStructureFrom(
        selectorWithConstraints
      );
      const nestedElements = _$(selector);
      const modifiedElements = applyAction(nestedElements, constraints);
      const numberOfElementsSelected = modifiedElements === UNDEFINED ? UNDEFINED : modifiedElements.length;
      if (numberOfElementsSelected && !offSuperpowers) {
        const iterableGroupedElements = [...modifiedElements];
        elements.push(iterableGroupedElements);
      } else if (numberOfElementsSelected > ONE && offSuperpowers) {
        elements.push(modifiedElements);
      } else {
        elements.push(modifiedElements);
      }
      depth++;
    }
    if (elements[ZERO].length === ZERO)
      return null;
    return elements && elements.length === ONE ? elements[ZERO] : elements;
  } catch (error2) {
    callRenderErrorLogger(error2);
    console.error(
      `Oops! Check the selector(s) '${str}' provided for validity because it seems the target is not found. Or you can't use $select on the server.`
    );
  }
}
function applyAction(elements, constraints) {
  if (typeof constraints === STRING && elements.length !== 0)
    return elements[constraints];
  if (!constraints && elements.length === ONE)
    return elements[0];
  if (!constraints && elements.length > ONE)
    return elements;
  let depth = 0;
  let result = elements;
  while (constraints && depth < constraints.length) {
    const [action, constraint] = constraints[depth];
    if (action === "delete") {
      result = del(result, constraints[depth]);
    } else if (action === "sort") {
      result = sortElements(result, constraints[depth]);
    } else if (action === "search") {
      result = search(result, constraints[depth]);
    } else if (action.includes("filter")) {
      result = filter(result, constraints[depth]);
    } else if (constraints !== UNDEFINED) {
      result = setAttribute(result, constraints[depth]);
    }
    depth++;
  }
  return result;
}
function fuzzyCompare(a, b, tolerance = 0.01) {
  if (!isNaN(a) && !isNaN(b)) {
    const tolerance2 = 0.01;
    return Math.abs(Number(a) - Number(b)) <= tolerance2;
  } else {
    return a.toLowerCase().includes(b.toLowerCase()) || b.toLowerCase().includes(a.toLowerCase());
  }
}
var operators = {
  "=*": (key, element, value) => fuzzyCompare(element[key], value),
  ">": (key, element, value) => element[key] > value,
  "<": (key, element, value) => element[key] < value,
  "=": (key, element, value) => element[key] === value,
  "<=": (key, element, value) => element[key] <= value,
  ">=": (key, element, value) => element[key] >= value,
  "!=": (key, element, value) => element[key] !== value,
  "+=": (key, element, value) => Number(element[key]) + Number(value),
  "-=": (key, element, value) => Number(element[key]) - Number(value)
};
function del(elements, constraints) {
  const [action, params] = constraints;
  const [key, operator, value] = params;
  const result = [];
  for (let index = 0; index < elements.length; index++) {
    if (key === "i" || key === "index") {
      const dummyElement = makeTag(index);
      if (operators[operator]("id", dummyElement, value)) {
        const deletedElement = key === "i" || key === "index" ? elements[index] : elements[value];
        deletedElement.remove();
        result.push(deletedElement);
        continue;
      }
    }
    if (operators[operator](key, elements[index], value)) {
      elements[index].remove();
      result.push(elements[index]);
      continue;
    }
    const errorMsg = "the selector and constraints you provided do not match any target";
    callRenderErrorLogger(errorMsg);
    console.log(errorMsg);
  }
  return result.length === ONE ? result[ZERO] : result;
}
function setAttribute(elements, constraints) {
  const [action, params] = constraints;
  const [key, operator, value] = params;
  for (let i = 0; i < elements.length; i++) {
    if (key === "class") {
      elements[i].classList[action](...value.split(" "));
      continue;
    }
    if (!value) {
      elements[i][key] = " ";
    } else if (operator === "+=" || operator === "-=") {
      const foundOperator = operators[operator](key, elements[i], value);
      elements[i][key] = foundOperator ? foundOperator : value;
    } else {
      elements[i][key] = value;
    }
  }
  return elements;
}
function makeTag(index) {
  const div = document.createElement("div");
  div.id = index;
  return div;
}
function filter(elements, constraints) {
  const result = [];
  const [action, params] = constraints;
  let [key, operator, value] = params;
  let depth = 0;
  while (depth < elements.length) {
    let element = key === "i" || key === "index" ? makeTag(value) : elements[depth];
    key = key === "i" || key === "index" ? "id" : key;
    const condition = key === "class" ? operators[key]("contains", element, value) : operators[operator](key, element, value);
    if (action === "filterIn" && condition || action === "filterOut" && !condition) {
      const filteredElement = params[ZERO] === "i" || params[ZERO] === "index" ? elements[value] : elements[depth];
      result.push(filteredElement);
    }
    depth++;
  }
  return result.length === ONE ? result[ZERO] : result;
}
function sortElements(array, constraints) {
  const [action, params] = constraints;
  const [key, operator, order] = params;
  const elements = [...array];
  const parent = elements[0].parentNode;
  let children = "";
  let depth = 0;
  const sortFunctions = {
    numberAsc: (a, b) => Number(a.textContent) - Number(b.textContent),
    numberDesc: (a, b) => Number(b.textContent) - Number(a.textContent),
    lengthSortAsc: (a, b) => a.textContent.length - b.textContent.length,
    lengthSortDesc: (a, b) => b.textContent.length - a.textContent.length,
    alphabetAsc: (a, b) => a.textContent.localeCompare(b.textContent),
    alphabetDesc: (a, b) => b.textContent.localeCompare(a.textContent),
    shuffle: () => Math.random() - 0.5
  };
  let sortedElements = elements.sort(sortFunctions[order]);
  while (depth < sortedElements.length) {
    children += sortedElements[depth].outerHTML;
    depth++;
  }
  parent.innerHTML = children;
  return sortedElements;
}
function search(elements, constraints) {
  const customParams = ["class", "=", "hidden"];
  const [action, params] = constraints;
  setAttribute(elements, ["remove", customParams]);
  if (params[2] === "*")
    return elements;
  const filteringConstraint = ["filterOut", params];
  const filteredElements = filter(elements, filteringConstraint);
  if (filteredElements.length === 0)
    ;
  setAttribute(filteredElements, ["add", customParams]);
  return filteredElements;
}
function registerInternalUtils() {
  globalThis["$render"] = $render;
  globalThis["stringify"] = stringify;
  globalThis["$trigger"] = $trigger;
  globalThis["$select"] = $select;
  globalThis["$purify"] = $purify;
  globalThis["spreadProps"] = spreadProps;
}
registerInternalUtils();
export {
  $purify,
  $register,
  $render,
  $select,
  $trigger,
  stringify
};
//# sourceMappingURL=@codingnninja_render.js.map
