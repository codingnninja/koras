

export async function CopyToClipboard({id="clipboard", text='nictoma.com', status=false} = {}){
    function copy(){
      navigator.clipboard.writeText($select(`#copy-input`).value);
      $render(CopyToClipboard, {id, text, status: !status})

      setTimeout(
        ()=> $render(CopyToClipboard, {id, text, status}), 
        1500
      )
    }

    return`
      <section id="${id}">
        <input 
          id="copy-input" 
          type="text" 
          value=${text} 
          placeholder=${text}
          disabled="" 
        >
        <button onmousedown="${copy()}">
          ${ status ? 'copied!' : 'Copy'}
        </button>
      </section>
    `
  }