# Utils

Utils are general purpose functions that are used across components, modules and files. Utils are usable in `Koras` via `import()`, `import` and `globalThis` but we recommend using `Koras` components in most cases.

## Component as utils

```js copy
function Storage({ prefix = "" } = {}) {
  const keyOf = (key) => `${prefix}${key}`;

  return {
    get(key, defaultValue = null) {
      try {
        const raw = localStorage.getItem(keyOf(key));
        if (raw === null) return defaultValue;
        return JSON.parse(raw);
      } catch (e) {
        console.warn("Storage.get error:", e);
        return defaultValue;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(keyOf(key), JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn("Storage.set error:", e);
        return false;
      }
    },

    remove(key) {
      localStorage.removeItem(keyOf(key));
    },

    clear() {
      if (!prefix) {
        localStorage.clear();
        return;
      }

      // clear only prefixed keys
      Object.keys(localStorage).forEach((k) => {
        if (k.startsWith(prefix)) {
          localStorage.removeItem(k);
        }
      });
    },
  };
}
```

-Usage:

```js
$register({ Storage });
const store = Storage({ prefix: "app_" });

store.set("user", { name: "Ayo" });

const user = store.get("user");
console.log(user.name); // Ayo
```

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

You can create modules and `import()` within a component.

```js
export async function Publish() {
  const { default: matter } = await import(_$utils.links.matter);
  const htmlParsers = await import(_$utils.links.htmlParsers);
  //the rest of the code
}
```
