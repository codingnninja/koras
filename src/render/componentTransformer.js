 import { 
  resolveAttributes, 
  formatKeyValuePairs 
 } from "../transformers/attributeTransformer.js";
 import { 
  sanitizeOpeningTagAttributes,
  deSanitizeString
 } from "../helpers/securityHelpers.js";

 
 function addDataListToTemplate(template) {
    const LIST_METHODS = ['.map','.flatMap', '.from'];
    let output = template;
    let cursor = 0;
  
    while (cursor < output.length) {
      if (isTemplateExpressionStart(output, cursor)) {
        const {
          expression,
          endIndex
        } = extractTemplateExpression(output, cursor);
  
        if (containsListMethod(expression, LIST_METHODS)) {
          output = injectDataListAttribute(output, cursor);
        }
  
        cursor = endIndex;
      }
  
      cursor++;
    }
  
    return output;
  }
  
  function isTemplateExpressionStart(str, index) {
    return str[index] === '$' && str[index + 1] === '{';
  }
  
  function extractTemplateExpression(str, startIndex) {
    let expressionStart = startIndex + 2;
    let braceDepth = 1;
    let scanIndex = expressionStart;
    let expressionContent = '';
  
    while (scanIndex < str.length) {
      const char = str[scanIndex];
  
      if (char === '{') braceDepth++;
      else if (char === '}') {
        braceDepth--;
        if (braceDepth === 0) break;
      }
  
      expressionContent += char;
      scanIndex++;
    }
  
    return {
      expression: expressionContent,
      endIndex: scanIndex
    };
  }
  
  function containsListMethod(expression, methods) {
    return methods.some(method => expression.includes(method));
  }
  
  function injectDataListAttribute(str, fromIndex) {
    let scanBackwardIndex = fromIndex;
  
    while (scanBackwardIndex >= 0) {
      if (isOpeningTag(str, scanBackwardIndex)) {
        const tagCloseIndex = str.indexOf('>', scanBackwardIndex);
        if (tagCloseIndex === -1) break;
  
        const tagContent = str.slice(scanBackwardIndex, tagCloseIndex);
  
        if (!hasDataListAttribute(tagContent)) {
          const updatedTag = addDataListToTag(tagContent);
  
          return (
            str.slice(0, scanBackwardIndex) +
            updatedTag +
            str.slice(tagCloseIndex)
          );
        }
  
        break;
      }
  
      scanBackwardIndex--;
    }
  
    return str;
  }
  
  function isOpeningTag(str, index) {
    return str[index] === '<' && str[index + 1] !== '/';
  }
  
  function hasDataListAttribute(tagContent) {
    return tagContent.includes('data-list');
  }
  
  function addDataListToTag(tagContent) {
    return tagContent.replace(
      /<([^\s>]+)/,
      '<$1 data-list=""'
    );
  }
  
  
 export function makeFunctionFromString(component) {
    const componentString = component.toString();
  
    const updatedComponent = transformTags(componentString, resolveAttributes);
    return Function(`return ${addDataListToTemplate(updatedComponent)}`)();
  }
  
  function transformTags(template, resolveAttributes) {
    template = sanitizeOpeningTagAttributes(formatKeyValuePairs(template));
    return template.replace(
      /<([\w-]+)(\s[^<>]*?)?\s*(\/?)>/g,
      (tag, tagName, rawAttrs = '', selfClosing) => {
        if (!rawAttrs) return tag; // no attributes → return as-
        const processedAttrs = resolveAttributes(
          rawAttrs.trim(),
          true
        );
        // Replace only attributes inside the original tag,
        // keep spacing/line breaks/indentation untouched
       return tag.replace(rawAttrs, ' ' + deSanitizeString(processedAttrs));
      }
    );
  }
  
  export function isArrow(fn) {
    return typeof fn === "function" && !fn.hasOwnProperty("prototype") && !fn.toString().trim().startsWith('async');
  }

 export function arrowToNamed(name, arrowFn) {
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
    src = src.replace(/^\s*\(/,`${isAsync ? "async " : ""}function ${name}(`);
  
    return Function(`return ${src}`)();
  }
  