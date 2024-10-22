# State

State is current data which is liable to change based on predefined or user interactions. In `$render`, state is declared with a normal JavaScript variable with an assigned value. There are two kinds of state -- unit and composite state.

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

A state can be viewed in two context in `$render` -- app and component contexts.

### State in a local component context

A component state is the current or latest data of the component. Components in `$render` can use unit and composite state.

- Unit state in a `$render` component

A unit state is used in a component when a component has only one view property.

```js
const Count = (count = 0) {
  //component body
}
```

You can declare your state in a unit like above.

It is suitable when you only need to pass one property around for re-rendering.

- Composite state in a `$render` component

A composite state is used in a component when a component has many view properties.

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

- Playground

<iframe src="https://codesandbox.io/embed/yvfk2s?view=Editor+%2B+Preview&module=%2Findex.html"
     width="100%"
     height="300px"
     title="movingDots"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

A composite state is suitable when you have to pass many properties around for re-rendering.

### State in the global scope

A global state is the current or latest data of an app that is accessible to all parts of the app. A global state can be used from anywhere in an application.

You can simply create a simple state like below:

```js
const state = {
  posts: [],
};

globalThis["appState"] = state;
```

Then, you can call `appState` everywhere in your application to access `posts`.

:::info
Note: You can use a state management library, create your own when necessary or use $state() utility.
:::
