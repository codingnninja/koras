 export function logError(label, error, inputValue) {
    const stackLines = (error.stack || '').split('\n');
    const locationLine = stackLines.find(line =>
      line.includes('at ') && !line.includes('tryCatch')
    );
  
    console.error(`• [Error in "${label}"]`);
    console.error(`• Message: ${error.message}`);
    if (locationLine) console.error(`• Location: ${locationLine.trim()}`);
    console.error('• Input Value:', inputValue);
    console.error('• Full Stack Trace:\n', error.stack);
  }
  
 export function callRenderErrorLogger(error) {
  
    if (!globalThis["RenderErrorLogger"]) {
      return false;
    }
  
    const component = globalThis["RenderErrorLogger"];
    $render(component, {
      error
    });
  }