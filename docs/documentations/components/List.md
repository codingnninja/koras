# List component

List comonents show items one after another in an order of magnitude.

- Self-contained List component

```js
function List() {
  const list = [{ title: "yo ya" }, { title: "yeah" }];
  return `
    <div id="list">
      <ul id="list">
        ${list.map((item) => `<li>${item.title}</li>`)}
      </ul>
    </div>
  `;
}

$render(List);
```

- Dependent List component

```js
const todos = [{ title: "yo ya" }, { title: "yeah" }];

function List(todos = []) {
  return `
    <div id="list">
      <ul id="list">
        ${todos && todos.map((todo) => `<li>${todo.title}</li>`)}
      </ul>
    </div>
  `;
}

$render(List, todo);
```

`Or`

```js
const App = () => {
  const todos = [{ title: "yo ya" }, { title: "yeah" }];
  return `
    <div id="app">
      <List todos=${stringify(todos)} />
    </div>
  `;
};

function List(todos = []) {
  return `
    <div id="list">
      <ul id="list">
        ${todos && todos.map((todo) => `<li>${todo.title}</li>`)}
      </ul>
    </div>
  `;
}

$render(App);
```

- Playground

<iframe src="https://codesandbox.io/embed/53p99h?view=Editor+%2B+Preview&module=%2Findex.html"
     width="100%" 
     height="500px"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
