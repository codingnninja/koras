let _$;

const renderIdentity = "_9s35Ufa7M67wghwT_";
const STRING = "string";
const NUMBER = "number";
const FUNCTION = "function";
const ZERO = 0;
const ONE = 1;
const BOOLEAN = "boolean";
const SYMBOL = "symbol";
const BIG_INT = "bigint";
const UNDEFINED = undefined || "undefined";

const CONSTANT = {
  cap: "cap",
  isFirstLetterCapped: "isFirstLetterCapped",
  isComponentCloseTag: "isComponentCloseTag",
  isNotTag: "isNotTag",
};

if (typeof document !== UNDEFINED ) {
  _$ = document.querySelectorAll.bind(document);
}

function removeWhiteSpaceInOpeningTag(code) {
  return code.replace(/<(\w+)\s+>/g, '<$1>')
}

function removeJsComments(code) {
  return code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, " ");
}

function sanitizeString(str) {
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/`/g, "&#96")
    .replace(/\//g, "&#x2F;");
}

function deSanitizeString(str) {
  const props = str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#96/g, "`")
    .replace(/&#x2F;/g, "/");
  return props;
}


/**
 * remove script tag
 * @param str
 * @returns {string | * | void}
 */
function removeScript(str) {
  return str.replace(/<script[^>]*>([^]*?)<\/script>/g, "");
}

/**
 * normalize brackets
 * @param str
 * @returns {string | * | void}
 */
function correctBracket(str) {
  return str.replace(/("[^<>\/"]*)<([^<>\/"]+)>([^<>\/"]*")/g, '"$1|$2|$3"');
}

/**
 * remove comment
 * @param str
 * @returns {string | * | void}
 */

function removeComment(str) {
  return str.replace(/<!--[^>]*-->/g, "");
}

/**
 * remove break line
 * @param str
 * @returns {string | * | void}
 */
function removeBreakLine(str) {
  let result = '';
  let inFunction = false;
  let i = 0;

  while (i < str.length) {
      // Check for start of arrow function
      if (str.slice(i, i + 2) === '=>') {
          inFunction = true;
          result += '=>';
          i += 2;
          continue;
      }

      // Check for start of native function
      if (str.slice(i, i + 8) === 'function') {
          inFunction = true;
          result += 'function';
          i += 8;
          continue;
      }

      // Check for end of function
      if (str[i] === '}') {
          inFunction = false;
      }

      if (inFunction || !(/[\t\b\n\r]/.test(str[i]))) {
          result += str[i];
      }

      i++;
  }

  return result;
}

/**
 * get body if available
 * @param str
 * @returns {*}
 */
function getBodyIfHave(str) {
  const match = str.match(/<body[^>]*>([^]*)<\/body>/);
  if (!match) {
    return str;
  }
  return match[ONE];
}

let patterns = {
  anyNode: /(<[^<>]+>)/,
  cap: /[A-Z]/,
  self: /<([^\s<>]+) ?([^<>]*) \/>/,
  close: /<\/([^\s<>]+)>/,
  start: /<([^\s<>]+) ?([^<>]*)>/,
  text: /<(?:\/?[A-Za-z]+\b[^>]*>|!--.*?--)>/,
  isFirstLetterCapped: /<([A-Z][A-Za-z0-9]*)/,
  isComponentCloseTag: /<\/[A-Z][A-Za-z0-9]*>/,
  isNotTag: /^(?!<\w+\/?>$).+$/,
};
/**
 * Tag regex matchers
 * @param str
 * @returns {Boolean}
 */
function isLine(property, line) {
  return patterns[property].test(line);
}

/**
 * node type
 * @type {{text: string, self: string, close: string, start: string}}
 */
const NODE_TYPE = {
  text: "text",
  self: "self",
  close: "close",
  // start or total
  start: "start",
  element: "element",
};

/**
 * check for component
 * @param str
 * @returns boolean
 */
function isComponent(line) {
  return isLine(CONSTANT.isFirstLetterCapped, line);
}

/**
 * Normalize html tags
 * @param str
 * @returns {string | * | void}
 */
function normalizeHTML(str) {
  return correctBracket(
    getBodyIfHave(removeBreakLine(removeComment(removeScript(removeWhiteSpaceInOpeningTag(str)))))
  );
}

function callRenderErrorLogger(error) {
  if (!globalThis["RenderErrorLogger"]) return false;
  const component = globalThis["RenderErrorLogger"];
  $render(component, { error });
}

function callRenderDomPurifier(html) {
  if (!globalThis["RenderDomPurifier"]) return html;
  const component = globalThis["RenderDomPurifier"];
  $render(component, { html });
}
function spreadKorasProps(props) {
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

function splitAttributes(input, component) {
  const pairs = [];
  let attrName = "";
  let attrValue = "";
  let inQuotes = false;
  let inObject = 0;
  let capturingValue = false;

  for (let index = ZERO; index < input.length; index++) {
    const char = input[index];

    if (capturingValue) {
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
        attrValue += char;
      } else if (char === "{") {
        if(inObject !== ZERO){
          attrValue += char;
        }
        inObject++;
      } else if (char === "}") {
        inObject--;
        if(inObject !== ZERO){
          attrValue += char;
        }
      } else if (inObject > 0 && (char === "{" || char ==="[")) {
        throw new TypeError(`props like attr={{a:"render"}} are not allowed; instead, use variables as values of props like attr=\${variableName} in ${component} and its parent component`);
      } else if ((!inQuotes && char === " ") || index === input.length - ONE) {
        if (index === input.length - ONE && char !== " ") {
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

function parseProps(spreadedProps, component) {
  const parsedProps = {};
  const propsSplittingRegex =
  /([\S]+=[`"']?_9s35Ufa7M67wghwT_([^]*?)_9s35Ufa7M67wghwT_[`"']?)/g;
  const trimmedProps = spreadedProps.trim().slice(ZERO, -1);
  let keyValuePairs = trimmedProps.match(propsSplittingRegex) ?? [];
  const primitiveData = spreadedProps.replace(propsSplittingRegex, "") ?? [];

  keyValuePairs = [...keyValuePairs, ...splitAttributes(primitiveData, component)];
  let depth = 0;

  while(depth < keyValuePairs.length){
    const pair = keyValuePairs[depth];
    let splitParam = pair.includes(renderIdentity) ? `=${renderIdentity}` : "=";

    if (
      pair.includes('="' + renderIdentity) ||
      pair.includes("='" + renderIdentity)
    ) {
      splitParam = pair.includes('="' + renderIdentity)
        ? `="${renderIdentity}`
        : `='${renderIdentity}`;
    }

    let [key, value] = pair.split(splitParam);
    value = value.split(renderIdentity);
    parsedProps[key] = $purify(preprocessFunction(value[ZERO]), component);
    depth++;
  }
  return parsedProps;
}

function preprocessFunction(prop) {
  if (!prop.startsWith("__function__:")) return prop;
  prop = normailzeQuotesInFunctionString(prop);
  const normalizedString = normalizeHTML(removeComment(prop.slice(13)));
  return new Function(`return ${normalizedString}`)();
}

function formatKeyValuePairs(input) {
  return input.replace(/(\w+)=\${(.*?)}/g, (match, key, value) => {
    return key + '="${' + value + '}"';
  });
}

function convertEventHandlerToExecutableFunction(input) {
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

  if (input.includes(UNDEFINED ) || input.includes("null")) {
    const errorMsg = `undefined or null is found. This component probably expects an object or array of object as props or you use falsy props in ${component}.`;

    callRenderErrorLogger(errorMsg);
  }
  return input;
}

function isPromise(value) {
  return Boolean(value && typeof value.then === FUNCTION);
}

/**
 * Combine tokens into an html string
 * @param str
 * @returns {string | * | void}
 */

function convertStackOfHTMLToString(stack) {
  let html = ``;
  if (stack.length > ZERO) {
    let index = 0;//depth
    while(index < stack.length){
      const node = stack[index];
      const trimmedNode = node.trim();
      if (isLine(NODE_TYPE.close, node)) {
        if (isLine(CONSTANT.isComponentCloseTag, trimmedNode)) {
          html += "</div>";
        } else if (
          !isLine(CONSTANT.isFirstLetterCapped, trimmedNode) &&
          stack[index - ONE] === "__placeholder"
        ) {
          html += "";
        } else if (
          !isLine(CONSTANT.isFirstLetterCapped, trimmedNode) &&
          stack[index - ONE].trim() !== "__placeholder"
        ) {
          html += trimmedNode;
        }
      } else if (trimmedNode === ",") {
        html += "";
      } else if (isLine(NODE_TYPE.start, trimmedNode)) {
        html += trimmedNode;
      } else if (
        isLine(CONSTANT.isNotTag, trimmedNode) &&
        trimmedNode !== "__placeholder"
      ) {
        html += trimmedNode;
      }
      index++;
    }
  }
  return html;
}

/**
 * parses html and jsx
 * @param str
 * @returns {*}
 */
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
  } catch (error) {
    callRenderErrorLogger(error);
    console.error(error);
  }
}

async function parseChildrenComponents(extensibleStr, currentElement) {
  const line = currentElement;
  const regularMatch = line.match(patterns.start);
  const selfClosingMatch = line.match(patterns.self);
  const node = regularMatch ? regularMatch : selfClosingMatch;

  const dependencies = {
    tagName: node[ONE],
    props: parseProps(deSanitizeString(node[2]), node[ONE]),
    children: selfClosingMatch ? "" : "__placeholder",
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
  } catch (error) {
    const component = node[ONE];
    callRenderErrorLogger({error, component});
    console.error(`${error} in ${component}: ${globalThis[component]}`);
  }
}

/**
 * Call a component with or without props
 * @param str
 * @returns {function}
 */
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
      const resolvedComponent = isPromise(calledComponent)
        ? await calledComponent
        : calledComponent;
      return resolvedComponent;
    }
  } catch (error) {
    const componentName = element.tagName;
    callRenderErrorLogger({ error, component: componentName });
    console.error(
      `${error} in ${element.tagName}; it seems you're yet $register() it: ${
        globalThis[element.tagName]
          ? globalThis[element.tagName]
          : element.tagName
      }`
    );
  }
}

/**
 * process JSX from html
 * @param str
 * @constructor
 */
async function processJSX(str) {
  try {
    let _str = sanitizeOpeningTagAttributes(str) || "";
    _str = normalizeHTML(_str);
    const a = await parseComponent(_str);
    return a;
  } catch (error) {
    callRenderErrorLogger(error);
    console.error(error);
  }
}

/**
 * @desc Checking rendering environment
 * @param void
 * @returns boolean
 */
const isBrowser = (_) => {
  if (typeof process === "object" && typeof require === FUNCTION) {
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
    throw `Use ${context}(functionName, arg) instead of ${context}(funcationName(arg)) or the first argument you provided is not a function.`;
  }
  const initialLetter = func.name.charAt(ZERO);
  return initialLetter === initialLetter.toUpperCase();
}

/**
 * @desc renders component
 * @param component string
 * @returns string || void (mutates the DOM)
 */

async function $render(component, props) {
  if (!isInitialLetterUppercase(component, "$render")) {
    throw new Error("A component must start with a capital letter");
  }

  const updatedComponent = makeFunctionFromString(component);
  try {
    if (isBrowser() && typeof document !== UNDEFINED ) {
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
    const resolvedComponentWithCustomPurifier = callRenderDomPurifier(resolvedComponent);
    const result = await processJSX(
      sanitizeOpeningTagAttributes(resolvedComponentWithCustomPurifier)
    );
    return result;
  } catch (error) {
    callRenderErrorLogger({ error, component });
    console.error(
      `${error} in ${
        globalThis[component.name] ? globalThis[component.name] : component.name
      }`
    );
  }
}

/**
 * Component executor
 * @param component:function, arg: any
 * @return
 */
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
  if (
    parsedComponent.dataset.append ||
    parsedComponent.dataset.prepend ||
    parsedComponent.dataset.replace
  ) {
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

  matchedFallback
    ? (fetcherAttributes[matchedFallback[ONE]] = matchedFallback[2])
    : (fetcherAttributes["data-fallback"] = matchedFallback);
  matchedComponent
    ? (fetcherAttributes["componentId"] = matchedComponent[2])
    : (fetcherAttributes["componentId"] = matchedComponent);
  fetcherAttributes["action"] = matchedComponent ? matchedComponent[ONE] : null;

  return fetcherAttributes;
}

function executeFallback(value) {
  const fetcherAttributes = extractFetcherAttributes(value.toString());
  if (
    fetcherAttributes.componentId &&
    fetcherAttributes.componentId.startsWith("#")
  ) {
    const targetComponent = document.querySelector(
      fetcherAttributes.componentId
    );
    const component = globalThis[fetcherAttributes["fallback"]];
    const modifiedComponent = component
      ? makeFunctionFromString(component)
      : "";
    const fallback = document.createElement("div");
    fallback.id = "render-fallback";
    const content = `${
      modifiedComponent && fetcherAttributes.componentId
        ? modifiedComponent(targetComponent.id)
        : "Loading..."
    }`;

    const resolvedDefaultFallback =
      !component && fetcherAttributes["fallback"]
        ? fetcherAttributes["fallback"]
        : content;

    fallback.innerHTML = resolvedDefaultFallback;
    fetcherAttributes.action == "prepend"
      ? targetComponent.prepend(fallback)
      : targetComponent.append(fallback);
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

function insertElementsIntoParent(parent, elements, parseComponent) {
  if (parent && elements && isBrowser()) {
    const fragment = document.createDocumentFragment();
    let depth = 0;
    while(depth < elements.length){
      const element = elements[depth];
      if (element instanceof Node) {
        fragment.appendChild(element);
      }
      depth++
    }

    if (parseComponent.dataset.append) {
      parent.appendChild(fragment);
    } else if (parseComponent.dataset.prepend) {
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
      message: `${insertionType}value must start with #`,
    });
    console.error(`${insertionType} value must start with #`);
  }
}

function sanitizeOpeningTagAttributes(tag) {
  const regex = /(\w+)=("[^"]*"|'[^']*')/g;
  return normalizeHTML(
    tag.replace(regex, (match, attributeName, attributeValue) => {
      const sanitizedValue = attributeValue
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;"); //make this to not affect arrow function's '=>' and if it works sanitizeString should be enough
      return `${attributeName}=${sanitizedValue}`;
    })
  );
}

function deSanitizeOpeningTagAttributes(tag) {
  const regex = /(\w+)=("[^"]*"|'[^']*')/g;
  return normalizeHTML(
    tag.replace(regex, (match, attributeName, attributeValue) => {
      const sanitizedValue = attributeValue
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
      return `${attributeName}=${sanitizedValue}`;
    })
  );
}

function insertBeforeOrAfterTarget(parsedComponent, position){
  const component = $select(`${parsedComponent.dataset[position]}`);
  const targetComponent = position === "before" ? component : component.nextSibling;
  component.parentNode.insertBefore(parsedComponent, targetComponent);
}

function appendOrPrependToSelf(parsedComponent, insertionType) {
  removeFallback(parsedComponent.dataset.append);
    stopIfNotStartWithHash(parsedComponent.dataset.append, insertionType);
    const component = $select(`${parsedComponent.dataset.append}`);
    const latestChildren = parsedComponent.querySelectorAll(
      `${parsedComponent.dataset.append}> *`
    );
    insertElementsIntoParent(component, latestChildren, parsedComponent);
}
/**
 * @desc renders client component
 * @param component func
 * @param arg any
 * @returns void (mutates the DOM)
 */
async function handleClientRendering(component, arg) {
  const parser = new DOMParser();
  const resolvedComponent = await resolveComponent(component, arg);
  if (!resolvedComponent) {
    return resolvedComponent;
  }

  const resolvedComponentWithCustomPurifier = callRenderDomPurifier(resolvedComponent);
  let processedComponent = await processJSX(
    sanitizeOpeningTagAttributes(resolvedComponentWithCustomPurifier)
  );

  const componentEl = parser.parseFromString(processedComponent, "text/html");
  const parsedComponent = componentEl.querySelector("body > div");

  if (!parsedComponent) {
    throw "A component must be wrapped with a <div> (nothing else)";
  }

  if (parsedComponent.id === "") {
    throw "A reRenderable component wrapping div must have an ID";
  }

  let el = $el(parsedComponent.id); //current component
  if (el && !isFetcher(parsedComponent)) {
    el.parentNode.replaceChild(parsedComponent, el);
  } else if (el && el.dataset.render === "defer") {
    el.parentNode.replaceChild(parsedComponent, el);
  } else if (el && parsedComponent.dataset.replace) {
    stopIfNotStartWithHash(parsedComponent.dataset.replace, "data.replace");
    el.parentNode.replaceChild(parsedComponent, el);
  } else if (el && parsedComponent.dataset.append) {
    appendOrPrependToSelf(parsedComponent, "data.append");
  } else if (el && parsedComponent.dataset.prepend) {
    appendOrPrependToSelf(parsedComponent, "data.prepend");
  } else if (!el && parsedComponent.dataset.before) {
    insertBeforeOrAfterTarget(parsedComponent, "before")
  } else if (!el && parsedComponent.dataset.after) {
    insertBeforeOrAfterTarget(parsedComponent, "after")
  } else {
    useRoot(processedComponent);
  }
  return processedComponent;
}

function makeFunctionFromString(component) {
  return Function(`return ${replaceValueWithStringify(component)}`)();
}

function normailzeQuotesInFunctionString(funcStr) {
  return funcStr
    .replace(/"(\w+)"\s*:/g, "'$1':")
    .replace(/:\s*"([^"]*)"/g, ": `$1`")
    .replace(/"/g, "`");
}

function replaceSpreadPropsInTags(input) {
  const tagRegex = /<([a-zA-Z_$][\w\-]*)\s*([^]*)>/g;
  return input.replace(tagRegex, (match, tagName, attributes) => {
    try {
      const newAttributes = replaceSpreadPropsInAttributes(attributes);
      return `<${tagName} ${newAttributes}>`;
    } catch (error) {
      throw new Error(`Error processing tag <${tagName}>: ${error.message}`);
    }
  });
}

function replaceSpreadPropsInAttributes(attributes) {
  const spreadRegex = /\{\.{3}([a-zA-Z_$][0-9a-zA-Z_$]*)\}/g;
  return attributes.replace(spreadRegex, (spreadMatch, variable) => {
    if (spreadMatch.includes("...")) {
      return `\${spreadKorasProps(${variable})}`;
    }
  });
}

function replaceValueWithStringify(component) {
  const functionString = component.toString();
  let func = formatKeyValuePairs(functionString);
  func = convertEventHandlerToExecutableFunction(func);
  func = func.replace(
    //matches attribue and {values}
    /(\w+)=["']?\$?\{([^'$][^{}]+)\}{1,2}["']?/g,
    (match, key, value) => {
      if (match.includes("{{") && match.includes("}")) {
        return key + '="' + "${stringify(" + value + "}, " + component.name + ')}"';
      }
      return key + '="' + "${stringify(" + value + ", " + component.name + ')}"';
    }
  );

  func = func.replace(
    /(\w+)="*\$render\s*\(\s*([^{}]+)\s*\,\s*\$?\{([\s\S]*?)\}\s*\)"/g,
    (match, key, component, prop) => {
      return (
        key +
        '="' +
        "$render(" +
        component +
        "," +
        "'${stringify(" +
        prop +
        ", " + component + ")}')" +
        '"'
      );
    }
  );
  return replaceSpreadPropsInTags(func);
}

/**
 * Push function to the global scope
 * @param agrs functions
 * @return boolean
 */
function $register(...args) {
  const components = [...args];
  let depth = ZERO ;

  while (components.length > depth) {
    const component = components[depth];
    if (typeof component !== FUNCTION) {
      throw "Only function is expected";
    }
    globalThis[component.name] = makeFunctionFromString(component);
    depth++;
  }
  return globalThis;
}

function isNativeCode(fn) {
  return (
    typeof fn === FUNCTION && /\{\s*\[native code\]\s*\}/.test(fn.toString())
  );
}

function insertSemicolons(input) {
  const lines = input.split('\n');
  let openParens = 0;
  let index = 0; 
  const processedLines = [];

  while (index < lines.length) {
    const line = lines[index];
    const trimmedLine = line.trim();

    // Count opening and closing parentheses to detect multiline expressions
    openParens += (trimmedLine.match(/\(/g) || []).length; // Count '('
    openParens -= (trimmedLine.match(/\)/g) || []).length; // Count ')'

    // Ignore lines that are empty, comments, already end with semicolons, braces, or inside an unclosed parenthetical expression
    if (
      trimmedLine === '' ||
      trimmedLine.endsWith(';') ||
      trimmedLine.endsWith('{') ||
      trimmedLine.endsWith('}') ||
      trimmedLine.startsWith('//') ||
      trimmedLine.includes('/*') || trimmedLine.includes('*/') ||
      openParens > 0 // We're inside an unclosed parentheses block
    ) {
      processedLines.push(line);
    } else {
      processedLines.push(line + ';');
    }

    index++;
  }

  return processedLines.join('\n');
}

function callFunctionWithElementsAndData(func, data) {
  if (typeof func === FUNCTION) {
    const funca = isNativeCode(func)
      ? func
      : new Function(`return ${normailzeQuotesInFunctionString(removeBreakLine(insertSemicolons(func.toString())))}`)();

    let cleanedData;
    if (!data) {
      cleanedData = data;
    } else {
      cleanedData =
        typeof data === STRING
          ? stringify(normalizeHTML(data), func)
          : stringify(data, func);
    }

    const restructuredFunction = !cleanedData
      ? `(${funca})()`
      : `(${funca})($purify('${cleanedData}', '${func.name ?? func}'))`;

      return isNativeCode(funca)
      ? `${funca.name ?? func}($purify('${cleanedData}', '${func.name ?? func}'))`
      : restructuredFunction;
  }

  throw `There is an error in ${
    func.name ?? func
  } or the first argument passed to $trigger is not a function`;
}

function $trigger(func, data) {
  if (!isBrowser()) {
    throw "You cannot use $trigger on the server";
  }
  try {
    let result = isBrowser() && callFunctionWithElementsAndData(func, data);
    return result;
  } catch (error) {
    callRenderErrorLogger(error);
    console.error(
      `${error} in ${func.name ?? func}.`
    );
  }
}
function $el(elementId) {
  return document.getElementById(elementId);
}

function useRoot(component) {
  const root = $el("root") ?? $el("app")
  root.innerHTML = component;
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

function escapeString(str) {
  return str
    .replace(/(?<!\\\\)[$^&]/g,"\\$&")
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\b/g, "")
    .replace(/\f/g, "\\f")
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

const getType = (value) => {
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
  if(banList(data)){
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

  if (type === BOOLEAN) return String(data);

  if (type === FUNCTION) {
    const sanitizedString = normalizeHTML(removeJsComments(data.toString()));
    return `__function__:${sanitizedString}`;
  }

  if (type === UNDEFINED ) {
    return undefined;
  }

  if (type === STRING) {
    return quotes + escapeString(data) + quotes;
  }

  if (typeof data.toJSON === FUNCTION) {
    return jsonStringify(data.toJSON());
  }

  if (Array.isArray(data)) {
    let result = "[";
    let first = true;
    for (let index = ZERO; index < data.length; index++) {
      if (!first) {
        result += ",";
      }
      result += jsonStringify(data[index]);
      first = false;
    }
    result += "]";
    return result;
  }

  let result = "{";
  let first = true;
  const entries = Object.entries(data);
  let index = ZERO;
  while (index < entries.length) {
    const [key, value] = entries[index];
    banList(value);

    if (typeof value === FUNCTION) {
      console.error(
        "functions are not expected in an object, for example, use <Home userImage={image} userAction={play} /> instead of <Home user={{image, play}} />"
      );
    }

    if (
      typeof key !== SYMBOL &&
      value !== UNDEFINED  &&
      typeof value !== FUNCTION &&
      typeof value !== SYMBOL
    ) {
      if (!first) {
        result += ",";
      }
      result += quotes + key + quotes + ":" + jsonStringify(value);
      first = false;
    }
    index++;
  }
  result += "}";
  return result;
}

const allowedData = {
  Array: "Array",
  Function: "Function",
  Object: "Object",
};

function isAllowed(data) {
   if(banList(data)) {
    throw new Error("Data type not allowed. Wrap it in a function instead");
  }
  return allowedData[getType(data)] ? true : false;
}

function stringify(prop, component) {
  try {
    if (
      typeof prop === STRING &&
      prop.includes("NaN") |
        prop.includes("[object Object]") |
        prop.includes(UNDEFINED)
    ) {
      return "null";
    }

    if (!isAllowed(prop)) {
      return sanitizeString(String(prop));
    }
    const stringifyProp = jsonStringify(prop);
    return `${renderIdentity}${sanitizeString(stringifyProp)}${renderIdentity}`;
  } catch (error) {
    callRenderErrorLogger({error, component});
    console.error(`${error} in ${component}`);
  }
}

function $purify(props, component) {
  if (typeof props !== STRING) return props;
  try {
    if (props.startsWith(renderIdentity)) {
      props = props.slice(18, -18);
    }
    if(!props.includes('"', ZERO)){
      props = '"'+ props +'"';
    }
    if(props.includes(renderIdentity)){ 
      return ("You're not allowed to use reserved ID (_9s35Ufa7M67wghwT_) in data");
    }
    return normalizeNumberOrBoolean(JSON.parse(props));
  } catch (error) {
    callRenderErrorLogger({ error, component });
    console.error(`${error} in ${component}`);
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
    const selector = splittedQuery[ZERO].endsWith("]")
      ? `[${splittedQuery[ZERO]}`
      : splittedQuery[ZERO];
    const constraints = splittedQuery[ONE].split("]")[ZERO];
    return [selector.trim(), constraints.trim()];
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
    const param = paramString
      .split(/(\w+)(\!=|\-=|\+=|=\*|>=?|<=?|={1,2})(.+)/)
      .filter(Boolean);
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
      const numberOfElementsSelected =
        modifiedElements === UNDEFINED  ? UNDEFINED  : modifiedElements.length;
      if (numberOfElementsSelected && !offSuperpowers) {
        //turn grouped elements to a real array
        const iterableGroupedElements = [...modifiedElements];
        elements.push(iterableGroupedElements);
      } else if (numberOfElementsSelected > ONE && offSuperpowers) {
        elements.push(modifiedElements);
      } else {
        elements.push(modifiedElements);
      }
      depth++;
    }
    if (elements[ZERO].length === ZERO) return null;
    return elements && elements.length === ONE ? elements[ZERO] : elements;
  } catch (error) {
    callRenderErrorLogger(error);
    console.error(
      `Oops! Check the selector(s) '${str}' provided for validity because it seems the target is not found. Or you can't use $select on the server.`
    );
  }
}

function applyAction(elements, constraints) {
  if (typeof constraints === STRING && elements.length !== 0)
    return elements[constraints];
  if (!constraints && elements.length === ONE) return elements[0];
  if (!constraints && elements.length > ONE) return elements;

  let depth = 0;
  let result = elements;

  while (constraints && depth < constraints.length) {
    const [action, constraint] = constraints[depth];
    if (action === "delete") {
      result = del(result, constraints[depth]);
    } else if (action === "sort") {
      result = sortElements(result, constraints[depth]);
    } else if (action === "search") {
      result = search(result, constraints[depth])
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
    return Math.abs(Number(a) - Number(b)) <= tolerance;
  } else {
    return (
      a.toLowerCase().includes(b.toLowerCase()) ||
      b.toLowerCase().includes(a.toLowerCase())
    );
  }
}

const operators = {
  "=*": (key, element, value) => fuzzyCompare(element[key], value),
  ">": (key, element, value) => element[key] > value,
  "<": (key, element, value) => element[key] < value,
  "=": (key, element, value) => element[key] === value,
  "<=": (key, element, value) => element[key] <= value,
  ">=": (key, element, value) => element[key] >= value,
  "!=": (key, element, value) => element[key] !== value,
  "+=": (key, element, value) => Number(element[key]) + Number(value),
  "-=": (key, element, value) => Number(element[key]) - Number(value),
};

function del(elements, constraints) {
  const [action, params] = constraints;
  const [key, operator, value] = params;
  const result = [];

  for (let index = 0; index < elements.length; index++) {
    if (key === "i" || key === "index") {
      const dummyElement = makeTag(index);

      if (operators[operator]("id", dummyElement, value)) {
        const deletedElement =
          key === "i" || key === "index" ? elements[index] : elements[value];
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
    const errorMsg =
      "the selector and constraints you provided do not match any target";
    callRenderErrorLogger({errorMsg, constraints});
    console.log(`${errorMsg} in constraints: ${constraints}`);
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
    let element =
      key === "i" || key === "index" ? makeTag(value) : elements[depth];
    key = key === "i" || key === "index" ? "id" : key;

    const condition =
      key === "class"
        ? operators[key]("contains", element, value)
        : operators[operator](key, element, value);

    if (
      (action === "filterIn" && condition) ||
      (action === "filterOut" && !condition)
    ) {
      const filteredElement =
        params[ZERO] === "i" || params[ZERO] === "index"
          ? elements[value]
          : elements[depth];
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
    shuffle: () => Math.random() - 0.5,
  };

  let sortedElements = elements.sort(sortFunctions[order]);

  while (depth < sortedElements.length) {
    children += sortedElements[depth].outerHTML;
    depth++;
  }

  parent.innerHTML = children;
  return sortedElements;
}

function search(elements, constraints){
  const customParams = ['class', '=', 'hidden'];
  const [action, params] = constraints;
  setAttribute(elements, ["remove", customParams]);
  if(params[2] === "*") return elements;
  const filteringConstraint = ["filterOut", params];
  const filteredElements = filter(elements, filteringConstraint);
  if(filteredElements.length === 0) return elements;
  setAttribute(filteredElements, ["add", customParams]);
  return filteredElements;
}

function registerInternalUtils() {
  globalThis["$render"] = $render;
  globalThis["stringify"] = stringify;
  globalThis["$trigger"] = $trigger;
  globalThis["$select"] = $select;
  globalThis["$purify"] = $purify;
  globalThis["spreadKorasProps"] = spreadKorasProps;
}

registerInternalUtils();

export { $render, $select, $trigger, $register, stringify, $purify };