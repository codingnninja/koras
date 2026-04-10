import fs from 'fs';
import path from 'path';
import { App } from './app.js';
import { $render } from "../../dist/esm/koras.js";


// Props to pass to the component
const props = { text: 'nictoma.com' };

// Render component to string
const view = await $render(App, props);
// Load template HTML
const indexPath = path.resolve('examples/prerendering/index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// Inject rendered view
html = html.replace('<!--VIEW_PLACEHOLDER-->', view);

// Save or overwrite the HTML file
const outputPath = path.resolve('examples/prerendering/index.html');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, html, 'utf-8');

console.log(`HTML rendered and saved to ${indexPath}`);