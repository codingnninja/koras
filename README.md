# Koras — Hybrid UI Component & Rendering System

**Koras** is a no-build, JSX-like UI system that runs directly in browsers, servers, or workers without a virtual DOM or tagged templates.

It let you render JavaScript components with minimal overhead while keeping the mental model simple and flexible.

---

## Why Koras?

- Use JSX-like syntax anywhere JavaScript runs — browsers, servers, or workers
- Run components synchronously or asynchronously
- No compilation step required
- No virtual DOM diffing
- Works on both client and server
- Lightweight, fast rendering model
- Orchestrate agents and subagents using components.
- Simple learning curve

Koras is designed for direct execution and minimal runtime cost on both client and server.

---

## Syntax Overview

Koras looks similar to JSX but operates differently.

### Supported patterns

- Components: `<Foo></Foo>`
- Self-closing tags: `<Foo />`
- Spread props: `<Profile {...props} />` not: `<Profile ${...props} />`
- Attributes: `<Home name=${username} />`
- Renderer: `$render(Component, props)`
- Query helper: `$select('query')`

---

## Development Tools

Code editor:

-Install **VS Code**

Recommended VSCode extensions:

- Install **Template Literals** and **leet-html** VScode extension (syntax highlighter)
- Install **Auto Complete Tag** (auto close/rename tags)

---

## Installation

koras is published to npm, and accessible via the jsdelivr.net CDN:

```sh
npm i @codingnninja/koras
```

CDN (no build required)

```js
import {
  $register,
  $render,
} from "https://cdn.jsdelivr.net/npm/@codingnninja/koras/dist/esm/koras.min.js";

import { $select } from "https://cdn.jsdelivr.net/npm/@codingnninja/koras/dist/esm/query.min.js";
```

## Usage

### Quick Demo - Counter with $select (browser)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module">
      import { $select } from "https://cdn.jsdelivr.net/npm/@codingnninja/koras/dist/esm/query.min.js";
    </script>
  </head>
  <body>
    <div id="counter">0</div>
    <button onclick="$select('#counter[add|textContent+=1]')">Increase</button>
  </body>
</html>
```

### Quick demo - Counter with $render (server)

```js
import { $render, $register, $select } from "@codingnninja/koras";

function Counter({ count = 0 } = {}) {
  function reRender(count) {
    $render(Counter, { count: count + 1 });
  }

  return `
    <div id="counter">
      <button
        onClick="${reRender(count)}"
        style="height:30px; width:100px">Count is ${count}
      </button>
    </div>
  `;
}

$register({ Counter });
$render(Counter);
```

### Quick Demo - Counter with $render (Browser)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
      import {
        $render,
        $register,
      } from "https://cdn.jsdelivr.net/npm/@codingnninja/koras/dist/esm/koras.min.js";

      function Counter({ count = 0 } = {}) {
        function reRender(count) {
          $render(Counter, { count: count + 1 });
        }

        return `
          <div id="counter">
            <button
              onClick="${reRender(count)}"
              style="height:30px; width:100px">Count is ${count}
            </button>
          </div>
        `;
      }

      $register({ Counter });
      $render(Counter);
    </script>
  </body>
</html>
```

## Dynamic Component Example

Generating `id` of a component dynamically makes it repeatable on the same page.

```js
export function CopyToClipboard({
  id = "clipboard",
  text = "nictoma.com",
  status = false,
} = {}) {
  function copy() {
    navigator.clipboard.writeText($select(`#copy-input`).value);
    $render(CopyToClipboard, { id, text, status: !status });

    setTimeout(() => $render(CopyToClipboard, { id, text, status }), 1500);
  }

  return `
      <section id="${id}">
        <input
          id="copy-input"   
          type="text"
          value=${text}
          placeholder=${text}
          disabled=""
        >
        <button onmousedown="${copy()}">
          ${status ? "copied!" : "Copy"}
        </button>
      </section>
    `;
}
```

`App.js`

```js
export function App() {
  return `
    <div id="app">
      <CopyToClipboard text="nictoma.com" id="a1" />
      <CopyToClipboard text="nictoma.org" id="a2" />
      <CopyToClipboard text="nictoma.com" id="a3" />
      <CopyToClipboard text="nictoma.org" id="a4" />
    </div>
    `;
}

$register({ App, CopyToClipboard });
await $render(App);
```

## Agent Orchestration Example

Koras components can coordinate agents and subagents naturally.

```js
async function ResearchAgent({ topic }) {
  return `
    <div>
      <h3>Researching: ${topic}</h3>
      <Reviewer rules="you are a senior dev so look for gotchas">
        <SummaryAgent topic="${topic}" />
      </Reviewer>
    </div>
  `;
}

function Reviewer({ rules, children }) {
  //review the topic leveraging LLM
  const reviewedChildren = children;
  return `
    <h2>Research review</h2>
    ${reviewedChildren}
  `;
}

function SummaryAgent({ topic }) {
  //run LLMs or AIs here
  const summarisedTopic = topic;
  return `
    <p>Summary generated for ${ummarisedTopic}</p>
  `;
}

$register({ ResearchAgent, SummaryAgent, Reviewer });
$render(ResearchAgent, { topic: "Koras.js" });
```

**Koras** can run in parallel or recursively making agent and subagent orchestration web-native.

## Contributing

Contributions are welcome and appreciated.

Please read the contribution guide:

👉 [/CONTRIBUTING.md](/CONTRIBUTING.md)

- You can help by:

- reporting bugs

- improving docs

- adding tests

- proposing new features

# Roadmap

- Improve error handling for debugging.
- Add more test infrastructures and suites.
- Add `typescript`.
