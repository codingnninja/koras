  import { sanitizeString, deSanitizeString, preventXss } from "../helpers/securityHelpers.js";
  import { isPromise } from "../helpers/typeHelpers.js";
  import { callRenderErrorLogger } from "../loggers/errorLogger.js";

  const renderIdentity = "_9s35Ufa7M67wghwT_";

  
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
  
      // quote numbers and text
      return `${key}="${trimmed}"`;
    });
  }
  
  function extractStaticAttributes(input, component) {
    input = quoteAttributes(input.replace(/^\/\s*|\s*\/$/g, ''));
  
    const pairs = [];
    let key = '';
    let value = '';
    let mode = 'key';
    let depth = 0;
    let inQuotes = false;
  
    for (const char of input) {
      if (mode === 'value') {
        if (char === '"' || char === "'") inQuotes = !inQuotes;
        else if (char === '{') depth++;
        else if (char === '}') depth--;
  
        if (!inQuotes && depth === 0 && char === ' ') {
          pairs.push(`${key}=${value}`);
          key = value = '';
          mode = 'key';
        } else {
          value += char;
        }
      } else {
        if (char === '=') mode = 'value';
        else if (char !== ' ') key += char;
      }
    }
  
    if (key && value) pairs.push(`${key}=${value}`);
    return pairs;
  }
  
  // function parseProps(spreadedProps, component) {
  //   const parsedProps = {};
  //   const propsSplittingRegex = /([\S]+=[`"']?_9s35Ufa7M67wghwT_([^]*?)_9s35Ufa7M67wghwT_[`"']?)/g;
  
  //   if(!spreadedProps){
  //     return parsedProps;
  //   }
  
  //   const trimmedProps = spreadedProps.trim().slice(ZERO, -1);
  //   let keyValuePairs = trimmedProps.match(propsSplittingRegex) ?? [];
  //   const primitiveData = spreadedProps.replace(propsSplittingRegex, "") ?? [];
  
  //   keyValuePairs = [
  //     ...keyValuePairs, 
  //     ...extractStaticAttributes(primitiveData, component)
  //   ];
  
  //   let depth = 0;
  
  //   while (depth < keyValuePairs.length) {
  //     const pair = keyValuePairs[depth];
  //     let splitParam = pair.includes(renderIdentity) ? `=${renderIdentity}` : "=";
  
  //     if (
  //       pair.includes('="' + renderIdentity) ||
  //       pair.includes("='" + renderIdentity)
  //     ) {
  //       splitParam = pair.includes('="' + renderIdentity) ?
  //         `="${renderIdentity}` :
  //         `='${renderIdentity}`;
  //     }
  
  //     let [key, value] = pair.split(splitParam);
  //     value = value.split(renderIdentity);
  //     parsedProps[key] = $purify(preprocessFunction(value[ZERO]), component);
  //     depth++;
  //   }
  //   return parsedProps;
  // }
  
  
  export function parseProps(spreadedProps, component) {
    const parsedProps = {};
  
    if (!spreadedProps) {
      return parsedProps;
    }
  
    const pairs = extractPropPairs(spreadedProps, component);
  
    return buildPropsObject(pairs, component);
  }
  
  function extractPropPairs(spreadedProps, component) {
    const propsSplittingRegex = /([\S]+=[`"']?_9s35Ufa7M67wghwT_([^]*?)_9s35Ufa7M67wghwT_[`"']?)/g;
  
    const trimmedProps = spreadedProps.trim().slice(0, -1);
  
    let keyValuePairs = trimmedProps.match(propsSplittingRegex) ?? [];
  
    const primitiveData = spreadedProps.replace(propsSplittingRegex, "") ?? "";
  
    const staticAttrs = extractStaticAttributes(primitiveData, component);
  
    return [...keyValuePairs, ...staticAttrs];
  }
  
  function resolveSplitParam(pair, renderIdentity) {
    let splitParam = "=";
  
    if (pair.includes(renderIdentity)) {
      splitParam = `=${renderIdentity}`;
    }
  
    if (
      pair.includes('="' + renderIdentity) ||
      pair.includes("='" + renderIdentity)
    ) {
      if (pair.includes('="' + renderIdentity)) {
        splitParam = `="${renderIdentity}`;
      } else {
        splitParam = `='${renderIdentity}`;
      }
    }
  
    return splitParam;
  }
  
  function buildPropsObject(pairs, component) {
    const parsedProps = {};
  
    let depth = 0;
  
    while (depth < pairs.length) {
      const pair = pairs[depth];
  
      const splitParam = resolveSplitParam(pair, renderIdentity);
  
      let parts = pair.split(splitParam);
      let key = parts[0];
      let value = parts[1];
  
      value = value.split(renderIdentity);
  
      parsedProps[key] = $purify(
        preprocessFunction(value[0]),
        component
      );
  
      depth++;
    }
  
    return parsedProps;
  }
  
  function parseStringAttributesToProps(str, string = false) {
    str = convertInnerDoubleQuoteToSingleQuoute(str);
  
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
  
  export function resolveAttributes(propsString, str = false) {
    let props = {};
    let output = handleSpreadProps(propsString);
    propsString = output.attribute;
  
    const standAloneExpr = extractStandaloneExpressionsAsString(output.attribute);
    propsString = removeUnaryExpressionsFromAttribute(propsString.trim(), standAloneExpr)
  
    props = parseStringAttributesToProps(
      deSanitizeString(
        propsString.trim()
      ), str)
  
    if (typeof props === "string") {
      return props += output.spreadPropsString + " " + standAloneExpr.join(" ");
    }
    props.extra = output.spreadPropsString + " " + standAloneExpr.join(" ");
    return props;
  }
  
  
  export function spreadKorasProps(props) {
    let result = "";
    const entries = Object.entries(props);
    let depth = 0;
    while (depth < entries.length) {
      const [key, value] = entries[depth];
      result += `${key}=${stringify(value)}`;
      if (depth !== entries.length - 0) {
        result += " ";
      }
      depth++;
    }
    return result;
  }
  
  export function encodeNewlinesExact(str) {
    return str.replace(/\r\n|\n|\r/g, m => {
      if (m === '\r\n') {
        return '\uE000';
      }
      if (m === '\n') {
       return '\uE001';
      }
        
      return '\uE002';
    });
  }
  
  export function decodeNewlinesExact(str) {
    return str.replace(/[\uE000-\uE002]/g, m => {
      if (m === '\uE000') {
        return '\r\n';
      }
      if (m === '\uE001') {
        return '\n';
      }
      return '\r';
    });
  }
  
  export function preprocessFunction(prop) {
    if (!prop.startsWith("__function__:")) return prop;
    prop = normailzeQuotesInFunctionString(prop);
    const normalizedString = decodeNewlinesExact(preventXss(prop.slice(13)));
    return new Function(`return ${normalizedString}`)();
  }
  
  export async function checkForJsQuirks(input, component) {
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
  
  function removeUnaryExpressionsFromAttribute(attribute, targets) {
    for (let i = 0; i < targets.length; i++) {
  
      const unaryExpressions = targets[i].startsWith("$") 
                             ? targets[i] 
                             : `\$${targets[i]}}`
  
      attribute = attribute.replace(unaryExpressions, '') // ${} version
                           .replace(unaryExpressions.slice(1), ''); // {} version
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
  
  function convertInnerDoubleQuoteToSingleQuoute(str) {
    return str.replace(/\$\{([^}]*)\}/g, (match, content) => {
      const updated = content.replace(/"([^"]*)"/g, "'$1'");
      return '${' + updated + '}';
    });
  }
  
  export function isValidIdentifier(token) {
    return /^[a-zA-Z_$][\w$]*$/.test(token);
  }
  
  export function* wrapWithEncoder(innerTokens, encoder = 'stringify') {
    yield encoder;
    yield '(';
    for (const token of innerTokens) yield token;
    yield ')';
  }
  
  export function buildStateSetter(props) {
    const sanitizedProps = sanitizeString([...transformInterpolations(props)].join(""));
    return sanitizedProps ? ", '${__$setState(" + sanitizedProps + ")}'" : '';
  }
  
  export function disallowClosureToFunctionCall(input) {
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

  export function isInitialLetterUppercase(func, context) {
  
    if (typeof func !== "function") {
      throw `Use ${context}(functionName, arg) instead of ${context}(funcationName(arg)) or the first argument you provided is not a function.`;
    }
    const initialLetter = func.name.charAt(0);
    return initialLetter === initialLetter.toUpperCase();
  }
  
  export function executeSignal(signal){
    if(typeof signal.action !== "function"){
      return false;
    }
    signal.action(signal.props);
  }
  
 export function getNextVersion(id) {
    globalThis["renderMap"] = globalThis["renderMap"] || {};
    const v = (renderMap[id] + 1) || 1;
    renderMap[id] = v;
    return v;
  }
  
  export function addStaleAttribute(html) {

    if(!html){
      return null
    }

    const len = html.length;
    let i = 0;
  
    while (i < len) {
      if (html[i] === '<') {
        let j = i + 1;
  
        // Skip non-opening tags
        if (j < len && (html[j] === '/' || html[j] === '!' || html[j] === '?')) {
          i++;
          continue;
        }
  
        // Move past tag name
        while (j < len && /[^\s/>]/.test(html[j])) {
          j++;
        }
  
        // Inject immediately after tag name
        return (
          html.slice(0, j) +
          ' __stale' +
          html.slice(j)
        );
      }
  
      i++;
    }
  
    return html;
  }
  
  export function isStale(targetId, version) {
    return renderMap[targetId] !== version;
  }
  
  function normailzeQuotesInFunctionString(funcStr) {
    return funcStr
      .replace(/"(\w+)"\s*:/g, "'$1':")
      .replace(/:\s*"([^"]*)"/g, ": `$1`")
      .replace(/"/g, "`");
  }
  
  export function formatKeyValuePairs(input) {
    return input.replace(/(\w+)=\$?{(.*?)}/g, (match, key, value) => {
      return key + '="${' + value + '}"';
    });
  }

  export function* tokenize(input) {
    let i = 0;
  
    while (i < input.length) {
      const char = input[i];
  
      // spread
      if (input.startsWith('{...', i)) {
        const result = consumeSpread(input, i);
        i = result.next;
        yield result.value;
        continue;
      }
  
      // whitespace or comments
      const misc = consumeCommentOrWhitespace(input, i);
  
      if (misc) {
        i = misc.next;
  
        if (!misc.skip) {
          yield misc.value;
        }
  
        continue;
      }
  
      // single char tokens
      if ("(),{}[]:$".includes(char)) {
        yield char;
        i++;
        continue;
      }
  
      // string
      if ("'\"`".includes(char)) {
        const result = consumeString(input, i);
        i = result.next;
        yield result.value;
        continue;
      }
  
      // identifier / value
      const result = consumeIdentifier(input, i);
      i = result.next;
      yield result.value;
    }
  }
  
  function consumeString(input, i) {
    const quote = input[i];
    let value = quote;
    i++;
  
    while (i < input.length) {
      if (input[i] === '\\') {
        value += input[i];
        i++;
  
        if (i < input.length) {
          value += input[i];
          i++;
        }
      } else if (input[i] === quote) {
        value += input[i];
        i++;
        break;
      } else {
        value += input[i];
        i++;
      }
    }
  
    return { value, next: i };
  }
  
  function consumeSpread(input, i) {
    let start = i;
    i += 3; // skip '{...'
    let braceDepth = 1;
  
    while (i < input.length && braceDepth > 0) {
      if (input[i] === '{') {
        braceDepth++;
      } else if (input[i] === '}') {
        braceDepth--;
      }
      i++;
    }
  
    return { value: input.slice(start, i), next: i };
  }
  function consumeIdentifier(input, i) {
    let start = i;
  
    while (
      i < input.length &&
      !/\s/.test(input[i]) &&
      !"(),{}[]:$".includes(input[i])
    ) {
      i++;
    }
  
    return { value: input.slice(start, i), next: i };
  }
  
  function consumeCommentOrWhitespace(input, i) {
    // whitespace
    if (/\s/.test(input[i])) {
      let start = i;
  
      while (i < input.length && /\s/.test(input[i])) {
        i++;
      }
  
      return { value: input.slice(start, i), next: i, skip: false };
    }
  
    // line comment
    if (input.startsWith('//', i)) {
      while (i < input.length && input[i] !== '\n') {
        i++;
      }
  
      return { next: i, skip: true };
    }
  
    // block comment
    if (input.startsWith('/*', i)) {
      i += 2;
  
      while (i < input.length && !input.startsWith('*/', i)) {
        i++;
      }
  
      i += 2;
  
      return { next: i, skip: true };
    }
  
    return null;
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
        let [inner, end] = result;
        i = end;
        // inner = inner.length === 5 ? inner.push("}") : inner;
      
        yield* wrapWithEncoder(inner);
      } else {
        yield input[i++];
      }
    }
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
  
  /* export function transformRenderArgs(tokens, errors = []) {
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
  } */
  
  export function transformRenderArgs(tokens, errors = []) {
    const cleaned = normalizeTokens(tokens);
  
    const base = buildBaseRenderCall(cleaned);
  
    if (isExpressionComponent(cleaned)) {
      return handleExpressionComponent(cleaned);
    }
  
    if (hasProps(cleaned)) {
      return handleComponentWithProps(cleaned, base);
    }
  
    return finalizeRenderCall(base);
  }
  
  function normalizeTokens(tokens) {
    const input = Array.from(tokens);
  
    input.shift(); // remove "//"
  
    return input.filter(token => token.trim() !== "");
  }
  
  function buildBaseRenderCall(tokens) {
    const dollar = tokens[0];
    const render = tokens[1];
    const openBrace = tokens[2];
    const component = tokens[3];
  
    return dollar + render + openBrace + component;
  }
  
  function isExpressionComponent(tokens) {
    return tokens[3] === tokens[0]; // component === '$'
  }
  
  function handleExpressionComponent(tokens) {
    const componentName = tokens[5];
  
    let props = extractProps(tokens, 9);
  
    const base = `$render(\${${componentName}}`;
  
    if (!hasValidProps(tokens, 10)) {
      return finalizeRenderCall(base);
    }
  
    return finalizeRenderCall(
      base + buildStateSetter(props)
    );
  }
  
  function handleComponentWithProps(tokens, base) {
    let props = extractProps(tokens, 6);
  
    return finalizeRenderCall(
      base + buildStateSetter(props)
    );
  }
  
  function extractProps(tokens, startIndex) {
    let props = tokens.slice(startIndex, tokens.length - 1);
  
    // normalize object shorthand
    if (props.length === 2) {
      props.unshift("{");
    }
  
    return props;
  }
  
  function hasProps(tokens) {
    return tokens.length > 5;
  }
  
  function hasValidProps(tokens, index) {
    return !!tokens[index];
  }
  
  function finalizeRenderCall(str) {
    return str + ")";
  }