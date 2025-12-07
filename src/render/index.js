"use strict";

const renderIdentity = "_9s35Ufa7M67wghwT_";
const STRING = "string";
const NUMBER = "number";
const FUNCTION = "function";
const ZERO = 0;
const ONE = 1;
const BOOLEAN = "boolean";
const SYMBOL = "symbol";
const BIG_INT = "bigint";
let bundle = globalThis['koras_bundle'] || '';
const UNDEFINED = undefined || "undefined";


let patterns = {
  anyNode: /(<[^<>]+>)/,
  cap: /[A-Z]/,
  self: /<([^\s<>\/]+)([^<>]*?)\/>/,
  close: /<\/([^\s<>]+)>/,
  start: /<([^\s<>]+) ?([^<>]*)>/,
  text: /<(?:\/?[A-Za-z]+\b[^>]*>|!--.*?--)>/,
  firstLetterCapped: /<([A-Z][A-Za-z0-9]*)/,
  isComponentCloseTag: /<\/[A-Z][A-Za-z0-9]*>/,
  isNotTag: /^(?!<\w+\/?>$).+$/,
};

globalThis.koras_state = globalThis.koras_state || {};

function __$setState(props) {
  const key = `koras_${Math.random().toString(36).substring(2)}`;
  globalThis.koras_state[key] = props;
  return key;
}

function getState(key) {
  const props = window.koras_state[key];
  return props ? props : key;
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
  if(typeof str !== STRING){
    return str;
  }
  
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

/**
 * Tag regex matchers
 * @param str
 * @returns {Boolean}
 */
function isLine(property, line) {
  return patterns[property].test(line);
}


/**
 * check for component
 * @param str
 * @returns boolean
 */
function isComponent(line) {
  return isLine("firstLetterCapped", line);
}

function tryCatchSmart(label, fn, ...args) {
  try {
    const result = fn(...args);
    if (result instanceof Promise) {
      return result.catch(error => logError(label, error, args));
    }
    return result;
  } catch (error) {
    logError(label, error, args);
  }
}

function logError(label, error, inputValue) {
  const stackLines = (error.stack || '').split('\n');
  const locationLine = stackLines.find(line =>
    line.includes('at ') && !line.includes('tryCatch')
  );

  console.error(`🚨 [Error in "${label}"]`);
  console.error(`• Message: ${error.message}`);
  if (locationLine) console.error(`• Location: ${locationLine.trim()}`);
  console.error('• Input Value:', inputValue);
  console.error('• Full Stack Trace:\n', error.stack);
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
  $render(component, {
    error
  });
}

function callRenderDomPurifier(html) {
  if (!globalThis["RenderDomPurifier"]) return html;
  const component = globalThis["RenderDomPurifier"];
  $render(component, {
    html
  });
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

function quoteAttributes(str) {
  const regex = /(\w+)=([^=\s]+)(?=\s+\w+=|$)/g;
  return str.replace(regex, (match, key, value) => {
    const trimmed = value.trim();

    // if already quoted, leave it
    if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
      return `${key}=${trimmed}`;
    }

    // quote booleans also
    if (trimmed === "true" || trimmed === "false") {
      return `${key}="${trimmed}"`;
    }

    // quote numbers and text (your original behavior)
    return `${key}="${trimmed}"`;
  });
}

function extractStaticAttributes(input, component) {
  input = quoteAttributes(input.replace(/^\/\s*|\s*\/$/g, ''));

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
        if (inObject !== ZERO) {
          attrValue += char;
        }
        inObject++;
      } else if (char === "}") {
        inObject--;
        if (inObject !== ZERO) {
          attrValue += char;
        }
      } else if (inObject > 0 && (char === "{" || char === "[")) {
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
  const propsSplittingRegex = /([\S]+=[`"']?_9s35Ufa7M67wghwT_([^]*?)_9s35Ufa7M67wghwT_[`"']?)/g;

  const trimmedProps = spreadedProps.trim().slice(ZERO, -1);
  let keyValuePairs = trimmedProps.match(propsSplittingRegex) ?? [];
  const primitiveData = spreadedProps.replace(propsSplittingRegex, "") ?? [];

  keyValuePairs = [
    ...keyValuePairs, 
    ...extractStaticAttributes(primitiveData, component)
  ];

  let depth = 0;

  while (depth < keyValuePairs.length) {
    const pair = keyValuePairs[depth];
    let splitParam = pair.includes(renderIdentity) ? `=${renderIdentity}` : "=";

    if (
      pair.includes('="' + renderIdentity) ||
      pair.includes("='" + renderIdentity)
    ) {
      splitParam = pair.includes('="' + renderIdentity) ?
        `="${renderIdentity}` :
        `='${renderIdentity}`;
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

async function checkForJsQuirks(input, component) {
  input = isPromise(input) ? await input : input;
  if (/\[object/.test(input)) {
    const errorMsg = `You are expected to pass an object or an array of object(s) with {} but you used \${} in ${component}`;
    callRenderErrorLogger(errorMsg);
  }

  if (/NaN/.test(input)) {
    const errorMsg = `NaN is found. This component probably expects an object or array of object as props or you use falsy props in ${component}.`;
    callRenderErrorLogger(errorMsg);
  }

  if (/undefined/.test(input) || /null/.test(input)) {
    const errorMsg = `undefined, null, [object Object] is found. This component probably expects an object or array of object as props or you use falsy value or pass props as value in ${component}.`;
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
    let index = 0; //depth
    while (index < stack.length) {
      const node = stack[index];
      const trimmedNode = node.trim();

      if (trimmedNode === ",") {
        html += "";
      } else {
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
      let currentElement = extensibleStr[depth].trim();
      if (currentElement === "") {
        depth++;
        continue;
      }
      if (isComponent(currentElement)) {
        extensibleStr = await parseChildrenComponents(
          extensibleStr,
          currentElement,
          depth
        );
      } else {
        currentElement = currentElement.replace(/_9s35Ufa7M67wghwT_/g, "");
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

function getChildrenOfTag(tokens, targetIndex) {
  const openTag = tokens[targetIndex];
  const openTagMatch = openTag.match(/^<([a-zA-Z0-9\-]+)\b/);
  if (!openTagMatch) throw new Error("Invalid opening tag at target index");

  const tagName = openTagMatch[1];
  const closeTag = `</${tagName}>`;

  const children = [];
  let depth = 0;
  let i = targetIndex + 1;

  while (i < tokens.length) {
    const token = tokens[i];

    if (typeof token === "string") {
      const isSameOpen = token.startsWith(`<${tagName}`) && !token.startsWith(`</`);
      const isSameClose = token === closeTag;

      if (isSameOpen) {
        depth++;
        children.push(token);
        i++;
        continue;
      }

      if (isSameClose) {
        if (depth === 0) {
          break; // we've reached the outermost closing tag
        } else {
          depth--;
          children.push(token);
          i++;
          continue;
        }
      }
    }

    // push normal token (text or other tags)
    children.push(token);
    i++;
  }

  if (i >= tokens.length || tokens[i] !== closeTag) {
    throw new Error(`Missing closing tag for <${tagName}>`);
  }

  // Construct updated tokens array (keep opening tag, remove children + closing tag)
  const newTokens = [
    ...tokens.slice(0, targetIndex + 1),
    ...tokens.slice(i + 1)
  ];

  return {
    tokens: newTokens,
    children: children.join(" ")
  };
}

function handleAttributes(propsString, str = false) {
  let props = {};
  let output = handleSpreadProps(propsString);
  propsString = output.attribute;

  const standAloneExpr = extractStandaloneExpressionsAsString(output.attribute);
  propsString = removeStandAloneExpressionsFromAttribute(propsString.trim(), standAloneExpr)

  props = parsePropsManually(
    deSanitizeString(
      propsString.trim()
    ), str)

  if (typeof props === STRING) {
    return props += output.spreadPropsString + " " + standAloneExpr.join(" ");
  }
  props.extra = output.spreadPropsString + " " + standAloneExpr.join(" ");
  return props;
}

function extractStandaloneExpressionsAsString(input) {
  let i = 0;
  const expressions = [];

  while (i < input.length) {
    // Skip key=value pairs
    const keyMatch = input.slice(i).match(/^\s*[\w-]+\s*=/);
    if (keyMatch) {
      i += keyMatch[0].length;
      const nextChar = input[i];
      if (nextChar === '"' || nextChar === "'") {
        const quote = nextChar;
        i++;
        while (i < input.length && input[i] !== quote) {
          if (input[i] === '\\') i++; // skip escaped
          i++;
        }
        i++; // skip closing quote
      } else if (nextChar === '{') {
        let depth = 1;
        i++;
        while (i < input.length && depth > 0) {
          if (input[i] === '{') depth++;
          else if (input[i] === '}') depth--;
          i++;
        }
      } else {
        while (i < input.length && !/\s/.test(input[i])) i++;
      }
      continue;
    }

    // Detect standalone { or ${
    if (input[i] === '{') {
      const isDollar = input[i + 1] === '$' && input[i + 2] === '{';
      let start = i;
      let depth = 0;
      do {
        if (input[i] === '{') depth++;
        else if (input[i] === '}') depth--;
        i++;
      } while (i < input.length && depth > 0);
      const raw = input.slice(start, i);

      // Normalize {...} to ${...}
      const expr = isDollar ? raw : `\${${raw.slice(1, -1).trim()}}`;
      expressions.push(expr);
    } else {
      i++;
    }
  }
  return expressions;
}

function handleSpreadProps(attribute) {
  const spreadRegex = /\{\.{3}([\w.$]+)\}/g;
  let spreadPropsString = '';
  let spreadMatch;

  while ((spreadMatch = spreadRegex.exec(attribute)) !== null) {
    spreadPropsString += " ${spreadKorasProps(" + spreadMatch[1] + ")}";
    attribute = attribute.replace(spreadMatch[0], '');
  }
  return {
    spreadPropsString,
    attribute
  };
}

function removeStandAloneExpressionsFromAttribute(attribute, targets) {
  for (let i = 0; i < targets.length; i++) {
    const standAloneExpressions = targets[i].startsWith("$") ? targets[i] : `\$${targets[i]}}`
    attribute = attribute.replace(standAloneExpressions, ''); // ${} version
    attribute = attribute.replace(standAloneExpressions.slice(1), ''); // {} version
  }
  return attribute;
}

function convertToAttr(obj) {
  return Object.entries(obj)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : ''; // For boolean attributes, include only if true
      }
      const escapedValue = String(value)
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      return `${key}="${escapedValue}"`;
    })
    .filter(Boolean) // Remove empty strings (e.g., for false booleans)
    .join(' ');
}

function transformValue(value) {
  if (!value) {
    return String(value);
  }

  if (value.startsWith("$render")) { ////$render
    const valueWithEscaped$render = value.replace(/\$render/, "\\$render")
    return transformRenderArgs(tokenize(valueWithEscaped$render));
  }

  if (
    value.includes("(") &&
    value.includes(")") &&
    value.includes("${")) {
    // console.log(value)
    value = [...transformFunctionCallArgs(tokenize(value))]
    return value.join("");
  }

  if (value.startsWith("${{") ||
    value.startsWith("${") ||
    value.startsWith("{{") ||
    value.startsWith("{")) {

    value = ['\${', ...transformInterpolations(tokenize(value)), '}']
    return value.join("");
  }

  return value;
}

function convertDoubleQuoteToSingleQuoute(str) {
  return str.replace(/\$\{([^}]*)\}/g, (match, content) => {
    const updated = content.replace(/"([^"]*)"/g, "'$1'");
    return '${' + updated + '}';
  });
}

function parsePropsManually(str, string = false) {
  str = convertDoubleQuoteToSingleQuoute(str);

  //convert all single quotes to double quotes
  str = str.replace(/=(['"])(.*?)\1/g, '="$2"');
  let props = {};
  let key = '',
    value = '',
    readingKey = true,
    readingValue = false;
  let inQuotes = false;

  for (let i = 0; i < str.length; i++) {
    let char = str[i];

    if (readingKey) {
      if (char === '=') {
        readingKey = false;
        readingValue = true;
        continue;
      }
      // if (/\s/.test(char)) continue;
      key += char;
    } else if (readingValue) {
      if (char === '"') {
        if (inQuotes) {
          props[key] = string ? transformValue(value) : $purify(value);
          key = value = '';
          readingKey = true;
          readingValue = false;
          inQuotes = false;
        } else {
          inQuotes = true;
        }
        continue;
      }
      if (inQuotes) value += char;
    }
  }

  const resolvedProps = string ? convertToAttr(props) : props;
  return resolvedProps;
}
async function parseChildrenComponents(extensibleStr, currentElement, depth) {

  const line = currentElement;
  const regularMatch = line.match(patterns.start);
  const selfClosingMatch = line.match(patterns.self);
  const node = regularMatch ? regularMatch : selfClosingMatch;
  let extraction = selfClosingMatch ? "" : getChildrenOfTag(extensibleStr, depth);

  const dependencies = {
    tagName: node[ONE],
    props: parseProps(deSanitizeString(node[2]), node[ONE]),
    children: extraction.children
  };

  try {
    let calledComponent = await callComponent(dependencies);
    const component = normalizeHTML(
      sanitizeOpeningTagAttributes(calledComponent)
    );

    extensibleStr = extraction ? extraction.tokens : extensibleStr;
    const indexOfCurrentElement = extensibleStr.indexOf(currentElement);
    const result = component.split(patterns.anyNode);

    if (indexOfCurrentElement !== -1) {
      extensibleStr.splice(indexOfCurrentElement, ONE, ...result);
    }
    return extensibleStr;
  } catch (error) {
    const component = node[ONE];
    callRenderErrorLogger({
      error,
      component
    });
    console.error(`${error} in ${component}: ${globalThis[component]}`);
  }
}

export function extractBalancedBrackets(tokens, startIndex, open = '{', close = '}', errors = []) {
  let depth = 1;
  const result = [open];
  let i = startIndex;

  while (i < tokens.length) {
    const token = tokens[i];
    result.push(token);

    if (token === open) {
      depth++;
    } else if (token === close) {
      depth--;
    }

    i++;
    if (depth === 0) {
      break;
    }
  }

  if (depth !== 0) {
    errors.push({
      type: 'UnmatchedBracket',
      token: open,
      at: startIndex
    });
    return [
      [], i
    ];
  }

  result.shift() //remove the open brace { used to track braces recursively
  return [result, i];
}

export function extractInterpolation(tokens, index, errors = []) {
  if (!tokens[index]) {
    return null;
  }

  const hasDollar = tokens[index] === '$';
  if (hasDollar) {
    index++;
  }

  if (tokens[index] !== '{') {
    return null;
  }

  const [content, end] = extractBalancedBrackets(tokens, index + 1, '{', '}', errors);
  return [content.slice(0, -1), end, hasDollar];
}

export function isValidIdentifier(token) {
  return /^[a-zA-Z_$][\w$]*$/.test(token);
}

export function* tokenize(input) {
  let i = 0;

  while (i < input.length) {
    const char = input[i];

    // Match {...spread} including nested ones like {...{a: {...b}}}
    if (input.startsWith('{...', i)) {
      const start = i;
      i += 3; // skip '{...'
      let braceDepth = 1;

      while (i < input.length && braceDepth > 0) {
        if (input[i] === '{') braceDepth++;
        else if (input[i] === '}') braceDepth--;
        i++;
      }

      yield input.slice(start, i);
    }

    // Whitespace
    else if (/\s/.test(char)) {
      let start = i;
      while (i < input.length && /\s/.test(input[i])) i++;
      yield input.slice(start, i);
    }

    // Line comment
    else if (input.startsWith('//', i)) {
      while (i < input.length && input[i] !== '\n') i++;
    }

    // Block comment
    else if (input.startsWith('/*', i)) {
      i += 2;
      while (i < input.length && !input.startsWith('*/', i)) i++;
      i += 2;
    }

    // Single-character token
    else if ("(),{}[]:$".includes(char)) {
      yield char;
      i++;
    }

    // Strings: '', "", ``
    else if ("'\"`".includes(char)) {
      const quote = char;
      let value = char;
      i++;
      while (i < input.length) {
        if (input[i] === '\\') {
          value += input[i++] + (input[i] || '');
        } else if (input[i] === quote) {
          value += input[i++];
          break;
        } else {
          value += input[i++];
        }
      }
      yield value;
    }

    // Regular identifiers or values
    else {
      let start = i;
      while (
        i < input.length &&
        !/\s/.test(input[i]) &&
        !"(),{}[]:$".includes(input[i])
      ) {
        i++;
      }
      yield input.slice(start, i);
    }
  }
}

function* wrapWithEncoder(innerTokens, encoder = 'stringify') {
  yield encoder;
  yield '(';
  for (const token of innerTokens) yield token;
  yield ')';
}

function buildStateSetter(props) {
  const sanitizedProps = sanitizeString([...transformInterpolations(props)].join(""));
  return sanitizedProps ? ", '${__$setState(" + sanitizedProps + ")}'" : '';
}

export function transformRenderArgs(tokens, errors = []) {
  const input = Array.from(tokens);
  input.shift(); //remove "//"
  let filteredInput = input.filter(str => str.trim() !== "")
  
  const dollar = filteredInput[0];
  const render = filteredInput[1];
  const openBrace = filteredInput[2];
  const component = filteredInput[3];
  let value;
  const reformedRenderPart = dollar + render + openBrace + component; //forms $render(Component

  //reform $render component is passed as js expression ($render(${component}, ${props}?))
  if (component === dollar) {
    let props = filteredInput.slice(9, filteredInput.length - 1);
    props = props.length === 2 ? props.unshift("{"): props;
    const reformedRenderPart = "$render(${" + filteredInput[5] + "}";
    let fullRender = reformedRenderPart + buildStateSetter(props) + ")";
    fullRender = filteredInput[10] ? fullRender : reformedRenderPart + ")";
    return fullRender;
  }

  if (input.length > 5) {
    let props = filteredInput.slice(6, filteredInput.length - 1);
    props = props.length === 2 ? props.unshift("{") : props;
    value = filteredInput.length === 9 ? filteredInput[6] : filteredInput[7];
    const otherPart = reformedRenderPart + buildStateSetter(props) + ")";
    return otherPart; //forms $render(Component, '${setState(springify(props)}'))
  }

  return reformedRenderPart + ")"; //forms $render(Component)
}

export function* transformInterpolations(tokens, errors = []) {
  let input = Array.from(tokens);
  input = input.filter(str => str.trim() !== "")

  let i = 0;
  while (i < input.length) {
    const result = extractInterpolation(input, i, errors);

    if(!result) {
      return input.join("");
    }

    if (result) {
      let [inner, end] = result;  ``
      i = end;
      // inner = inner.length === 5 ? inner.push("}") : inner;
    
      yield* wrapWithEncoder(inner);
    } else {
      yield input[i++];
    }
  }
}

function disallowClosureToFunctionCall(input) {
  let filteredInput = input.filter(str => str.trim() !== "")
  const dollar = filteredInput[0];
  const openCurlyBrace = filteredInput[1];
  const openBrace = filteredInput[2];

  const initialCharOfClosure = dollar + openCurlyBrace + openBrace;
  //heuristic to know we are dealing with a closure.
  if (initialCharOfClosure === "${(") {
    throw ("Please, pass the function like ${ play() } instead of ${ () => play() }")
  }
  return filteredInput;
}

export function* transformFunctionCallArgs(tokens, errors = []) {
  let input = Array.from(tokens);
  input = disallowClosureToFunctionCall(input);
  let i = 0;

  while (i < input.length) {
    if (
      (input[i] === '$' || input[i] === '') &&
      isValidIdentifier(input[i + 2] || '') &&
      input[i + 3] === '('
    ) {
      const funcName = input[i + 2];
      i += 4;

      // extract args inside parentheses
      let [args, end] = extractBalancedBrackets(input, i, '(', ')', errors);
      i = end;
      args = args.slice(0, args.length - 1);

      let props = args.length > 0 && args.join("");

      if (props && props.trim() === "event") {
        yield* ['${__trigger(' + funcName + ", event)"];
      } else if(props && props.startsWith("this")) {
        throw(`Use event instead of this in ${funcName} and do not pass event as a prop.`)
       } else if (props) {
        yield* ['${__trigger(' + funcName + ", stringify(" + props + "))"];
      } else {
        yield* ['${__trigger(' + funcName + ')'];
      }
    } else {
      yield input[i++];
    }
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
      } else {
        props.children = " ";
      }

      const calledComponent = checkForJsQuirks(component(props), component);
      const resolvedComponent = isPromise(calledComponent) ?
        await calledComponent :
        calledComponent;
      return resolvedComponent;
    }
  } catch (error) {
    const componentName = element.tagName;
    callRenderErrorLogger({
      error,
      component: componentName
    });
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

function isBrowser(){
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

function executeSignal(signal){
  if(typeof signal.action !== FUNCTION){
    console.error("Signal: 'action' must be a function.");
    return false;
  }
  signal.action(signal.props);
}
/**
 * @desc renders component
 * @param component string
 * @returns string || void (mutates the DOM)
 */

async function $render(component, props) {
  const result = await tryCatchSmart("$render", __$render, component, props);
  return result;
}

async function __$render(component, props){
  const updatedComponent = globalThis[component.name];
  let renderedApp;

  if (!isInitialLetterUppercase(component, "$render")) {
    throw new Error("A component must start with a capital letter");
  }

  if(!isBrowser()){
    const resolvedComponent = await resolveComponent(updatedComponent, props);
    const resolvedComponentWithCustomPurifier = callRenderDomPurifier(resolvedComponent);
    const result = await processJSX(
        sanitizeOpeningTagAttributes(resolvedComponentWithCustomPurifier)
      );
    return result;
  }
   
  if (document.readyState === "complete") {
    renderedApp = await handleClientRendering(updatedComponent, getState(props));
    return renderedApp;
  } 

  window.addEventListener("DOMContentLoaded", async () => {
    renderedApp = await handleClientRendering(updatedComponent, getState(props));
  });
  
  return renderedApp;
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
    return checkForJsQuirks(result, component)
  }

  if (typeof resolvedComponent !== STRING) {
    throw "A component must return a string or an empty string";
  }

  return checkForJsQuirks(resolvedComponent, component);
}


function sanitizeOpeningTagAttributes(tag) {
  const regex = /(\w+)=("[^"]*"|'[^']*')/g;
  return tag.replace(regex, (match, attributeName, attributeValue) => {
      const sanitizedValue = attributeValue
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;"); //make this to not affect arrow function's '=>' and if it works sanitizeString should be enough
      return `${attributeName}=${sanitizedValue}`;
    });
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

function convertHtmlStringToDomElement(processedComponent) {
  const parser = new DOMParser();
  const componentEl = parser.parseFromString(processedComponent, "text/html");
  const parsedComponent = componentEl.querySelector("body > :first-child");

  if (!parsedComponent) {
    return parsedComponent;
  }

  if (parsedComponent.id === "") {
    throw "A reRenderable component wrapping div must have an ID";
  }
  return parsedComponent;
}

function syncDomNode(target, source) {
  if (!target || !source || target.nodeType !== source.nodeType) return;

  // --- Text Node Sync ---
  if (target.nodeType === Node.TEXT_NODE) {
    if (target.nodeValue !== source.nodeValue) {
      target.nodeValue = source.nodeValue;
    }
    return;
  }

  // --- Replace node if tag differs ---
  if (target.nodeName !== source.nodeName) {
    const newNode = source.cloneNode(true);
    target.replaceWith(newNode);
    return;
  }

  // --- Sync attributes ---
  const srcAttrs = source.attributes;
  const tgtAttrs = target.attributes;

  // Add or update changed attributes
  for (let i = 0; i < srcAttrs.length; i++) {
    const { name, value } = srcAttrs[i];
    if (target.getAttribute(name) !== value) {
      target.setAttribute(name, value);
    }
  }

  // Remove extra attributes
  for (let i = tgtAttrs.length - 1; i >= 0; i--) {
    const { name } = tgtAttrs[i];
    if (!source.hasAttribute(name)) {
      target.removeAttribute(name);
    }
  }

  // --- Sync child nodes ---
  const srcChildren = Array.from(source.childNodes);
  const tgtChildren = Array.from(target.childNodes);

  const max = Math.max(srcChildren.length, tgtChildren.length);

  for (let i = 0; i < max; i++) {
    const srcChild = srcChildren[i];
    const tgtChild = tgtChildren[i];

    if (!srcChild && tgtChild) {
      target.removeChild(tgtChild);
    } else if (srcChild && !tgtChild) {
      target.appendChild(srcChild.cloneNode(true));
    } else if (srcChild && tgtChild) {
      if (
        srcChild.nodeType !== tgtChild.nodeType ||
        srcChild.nodeName !== tgtChild.nodeName
      ) {
        const newNode = srcChild.cloneNode(true);
        target.replaceChild(newNode, tgtChild);
      } else {
        syncDomNode(tgtChild, srcChild);
      }
    }
  }
}


function hasVisibleChildren(el) {
  return [...el.childNodes].every(node => {
    if (node.nodeType === 8) {
      return false;
    }

    if (node.nodeType === 3 && !node.textContent.trim()) {
      return false;
    }

    return true;
  })
}

function handleViewTransition(target, renderOnlyDOM){
  if (shouldStartTransition(target)) {
    document.startViewTransition(renderOnlyDOM);
  } else {
    renderOnlyDOM();
  } 
}

function shouldStartTransition(domNode) {
  if (
    typeof document.startViewTransition !== "function" ||
    !(domNode instanceof Element)
  ) {
    return false;
  }

  // Check the element itself OR any descendant
  return domNode.matches("[view-transition-name]") ||
    domNode.querySelector("[view-transition-name]");
}

/**
 * @desc renders client component
 * @param component func
 * @param arg any
 * @returns void (mutates the DOM)
 */
async function handleClientRendering(component, arg) {
  if(__$signal.props && __$signal.props.when === "before"){
    executeSignal(__$signal);
  }

  const resolvedComponent = await resolveComponent(component, arg);

  if (!resolvedComponent) {
    return resolvedComponent;
  }

  const resolvedComponentWithCustomPurifier = callRenderDomPurifier(resolvedComponent);
  let processedComponent = await processJSX(
    sanitizeOpeningTagAttributes(resolvedComponentWithCustomPurifier)
  );

  const parsedComponent = convertHtmlStringToDomElement(processedComponent);
  if(!parsedComponent){
    return " ";
  }

  updateTargetComponent(parsedComponent);

  if(__$signal.props && __$signal.props.when === "after"){
    executeSignal(__$signal);
  }

  return processedComponent;
}

function updateTargetComponent(component) {
  let el = $el(component.id); //current component
  if (el == null) {
    useBody(component);
  } else if (!hasVisibleChildren(el)) {
    const renderOnlyDOM = () => el.parentNode.replaceChild(component, el);
    handleViewTransition(el, renderOnlyDOM);
  } else if (el && hasVisibleChildren(el)) {
    // syncDomNode(el, component);
    const renderOnlyDOM = () => syncDomNode(el, component);
    handleViewTransition(el, renderOnlyDOM);
    // el.parentNode.replaceChild(component, el);
  } 
}


function makeFunctionFromString(component) {
  const componentString = component.toString();
  const updatedComponent = transformTags(componentString, handleAttributes);
  return Function(`return ${updatedComponent}`)();
}

function normailzeQuotesInFunctionString(funcStr) {
  return funcStr
    .replace(/"(\w+)"\s*:/g, "'$1':")
    .replace(/:\s*"([^"]*)"/g, ": `$1`")
    .replace(/"/g, "`");
}

function formatKeyValuePairs(input) {
  return input.replace(/(\w+)=\$?{(.*?)}/g, (match, key, value) => {
    return key + '="${' + value + '}"';
  });
}

function transformTags(template, handleAttributes) {
  template = sanitizeOpeningTagAttributes(formatKeyValuePairs(template));
  return template.replace(
    /<([\w-]+)(\s[^<>]*?)?\s*(\/?)>/g,
    (tag, tagName, rawAttrs = '', selfClosing) => {
      if (!rawAttrs) return tag; // no attributes → return as-
      const processedAttrs = handleAttributes(
        rawAttrs.trim(),
        true
      );
      // Replace only attributes inside the original tag,
      // keep spacing/line breaks/indentation untouched
     return tag.replace(rawAttrs, ' ' + deSanitizeString(processedAttrs));
    }
  );
}

/**
 * Push function to the global scope
 * @param agrs functions
 * @return boolean
 */
function $register(...args) {
  if (isBrowser()) {
    const bundle = document.querySelector('#koras_bundle');
    if(bundle) return;
  }

  const components = [...args];
  let depth = ZERO;

  while (components.length > depth) {
    let component = components[depth];
    
    if(isArrow(component)){
      component = arrowToNamed(component.name,  component);
    }

    if (typeof component !== FUNCTION) {
      throw "Only function is expected";
    }

    globalThis[component.name] = makeFunctionFromString(component);
    bundle += "\n\r\n\r" + globalThis[component.name]; 
    depth++;
  }

  globalThis['koras_bundle'] = bundle;
  return globalThis;
}

function arrowToNamed(name, arrowFn) {
  let src = arrowFn.toString().trim();

  // Detect async
  const isAsync = src.startsWith("async");
  if (isAsync) src = src.replace(/^async\s*/, "");

  // Normalize params: wrap single param in ()
  if (!src.startsWith("(")) {
    src = "(" + src;
  }

  if (!src.includes("{")) {
    // Expression body
    src = src.replace(/\s*=>\s*/, `) { return `) + ` }`;
  } else {
    // Block body
    src = src.replace(/\s*=>\s*/, "");
  }

  // Insert name (with async if needed)
  src = src.replace(
    /^\s*\(/,
    `${isAsync ? "async " : ""}function ${name}(`
  );

  return Function(`return ${src}`)();
}

function isArrow(fn) {
  return typeof fn === "function" && !fn.hasOwnProperty("prototype") && !fn.toString().trim().startsWith('async');
}

/*  */
function $el(elementId) {
  return document.getElementById(elementId);
}

function useBody(component) {
  const root = document.body;
  root.appendChild(component)
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

function unescapeQuotes(props) {
  props = props.replace(/\\'/g, "'").replace(/\\"/g, '"');
  return props;
}

function escapeString(str) {
  return String(str)
    .replace(/\\/g, '\\\\') // backslash
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"') // double quote
    .replace(/\"/g, '\\"') // escaped double quote
    .replace(/[\x00-\x1F]/g, (ch) => {
      switch (ch) {
        case '\b':
          return '\\b';
        case '\f':
          return '\\f';
        case '\n':
          return '\\n';
        case '\r':
          return '\\r';
        case '\t':
          return '\\t';
        default:
          return '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0');
      }
    });
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

  if (type === BOOLEAN) return String(data);

  if (type === FUNCTION) {
    const sanitizedString = removeJsComments(data.toString());
    return `__function__:${sanitizedString}`;
  }

  if (type === UNDEFINED) {
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
      value !== UNDEFINED &&
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
  Object: "Object"
};

function isAllowed(data) {
  if (banList(data)) {
    throw new Error("Data type not allowed. Wrap it in a function instead");
  }
  return allowedData[getType(data)] ? true : false;
}

function callFunctionWithElementsAndData(func, data=false) {

  if(typeof func !== FUNCTION){
    return false;
  }

  const functionName = __$setState(func);

  if (data instanceof Event || data instanceof Document) {
    return `(koras_state['${functionName}'])(${data instanceof Event ? "event" : "this"})`;
  }

  const purifiedProps = $purify(
    deSanitizeString(data, func.name ?? func)
  );

  data = data ? __$setState(purifiedProps) : '';
  const propsReference = data ? `koras_state['${data}']` : ''
  return `(koras_state['${functionName}'])(${propsReference})`;

}

function __trigger(func, data) {
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

    if(prop && typeof prop === STRING || typeof prop === NUMBER){
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

function $purify(props, component) {
  if(props === "{}") return {};
  if(props === "[]") return [];
  if (typeof props !== STRING) return props;
  try {
    if (props.startsWith(renderIdentity)) {
      props = deSanitizeString(props.slice(18, -18));
      if(props.startsWith("__function__:")){
        return preprocessFunction(props);
      }
    }
    if (!props.includes('"', ZERO)) {
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

function If({condition=false, children} = {}){
  return condition ? children : "";
}

function For({ each = [], render, target = "eueei", position, fallback } = {}) {
  // Get parent element
  let parent = target.startsWith("#") 
      ? $select(target) 
      : $select(`#${target}`);

  // Parse items array if it's a string
  const items = Array.isArray(each) ? each : JSON.parse(each);

  // If no items, use fallback if provided
  if (!items || items.length === 0) {
    if (typeof fallback === "function") {
      const fallbackContent = fallback();

      // Append fallback instead of replacing innerHTML
      if (parent) {
        parent.innerHTML = position === "prepend"
          ? `${fallbackContent} ${parent.innerHTML}`
          : `${parent.innerHTML} ${fallbackContent}`;
      }

      return fallbackContent;
    }
    return typeof fallback === STRING ? fallback : 'loading...'; // No items and no fallback
  }

  const key = parent ? parent.children.length : items.length;
  const lastItem = items[items.length - 1];
  const lastKey = lastItem && (lastItem.id ?? lastItem);

  // Avoid duplicate rendering if last key matches
  if (parent && lastKey === Number(key)) {
    return parent.innerHTML;
  }

  // Render children
  let children = items.map((item, index) => {
    index = parent ? index + Number(parent.children.length) : index;
    return globalThis[`${render}`]({ item, index });
  }).join(" ");

  // Append or prepend to parent
  if (parent) {
    children = position === "prepend" 
           ? `${children} ${parent.innerHTML}`
           : `${parent.innerHTML} ${children}`;
    parent.innerHTML = children; // update DOM
  }

  return children;
}

function registerInternalUtils() {
  globalThis["$render"] = $render;
  globalThis["If"] = If;
  globalThis["For"] = For;
  globalThis["stringify"] = stringify;
  globalThis["__trigger"] = __trigger;
  globalThis["$purify"] = $purify;
  globalThis["spreadKorasProps"] = spreadKorasProps;
  globalThis["__$setState"] = __$setState;
  globalThis["__$signal"] = {};
}

registerInternalUtils();

export {
  $render,
  $register,
  stringify,
  $purify,
  If,
  For
};
