import { $render, $register} from "../../dist/esm/koras.js";

const voice = document.getElementById('voice');

voice.addEventListener('click', () => {
  console.log($render(MySpeech));
});

// console.log($render(MySpeech));
function MySpeech(){
  return `
    <Ssml>
      <div id="speech">
        <Speak> 
          The boy just had fatal accident. It was so terrible.
          <Break time="200ms" /> 
          <Mood tone="sad"> Oh! This is really sad.</Mood>
          <Break time="300ms" /> 
          The seen of the accident is not good for the eyes of an emotional human being.
          <Break time="200ms" /> 
          <Mood tone="sad"> It is so sad!</Mood>
          Our children will not die untimely by God's grace.
          
          <Break time="300ms" /> This is a bad occurrence.
        </Speak>
      </div>
    </Ssml>
  `
}

export function Ssml({children}) {
  const input = children
  let pos = 0, tagStack = [], output = '';

  while (pos < input.length) {
    if (input[pos] === '<') {
      const tagMatch = input.slice(pos).match(/^<\/?([^\s>/]+)[^>]*\/?>/);
      if (tagMatch) {
        const [fullTag, tagName] = tagMatch;
        const isClosing = fullTag.startsWith('</');
        const isSelfClosing = /\/>$/.test(fullTag);

        if (!isClosing && !isSelfClosing) {
          tagStack.push(tagName);
        } else if (isClosing) {
          tagStack.pop();
        }

        output += fullTag;
        pos += fullTag.length;
        continue;
      }
    }

    let nextTagStart = input.indexOf('<', pos);
    if (nextTagStart === -1) nextTagStart = input.length;

    const textContent = input.slice(pos, nextTagStart);
    const inside = tagStack[tagStack.length - 1];

    output += textContent.trim() && (!inside || inside === 'Speak')
      ? `<Text> ${textContent.trim()} </Text>`
      : textContent;

    pos = nextTagStart;
  }

  return output;
}


function setSsmlPrerequisite(){
  globalThis["__$speechKeys"] = new Set();
  globalThis["__$speechChain"] = Promise.resolve();
    
  function enqueueSpeech(item) {
    let key;

    if (item.type === "speech") {
      key = "speech|" + item.text + "|" + JSON.stringify(item.settings || {});
    }

    if (item.type === "break") {
      key = "break|" + item.time;
    }

    if (!__$speechKeys.has(key)) {
      __$speechKeys.add(key);
      __$speechQueue.push(item);
    }
  }

  async function speak() {
    if (!window.speechSynthesis) return;

    const voices = await waitForVoices();

    const queue = [...__$speechQueue]; // snapshot

    // reset for next run
    __$speechQueue.length = 0;
    __$speechKeys.clear();

    for (const item of queue) {
        if (item.type === "speech") {
        await speakOne(item.text, item.settings, voices);
        } else if (item.type === "break") {
        await wait(item.time);
        }
    }
  }

  function speakOne(text, settings = {}, voices) {
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(text);

      if (settings.pitch != null) u.pitch = settings.pitch;
      if (settings.rate != null) u.rate = settings.rate;
      if (settings.volume != null) u.volume = settings.volume;

      u.onend = resolve;
      u.onerror = resolve;

      speechSynthesis.speak(u);
    });
  }

  function wait(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function waitForVoices() {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length) return resolve(voices);

      speechSynthesis.onvoiceschanged = () => {
      resolve(speechSynthesis.getVoices());
      };
    });
  }

  globalThis["__$enqueueSpeech"] = enqueueSpeech;
  globalThis["__$speak"] = speak  
}

 globalThis.setSsmlPrerequisite = setSsmlPrerequisite;

export function Speak({ children }) {
  console.log(children)
  globalThis["__$speechQueue"] = [];

  setSsmlPrerequisite();

  speechChain = __$speechChain.then(() => __$speak());
  return children;
}

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

export function Break({ time = "500ms" } = {}) {
  const ms = parseInt(time || '0', 10);
    if (!isNaN(ms)) {
      __$enqueueSpeech({ type: 'break', time: ms })
      // speechQueue.push();
    }
    return " ";
  }

$register({MySpeech, Text, Speak, Mood, Break, Ssml});

