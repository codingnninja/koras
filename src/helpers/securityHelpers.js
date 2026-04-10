function removeWhiteSpaceInOpeningTag(code) {
    return code.replace(/<(\w+)([^>]*)>/g, (match, tagName, attrs) => {
      // This regex matches sequences of whitespace outside quotes
      const whitespaces = '/(\s+)(?=(?:[^"]*"[^"]*")*[^"]*$)/g';
      const cleanedAttrs = attrs.replace(whitespaces, ' ').trim();
      return cleanedAttrs ? `<${tagName} ${cleanedAttrs}>` 
                          : `<${tagName}>`;
    });
  }
  
  function removeJsComments(code) {
    return code.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, " ");
  }
  
  export function unescapeQuotes(props) {
    props = props.replace(/\\'/g, "'").replace(/\\"/g, '"');
    return props;
  }
  
  export function escapeString(str) {
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
  
  export function sanitizeString(str) {
    
    if(typeof str !== "string"){
      return str;
    }
  
    return str
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/`/g, "&#96")
      .replace(/\//g, "&#x2F;");
  }
  
  export function deSanitizeString(str) {
    if(typeof str !== "string"){
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
  function fixBracketConflicts(str) {
    return str.replace(/("[^<>\/"]*)<([^<>\/"]+)>([^<>\/"]*")/g, '"$1|$2|$3"');
  }
  
  /**
   * remove comment
   * @param str
   * @returns {string | * | void}
   */
  
  function removeHtmlComment(str) {
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

  
  export function preventXss(str) {
    const steps = [
      removeJsComments,
      removeWhiteSpaceInOpeningTag,
      removeScript,
      removeHtmlComment,
      removeBreakLine,
      getBodyIfHave,
      fixBracketConflicts
    ];
  
    return steps.reduce((v, fn) => fn(v), str);
  }
  
  export function callRenderDomPurifier(html) {
  
    if (!globalThis["RenderDomPurifier"]) {
      return html;
    }
  
    const component = globalThis["RenderDomPurifier"];
    $render(component, {
      html
    });
  }

  export function sanitizeOpeningTagAttributes(tag) {
    const regex = /(\w+)=("[^"]*"|'[^']*')/g;
    return tag.replace(regex, (match, attributeName, attributeValue) => {
        const sanitizedValue = attributeValue
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;"); //make this to not affect arrow function's '=>' and if it works sanitizeString should be enough
        return `${attributeName}=${sanitizedValue}`;
      });
  }
  
  export function deSanitizeOpeningTagAttributes(tag) {
    const regex = /(\w+)=("[^"]*"|'[^']*')/g;
    return preventXss(
      tag.replace(regex, (match, attributeName, attributeValue) => {
        const sanitizedValue = attributeValue
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
        return `${attributeName}=${sanitizedValue}`;
      })
    );
  }