import { getNextVersion } from '../transformers/attributeTransformer.js';
import { callRenderErrorLogger } from '../loggers/errorLogger.js';
import { checkForJsQuirks } from '../transformers/attributeTransformer.js';
import { isPromise } from '../helpers/typeHelpers.js';

  //childern component caller/resolver
 export async function callComponent(element) {
    try {
      const component = globalThis[element.tagName];
      const children = element.children;
      let props = element.props;
  
      let pr = props && props.id ? props.id : 1;
      const id = element.tagName + pr;
      const version = isClient && getNextVersion(id);
      if (Object.keys(props).length === 0 && !element.children) {
        const a = await resolveComponentOutput(component, props);
        return [version, a];
      } else {
  
        if (element.children) {
          props.children = children;
        } else {
          props.children = " ";
        }
  
        const a = await resolveComponentOutput(component, props);
        return [version, a];
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
  
  async function resolveComponentOutput(component, props){
  
    let calledComponent;
    if(props.length === 0){
      calledComponent = checkForJsQuirks(component(), component);
    }
  
    calledComponent = checkForJsQuirks(component(props), component);
    const resolvedComponent = isPromise(calledComponent) ?
          await calledComponent :
          calledComponent;
        return resolvedComponent;
  
  }
  
  //root component caller/resolver
  export async function resolveComponent(component, arg) {
    const props = typeof arg === "function" 
                ? arg : $purify(arg, component);

    let resolvedComponent = arg ? component(props) : component();
    
    if (isPromise(resolvedComponent)) {
      const result = await resolvedComponent;
      return checkForJsQuirks(result, component)
    }
  
    if (typeof resolvedComponent !== "string") {
      throw "A component must return a string or an empty string";
    }
  
    return checkForJsQuirks(resolvedComponent, component);
  }
  