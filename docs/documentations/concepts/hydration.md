# Hydration

Hydration is the process of attaching event handlers to `html` on the client side but in `$render.jsx`, `Hydration` works by default in the browser so there is no need to take some extra time to `re-compile`. What you write is what you get in the browser.

When you wrap a function with template literals while passing it to an event handler in a component, it is hydrated into the component.

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
      <button 
        onClick="${add({ first: 4, second: 5 })})">
        add
      </button>
    </div>
  `;
}
```

The browser will hydrate the `add` function above into the `Calculator` component. It attaches the function to the element returned by the `Calculator` component.

```js
<button
  onClick="(function add(props){
  return props.first + props.second;
})($purify('{first:4, second:5}'))"
>
  add
</button>
```

### Avoiding hydrations from template literals

Maybe you don't like how hydrated functions look in the browser, you can use conditional statements to trigger functions in a component.

```js
function Box({item:"water", isBrowser}){
  const modifyItem = (item) => `Yeah, ${item}`;
  let modifiedItem;

  if(item){
    modifiedItem = modifyItem(item);
  }

  const props = {item: modifiedItem,  isBrowser:false};
  return`
    <div id="box" onclick="$render(Box, {props})"></div>
  `
}
```

You can also create a custom `$utils` to access utilities globally. Check [utils]() to see how to create it.
