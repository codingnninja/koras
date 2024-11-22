import terser from "@rollup/plugin-terser";
import pkg from "./package.json" with { "type": "json" };

export default [
  {
    input: "src/index.js",
    output: [{ name: "koras", file: pkg.module, format: "es" }],
  },
  {
    input: "src/index.js",
    output: [{ name: "koras.min", file: pkg.module_min, format: "es" }],
    plugins: [
      terser()
    ],
  },
];
