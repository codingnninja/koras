# Notes component

```js
function Notes(noteId = 0) {
  const note = $select(`state-${noteId}`);
  const nextNoteId = note ? Number(note.value) + 1 : 1;

  function getNotes() {
    return localStorage.getItem("notes") ?? "";
  }

  function saveNote() {
    const notes = $select("#notes:not(:last-child)");
    console.log(notes);
    if (notes.innerHTML === "") return false;
    localStorage.setItem("notes", notes.innerHTML);
  }

  return `
      <div id="container">
        <input type="hidden" value="${nextNoteId}" id="state-${nextNoteId}">
        <div id="notes">
          ${getNotes()}
            <div
              id="note-${noteId + 1}"
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
