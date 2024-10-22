# Notes component

```js
function Notes ({nodeId = 0, isBrowser} = {}) {
  const note = isBrowser && $select(`note-${noteId}`);
  const nextNoteId = note ? Number(note.id) + 1 : noteId;

  function getNotes( ) {
    return localStorage.getItem('notes') ?? 'no note yet';
   }

  function saveNote(this) {
    if(this.textContent === ' ') return false;
    const notes = $select('notes');
    localStorage.setItem('notes', notes);
  }

  const props = {noteId: nextNoteId, isBrowser:true};

  return `
    <div id="container">
      <div id="notes">
        ${isBrowser && getNotes()}
          <div
            id="note-${noteId}"
            onblur="${saveNote(this)}"
            contentEditable=""
          > </div>
      </div>
      <button
        onclick="$render(Notes, ${props})"
      > Add note </button>
   </div>
  `;
}
```

The `Notes` component above has to access the DOM for `id` for the next note to add since it basically operates on html tags.
