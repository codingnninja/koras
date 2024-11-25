# $render utility

`$trigger` is a koras.jsx utility to call a function with an `Event`.

```js copy
$trigger(func, event);
```

Normally, you call an event handler in `koras.jsx` like `${doSomething(params)}` but this method can't take an `Event` as a `parameter`. If you need to pass an `event` as a parameter, you have to use `$trigger`.

```js copy
<div onblur="$trigger(${saveNote}, event)" contenteditable="">
  Note placeholder
</div>
```

`$trigger` takes a `function` as the first parameter and an `Event` as the second parameter and it will throw an error if the condition is not met.
