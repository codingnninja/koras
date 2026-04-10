# State

State is current data which is liable to change based on predefined or user interactions. In `koras`, state is declared with a normal JavaScript variable with an assigned value. There are two kinds of state -- unit and composite state.

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

A state can be viewed in two context in `koras` -- global and local component contexts.

### State in a local component context

A component state is the current or latest data of the component. Components in `koras` can use unit and composite state but composite state is recommended.

- Composite state in a `koras` component

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

States in `koras` are scoped to tags (local scope) so there are not accessible to JavaScript by default. A state scoped to a tag is only accessible to the components that access it.

```js
const Counter = ({ count = 0 } = {}) => {
  function reRender(count){
    $render(Counter, ${count + 1})
  }
  return `
    <div id="counter">
      <button
        onClick="${reRender(count)}"
        style="height:30px; width:100px">Count is ${count}
      </button>
    </div>
  `;
};
```

- Another example

```js
const AddTodoForm = ({items = []} = {}) => {

  functin reRender(items){
    const newItem = {id: items.length + 1}
    items.push(newItem);
    $render(AddTodoForm, items);
  }

  return `
    <div id="todo-form">
      ${
        !items && items.length > 0 ? items.map( item => `
          <input type="text" id="input-${item.id}">
        `) : 'No item yet!'
      }
    <button onclick="${reRender(items)}">plus</button>
    </div>
  `;
};
```

In the components above, `count` and `items` are scoped to `button` for re-rendering. Whenever the button is clicked, `Counter` or `AddTodoForm` will be called with a predetermined state.

- Async example

```js
export async function Articles({ page = 0 } = {}) {
  const articles = await blog.loadData(page);

  return `
    <div id="articles">
     ${
       articles && articles.length > 0
         ? articles.map(
             (article) => `
        <section id=${article.id}>
          <h2> ${article.title}</h2>
        </section>
      `
           )
         : " No article yet!"
     }
      <button 
        type="button" 
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
        onclick="$render(Articles, ${{ page: page + 1 }})"
      > Load more...</button>
    </div>
  `;
}
```
