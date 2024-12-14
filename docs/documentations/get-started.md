# Getting Started with Koras.jsx

Koras.jsx is a no-build JSX library that works in browsers and servers without a virtual DOM or tagged templates. It is simply the only kind of `JSX` that achieves the true aim of the web component without the known flaws.

It introduces an intuitive state management system that makes `JSX` works everywhere, in browsers and servers by using an arithmetic progression formula: `nth = a + (n - 1)d`.

It's intuitive, super fast and flexible.

::: info
Are you curious to see koras.jsx in action? Check it out at [LovePlay music player](https://codingnninja.github.io/lovePlay).
:::

## Installations

::: code-group

```js [cdn]
import {
  $render,
  $register,
  $select,
} from "https://cdn.jsdelivr.net/npm/@codingnninja/koras/dist/esm/koras.min.js";
```

```sh [npm]
$ npm install @codingnninja/koras
```

```sh [pnpm]
$ pnpm add @codingnninja/koras
```

```sh [yarn]
$ yarn add @codingnninja/koras
```

```sh [bun]
$ bun add @codingnninja/koras
```

:::

Now, you can enjoy all the goodies that come with Koras.jsx.

## Development tools

- Install `VSCode` editor.
- Install `leet-html` (a VSCode extension) for syntax highlighting.
- Install `Auto complete tag` to automatically add close tag and rename paired tag.

## Quick Demo - Counter with $select (Browser)

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script type="module">
      import { $select } from "https://cdn.jsdelivr.net/npm/@codingnninja/koras/dist/esm/koras.min.js";
    </script>
  </head>
  <body>
    <div id="counter">0</div>
    <button onclick="$select('#counter[add|textContent+=1]')">Increase</button>
  </body>
</html>
```

- ### Output:

<iframe src="https://codesandbox.io/embed/fhzgcz?view=editor+%2B+preview&module=%2Findex.html"
     width="100%"
     title="counter"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Quick demo - Counter with $render (Node)

```js
import { $render, $register } from "@codingnninja/koras";

const Counter = (count = 0) => {
  return `
    <div id="counter">
      <button 
        onClick="$render(Counter, ${count + 1})" 
        style="height:30px; width:100px">Count is ${count}
      </button>
    </div>
  `;
};
$register(Counter);
$render(Counter);
```

## Quick Demo - Counter with $render (Browser)

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
      const Counter = (count = 0) => {
        return `
          <div id="counter">
            <button 
              onClick="$render(Counter, ${count + 1})" 
              style="height:30px; width:100px">Count is ${count}
            </button>
          </div>
        `;
      };
      $register(Counter);
      $render(Counter);
    </script>
  </body>
</html>
```

- ### Output:

    <iframe src="https://codesandbox.io/embed/ggjrqp?view=preview&module=%2Findex.html&hidenavigation=1"
     width="100%"
     title="counter"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Scaffold Koras projects

- scaffold

```sh copy
npx create-render-app music-player
```

::: info
Note: since `Koras.jsx` is similar to React, this is to remind you to never scaffold your `React` application with `create-react-app`; use `Remix` or `Next` instead.
:::

- change directory to the project.

```sh copy
cd music-player
```

- run local server.

```sh
npm run dev
```
