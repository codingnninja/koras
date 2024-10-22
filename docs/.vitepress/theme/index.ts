import DefaultTheme from "vitepress/theme";
import "./custom.css";
import {codeToHtml} from "shiki";
import { transformerRenderWhitespace } from '@shikijs/transformers';
import { $render } from '@codingnninja/render'
export default DefaultTheme;

let code = await codeToHtml('<div id="student"></div>', {
    lang: 'html',
    theme: 'github-dark',
    transformers: [transformerRenderWhitespace()]
  });

  const Counter = (count = 0) => {
    console.log('get here')
    return `
      <div id="counter-1">
        <button 
          onClick="$render(Counter, ${count + 1})" 
          style="height:30px; width:100px">Count is ${count}
        </button>
      </div>
    `;
  };

