# $purify utility

`$purify` converts stringified data back to its original version. In JavaScript, any object passed via template literals will turn to `[Object object]`. To avoid that from happening, `koras.jsx` introduces `stringify` to convert data to a string before passing it to template literals.

```js copy
$purify(stringifiedData);
```

:::info
You don't need to use `$purify` because it is used behind the scenes but you may need it to workaround some challenges in some other libraries or frameworks.
:::

[Click to check]() the common errors in using `$purify`.
