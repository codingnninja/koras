import { $render, $register} from "../../dist/esm/render.js";

const voice = document.getElementById('voice');

voice.addEventListener('click', () => {
  $render(MySpeech);
});

// console.log($render(MySpeech));
function MySpeech(){
  return ssml(`
  <div id="speech">
    <Speak> 
      <Mood tone="sad"> Once upon a time,</Mood><Break time="3000ms" /> in a village nestled between green hills and clear rivers, there lived a boy with dreams <Break time="5000ms" /> larger than the sky. His name was Eli. One day, He asked,<Break time="7000ms" /> "Do you go out at night?"
    </Speak>
  </div>
  `)
}

let speechQueue = [];
globalThis["speechQueue"] = speechQueue;

export function Speak({children}) {
  speak(speechQueue);
  return children;
}

export function Mood({ tone = "neutral", children } = {}) {
console.log(tone, children);
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
      sad:            { pitch: 0.8, rate: 0.9, volume: 0.6 },
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
    speechQueue.push({type: "speech", text:children, settings})
    return children;
  }
  
function ssml(input) {
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
      ? `<NaturalParagraph> ${textContent.trim()} </NaturalParagraph>`
      : textContent;

    pos = nextTagStart;
  }

  return output;
}


globalThis["ssml"] = ssml
globalThis["speak"] = speak


async function speak(queue) {
  if (!window.speechSynthesis) {
    console.warn('SpeechSynthesis not supported in this browser.');
    return;
  }

  const voices = await waitForVoices();

  for (const item of queue) {
    if (item.type === 'speech') {
      await speakOne(item.text, item.settings, voices);
    } else if (item.type === 'break') {
      await wait(item.time);
    }
  }

  function speakOne(text, settings = {}, voices) {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);

      // Apply mood/tone settings passed in
      if (settings.pitch != null) utterance.pitch = settings.pitch;
      if (settings.rate != null) utterance.rate = settings.rate;
      if (settings.volume != null) utterance.volume = settings.volume;
      if (settings.voice) {
        const voice = voices.find(v => v.name === settings.voice);
        if (voice) utterance.voice = voice;
      }

      utterance.onend = resolve;
      utterance.onerror = resolve; // Fail-safe
      window.speechSynthesis.speak(utterance);
      speechQueue = [];
    });
  }

  function waitForVoices() {
    return new Promise((resolve) => {
      const voices = speechSynthesis.getVoices();
      if (voices.length) {
        resolve(voices);
      } else {
        speechSynthesis.onvoiceschanged = () => {
          resolve(speechSynthesis.getVoices());
        };
      }
    });
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}


export function NaturalParagraph({
  children,
  pitch = 1.0,
  rate = 1.0,
  pitchBoost = 0.15,
  rateBoost = 0.1,
} = {}) {
  // const helper = SpeechHelper();
  // const {node, rest} = helper.extractNextNode(children);

  speechQueue.push({
    text: children, 
    pitch, 
    rate, 
    pitchBoost, 
    rateBoost,
    type: "speech"
  });
  console.log(children)
  return children;
}

export function Break({ time = "500ms" } = {}) {
  const ms = parseInt(time || '0', 10);
    if (!isNaN(ms)) {
      speechQueue.push({ type: 'break', time: ms });
    }
    return " ";
  }

$register({MySpeech, NaturalParagraph, Speak, Mood, Break});

