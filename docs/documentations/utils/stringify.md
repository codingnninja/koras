# Stringify utility

`stringify` is a built-in utility in `koras.jsx` to convert an object or an array of objects to a string in template literals so that it doesn't turn to [object Object]. `stringify` takes a parameter of any data type.

:::info
You don't need to use `stringify` because it is used behind the scenes but you may need it to workaround some challenges in some other libraries or frameworks.
:::

```js copy
$stringify(stringifiedData);
```

### How to use stringify

- Use `stringify` in passing `props` to JSX tag

`stringify` must not be enclosed in either single('') or double("") quotes to pass `props` to `JSX tags`.

```js copy
  <Posts posts=${stringify(posts)} />
```

- Use `stringify` in passing a parameter containing object(s) to a function or component. In this case, a single ('') quotes is expected.

### Open inverted comma.

```sh copy
'
```

### Add stringify with data in template literals.

```sh copy
'${stringify(data)}
```

### Close inverted comma.

```sh copy
'${stringify(data)}'
```

You should always use stringify on any `data containing` object(s) in template literals like `'${stringify(data)}'`. If not, it will turn to [object Object].

:::info
Note: Don't forget to always check common errors in the docs whenever you get an error.
:::

### Stringify data

```js
const App = () => {
  const person = {
    id: 1,
    name: "Alice",
    age: 24,
  };

  return `
    <div id="main">
      <article>
        <Profile person=${stringify(person)} />
      </article>
    </div>
  `;
};

function Profile(person) {
  return `
    <div id="${person.id}">
      ${person.name} is ${person.age} year old
    </div>
    <button onclick="resetProfile(${person})"></button>
  `;
}
```

In the `App` component, we use `stringify` to pass `person` as a `prop` to the `Profile` component because any variable with an object or array of objects value used in template literals turns to [object Object].

To avoid it, you need to use `stringify` on any data containing object(s).

:::info
Note: Other values like number, boolean and function could be passed without using `stringify`. `stringify` is only needed for `objects` and `arrays of objects`.
:::

Click to check the common errors in using `stringify`.
