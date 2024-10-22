# Placeholding component

It is a component that return a string of `HTML tags` that occupies a position for another components to occupy later. It useful to create dynamic structure for various components

```js
const Layout = ({id, className}) => {
  return `
    <div
      id="${id}"
      class="${className}"
    ></div>`;
}

//usage
<Layout id="page" />
<Layout id="modal" className="hidden" />
<Layout id="notification" className="hidden" />
```
