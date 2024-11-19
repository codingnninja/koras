# Interoperability (Interop)

Interoperability as regards JavaScript means the ability of code to run across runtimes. There are many runtimes for JavaScript all of which operate differently in different scenerios, so it is necessary to make sure your code runs in all runtimes.

## Handling Interop in $render.jsx

Nowadays, frontend code is pre-rendered on the server to optimize for speed and some operating systems like `Android` and `iOS`, so it is necessary to write code that runs everywhere.

The rule of thumb to do so is to always put runtime functions, modules or objects in closures and call them conditionally based on runtime capabilities.

```js
function Notes({ notes, isBrowser }) {
  const saveNotes = (notes) => {
    const noteElement = $select("#noteForm");
    const note = noteElement.value;
    localStorage.setItem("notes", JSON.stringify(notes));
    return isBrowser { notes: notes.concat(note), isBrowser: true };
  };

  const props = isBrowser && saveNotes(notes);
  return `
    <div id="notes">
      <!-- the rest of the code -->
      <button onclick="$render(Notes, ${props})"
    </div>
  `;
}
```

In `Notes` component, we called `saveNotes` conditionally with is `isBrowser` which means it won't be called on the server if initial rendering happens on the server.

If not for the closure and the conditional call, rendering `Notes` on the server will cause an error.

## Identifying runtime code

Runtime code is any functions, modules, class and objects you do not declare but you only call or instantiate.

For example, `fetch()`, `document`, `Buffer`, `navigator`, `window` and many others are runtime code because you do not declare them. You only use them.

It is recommended you put runtime code in closures when you have to run them on multiple `runtimes`.
