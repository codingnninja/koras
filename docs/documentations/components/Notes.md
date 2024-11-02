# Notes component

```js
function Notes (isBrowser) {
  const note = isBrowser && $select(`state-${noteId}`);
  const nextNoteId = note ? Number(note.value) + 1 : 1;

  function getNotes() {
    return localStorage.getItem('notes') ?? 'no note yet';
   }

  function saveNote(this) {
    if(this.textContent === ' ') return false;
    const notes = $select('notes');
    localStorage.setItem('notes', notes.outerHTML);
  }

  return `
    <div id="container">
      <input type="hidden" value="${noteNextId}" id="state-${noteId}"
      <div id="notes">
        ${isBrowser && getNotes()}
          <div
            id="note-${noteId}"
            onblur="${saveNote(this)}"
            contentEditable=""
          > </div>
      </div>
      <button
        onclick="$render(Notes)"
      > Add note </button>
   </div>
  `;
}
```

The `Notes` component above has to access the DOM for `id` for the next note to add since it basically operates on html tags.
