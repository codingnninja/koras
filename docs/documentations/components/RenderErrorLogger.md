# RenderErrorLogger

`RenderErrorLogger` component is used to track errors both in development and production enviroments. It tracks real time errors.

```js
function RenderErrorLogger({ error }) {
  console.error(error);
  console.log("This is called by render internal");
  return "";
}

$register(RenderErrorLogger);
```

Once you register `RenderErrorLogger`, `$render` will keep sending errors to it and you can choose to send errors to the server.

In fact, you can do whatever you want with it.
