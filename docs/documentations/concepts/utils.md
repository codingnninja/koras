# Utils

Utils are general purpose functions that are used across components, modules and files. Utils are usable in `Koras` via `import()`, `import` and `globalThis` but we recommend you use `import()` in most cases for modularity.

### Utils via globalThis

You can create a simple globally accessible utils like below:

```js
const utils = {
  links: {},
  doSomething() {},
};

globalThis["_$utils"] = utils;

//call it anywhere on a page
_$utils.doSomething();
```

### Utils via import()

You can create modules and import them with `import` at the top level of a file or `import()` within a component.

```js
export async function Publish() {
  const { default: matter } = await import(_$utils.links.matter);
  const htmlParsers = await import(_$utils.links.htmlParsers);
  //the rest of the code
}
```
