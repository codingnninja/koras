  export function For(
    {
      id, 
      each, 
      component, 
      fallback, 
      position=""} = {} ){
    
    return`
      <section 
        id="items-${id}" 
        data-list="${position}"
      >
        ${
          each && each.length !== 0 ? each.map(item => `
            <${component} {...item} />
          `) : typeof fallback === "function" ? fallback() : fallback
        }
      </section>
    `
  }