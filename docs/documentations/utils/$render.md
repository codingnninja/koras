# $render utility

$render adds JSX to the DOM with the `#root id` or a target `id` of a component. It makes using JSX directly in the browser without a virtual DOM or tagged templates possible.

```js copy
$render(Component, props?optional);
```

## Rendering

It is adding JSX to the DOM that happens in the browser without any user interactions with the DOM elements.

- Rendering without props

```js
function Profile() {
  return `
      <div id="1"> 
        Ayobami Ogundiran
      </div>
    `;
}

$render(Profile); //without props
```

- Rendering with props

```js
const item = {
  id: 1,
  person: {},
  children: { a: "No" },
};

function Profile(item) {
  //without default value
  return `
      <div
        id=${item.id}
        person=${item.person)}>
        ${item.children.a}
      </div>
    `;
}

$render(Profile, item); //with props
```

## Re-rendering

It is adding JSX to the DOM that happens in the browser when you interact with the DOM.

:::info
Note: A re-renderable component must have a wrapping `div` tag with an `ID`.
:::

- Self-contained re-rendering

```js
const Shuffle = (status = false) => {
  return `
    <div id="shuffle">
      <button class="btn-icon toggle">
        <span 
          class="material-symbols-rounded ${status ? "active" : ""}"
          onclick="$render(Shuffle, ${!status})"
        >shuffle ${status} </span>
      </button>
    </div>
  `;
};
$render(Shuffle);
```

In the code above, you would notice we use `$render(Shuffle, ${!status})` to make `Shuffle` re-render itself whenever the shuffle button is clicked.

- Re-rendering from a controller

You might need to perform some operations you don't want to tie to a component, then you can create reusable utilities.

- A re-usable utility

```js
function toggle(status) {
  $render(Shuffle, !status);
}

const utils = {
  toggle,
};

globalThis["$utils"] = utils;
```

- Use the utility in a component

```js
export const Shuffle = (status = false) => {
  return `
     <div id="shuffle">
       <button class="btn-icon toggle">
         <span
           class="material-symbols-rounded ${status ? "active" : ""}"
           onclick="$utils.toggle(${status})"
         >shuffle ${status} </span>
       </button>
     </div>
   `;
};
```

You can import the utils from a module directly in `Shuffle` using `import()`.

```js
export const Shuffle = async (status = false) => {
  const { toggle } = import(_$links.utils);
  return `
     <div id="shuffle">
       <button class="btn-icon toggle">
         <span
           class="material-symbols-rounded ${status ? "active" : ""}"
           onclick="${toggle(status)}"
         >shuffle ${status} </span>
       </button>
     </div>
   `;
};
```

- Use the component

```js copy
import { Shuffle } from "./Shuffle";

$register(Shuffle);
$render(Shuffle);
```

If you have rendered `Shuffle`, you need to remove `$render(Shuffle);` at the end of the code snippets above.

`$render` is a built-in utility to render and re-render JSX without a virtual DOM or tagged templates.
