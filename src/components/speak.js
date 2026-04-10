  export function Speak({ children }) {
    globalThis["__$speechQueue"] = [];
  
    setSsmlPrerequisite();
  
    speechChain = __$speechChain.then(() => __$speak());
    return children;
  }