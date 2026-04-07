# $register utility

`$register` utility is used to make components or any functions accessible to `$render`. If you don't use `$register`, your components won't be accessible to `$render`.

```js copy
$register({ Component, AnotherComponent, etc...});
```

`$register takes an object of components.

### $register a component

You only need to $register a component where it is imported and used (not where it is created or exported).

```js
export const Shuffle = (status = false) => {
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
```

`Shuffle` is created. Now, let use it in `App` component.

```js copy
import { Shuffle } from "./Shuffle";

const App = () => {
  const media = {};
  return `
      <div id="main">
        <article>
          <Shuffle />
        </article>
        <button 
          onClick="transformMedia(${media})">
          transform media
        </button>
      </div>
    `;
};

$register({ Shuffle });
```

You see! We registered `Shuffle` in the `App` component where it is used. You have to `$register` a component where you use it.

:::info
Note: Once you `$register` a component, you don't need to re-register it if you have to use it in another component.
:::

### $register a function

Functions from a module are not accessible to DOM events like `onclick` by default. You can make them accessible by using `$register` on them.
