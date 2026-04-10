import { isObject } from '../helpers/typeHelpers.js';
import { 
  makeFunctionFromString, 
  arrowToNamed, 
  isArrow 
} from './componentTransformer.js';


const FUNCTION = "function";
globalThis.ks = globalThis.ks || {};
export function $register(components){

    if(!isObject(components)){
      throw(`An object of components is expected like $register({Home, App})instead of $register(${components.name},...)`)
    }
  
    for( const name in components){
  
      let component = components[name];
  
      if (typeof component !== FUNCTION) {
        throw "Only functions are expected";
      }
  
      const isPreProcessed = component.toString().includes('stringify');
      
      if(isArrow(component)){
        component = arrowToNamed(component.name,  component);
      }
  
      component = isPreProcessed 
                ? component 
                : makeFunctionFromString(component);
  
      Object.defineProperty(globalThis, name, {
        value: component,
        writable: false,
        configurable: false,
      })
    }
  
    return globalThis;
}
 
  