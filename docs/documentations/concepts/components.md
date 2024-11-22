# $render Components

A component is a part of an object that is detachable and pluggable to another object of the same family. For example, a computer has several components such as the monitor, keyboard, mouse and system unit to mention few. For you to have a computer, you need to bring these components together.

Just like in a computer, $render components are detachable and pluggable to another component that supplies suitable props. Components in koras.jsx and React are similar except koras.jsx uses JavaScript `template literals` to wrap every `HTML string` to be returned.

:::info

- A component can return an empty string `""` to inform `$render` not to touch the `DOM`. It is useful to execute some operations not intended to change the `DOM`

:::

#### A component without props.

```js
// using an arrow function
const App = () => {
  return `
    <div id="main">
      <article>
        <Player />
        <Playlist />
        <Overlay />
      </article>
    </div>
  `;
};
```

You call it like:

```html
<App />
```

#### A component with props.

```js
// using an native function
function List(items) {
  return `
    <div id="list">
      <ul>
        ${items.map((item) => `<li>${item.title}</li>`)}
      </ul>
    </div>
  `;
}
//usage
const list = [
  {
    name: "Alice",
    age: 24,
  },
];
```

You call it like:

```html
<List users="${list}" />
```

`Or`

```js
// using an arrow function
const List = (items) => {
  return `
    <div id="list">
      <ul>
        ${items.map((item) => `<li>${item.title}</li>`)}
      </ul>
    </div>
  `;
};
//usage
const list = [
  {
    name: "Alice",
    age: 24,
  },
];
```

You call it like:

```html
<List users="${list}" />
```

## Component parameter

A component can only take zero or one `parameter` of any `data type` that can have a default value.

#### A parameter without a default value

Any component with a parameter that has no default value expects an argument whenever it is used as JSX `<Component songs=${songs} />`. This is mostly used when you want a component to depend on its parent Component for `props`.

:::info
**A unit state** is a non-structured parameter such as `number`, `string`, or `boolean`.

**A composite state** represents `props` or an `object` passed as a parameter to a component.
:::

#### Unit state

```js
const Counter = (count) => {
  return `
    <div id="counter">
      <button 
        onClick="$render(Counter, ${count + 1})" 
        style="height:30px; width:100px">Count is ${count}
      </button>
    </div>
  `;
};
```

#### Composite state

> props without destructuring

```js
function Profile(item) {
  return `
    <div 
      id="${item.id}" 
      person="${item.person}"> 
      ${item.children.a} 
    </div>
  `;
}
```

> props with destructuring

```js
function Profile({ id, person, children }) {
  return `
    <div 
      id=${id} 
      person=${person}> 
      ${children.a} 
    </div>
  `;
}
```

##### Render components that have no default value.

- As html tags

```md
//As HTML tags
<Counter count="0" />
<Profile user=${user} />
<Profile user={user} />
```

- As JavaScript functions

```js
//In a component/function body
$render(Counter, 0);
$render(Profile, user);
```

- As event handlers

```js
onclick = "$render(Counter, 0)";
onhover = "$render(Profile, {user})";
onkeyup = "$render(Profile, ${user})";
onpointermove = "$render(Profile, {{x:this.x, y:this.y}})";
```

:::warning
Note: You can't `$render` a component in its own body but you can `$render` another component. If you have to do so, make sure you add a stopping point like in a Recursion because the operation will be recursive and loop "forever and ever" if no stopping point is provided.
:::

##### Use a parameter with a default value

Any component with a parameter that has a default value doesn't expect an argument whenever it is used. This is useful when you want a component to be self containted or independent.

#### Unit state

```js
const Counter = (count = 0) => {
  return `
    <div id="counter">
      <button 
        onClick="$render(Counter, ${count + 1})" 
        style="height:30px; width:100px">Count is ${count}
      </button>
    </div>
  `;
};
```

#### Composite state

> default value without destructuring

```js
function Profile(item = { id: 1, person: {}, children: { a: "yes" } }) {
  return `
      <div 
        id="${item.id}" 
        person="${item.person}"> 
        ${item.children.a} 
      </div>
    `;
}
```

> default value with destructuring

```js
function Profile({ id = 1, person = {}, children = { a: "yes" } } = {}) {
  return `
      <div 
        id=${id} 
        person=${person}> 
        ${children.a} 
      </div>
    `;
}
```

Basically, a `koras.jsx` component is still a JavaScript function that has a name with `PascalCase` (Koras will support kebab-case in the future).

A common error to avoid in `$render.jsx` or `React` while crafting components is Prop Drilling. Learn more from [How to avoid Prop Drilling in React or $render](https://www.freecodecamp.org/news/avoid-prop-drilling-in-react/)
