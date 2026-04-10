  import { syncDomNode } from "./domSyncEngine.js";

  export function $el(elementId) {
    return document.getElementById(elementId);
  }
  
  export function useBody(component) {
    const root = document.body;
    root.appendChild(component)
  }
  
  export function convertHtmlStringToDomElement(processedComponent) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(processedComponent, "text/html");
  
    // Get ONLY element children (ignore text/comments)
    const children = Array.from(doc.body.children);
  
    //No root element
    if (children.length === 0) {
      return null;
    }
  
    //More than one root element
    if (children.length > 1) {
      throw new Error(
        "Component must have a single root element. Wrap all elements in one parent with an id."
      );
    }
  
    const root = children[0];
  
    if (!root.id) {
      throw new Error(
        "A reRenderable component wrapping element must have an ID"
      );
    }
  
    return root;
  }
  
  export function hasVisibleChildren(el) {
    return [...el.childNodes].every(node => {
      if (node.nodeType === 8) {
        return false;
      }
  
      if (node.nodeType === 3 && !node.textContent.trim()) {
        return false;
      }
  
      return true;
    })
  }
  
  export function handleViewTransition(target, renderOnlyDOM){
    if (shouldStartTransition(target)) {
      document.startViewTransition(renderOnlyDOM);
    } else {
      renderOnlyDOM();
    } 
  }
  
  export function shouldStartTransition(domNode) {
    if (
      typeof document.startViewTransition !== "function" ||
      !(domNode instanceof Element)
    ) {
      return false;
    }
  
    // Check the element itself OR any descendant
    return domNode.matches("[view-transition-name]") ||
      domNode.querySelector("[view-transition-name]");
  }
  
  export function updateTargetComponent(component) {
    let el = $el(component.id); //current component
    if (el == null) {
      useBody(component);
    } else if (!hasVisibleChildren(el)) {
  
      const renderOnlyDOM = () => el.parentNode.replaceChild(component, el);
      handleViewTransition(el, renderOnlyDOM);
    } else if (el && hasVisibleChildren(el)) {
  
      const renderOnlyDOM = () => syncDomNode(el, component);
      handleViewTransition(el, renderOnlyDOM);
      // el.parentNode.replaceChild(component, el);
    } 
  }

  export function isBrowserDOM() {
    return typeof window === "object" && typeof document === "object";
  }