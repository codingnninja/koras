# Rendering

Rendering refers to the process of displaying or updating the user interface of a web application. `koras` uses `$render(Component, props)` utility to achieve React like rendering without a virtual DOM or tagged templates.

Though rendering systems in `koras.jsx` and `React` are similar, the operating systems in both frameworks are different because `koras.jsx` makes use of `nth = a + (n - 1)d` for its rendering and re-rendering algorithm in place of `Reconciliation`, `Diffing`, `Batching` and so on.

Using `nth = a + (n - 1)d` in `koras.jsx` makes rendering very fast and state management more comfortable.

Rendering and re-rendering often change the state of elements in a component. [Learn more](../utils/$render).

### Conditional rendering

You can render your components based on some conditions using `if`, `&&`, `||`, `??` and `?:` operators.

- ##### Conditional rendering with `if` statements

You can render different forms of elements and components based on some certain conditions using `if` statements.

> conditionally render elements

```js
if (hasPaid) {
  return `<li class="item">${name} ✔</li>`;
}
return `<li class="item">${name}</li>`;
```

> conditionally render components

```js
if (isExpensive) {
  return `<OriginalItem />`;
}
return `<InferiorItem />`;

//or

const content;
if (isExpensive) {
  content = `<OriginalItem />`;
}
content = `<InferiorItem />`;
return content;
```

> conditionally call/trigger a function

```js
if (isBrowser) {
  saveNotes(notes);
}
return `<Notes />`;
```

- ##### Conditional rendering with the logical AND operator (`&&`)

You can conditionally render attributes, contents and component using `&&` when you only want the first operand to be the condition and the second operand the value to render.

> conditionally render content

```js
return `
  <li className="item">
    ${name} ${hasPaid && "✔"}
  </li>
`;
```

> conditionally render attributes

```js
return `
  <li class="${hasPaid && "paid"}">
    Rice
  </li>
`;
```

> conditionally render components

```js
return `
  <li class="item">
    ${isExpensive && "<OriginalItem />"}
  </li>
`;
```

> conditionally call/trigger a function

```js
const props = isBrowser && saveNotes(notes);
```

- ##### Conditional rendering with the nullish coalescing operator `??`

You can use the the nullish coalescing operator to conditionally render attributes, contents or components as a fallback.

> conditionally render content

```js
return `
  <li className="item">
    Welcome, ${name ?? "our esteemed customer"}
  </li>
`;
```

> conditionally render attributes

```js
return `
  <li class="${paid ?? "no paid"}">
    Rice
  </li>
`;
```

> conditionally render components

```js
return `
  <li class="item">
    ${isExpensive ?? "<OriginalItem />"}
  </li>
`;
```

> conditionally call/trigger a function

```js
const props = isTriggered ?? saveNotes(notes);
```

- ##### Conditional rendering with the ternary operator `?:`

You can use the ternary operator to conditionally render attributes, contents or components.

> conditionally render content

```js
return `
  <li className="item">
    ${hasPaid ? name + " ✔" : name}
  </li>
`;
```

> conditionally render attributes

```js
return `
  <li class="${hasPaid ? "paid" : "no paid"}">
    Rice
  </li>
`;
```

> conditionally render components

```js
return `
  <li class="item">
    ${isExpensive ? "<OriginalItem />" : "<InferiorItem />"}
  </li>
`;
```

> conditionally call/trigger a function

```js
const props = isBrowser ? saveNotesOnBrowser(notes) : saveNotesOnServer(notes);
```

- ##### Conditional rendering with OR operator `||`

You can use `OR` operator to conditionally render attributes or contents.

> conditionally render content

```js
return `
  <li className="item">
    ${firstName || surname}
  </li>
`;
```

> conditionally render attributes

```js
return `
  <li class="${free || paid}">
    Rice
  </li>
`;
```

### Harmonious rendering

An harmonious rendering happens when all nested functions and children components depend on their parent component for arguments or props. They do not take independent props or have side effect.

```js copy
const Profile = memoize(({ user }) => {
  const modifyName = memoize((user) => `Mr. ${user.name}`);
  const giveBadge = () => "Badge";
  return `
   <div>
      ${modifyName(user)}
      ${giveBadge()}
   </div> 
  `;
});
```

The component above is harmonious as the functions within it either take its props as an argument or take no argument and without any side effect. You can memoize an harmonious component or any of its content without worrying about any issue.

### Disjointed rendering

A disjointed rendering is the opposite of Harmonious Rendering as it only happens when some or all nested functions and children components have their own props, arguments which do not come from their parent component or have side effect.

```js copy
const Profile = ({ user }) => {
  const toggle = (status = false) => !status;
  const giveBadge = () => "Badge";
  return `
   <div>
      ${toggle()}
      ${giveBadge()}
   </div> 
  `;
};
```

Memoizeing a disjointed component requires you to be extra careful to avoid unexpect challenges.
