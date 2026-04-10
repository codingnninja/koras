import { callRenderErrorLogger } from "../loggers/errorLogger";

let _$;
const STRING = "string";
const ZERO = 0;
const ONE = 1;
const UNDEFINED = undefined || "undefined";

if (typeof document !== UNDEFINED) {
  _$ = document.querySelectorAll.bind(document);
}

function isBrowserDOM() {
  return typeof window === "object" && typeof document === "object";
}

function toArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value;
  }

  if (value instanceof Element) {
    return [value];
  }

  if (typeof value.length === "number") {
    return [...value];
  }
  
  return [];
}

function normalizeResult(results, isMultiSelector) {
  const flat = results.flat().filter(Boolean);

  if (flat.length === 0) return null;

  if (isMultiSelector) {
    return flat;
  }

  return flat.length === 1 ? flat[0] : flat;
}

function tailwindToSelector(input) {
  return input
    .trim()
    .split(/\s+/)
    .map(token => {
      // Tailwind classes that contain variants like hover:, sm:, group-hover:, etc.
      const isTailwindClass = /^[a-zA-Z0-9_-]+:/.test(token);

      if (!isTailwindClass) {
        return token; // return normal CSS selectors untouched
      }

      // Escape only Tailwind variant colons
      return token.replace(/:/g, '\\:');
    })
    .join(' ');
}


function buildDataStructureFrom(queryString) {
    let [selector, constraints] = resolveActionAndConstraints(queryString);
  
    if (constraints === UNDEFINED) {
      return [selector];
    }
  
    if (/(\S+|\[\S+\])\[(\d+)\]/.test(queryString)) {
      return [selector, constraints];
    }
    constraints = resolveMultipleAttributes(constraints.split(","));
    return [selector, constraints];
  }
  
  function resolveActionAndConstraints(queryString) {
    const regex = /(\S+|\[\S+\])\[(\d+)\]/;
    const match = queryString.match(regex);
  
    if (match) {
      return [match[ONE], match[2]];
    }
  
    if (!queryString.includes("|") || queryString.includes("|=")) {
      return [queryString.trim(), UNDEFINED];
    }
  
    const splittedQuery = queryString.split("[").filter(Boolean);
    if (splittedQuery.length === 2) {
      const selector = splittedQuery[ZERO].endsWith("]") ?
        `[${splittedQuery[ZERO]}` :
        splittedQuery[ZERO];
      const constraints = splittedQuery[ONE].split("]")[ZERO];
      return [selector.trim(), constraints.trim()];
    }
  
    const selector = `${splittedQuery[ZERO]}[${splittedQuery[ONE]}`;
    const constraints = splittedQuery[2].split("]")[ZERO];
    return [selector.trim(), constraints.trim()];
  }
  
  function resolveMultipleAttributes(constraints) {
    let processedConstraints = [];
    let depth = 0;
  
    while (depth < constraints.length) {
      let splittedConstraints = constraints[depth].split("|").filter(Boolean);
  
      const [action, paramString] = splittedConstraints;
  
      const param = paramString
        .split(/([\w-]+)(\!=|\-=|\+=|=\*|>=?|<=?|={1,2})(.+)/)
        .filter(Boolean);
  
      processedConstraints.push([action.trim(), param]);
  
      depth++;
    }
  
    return processedConstraints;
  }

  const operators = {
    "=*": (key, element, value) => fuzzyCompare(element[key], value),
    ">": (key, element, value) => element[key] > value,
    "<": (key, element, value) => element[key] < value,
    "=": (key, element, value) => element[key] === value,
    "<=": (key, element, value) => element[key] <= value,
    ">=": (key, element, value) => element[key] >= value,
    "!=": (key, element, value) => element[key] !== value,
    "+=": (key, element, value) => Number(element[key]) + Number(value),
    "-=": (key, element, value) => Number(element[key]) - Number(value),
  };

  function makeTag(index) {
    const div = document.createElement("div");
    div.id = index;
    return div;
  }

  function fuzzyCompare(a, b, tolerance = 0.01) {
    if (!isNaN(a) && !isNaN(b)) {
      return Math.abs(Number(a) - Number(b)) <= tolerance;
    } else {
      return (
        a.toLowerCase().includes(b.toLowerCase()) ||
        b.toLowerCase().includes(a.toLowerCase())
      );
    }
  }
  
 
  
  function del(elements, constraints) {
    const [action, params] = constraints;
    let [key, operator, value] = params;
    value = value.trim();
    const result = [];
  
    for (let index = 0; index < elements.length; index++) {
      if (key === "i" || key === "index") {
        const dummyElement = makeTag(index);
  
        if (operators[operator]("id", dummyElement, value)) {
          const deletedElement =
            key === "i" || key === "index" ? elements[index] : elements[value];
          deletedElement.remove();
          result.push(deletedElement);
          continue;
        }
      }
  
      if (operators[operator](key, elements[index], value)) {
        elements[index].remove();
        result.push(elements[index]);
        continue;
      }
      const errorMsg =
        "the selector and constraints you provided do not match any target";
      callRenderErrorLogger({
        errorMsg,
        constraints
      });
      console.log(`${errorMsg} in constraints: ${constraints}`);
    }
    return result.length === ONE ? result[ZERO] : result;
  }
  function setAttribute(elements, constraints) {
    const [action, params] = constraints;
    if(params.length === 4){

    }
    let [key, operator, value] = params;
    value = value.trim();
  
    for (let i = 0; i < elements.length; i++) {
      if (key === "class") {
        elements[i].classList[action](...value.split(" "));
        continue;
      }

      if (!value) {
        elements[i][key] = " ";
      } else if (operator === "+=" || operator === "-=") {
        const foundOperator = operators[operator](key, elements[i], value);
        elements[i][key] = foundOperator ? foundOperator : value;
      } else if(key.startsWith('data-')) {
        elements[i].setAttribute([key], value);
      } else {
        elements[i][key] = value;
      } 
    }
  
    return elements;
  }
  
  function filter(elements, constraints) {
    const result = [];
    const [action, params] = constraints;
    let [key, operator, value] = params;
    value = value.trim();
    let depth = 0;
  
    while (depth < elements.length) {
      let element =
        key === "i" || key === "index" ? makeTag(value) : elements[depth];
      key = key === "i" || key === "index" ? "id" : key;
  
      const condition =
        key === "class" ?
        operators[key]("contains", element, value) :
        operators[operator](key, element, value);
  
      if (
        (action === "filterIn" && condition) ||
        (action === "filterOut" && !condition)
      ) {
        const filteredElement =
          params[ZERO] === "i" || params[ZERO] === "index" ?
          elements[value] :
          elements[depth];
        result.push(filteredElement);
      }
      depth++;
    }
    return result.length === ONE ? result[ZERO] : result;
  }
  
  function sortElements(array, constraints) {
    const [action, params] = constraints;
    const [key, operator, order] = params;
    const elements = [...array];
    const parent = elements[0].parentNode;
    let children = "";
    let depth = 0;
  
    const sortFunctions = {
      numberAsc: (a, b) => Number(a.textContent) - Number(b.textContent),
      numberDesc: (a, b) => Number(b.textContent) - Number(a.textContent),
      lengthSortAsc: (a, b) => a.textContent.length - b.textContent.length,
      lengthSortDesc: (a, b) => b.textContent.length - a.textContent.length,
      alphabetAsc: (a, b) => a.textContent.localeCompare(b.textContent),
      alphabetDesc: (a, b) => b.textContent.localeCompare(a.textContent),
      shuffle: () => Math.random() - 0.5,
    };
  
    let sortedElements = elements.sort(sortFunctions[order]);
  
    while (depth < sortedElements.length) {
      children += sortedElements[depth].outerHTML;
      depth++;
    }
  
    parent.innerHTML = children;
    return sortedElements;
  }
  
  function search(elements, constraints) {
    const customParams = ['class', '=', 'hidden'];
    const [action, params] = constraints;
    setAttribute(elements, ["remove", customParams]);

    if (params[2] === "*") {
      return elements;
    }

    const filteringConstraint = ["filterOut", params];
    const filteredElements = filter(elements, filteringConstraint);

    if (filteredElements.length === 0) {
      return elements;
    }
    
    setAttribute(filteredElements, ["add", customParams]);
    return filteredElements;
  }

  function applyAction(elements, constraints) {

    if (typeof constraints === STRING) {
      const index = Number(constraints);
      return Number.isInteger(index) && index >= 0 && index < elements.length
        ? elements[index]
        : null;
    }
    
    if (!constraints && elements.length === ONE) {
      return elements[ZERO];
    }

    if (!constraints && elements.length > ONE) {
      return elements;
    }
    
    let depth = 0;
    let result = elements;
  
    while (constraints && depth < constraints.length) {
      const [action, constraint] = constraints[depth];
      if (action === "delete") {
        result = del(result, constraints[depth]);
      } else if (action === "sort") {
        result = sortElements(result, constraints[depth]);
      } else if (action === "search") {
        result = search(result, constraints[depth])
      } else if (action.includes("filter")) {
        result = filter(result, constraints[depth]);
      } else if (constraints !== UNDEFINED) {
        result = setAttribute(result, constraints[depth]);
      }
      depth++;
    }
  
    return result;
  }
  
  export function $select(str, offSuperpowers = false) {
    if (!isBrowserDOM()) {
      throw new Error("You cannot use $select on the server");
    }
  
    if (typeof str !== STRING || !str.trim()) {
      throw new Error("$select expects a string of selectors");
    }
  
    const selectors = str.split(/,(?![^\[]*\])/);
  
    // 🔥 POWER OFF MODE
    if (offSuperpowers) {
      return selectors.length === ONE
        ? _$(tailwindToSelector(selectors[ZERO].trim()))
        : selectors.map(sel => _$(tailwindToSelector(sel.trim())));
    }
  
    // ↓ POWER ON MODE (smart path)
    const isMultiSelector = selectors.length > ONE;
    let collected = [];
  
    for (let i = 0; i < selectors.length; i++) {
      const raw = selectors[i].trim();
      if (!raw) continue;
  
      const [selector, constraints] = buildDataStructureFrom(raw);
      const nodeList = _$(tailwindToSelector(selector));
      const result = applyAction(nodeList, constraints);
  
      collected.push(toArray(result));
    }
  
    return normalizeResult(collected, isMultiSelector);
  }
  
  globalThis.$select = $select;
  /* function $select(str, offSuperpowers = false) {
    if (!isBrowserDOM()) {
      throw new Error("You cannot use $select on the server");
    }
  
    if (typeof str !== STRING || str === "") {
      throw new Error("$select expects a string of selectors");
    }
  
    try {
      const selectors = str.split(/,(?![^\[]*\])/);
      let elements = [];
      let depth = ZERO;
  
      while (selectors.length > depth) {
        const selectorWithConstraints = selectors[depth];
        const [selector, constraints] = buildDataStructureFrom(
          selectorWithConstraints
        );
  
        const nestedElements = _$(tailwindToSelector(selector));
        const modifiedElements = applyAction(nestedElements, constraints);
        const numberOfElementsSelected =
          modifiedElements === UNDEFINED ? UNDEFINED : modifiedElements.length;
        if (numberOfElementsSelected && !offSuperpowers) {
          //turn grouped elements to a real array
          const iterableGroupedElements = [...modifiedElements];
          elements.push(iterableGroupedElements);
        } else if (numberOfElementsSelected > ONE && offSuperpowers) {
          elements.push(modifiedElements);
        } else {
          elements.push(modifiedElements);
        }
        depth++;
      }
      if (elements[ZERO].length === ZERO) return null;
      return elements && elements.length === ONE ? elements[ZERO] : elements;
    } catch (error) {
      console.error(error);
      console.error(
        `Oops! Check the selector(s) '${str}' provided for validity because it seems the target is not found. Or you can't use $select on the server.`
      );
    }
  } */


//git tag -a v0.1.2-beta.1 -m "Release v0.1.2-beta.1"
//git push origin v0.1.2-beta.1