  
export function Mood({ tone = "neutral", children } = {}) {
  const tones = {
      // Positive
      excited:        { pitch: 1.3, rate: 1.2, volume: 1 },
      proud:          { pitch: 1.2, rate: 1.05, volume: 1 },
      happy:          { pitch: 1.2, rate: 1.1, volume: 1 },
      calm:           { pitch: 1, rate: 0.85, volume: 0.7 },
      confident:      { pitch: 1.1, rate: 1.05, volume: 1 },
      enthusiastic:   { pitch: 1.25, rate: 1.2, volume: 1 },
  
      // Neutral / default
      neutral:        { pitch: 1, rate: 1, volume: 1 },
  
      // Negative
      sad:            { pitch: 0.8, rate: 0.9, volume: 0.9 },
      disappointed:   { pitch: 0.9, rate: 0.8, volume: 0.5 },
      angry:          { pitch: 1.1, rate: 1.4, volume: 1 },
      frustrated:     { pitch: 1, rate: 1.3, volume: 1 },
      anxious:        { pitch: 1.3, rate: 1.35, volume: 0.8 },
      nervous:        { pitch: 1.4, rate: 1.25, volume: 0.7 },
      afraid:         { pitch: 1.5, rate: 1.4, volume: 0.6 },
      bored:          { pitch: 0.9, rate: 0.8, volume: 0.6 },
  
      // Low energy
      sleepy:         { pitch: 0.7, rate: 0.6, volume: 0.4 },
      tired:          { pitch: 0.8, rate: 0.7, volume: 0.5 },
      quiet:          { pitch: 1, rate: 1, volume: 0.3 },
      whisper:        { pitch: 1, rate: 0.85, volume: 0.2 },
      murmur:         { pitch: 0.9, rate: 0.7, volume: 0.3 },
  
      // Other styles
      sarcastic:      { pitch: 0.95, rate: 1.1, volume: 1 },
      robotic:        { pitch: 1, rate: 1, volume: 1 },
      mysterious:     { pitch: 0.85, rate: 0.8, volume: 0.7 },
      dramatic:       { pitch: 0.95, rate: 0.7, volume: 1 },
      surprised:      { pitch: 1.5, rate: 1.3, volume: 1 }
    };
  
    const settings = tones[tone] || tones["neutral"];
    __$enqueueSpeech({type:"speech", text: children, settings});
    // speechQueue.push({type: "speech", text:children, ...settings})
    return children;
}
  
  
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
  
