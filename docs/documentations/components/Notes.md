# Notes component

```js
function Notes({ noteId = 0, isBrowser } = {}) {
  const note = $select(`state-${noteId}`);
  const nextNoteId = note ? Number(note.value) + 1 : 1;

  function getNotes() {
    return localStorage.getItem("notes") ?? "";
  }

  function saveNote() {
    if (this.textContent === " ") return false;
    const notes = $select("#notes");
    localStorage.setItem("notes", notes.innerHTML);
  }

  return `
      <div id="container">
        <input type="hidden" value="${nextNoteId}" id="state-${noteId}">
        <div id="notes">
          ${getNotes()}
            <div
              id="note-${noteId}"
              onblur="${saveNote()}"
              contenteditable=""
            > Note placeholder</div>
        </div>
        <button
          onclick="$render(Notes)"
        > Add note </button>
     </div>
    `;
}
```

The `Notes` component above has to access the DOM for `id` for the next note to add since it basically operates on html tags.
