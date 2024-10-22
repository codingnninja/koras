
function autoExecute(fn) {
    if (typeof fn === 'function') {
      return fn(); // Automatically executes the passed function
    } else {
      throw new Error('The argument passed is not a function');
    }
  }
  
  const Counter = (count = 0) => {
      return `
        <div id="counter">
          <button 
            onClick="$render(Counter, ${count + 1})" 
            style="height:30px; width:100px">Count is ${count}
          </button>
        </div>
      `;
    };
  
    function CodeBlockControllers({ id, status }) {
      const props = { id }; 
      return `
        <div class="flex space-x-1 rounded-lg bg-slate-100 p-0.5" role="tablist" aria-orientation="horizontal" id="code-block-controllers-${id}">
          <button class="flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 ${status ? 'bg-gray-200' :'bg-red-500'}" id="headlessui-tabs-tab-:R12q8qj:" role="tab" type="button" aria-selected="false" tabindex="-1"  aria-controls="headlessui-tabs-panel-:r0:" 
          onclick="$render(RawCode, ${props})">
            <svg class="h-5 w-5 flex-none ${status ? 'stroke-slate-600' :'stroke-white'}" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="m13.75 6.75 3.5 3.25-3.5 3.25M6.25 13.25 2.75 10l3.5-3.25"></path></svg>
            <span class="sr-only lg:not-sr-only lg:ml-2 ${status ? 'text-slate-600' :'text-white'}">Code</span>
          </button>
          <button class="flex items-center rounded-md py-[0.4375rem] pl-2 pr-2 text-sm font-semibold lg:pr-3 shadow preview ${status ? 'bg-red-500' :'bg-gray-200'}" id="headlessui-tabs-tab-:Riq8qj:" role="tab" type="button" aria-selected="true" tabindex="0" aria-controls="headlessui-tabs-panel-:R3a8qj:" onclick="$render(CodeBlockPreview, ${props})">
            <svg class="h-5 w-5 flex-none ${status ? 'stroke-white' :'stroke-slate-600'}" fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.25 10c0 1-1.75 6.25-7.25 6.25S2.75 11 2.75 10 4.5 3.75 10 3.75 17.25 9 17.25 10Z"></path><circle cx="10" cy="10" r="2.25"></circle></svg>
            <span class="sr-only lg:not-sr-only lg:ml-2 ${status ? 'text-white' :'text-slate-600'}">Preview</span>
          </button>
        </div>
      `;         
    }
  
    function CodeBlockPreview({ id, status = true } = {}){
      const content = codeContent;
      const codeElement = $select(`#raw-code-${id}`);
      const rawCode = codeElement ? codeElement.textContent : content;
      const code = removeBreakLine(rawCode);
      //Only call CodeBlockControllers for re-rendering
      $select(`#raw-code-${id}`) && $render(CodeBlockControllers, { id, status });
      $select(`#raw-code-container-${id}[add|class=hidden]`);
  
      return`
        <div id="preview-${id}" class="relative ${codeElement ? '' : 'hidden'}" style="height: auto;">
          <style>
            #preview-iframe-${id} {
              height: 560px;
            }
            @media (min-width: 704px) {
              #preview-iframe-${id} {
                height: 572px;
              }
            }
          </style>
          <iframe src="/" class="w-full overflow-hidden rounded-lg ring-1 ring-slate-900/10" id="preview-iframe-${id}" title="Simple centered preview" aria-label="Simple centered preview" name="frame-${id}" srcdoc="${code}" height="auto"></iframe>
        </div>
      `;
    }
  
    async function RawCode({ id, status = false } = {}){
      const shiki = await import('https://esm.sh/shiki@1.0.0');
      const transformers = await import('https://cdn.jsdelivr.net/npm/@shikijs/transformers@1.14.1/+esm');
      
      const content = codeContent;
      const codeElement = $select(`#raw-code-${id}`);
      const rawCode = codeElement ? codeElement.textContent.trim() : content.trim();
      let code = await shiki.codeToHtml(rawCode, {
        lang: 'js',
        theme: 'github-dark',
        transformers: [transformers.transformerRenderWhitespace()]
      }); 
  
    // /*   code = code.replace(/<span class="space">/g, '<span class="space">&nbsp;</span>') */
  
      code = code.replace('<code', `
        <code 
          id="raw-code-${id}" 
          class="custom" 
        `);
      
      $select(`#raw-code-${id}`) && $render(CodeBlockControllers, { id, status });
      $select(`#preview-iframe-${id}[add|class=hidden]`);
  
      return `
        <div 
          class="language-js vp-adaptive-theme w-full h-full overflow-hidden rounded-lg ring-1 ring-slate-900/10 bg-black-900" 
          id="raw-code-container-${id}"
        >
          <button title="Copy Code" class="copy"></button>
          <span class="lang">js</span>
            ${code}
        </div>
      `;
    }
  
    function CodeBlock({ id, children }) {
      const content = typeof children === "function" ? children() : '<div>No demo</div>';
      globalThis["codeContent"] = content;
      return`
        <div class="w-full" id="code-block-${id}">
          <div class="mt-10 space-y-24 pb-px">
            <div class="grid grid-cols-[1fr,auto] items-center">
              <div class="flex items-center p-3 rounded-lg">
                <CodeBlockControllers id="${id}" status="false" />
                <h4 class="group ml-5 relative h-9 items-center justify-center sm:flex"> Testimonials </h4>
              </div>
              <div class="col-span-2 row-start-2 min-w-0">
                <RawCode id=${id} />
                <div class="mt-4 focus:outline-none" role="tabpanel" tabindex="0" data-headlessui-state="selected" data-selected="" aria-labelledby="headlessui-tabs-tab-:Riq8qj:">
                  <CodeBlockPreview id=${id} />
                </div>
                <span aria-hidden="true" role="tabpanel" tabindex="-1" aria-labelledby="headlessui-tabs-tab-:R12q8qj:" style="position: fixed; top: 1px; left: 1px; width: 1px; height: 0px; padding: 0px; margin: -1px; overflow: hidden; clip: rect(0px, 0px, 0px, 0px); white-space: nowrap; border-width: 0px;"></span>
            </div>
          </div>
        </div>
      </div>
      `;
   } 
  
   const selectDemo = () => `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script type="module">
          import { $select } from "https://cdn.jsdelivr.net/npm/@codingnninja/render/dist/esm/render.min.js";
        </script>
      </head>
      <body>
        <div id="counter">0</div>
        <button onclick="$select('#counter[add|textContent+=1]')">Increase</button>
      </body>
    </html>
   `
   
   function App(){
    return`
      <div id="myApp">
        <CodeBlock id="counter" children="${Counter}" />
        <CodeBlock id="counter-2" children="${Counter}" />
      </div>
    `;
   }
  
  $register(Counter, CodeBlock, CodeBlockPreview, RawCode, CodeBlockControllers);
  $render(App);
  
  
  