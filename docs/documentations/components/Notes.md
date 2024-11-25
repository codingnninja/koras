# Notes component

```js
function Notes(noteId = 1) {
  function getNotes() {
    return localStorage.getItem("notes") ?? "";
  }

  function saveNote() {
    const notes = $select("#notes:not(:last-child)");
    if (notes.innerHTML === "") return false;
    localStorage.setItem("notes", notes.innerHTML);
  }

  return `
      <div id="container">
        <div id="notes" data-append="#notes">
          ${getNotes()}
            <div
              onblur="${saveNote()}"
              contenteditable=""
            > Note placeholder</div>
        </div>
        <button
          onclick="$render(Notes)"
        > + </button>
     </div>
    `;
}
```

The `Notes` component above has to access the DOM for `id` for the next note to add since it basically operates on html tags.
