# RenderDomPurifier

`RenderDomPurifier` component is used to add addtional layer of security to Koras.jsx.

:::info
Note: Koras.jsx is fully secure but if you want to add custom layer of security to your app, `RenderDomPurifier` is handy.
:::

```js
function RenderDomPurifier(htmlString) {
  return DOMpurify.sanitize(htmlString);
}

$register(RenderDomPurifier);
```

Once you register `RenderDomPurifier`, Koras will always call it to further sanitize `htmlString`.
