# Defer component

It is used to inform render engine to defer a component to the browser.

```js
function Defer({id, action}){
  return `
    <div id="${id}">
      <iframe onload="${action}">Loading</iframe>
    </div>
  `
}

//usage
<Defer id="page" action="$render(Home)" />
<Defer id="page" action="$view(github/dashboard)" />
<Defer id="feeds" action="$render(Feeds, '${stringify(data)}')" />
```
