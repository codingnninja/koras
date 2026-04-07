# $render utility

$render adds `JSX-like` tags to the DOM with the `#root id` or a target `id` of a component. It enables JSX-like tags directly in browsers without a virtual DOM or tagged templates.

```js copy
$render(Component, props?optional);
```

## Rendering

It is adding JSX to the DOM that happens in browsers without any user interactions with the DOM elements.

- Rendering without props

```js
function Profile() {
  return `
      <div id="profile-1"> 
        Ayobami Ogundiran
      </div>
    `;
}

$register({ Profile });
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
        id="profile-${item.id}"
        person=${item.person)}>
        ${item.children.a}
      </div>
    `;
}

$register({ Profile });
$render(Profile, item); //with props
```

## Re-rendering

It is adding JSX to the DOM that happens in browsers when you interact with the DOM.

:::info
Note: The wrapping tag of a re-renderable component must have an `ID`.
:::

- Self-contained re-rendering

```js
const Shuffle = ({ status = false } = {}) => {
  function reRender() {
    $render(Shuffle, { status: true });
  }

  return `
    <div id="shuffle">
      <button class="btn-icon toggle">
        <span 
          class="material-symbols-rounded ${status ? "active" : ""}"
          onclick=${reRender()}
        >shuffle ${status} </span>
      </button>
    </div>
  `;
};

$register({ Shuffle });
$render(Shuffle);
```

In the code above, you would notice we use `$render(Shuffle, {status: true})` to make `Shuffle` re-render itself whenever the shuffle button is clicked.

- Re-rendering from a controller

You might need to perform some operations you don't want to tie to a component, then you can create reusable utilities.

- A re-usable utility

```js
function Utils(status) {
  return {
    toggle(status) {
      $render(Shuffle, !status);
    },
  };
}

$register({ Utils });
```

- Use the utility in a component

```js
export const Shuffle = ({ status = false } = {}) => {
  return `
     <div id="shuffle">
       <button class="btn-icon toggle">
         <span
           class="material-symbols-rounded ${status ? "active" : ""}"
           onclick="Utils().toggle(${status})"
         >shuffle ${status} </span>
       </button>
     </div>
   `;
};
```

You can also import utils directly from `Shuffle` using `import()`. Note that units or modules not accessible in the global scope are not accessible within a component.

```js
export const Shuffle = async (status = false) => {
  const { toggle } = await import(_$links.utils);

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

`$render` is a built-in utility to render and re-render web-JSX without a virtual DOM, compilation or tagged templates.
