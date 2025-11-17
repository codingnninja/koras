import terser from "@rollup/plugin-terser";

export default [{
  input: {
    render: 'src/render/index.js',
    query: 'src/query/index.js',
  },

  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: 'esm/[name].js',
    sourcemap: true,
  },
  preserveEntrySignatures: 'strict',
},

{
  input: {
    render: 'src/render/index.js',
    query: 'src/query/index.js',
  },

  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: 'esm/[name].min.js',
    sourcemap: true,
  },
  plugins: [terser()],
  preserveEntrySignatures: 'strict',
}
];