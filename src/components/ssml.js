  export function Ssml(input) {
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


function setSsmlPrerequisite(){
  globalThis["__$speechQueue"] = [];
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

    const queue = [...speechQueue]; // snapshot

    // reset for next run
    speechQueue.length = 0;
    speechKeys.clear();

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
export function Speak({ children }) {

  if(__$speechQueue){
    setSsmlPrerequisite();
  }

  speechChain = __$speechChain.then(() => __$speak());
  return children;
}