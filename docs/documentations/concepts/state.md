# State

State is current data which is liable to change based on predefined or user interactions. In `koras.jsx`, state is declared with a normal JavaScript variable with an assigned value. There are two kinds of state -- unit and composite state.

### Unit state

It is a state that represent a property of an entity (an app, a module, a class, a function or a component).

```js
const color = "blue";
```

### Composite state

It is a state declaration to represent all properties of an entity (an object, an app or a component). An object is used for a composite state in Javascript to contain all properties needed in the component.

```js
const person = {
    name: 'Doe',
    age: 89,
    nationality: 'German'
    address: { city: 'New York'}
}
```

A state can be viewed in two context in `koras.jsx` -- global and local component contexts.

### State in a local component context

A component state is the current or latest data of the component. Components in `koras.jsx` can use unit and composite state.

- Unit state in a `koras.jsx` component

A unit state is used in a component when a component changes only one view property.

```js
const Count = (count = 0) {
  //component body
}
```

You can declare your state in a unit like above.

It is suitable when you only need to pass one property around for re-rendering.

- Composite state in a `koras.jsx` component

A composite state is used in a component when a component changes many view properties.

```js
const MovingDot = (coordinates = { x:0, y:3 }) {
 // code
}
```

`or`

```js {1}
const MovingDot = ({ x=0, y=3 } = {}) {
 // code
}
```

`or`

```js
const MovingDot = () {
 const cordinate = { x:0, y:3 };
}
```

- Playground

<iframe src="https://codesandbox.io/embed/yvfk2s?view=Editor+%2B+Preview&module=%2Findex.html"
     width="100%"
     height="300px"
     title="movingDots"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

A composite state is suitable when you have to pass many properties around for re-rendering.

#### Scoping states

States in `koras.jsx` are scoped to tags (local scope) so there are not accessible to JavaScript by default. A state scoped to a tag is only accessible to the components that access it.

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

In the component above, `count` is scoped to `button` via `onClick="$render(Counter, ${count + 1})"` for re-rendering. Whenever the button is clicked, `Counter` will be called with a predetermined state.

Sometimes, it is impossible to pass props to `$render` because it will add latest `elements` as the last child of a component so trigger buttons will be repeated. Then, you can scope states to a non-triggering tag.

```js
const AddTodoForm = (id = 0) => {
  const todoForm = $select(`#todo-form>:nth-last-child(2)`);
  id = todoForm ? Number(todoForm.dataset.id) + 1 : id;

  return `
    <div 
      id="todo-form"
      class="todo-form" 
      data-append="#todo-form"
    >
      <input type="text" id="input-${id}" data-id="${id}">
    </div>
    <button onclick="$render(AddTodoForm)">plus</button>
  `;
};
```

- Another example or style.

```js
export async function Articles() {
  const stateTag = $select(`#articles-state`);
  const nextPage = stateTag ? Number(stateTag.value) + 1 : 1;
  const articles = await blog.loadData(nextPage);

  return `
    <input type="hidden" value="${nextPage}" id="articles-state">
    <div id="articles" data-append="#articles">
     <-- The rest of the code -->
    </div>
    <button type="button" class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onclick="$render(Articles)">Load more...</button>
  `;
}
```

:::info
Note: `Props` is not passed to `$render` in the examples above. It is added to a tag and retrieved by the component. And triggers are outside of the component wrapping `div` so that the `trigger` won't be re-rendered.
:::

You can put a `global` level state in a tag in `App` component and any component that need it can access it.

### State management tools

By default, it is straight forewards to manage state with `$render` and `js` scopes. Somestimes, you need state management tools to deal with state in your applications efficiently.

You probably need a state management tool when there are multiple inter-dependency of components, that is, many non-nested or unrelated components have to change together.
