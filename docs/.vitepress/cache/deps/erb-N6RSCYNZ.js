import {
  ruby
} from "./chunk-7FQCCQF7.js";
import "./chunk-6T2LC7RG.js";
import "./chunk-NP4HN5VT.js";
import "./chunk-W4NDYE43.js";
import "./chunk-23YUXMDY.js";
import "./chunk-WETO2DSL.js";
import "./chunk-A4BXN6LK.js";
import {
  html
} from "./chunk-TFYF4XTK.js";
import "./chunk-WXM4ZQL6.js";
import "./chunk-VIVHTQ6A.js";
import "./chunk-6YEEIP7I.js";

// node_modules/shiki/dist/langs/erb.mjs
var lang = Object.freeze({ "displayName": "ERB", "fileTypes": ["erb", "rhtml", "html.erb"], "injections": { "text.html.erb - (meta.embedded.block.erb | meta.embedded.line.erb | comment)": { "patterns": [{ "begin": "(^\\s*)(?=<%+#(?![^%]*%>))", "beginCaptures": { "0": { "name": "punctuation.whitespace.comment.leading.erb" } }, "end": "(?!\\G)(\\s*$\\n)?", "endCaptures": { "0": { "name": "punctuation.whitespace.comment.trailing.erb" } }, "patterns": [{ "include": "#comment" }] }, { "begin": "(^\\s*)(?=<%(?![^%]*%>))", "beginCaptures": { "0": { "name": "punctuation.whitespace.embedded.leading.erb" } }, "end": "(?!\\G)(\\s*$\\n)?", "endCaptures": { "0": { "name": "punctuation.whitespace.embedded.trailing.erb" } }, "patterns": [{ "include": "#tags" }] }, { "include": "#comment" }, { "include": "#tags" }] } }, "name": "erb", "patterns": [{ "include": "text.html.basic" }], "repository": { "comment": { "patterns": [{ "begin": "<%+#", "beginCaptures": { "0": { "name": "punctuation.definition.comment.begin.erb" } }, "end": "%>", "endCaptures": { "0": { "name": "punctuation.definition.comment.end.erb" } }, "name": "comment.block.erb" }] }, "tags": { "patterns": [{ "begin": "<%+(?!>)[-=]?(?![^%]*%>)", "beginCaptures": { "0": { "name": "punctuation.section.embedded.begin.erb" } }, "contentName": "source.ruby", "end": "(-?%)>", "endCaptures": { "0": { "name": "punctuation.section.embedded.end.erb" }, "1": { "name": "source.ruby" } }, "name": "meta.embedded.block.erb", "patterns": [{ "captures": { "1": { "name": "punctuation.definition.comment.erb" } }, "match": "(#).*?(?=-?%>)", "name": "comment.line.number-sign.erb" }, { "include": "source.ruby" }] }, { "begin": "<%+(?!>)[-=]?", "beginCaptures": { "0": { "name": "punctuation.section.embedded.begin.erb" } }, "contentName": "source.ruby", "end": "(-?%)>", "endCaptures": { "0": { "name": "punctuation.section.embedded.end.erb" }, "1": { "name": "source.ruby" } }, "name": "meta.embedded.line.erb", "patterns": [{ "captures": { "1": { "name": "punctuation.definition.comment.erb" } }, "match": "(#).*?(?=-?%>)", "name": "comment.line.number-sign.erb" }, { "include": "source.ruby" }] }] } }, "scopeName": "text.html.erb", "embeddedLangs": ["html", "ruby"] });
var erb = [
  ...html,
  ...ruby,
  lang
];
export {
  erb as default
};
//# sourceMappingURL=erb-N6RSCYNZ.js.map
