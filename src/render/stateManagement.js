export function __$setState(props) {
    const key = `${Math.random().toString(36).substring(6)}`;
    globalThis.ks[key] = props;
    return key;
  }
  
 export function getState(key) {
    const props = globalThis.ks[key];
    return props ? props : key;
  }