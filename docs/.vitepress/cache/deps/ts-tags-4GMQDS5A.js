import {
  typescript
} from "./chunk-RYSB5V27.js";
import {
  sql
} from "./chunk-W4NDYE43.js";
import {
  glsl
} from "./chunk-BE334MAB.js";
import "./chunk-23YUXMDY.js";
import {
  xml
} from "./chunk-WETO2DSL.js";
import "./chunk-A4BXN6LK.js";
import {
  html
} from "./chunk-TFYF4XTK.js";
import {
  javascript
} from "./chunk-WXM4ZQL6.js";
import {
  css
} from "./chunk-VIVHTQ6A.js";
import "./chunk-F3FYYIAV.js";

// node_modules/shiki/dist/langs/es-tag-css.mjs
var lang = Object.freeze({ "fileTypes": ["js", "jsx", "ts", "tsx", "html", "vue", "svelte", "php", "res"], "injectTo": ["source.ts", "source.js"], "injectionSelector": "L:source.js -comment -string, L:source.js -comment -string, L:source.jsx -comment -string,  L:source.js.jsx -comment -string, L:source.ts -comment -string, L:source.tsx -comment -string, L:source.rescript -comment -string, L:source.vue -comment -string, L:source.svelte -comment -string, L:source.php -comment -string, L:source.rescript -comment -string", "injections": { "L:source": { "patterns": [{ "match": "<", "name": "invalid.illegal.bad-angle-bracket.html" }] } }, "name": "es-tag-css", "patterns": [{ "begin": "(?i)(\\s?\\/\\*\\s?(css|inline-css)\\s?\\*\\/\\s?)(`)", "beginCaptures": { "1": { "name": "comment.block" } }, "end": "(`)", "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.css" }, { "include": "inline.es6-htmlx#template" }] }, { "begin": "(?i)(\\s*(css|inline-css))(`)", "beginCaptures": { "1": { "name": "comment.block" } }, "end": "(`)", "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.css" }, { "include": "inline.es6-htmlx#template" }, { "include": "string.quoted.other.template.js" }] }, { "begin": "(?i)(?<=\\s|\\,|\\=|\\:|\\(|\\$\\()\\s{0,}(((\\/\\*)|(\\/\\/))\\s?(css|inline-css)[ ]{0,1000}\\*?\\/?)[ ]{0,1000}$", "beginCaptures": { "1": { "name": "comment.line" } }, "end": "(`).*", "patterns": [{ "begin": "(\\G)", "end": "(`)" }, { "include": "source.ts#template-substitution-element" }, { "include": "source.css" }] }, { "begin": "(\\${)", "beginCaptures": { "1": { "name": "entity.name.tag" } }, "end": "(})", "endCaptures": { "1": { "name": "entity.name.tag" } }, "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.js" }] }], "scopeName": "inline.es6-css", "embeddedLangs": ["typescript", "css", "javascript"] });
var es_tag_css = [
  ...typescript,
  ...css,
  ...javascript,
  lang
];

// node_modules/shiki/dist/langs/es-tag-glsl.mjs
var lang2 = Object.freeze({ "fileTypes": ["js", "jsx", "ts", "tsx", "html", "vue", "svelte", "php", "res"], "injectTo": ["source.ts", "source.js"], "injectionSelector": "L:source.js -comment -string, L:source.js -comment -string, L:source.jsx -comment -string,  L:source.js.jsx -comment -string, L:source.ts -comment -string, L:source.tsx -comment -string, L:source.rescript -comment -string", "injections": { "L:source": { "patterns": [{ "match": "<", "name": "invalid.illegal.bad-angle-bracket.html" }] } }, "name": "es-tag-glsl", "patterns": [{ "begin": "(?i)(\\s?\\/\\*\\s?(glsl|inline-glsl)\\s?\\*\\/\\s?)(`)", "beginCaptures": { "1": { "name": "comment.block" } }, "end": "(`)", "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.glsl" }, { "include": "inline.es6-htmlx#template" }] }, { "begin": "(?i)(\\s*(glsl|inline-glsl))(`)", "beginCaptures": { "1": { "name": "comment.block" } }, "end": "(`)", "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.glsl" }, { "include": "inline.es6-htmlx#template" }, { "include": "string.quoted.other.template.js" }] }, { "begin": "(?i)(?<=\\s|\\,|\\=|\\:|\\(|\\$\\()\\s{0,}(((\\/\\*)|(\\/\\/))\\s?(glsl|inline-glsl)[ ]{0,1000}\\*?\\/?)[ ]{0,1000}$", "beginCaptures": { "1": { "name": "comment.line" } }, "end": "(`).*", "patterns": [{ "begin": "(\\G)", "end": "(`)" }, { "include": "source.ts#template-substitution-element" }, { "include": "source.glsl" }] }, { "begin": "(\\${)", "beginCaptures": { "1": { "name": "entity.name.tag" } }, "end": "(})", "endCaptures": { "1": { "name": "entity.name.tag" } }, "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.js" }] }], "scopeName": "inline.es6-glsl", "embeddedLangs": ["typescript", "glsl", "javascript"] });
var es_tag_glsl = [
  ...typescript,
  ...glsl,
  ...javascript,
  lang2
];

// node_modules/shiki/dist/langs/es-tag-html.mjs
var lang3 = Object.freeze({ "fileTypes": ["js", "jsx", "ts", "tsx", "html", "vue", "svelte", "php", "res"], "injectTo": ["source.ts", "source.js"], "injectionSelector": "L:source.js -comment -string, L:source.js -comment -string, L:source.jsx -comment -string,  L:source.js.jsx -comment -string, L:source.ts -comment -string, L:source.tsx -comment -string, L:source.rescript -comment -string", "injections": { "L:source": { "patterns": [{ "match": "<", "name": "invalid.illegal.bad-angle-bracket.html" }] } }, "name": "es-tag-html", "patterns": [{ "begin": "(?i)(\\s?\\/\\*\\s?(html|template|inline-html|inline-template)\\s?\\*\\/\\s?)(`)", "beginCaptures": { "1": { "name": "comment.block" } }, "end": "(`)", "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "text.html.basic" }, { "include": "inline.es6-htmlx#template" }] }, { "begin": "(?i)(\\s*(html|template|inline-html|inline-template))(`)", "beginCaptures": { "1": { "name": "comment.block" } }, "end": "(`)", "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "text.html.basic" }, { "include": "inline.es6-htmlx#template" }, { "include": "string.quoted.other.template.js" }] }, { "begin": "(?i)(?<=\\s|\\,|\\=|\\:|\\(|\\$\\()\\s{0,}(((\\/\\*)|(\\/\\/))\\s?(html|template|inline-html|inline-template)[ ]{0,1000}\\*?\\/?)[ ]{0,1000}$", "beginCaptures": { "1": { "name": "comment.line" } }, "end": "(`).*", "patterns": [{ "begin": "(\\G)", "end": "(`)" }, { "include": "source.ts#template-substitution-element" }, { "include": "text.html.basic" }] }, { "begin": "(\\${)", "beginCaptures": { "1": { "name": "entity.name.tag" } }, "end": "(})", "endCaptures": { "1": { "name": "entity.name.tag" } }, "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.js" }] }, { "begin": "(\\$\\(`)", "beginCaptures": { "1": { "name": "entity.name.tag" } }, "end": "(`\\))", "endCaptures": { "1": { "name": "entity.name.tag" } }, "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.js" }] }], "scopeName": "inline.es6-html", "embeddedLangs": ["typescript", "html", "javascript"] });
var es_tag_html = [
  ...typescript,
  ...html,
  ...javascript,
  lang3
];

// node_modules/shiki/dist/langs/es-tag-sql.mjs
var lang4 = Object.freeze({ "fileTypes": ["js", "jsx", "ts", "tsx", "html", "vue", "svelte", "php", "res"], "injectTo": ["source.ts", "source.js"], "injectionSelector": "L:source.js -comment -string, L:source.jsx -comment -string,  L:source.js.jsx -comment -string, L:source.ts -comment -string, L:source.tsx -comment -string, L:source.rescript -comment -string", "injections": { "L:source": { "patterns": [{ "match": "<", "name": "invalid.illegal.bad-angle-bracket.html" }] } }, "name": "es-tag-sql", "patterns": [{ "begin": "(?i)\\b(\\w+\\.sql)\\s*(`)", "beginCaptures": { "1": { "name": "variable.parameter" } }, "end": "(`)", "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.ts#string-character-escape" }, { "include": "source.sql" }, { "include": "source.plpgsql.postgres" }, { "match": "." }] }, { "begin": "(?i)(\\s?\\/?\\*?\\s?(sql|inline-sql)\\s?\\*?\\/?\\s?)(`)", "beginCaptures": { "1": { "name": "comment.block" } }, "end": "(`)", "patterns": [{ "include": "source.ts#template-substitution-element" }, { "include": "source.ts#string-character-escape" }, { "include": "source.sql" }, { "include": "source.plpgsql.postgres" }, { "match": "." }] }, { "begin": "(?i)(?<=\\s|\\,|\\=|\\:|\\(|\\$\\()\\s{0,}(((\\/\\*)|(\\/\\/))\\s?(sql|inline-sql)[ ]{0,1000}\\*?\\/?)[ ]{0,1000}$", "beginCaptures": { "1": { "name": "comment.line" } }, "end": "(`)", "patterns": [{ "begin": "(\\G)", "end": "(`)" }, { "include": "source.ts#template-substitution-element" }, { "include": "source.ts#string-character-escape" }, { "include": "source.sql" }, { "include": "source.plpgsql.postgres" }, { "match": "." }] }], "scopeName": "inline.es6-sql", "embeddedLangs": ["typescript", "sql"] });
var es_tag_sql = [
  ...typescript,
  ...sql,
  lang4
];

// node_modules/shiki/dist/langs/es-tag-xml.mjs
var lang5 = Object.freeze({ "fileTypes": ["js", "jsx", "ts", "tsx", "html", "vue", "svelte", "php", "res"], "injectTo": ["source.ts", "source.js"], "injectionSelector": "L:source.js -comment -string, L:source.js -comment -string, L:source.jsx -comment -string,  L:source.js.jsx -comment -string, L:source.ts -comment -string, L:source.tsx -comment -string, L:source.rescript -comment -string", "injections": { "L:source": { "patterns": [{ "match": "<", "name": "invalid.illegal.bad-angle-bracket.html" }] } }, "name": "es-tag-xml", "patterns": [{ "begin": "(?i)(\\s?\\/\\*\\s?(xml|svg|inline-svg|inline-xml)\\s?\\*\\/\\s?)(`)", "beginCaptures": { "1": { "name": "comment.block" } }, "end": "(`)", "patterns": [{ "include": "text.xml" }] }, { "begin": "(?i)(\\s*(xml|inline-xml))(`)", "beginCaptures": { "1": { "name": "comment.block" } }, "end": "(`)", "patterns": [{ "include": "text.xml" }] }, { "begin": "(?i)(?<=\\s|\\,|\\=|\\:|\\(|\\$\\()\\s{0,}(((\\/\\*)|(\\/\\/))\\s?(xml|svg|inline-svg|inline-xml)[ ]{0,1000}\\*?\\/?)[ ]{0,1000}$", "beginCaptures": { "1": { "name": "comment.line" } }, "end": "(`).*", "patterns": [{ "begin": "(\\G)", "end": "(`)" }, { "include": "text.xml" }] }], "scopeName": "inline.es6-xml", "embeddedLangs": ["xml"] });
var es_tag_xml = [
  ...xml,
  lang5
];

// node_modules/shiki/dist/langs/ts-tags.mjs
var lang6 = Object.freeze({ "displayName": "TypeScript with Tags", "name": "ts-tags", "patterns": [{ "include": "source.ts" }], "scopeName": "source.ts.tags", "embeddedLangs": ["typescript", "es-tag-css", "es-tag-glsl", "es-tag-html", "es-tag-sql", "es-tag-xml"], "aliases": ["lit"] });
var tsTags = [
  ...typescript,
  ...es_tag_css,
  ...es_tag_glsl,
  ...es_tag_html,
  ...es_tag_sql,
  ...es_tag_xml,
  lang6
];
export {
  tsTags as default
};
//# sourceMappingURL=ts-tags-4GMQDS5A.js.map
