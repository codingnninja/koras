import "./chunk-6YEEIP7I.js";

// node_modules/shiki/dist/langs/codeowners.mjs
var lang = Object.freeze({ "displayName": "CODEOWNERS", "name": "codeowners", "patterns": [{ "include": "#comment" }, { "include": "#pattern" }, { "include": "#owner" }], "repository": { "comment": { "patterns": [{ "begin": "^\\s*#", "captures": { "0": { "name": "punctuation.definition.comment.codeowners" } }, "end": "$", "name": "comment.line.codeowners" }] }, "owner": { "match": "\\S*@\\S+", "name": "storage.type.function.codeowners" }, "pattern": { "match": "^\\s*(\\S+)", "name": "variable.other.codeowners" } }, "scopeName": "text.codeowners" });
var codeowners = [
  lang
];
export {
  codeowners as default
};
//# sourceMappingURL=codeowners-OVZ6J4Z4.js.map
