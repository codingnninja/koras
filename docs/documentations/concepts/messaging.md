# Message Passing

`Koras` components have the ability to pass messages to one another and that means a component can trigger another.

```js
function Notes({ isRaw = false, notes = [] } = {}) {
  const saveNotes = (notes) => {
    const noteElement = $select("#noteForm");
    const note = noteElement.value;
    localStorage.setItem("notes", JSON.stringify(notes));
    $render(Notes, { notes: notes.concat(note) });
  };

  if (isRaw) {
    return {
      saveNotes,
    };
  }

  return `
    <div id="notes">
      <!-- the rest of the code -->
      <button onclick="${saveNote(notes)}"
    </div>
  `;
}
```

- Counter

```js
 function Counter({count = 0, notes=[]} = {}){
    const notes = Notes({isRaw=true});
    notes.count = notes.length - 1;
    notes.saveNotes(notes);
 }
```

Now, `Counter` triggers Notes by passing a message to it.

- How it works

Rendering `Notes` desplays UI if `isRaw` is `false` but if `isRaw` is set to `true`, an `object` will be return instead of the UI. That makes it possible to control `Notes` from any component.
