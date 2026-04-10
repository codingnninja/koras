import { __$setState} from './stateManagement.js';
import { $purify } from './propSerializer.js';
import { callRenderErrorLogger } from '../loggers/errorLogger.js';
import { isBrowserDOM } from '../helpers/domHelpers.js';
import { deSanitizeString } from '../helpers/securityHelpers.js';

function hydrate(func, data) {
  
    if(typeof func !== "function"){
      return false;
    }
  
    const functionName = __$setState(func);
    
    if (data instanceof Event || data instanceof Document) {
      return `(ks['${functionName}'])(${data instanceof Event ? "event" : "this"})`;
    }
  
    const purifiedProps = $purify(
      deSanitizeString(data, func.name ?? func)
    );
    
    data = data ? __$setState(purifiedProps) : '';
    const propsReference = data ? `ks['${data}']` : '';
    return `__$c(ks['${functionName}'], ${propsReference})`;
}
  
  export function __$createHydrationHandler(func, data) {
    try {
      if(!isBrowserDOM()){
        return '() => {}';
      }
      return hydrate(func, data);
    } catch (error) {
      callRenderErrorLogger(error);
      console.error(
        `${error} in ${func.name ?? func}.`
      );
    }
  }
  
  export function __$callMethod(fn, data){
    return fn(data);
  }