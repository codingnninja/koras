export const patterns = {
    // safer split
    anyNode: /(<[^<>]+?>)/,
  
    cap: /[A-Z]/,
  
    // self-closing tags
    self: /<([A-Za-z][\w-]*)(\s+[^<>]*?)?\s*\/>/,
  
    // closing tags
    close: /<\/([A-Za-z][\w-]*)>/,
  
    // opening tags
    start: /<([A-Za-z][\w-]*)(\s+[^<>]*?)?>/,
  
    // tags + comments
    tagOrComment: /<!--[\s\S]*?-->|<\/?[A-Za-z][\w-]*\b[^>]*>/,
  
    // component detection
    firstLetterCapped: /<([A-Z][A-Za-z0-9]*)\b/,
  
    isComponentCloseTag: /<\/([A-Z][A-Za-z0-9]*)>/,
  };
  