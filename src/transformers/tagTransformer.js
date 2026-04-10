import { patterns } from "./tagPatterns.js";
import { 
  sanitizeOpeningTagAttributes, 
  deSanitizeOpeningTagAttributes,
  deSanitizeString
} from "../helpers/securityHelpers.js";
import { preventXss } from "../helpers/securityHelpers.js";
import { 
  callRenderErrorLogger,
  logError 
} from "../loggers/errorLogger.js";
import { parseProps, addStaleAttribute } from "./attributeTransformer.js";
import { callComponent} from "../render/componentCaller.js";
import { convertHtmlStringToDomElement, updateTargetComponent, $el } from "../helpers/domHelpers.js";
import { executeSignal, isStale } from "./attributeTransformer.js";

export async function compileTemplate(str) {
    try {
      let _str = sanitizeOpeningTagAttributes(str) || "";
      _str = preventXss(_str);
      const parsedComponent = await parseComponent(_str);
      return  parsedComponent;
    } catch (error) {
      callRenderErrorLogger(error);
      console.error(error);
    }
  }
  
  async function parseComponent(template) {
    if (!template) return null;
  
    try {
      let tokens = tokenizeTemplate(template);
      const resultStack = await processTokens(tokens);
      return buildFinalOutput(resultStack);
  
    } catch (error) {
      callRenderErrorLogger(error);
      console.error(error);
    }
  }
  
  function tokenizeTemplate(str) {
    return str.split(patterns.anyNode);
  }
  
  async function processTokens(initialTokens) {
    let tokens = initialTokens;
    const stack = [];
  
    let cursor = 0;
  
    while (cursor < tokens.length) {
      let token = cleanToken(tokens[cursor]);
  
      if (!token) {
        cursor++;
        continue;
      }
  
      if (isComponent(token)) {
        const result = await handleComponentToken(
          tokens,
          token,
          cursor
        );
  
        tokens = result.tokens;
        cursor = result.nextCursor;
  
      } else {
        stack.push(processPlainToken(token));
        cursor++;
      }
    }
  
    function cleanToken(token) {
      if (!token) return "";
    
      return token.trim();
    }
  
    async function handleComponentToken(tokens, token, index) {
      const updatedTokens = await parseChildrenComponents(
        tokens,
        token,
        index
      );
    
      // ⚠️ critical: after mutation, stay at same index
      return {
        tokens: updatedTokens,
        nextCursor: index
      };
    }
  
    return stack;
  }
  
  function processPlainToken(token) {
    const cleaned = token.replace(/_9s35Ufa7M67wghwT_/g, "");
  
    return deSanitizeOpeningTagAttributes(cleaned);
  }
  
  function buildFinalOutput(stack) {
    return convertStackOfHTMLToString(stack);
  }
  
  async function parseChildrenComponents(tokens, currentToken, depth) {
    const nodeInfo = extractNodeInfo(currentToken);
  
    const extraction = getNodeChildren(tokens, nodeInfo, depth);
  
    const dependencies = buildComponentDependencies(
      nodeInfo,
      extraction
    );
  
    try {
      const renderResult = await renderComponentWithDependencies(dependencies);
  
      const processedComponent = await processRenderedComponent(
        renderResult,
        dependencies
      );
  
      return replaceNodeWithRenderedContent(
        tokens,
        currentToken,
        extraction,
        processedComponent
      );
  
    } catch (error) {
      handleComponentRenderError(error, nodeInfo, dependencies);
    }
  }
  
  function extractNodeInfo(token) {
    const regularMatch = token.match(patterns.start);
    const selfClosingMatch = token.match(patterns.self);
    const match = regularMatch || selfClosingMatch;
  
    return {
      match,
      isSelfClosing: !!selfClosingMatch,
      tagName: match[1],
      rawProps: match[2]
    };
  }
  
  function getNodeChildren(tokens, nodeInfo, depth) {
    if (nodeInfo.isSelfClosing) {
      return {
        children: [],
        tokens
      };
    }
  
    return getChildrenOfTag(tokens, depth);
  }
  
  function buildComponentDependencies(nodeInfo, extraction) {
    return {
      tagName: nodeInfo.tagName,
      props: parseProps(
        deSanitizeString(nodeInfo.rawProps),
        nodeInfo.tagName
      ),
      children: extraction.children
    };
  }
  
  async function renderComponentWithDependencies(dependencies) {
    const [version, calledComponent] =
      await callComponent(dependencies);
  
    return { version, calledComponent };
  }
  
  async function processRenderedComponent(renderResult, dependencies) {
    const { version, calledComponent } = renderResult;
  
    const safeComponent = preventXss(
      sanitizeOpeningTagAttributes(calledComponent)
    );
  
    const parsed = await parseComponent(safeComponent);
  
    const tokens = parsed == null
      ? ['']
      : parsed.split(patterns.anyNode);
  
    const hydrated = await applyClientSideEffects(
      tokens,
      parsed,
      dependencies,
      version
    );
  
    return hydrated;
  }
  
  async function applyClientSideEffects(tokens, parsed, dependencies, version) {
    const props = dependencies.props;
    const id = props && props.id ? props.id : 1;
  
    if (isClient && dependencies.tagName !== 'If') {
      await handleClientRerendering(
        parsed,
        dependencies.tagName + id,
        version
      );
  
      tokens[1] = addStaleAttribute(tokens[1]);
    }
  
    return tokens;
  }
  
  function replaceNodeWithRenderedContent(
    tokens,
    currentToken,
    extraction,
    processedTokens
  ) {
    const workingTokens = extraction
      ? extraction.tokens
      : tokens;
  
    const index = workingTokens.indexOf(currentToken);
  
    if (index !== -1) {
      workingTokens.splice(index, 1, ...processedTokens);
    }
  
    return workingTokens;
  }
  
  function handleComponentRenderError(error, nodeInfo, dependencies) {
    const component = nodeInfo.tagName;
  
    callRenderErrorLogger({
      error,
      component
    });
  
    console.error(
      `${error} in ${component}: ${globalThis[component]}`
    );
  
    logError("$render", error, [
      globalThis[component],
      dependencies.props
    ]);
  }
  
  function convertStackOfHTMLToString(stack) {
    let html = ``;

    if (stack.length > 0) {
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
  
  function getChildrenOfTag(tokens, targetIndex) {
    const { tagName, closeTag } = getTagMetadata(tokens[targetIndex]);
  
    const {
      childrenTokens,
      closingIndex
    } = collectChildrenTokens(tokens, targetIndex, tagName, closeTag);
  
    const updatedTokens = removeChildrenRange(
      tokens,
      targetIndex,
      closingIndex
    );
  
    return {
      tokens: updatedTokens,
      children: joinChildren(childrenTokens)
    };
  }
  
  function getTagMetadata(openToken) {
    const match = openToken.match(/^<([a-zA-Z0-9\-]+)\b/);
  
    if (!match) {
      throw new Error("Invalid opening tag");
    }
  
    const tagName = match[1];
  
    return {
      tagName,
      closeTag: `</${tagName}>`
    };
  }
  
  function collectChildrenTokens(tokens, startIndex, tagName, closeTag) {
    const childrenTokens = [];
    let nestedDepth = 0;
    let cursor = startIndex + 1;
  
    while (cursor < tokens.length) {
      const token = tokens[cursor];
  
      if (isSameOpeningTag(token, tagName)) {
        nestedDepth++;
        childrenTokens.push(token);
        cursor++;
        continue;
      }
  
      if (isMatchingClosingTag(token, closeTag)) {
        if (nestedDepth === 0) {
          break;
        }
  
        nestedDepth--;
        childrenTokens.push(token);
        cursor++;
        continue;
      }
  
      childrenTokens.push(token);
      cursor++;
    }
  
    validateClosingTag(tokens, cursor, closeTag, tagName);
  
    return {
      childrenTokens,
      closingIndex: cursor
    };
  }
  
  function isSameOpeningTag(token, tagName) {
    return (
      typeof token === "string" &&
      token.startsWith(`<${tagName}`) &&
      !token.startsWith(`</`)
    );
  }
  
  function isMatchingClosingTag(token, closeTag) {
    return token === closeTag;
  }
  
  function validateClosingTag(tokens, index, closeTag, tagName) {
    if (index >= tokens.length || tokens[index] !== closeTag) {
      throw new Error(`Missing closing tag for <${tagName}>`);
    }
  }
  
  function removeChildrenRange(tokens, openIndex, closeIndex) {
    return [
      ...tokens.slice(0, openIndex + 1),
      ...tokens.slice(closeIndex + 1)
    ];
  }
  
  function joinChildren(childrenTokens) {
    return childrenTokens.join(" ");
  }
  
  function isLine(property, line) {
    return patterns[property].test(line);
  }
  
  function isComponent(line) {
    return isLine("firstLetterCapped", line);
  }
  
  export async function handleClientRerendering(resolvedComponent, targetId, version){
    if (!resolvedComponent) {
      return resolvedComponent;
    }
  
    // final guard before DOM write
    if (isStale(targetId, version)) {
      return null;
    }
  
    const parsedComponent = convertHtmlStringToDomElement(
      resolvedComponent
    );
  
    if(!parsedComponent){
      return " ";
    }
    
    if(!$el(parsedComponent.id)){
      return '';
    }
  
    updateTargetComponent(parsedComponent);
  
    if(__$signal.props && __$signal.props.when === "after"){
      executeSignal(__$signal);
    }
  
    return resolvedComponent;
  }