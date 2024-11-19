# Contexts

A context is a point where some executions take place. Some call it execution context. If an operation happens within a component, then it is in the context of that component.

```js
const List = () => {
  const list = {
    name: "Alice",
    age: 24,
  };
  return `<Person id="list"> ${list.name} />`;
};
```

The `list` variable and the `Person` component are in the context of the `List` component because they execute within the `List` component.

Improper use of contexts always lead to `Prop drilling` in `React` and `$render.jsx`. [Learn more](https://www.freecodecamp.org/news/avoid-prop-drilling-in-react/) on how to avoid `prop drilling` intuitively in any component based UI libraries.
