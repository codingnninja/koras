import { getState } from "./stateManagement.js";
import { tryCatchSmart } from "../helpers/errorHelpers.js";

import { isBrowserDOM, 
  convertHtmlStringToDomElement,
  updateTargetComponent,
  $el 
} from "../helpers/domHelpers.js";

import { 
  isInitialLetterUppercase,
  executeSignal
 } from "../transformers/attributeTransformer.js";

import { resolveComponent } from "./componentCaller.js";
import { 
  callRenderDomPurifier,
  sanitizeOpeningTagAttributes
 } from "../helpers/securityHelpers.js";

import { compileTemplate } from "../transformers/tagTransformer.js";

  export async function $render(component, props) {
    const result = await tryCatchSmart("$render", __$render, component, props);
    return result;
  }
  
  async function __$render(component, props){
    const updatedComponent = globalThis[component.name];
    let renderedApp;
  
    if (!isInitialLetterUppercase(component, "$render")) {
      throw new Error("A component must start with a capital letter");
    }
  
    if(!isBrowserDOM()){
      const resolvedComponent = await resolveComponent(updatedComponent, props);
      const resolvedComponentWithCustomPurifier = callRenderDomPurifier(resolvedComponent);
      const result = await compileTemplate(
          sanitizeOpeningTagAttributes(resolvedComponentWithCustomPurifier)
        );
      return result;
    } 
     
    if (document.readyState === "complete") {
      isClient = true;
      renderedApp = await handleClientRendering(updatedComponent, getState(props));
      return renderedApp;
    } 
  
    globalThis.addEventListener("DOMContentLoaded", async () => {
      renderedApp = await handleClientRendering(updatedComponent, getState(props));
    });
    
    return renderedApp;
  }
  
  async function handleClientRendering(component, arg) {
    if(__$signal.props && __$signal.props.when === "before"){
      executeSignal(__$signal);
    }
  
    const resolvedComponent = await resolveComponent(component, arg);
  
    if (!resolvedComponent) {
      return resolvedComponent;
    }
  
    const resolvedComponentWithCustomPurifier = callRenderDomPurifier(resolvedComponent);
    let processedComponent = await compileTemplate(
      sanitizeOpeningTagAttributes(
        resolvedComponentWithCustomPurifier
      )
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
  

  