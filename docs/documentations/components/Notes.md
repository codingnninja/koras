# Notes component

```js
function Notes() {
  function getNotes() {
    return localStorage.getItem("notes") ?? "";
  }

  function saveNote(event) {
    $select(".note[delete|textContent=write note...]");
    const notes = $select("#notes");
    localStorage.setItem("notes", notes.innerHTML);
  }

  return `
    <div id="container">
      <div id="notes" data-append="#notes">
        ${getNotes()}
          <div
            class="note"
            onblur="${saveNote()}"
            contenteditable=""
          >write note...</div>
      </div>
      <button
        class="add-note-btn"
        onclick="$render(Notes)"
      > + </button>
    </div>
  `;
}

$register(Notes);
$render(Notes);
```

The `Notes` component above has to access the DOM for `id` for the next note to add since it basically operates on html tags.
