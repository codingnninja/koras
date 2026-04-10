import { $register, $render } from "../../dist/esm/koras.js";
import { CopyToClipboard } from "./copyToClipboard.js";

export function App(){
    return`
        <div id="app">
          <CopyToClipboard text="nictoma.com" id="a1" />
          <CopyToClipboard text="nictoma.org" id="a2" />
          <CopyToClipboard text="nictoma.com" id="a3" />
          <CopyToClipboard text="nictoma.org" id="a4" />
        </div>
    `
}


$register({App, CopyToClipboard });
await $render(App);
 