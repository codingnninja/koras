  export function Text({
    children,
    pitch = 1.0,
    rate = 1.0,
    pitchBoost = 0.15,
    rateBoost = 0.1,
  } = {}) {
    // const helper = SpeechHelper();
    // const {node, rest} = helper.extractNextNode(children);
  
    const settings = {pitch, rate, pitchBoost, rateBoost, type:"speech"}
    __$enqueueSpeech({type:"speech", text: children, ...settings});
    console.log(__$speechQueue)
    return children;
  }