# Hydration

Hydration is the process of attaching event handlers to `html` on the client side in `koras`. This hydration works well whether components are prerendered or not.

:::info
Note: It is recommended to create any utility with a native function.
:::

```js
function Calculator(result) {
  function add(props) {
    const result = props.first + props.second;
    $render(Calculator, result);
  }

  return `
    <div id="calc">
      ${result ? `updated to ${result}` : ""}
      <If condition=${result ? true : false}>
        This will show or not depending on result.
      </If>
      <button 
        onClick="${add({ first: 4, second: 5 })})">
        add
      </button>
    </div>
  `;
}
```

The `koras` will hydrate the `add` function above into the `Calculator` component. It attaches the function to the element returned by the `Calculator` component.

```js
<button onClick="__$c(ks[83jskks], ks[jd79393])">add</button>
```

This hydration system works for both client and server rendered UIs.
