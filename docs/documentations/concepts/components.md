# koras Components

A component is a part of an object that is detachable and pluggable to another object of the same family. For example, a computer has several components such as the monitor, keyboard, mouse and system unit to mention few. For you to have a computer, you need to bring these components together.

Just like in a computer, koras components are detachable and pluggable to another component that supplies suitable props. Components in `koras` and React are similar except `koras` uses JavaScript `template literals` to wrap every `HTML string` to be returned.

:::info

- A component can return an empty string `""` to inform `$render` not to touch the `DOM`. It is useful to execute some operations not intended to change the `DOM`

:::

## Why use components?

Components are use for many reasons and two most important of all are `Composability` and `Reusability`.

- Composibility

This means you can combine many UI components or units to make main UIs.

```jsx
<App>
  <Home />
  <Profile />
</App>
```

In `Koras.js`, the `id` in `<div id="app"></div>` is used to identify a component because it is unique. Component `id` is only useful for re-rendering.

```js
export function Home() {
  return `
    <div id="home">
      <img src="ayo.png" alt="Ayobami">
      <style>
        #home {}
        #home img {}
      </style>
    </div>
  `;
}
```

Like that, you can collocate HTML, CSS and JavaScript in a component.

- Reusability

A reusable component can be reuse in another form, shape or style. It usually has dynamic `id`, `style` and `children` to be suitable for differenct contexts or needs.

```js
export function Layout({ name, style = "", children } = {}) {
  return `
    <div id="${name}">
      ${children}

      <style>
        #${name} {}
        #${name} img {}
      </style>

      //or 

      <style>
        ${style}
      </style>
    </div>
  `;
}
```

You can now reuse `Layout` as a compoennt.

```js
<Layout name="profile">
  <img src="Ayobami.png" alt="Ayobami">
</Layout>

//or

<Layout name="home">
  <img src="Ayobami-at-home.png" alt="Ayobami at home">
</Layout>
```

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
      <ul id="list-items">
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
const Counter = ({ count = 0 } = {}) => {
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
function Profile() {
  function show(props) {
    $render(Profile, props);
  }

  return `
   <button onclick="${show(user)}">show</button>
  `;
}
```

:::warning
Note: $render works everywhere but it is best used within function with a component.
:::

##### Use a parameter with a default value

Any component with a parameter that has a default value doesn't expect an argument whenever it is used. This is useful when you want a component to be self containted or independent.

#### Unit state

```js
const Counter = ({ count = 0 } = {}) => {
  return `
    <div id="counter">
      <button 
        onClick="$render(Counter, ${{ count: count + 1 }})" 
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

Basically, a `koras` component is still a JavaScript function that has a name with `PascalCase` (Koras will support kebab-case in the future).

A common error to avoid in `$koras` or `React` while crafting components is Prop Drilling. Learn more from [How to avoid Prop Drilling in React or $render](https://www.freecodecamp.org/news/avoid-prop-drilling-in-react/)
