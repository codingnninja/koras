
function syncFormState(tgt, src) {
    if (!(tgt instanceof HTMLElement && src instanceof HTMLElement)) {
      return;
    }
  
    // ---- INPUT ----
    if (tgt instanceof HTMLInputElement && src instanceof HTMLInputElement) {
      if (tgt.type === "checkbox" || tgt.type === "radio") {
        tgt.checked = src.checked;
      } else if (tgt.value !== src.value) {
        tgt.value = src.value;
      }
      return;
    }
  
    // ---- TEXTAREA ----
    if (tgt instanceof HTMLTextAreaElement && src instanceof HTMLTextAreaElement) {
      if (tgt.value !== src.value) {
        tgt.value = src.value;
      }
      return;
    }
  
    // ---- SELECT ----
    if (tgt instanceof HTMLSelectElement && src instanceof HTMLSelectElement) {
      tgt.selectedIndex = src.selectedIndex;
      return true;
    }
  
    // ---- OPTION ----
    if (tgt instanceof HTMLOptionElement && src instanceof HTMLOptionElement) {
      tgt.selected = src.selected;
    }
  }
  
  function isSourceStale(node) {
    return (
      node &&
      node.nodeType === Node.ELEMENT_NODE &&
      node.hasAttribute("__stale")
    );
  }
  
  export function syncDomNode(target, source) {
    if (!target || !source || target.nodeType !== source.nodeType) return;
  
    //If source itself is stale → leave target untouched
    if (isSourceStale(source)) {
      return;
    }
  
    // --- Text Node Sync ---
    if (target.nodeType === Node.TEXT_NODE) {
      if (target.nodeValue !== source.nodeValue) {
        target.nodeValue = source.nodeValue;
      }
      return;
    }
  
    // --- Replace node if tag differs ---
    if (target.nodeName !== source.nodeName) {
      const newNode = source.cloneNode(true);
      target.replaceWith(newNode);
      return;
    }
  
    // --- Sync attributes ---
    const srcAttrs = source.attributes;
    const tgtAttrs = target.attributes;
  
    for (let i = 0; i < srcAttrs.length; i++) {
      const { name, value } = srcAttrs[i];
      if (target.getAttribute(name) !== value) {
        target.setAttribute(name, value);
      }
    }
  
    for (let i = tgtAttrs.length - 1; i >= 0; i--) {
      const { name } = tgtAttrs[i];
      if (!source.hasAttribute(name)) {
        target.removeAttribute(name);
      }
    }
  
    syncFormState(target, source);
  
    // --- Sync child nodes ---
    let srcChildren = Array.from(source.childNodes);
    const tgtChildren = Array.from(target.childNodes);
    const isList = source.dataset.list;
  
    if(isList === ''){
      mergeChildrenById(target, source);
    }
  
    // if(srcChild.dataset && srcChild.dataset.list === ''){
    //   console.log(tgtChild, srcChild)
    // }
    
    const max = Math.max(srcChildren.length, tgtChildren.length);
     
    for (let i = 0; i < max; i++) {
      const srcChild = srcChildren[i];
      const tgtChild = tgtChildren[i];
  
      //If source child is stale → skip completely
      if (srcChild && isSourceStale(srcChild)) {
        continue;
      }
  
      if (!srcChild && tgtChild && isList !== "") {
        target.removeChild(tgtChild);
      } else if (srcChild && !tgtChild) {
        target.appendChild(srcChild.cloneNode(true));
      } else if (srcChild && tgtChild) {
        if (
          srcChild.nodeType !== tgtChild.nodeType ||
          srcChild.nodeName !== tgtChild.nodeName
        ) {
          const newNode = srcChild.cloneNode(true);
          target.replaceChild(newNode, tgtChild);
        } else {
          syncDomNode(tgtChild, srcChild);
        }
      }
    }
  }
  
  function mergeChildrenById(target, source) {
    if (!target || !source) {
      return;
    }
  
    const map = new Map();
  
    // Step 1: take existing children
    Array.from(target.children).map(function (child) {
      if (child.id) {
        map.set(child.id, child);
      }
    });
  
    // Step 2: merge source (override or add)
    Array.from(source.children).map(function (child) {
      if (child.id) {
        map.set(child.id, child);
      }
    });
  
    // Step 3: rebuild DOM (this avoids duplicates permanently)
    const fragment = document.createDocumentFragment();
  
    map.forEach(function (child) {
      const clone = child.cloneNode(true);
  
      if (clone.hasAttribute("__stale")) {
        clone.removeAttribute("__stale");
      }
  
      fragment.appendChild(clone);
    });
  
    // Step 4: replace content once (stable)
    target.innerHTML = "";
    target.appendChild(fragment);
  }