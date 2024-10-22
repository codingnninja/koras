# Menu

Simple menu component with toggling enabled.

```js
function Menu() {
  return `
    <div id="menu">
      <button
        onclick="$select('.menu-items[toggle|class=hidden')"
      >toggle</button>
      <ul class="menu-items hidden">
        <li>Item 1</li>
        <li>Item 2</li>
        <li>Item 2</li>
        <li>Item 3</li>
      </ul>
    </div>
  `;
}
```

<iframe src="https://codesandbox.io/embed/75n34m?view=preview&module=%2Findex.html"
     style="width:100%; height: 500px; border:0; border-radius: 4px; overflow:hidden;"
     title="Toggling menu"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
<a href="https://codesandbox.io/p/sandbox/75n34m">
  <img alt="Edit Toggling menu" src="https://codesandbox.io/static/img/play-codesandbox.svg">
</a>
