# Fetchers

Fetchers are data fetching components. They are components that render view and fetch data for necessary operations. They're reusable and composable.

You can even fetch `html` string from servers just like `htmx` and render it using `koras.jsx` with ease.

### Quick demo

- A working example of fetcher

```js copy
const Users = async () => {
  const response = await fetch("https://randomuser.me/api?results=30");
  const users = await response.json();

  return `
      <div id="users" data-replace="#list">
        <h1 class="text-3xl">User list</h1>
        <ul class="list" id="list">
          ${users.results.map((user) => {
            return `
                <li class="item">
                  <img src="${user.picture.medium}">
                  <p class="name">${user.name.first}</p>
                </li>
              `;
          })}
          </ul>
          <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5"
            onClick="$render(Users)">Load more users...</button>
      </div>
    `;
};
```

- Playground

<iframe src="https://codesandbox.io/embed/hwdm3g?view=Editor+%2B+Preview&module=%2Findex.html"
     width="100%" 
     height="500px"
     title="UsersModel"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

- Data fetching component with an arrow function

```js
const Users = (props) => {
  return `
    <div id="users">
      <ul id="#componentId" data-prepend="#componentId">
        <li>Item 1</li>
      </ul>
      <!-- the rest of the component -->
    </div>
  `;
};
```

- Data fetching component with a native function

```js
function Users(props) {
  return `
    <div id="users">
      <ul id="#componentId" data-prepend="#componentId">
        <li>Item 1</li>
      </ul>
      // the rest of the component
    </div>
  `;
}
```

### Content placement attributes

There are six attributes and you have to use one of them whenever you use a data fetching component or place some elements in another. They are:

1. data-replace

```html
<ul id="componentId" data-replace="#componentId">
  <li>Item 1</li>
</ul>
```

`data-replace="#componentId"` means an updated version is set to replace the element with id `#componentId`. `data-replace` should be added to a data fetching component to replace an element with an updated version.

2. data-append

```html copy
<ul id="componentId" data-append="#componentId">
  <li>Item 1</li>
</ul>
```

`data-append="#componentId"` means more items should be appended to the element with id `#componentId`. `data-append` should be added to a data fetching component to append more items.

3. data-prepend

```html copy
<ul id="#componentId" data-prepend="#componentId">
  <li>Item 1</li>
</ul>
```

`data-prepend="#componentId"` means more items should be prepended to an element with id `#componentId`. `data-prepend` should be added to a data fetching component to prepend more items.

4. data-before

```html copy
<ul id="#componentId" data-before="#targetComponentId">
  <li>Item 1</li>
</ul>
```

`data-before="#componentId"` is used to insert a component before another component.

5. data-after

```html copy
<ul id="#componentId" data-after="#targetComponentId">
  <li>Item 1</li>
</ul>
```

`data-after="#componentId"` is used to insert a component before another component.

6. data-fallback

```html copy
<ul id="#componentId" data-fallback="fetching...">
  <li>Item 1</li>
</ul>
```

`or`

```js
function Loading(targetId) {
  //do something
  return "fetching";
}

$register(Loading);
```

Now, use the component as a fallback.

```html copy
<ul id="#componentId" data-fallback="Loading">
  <li>Item 1</li>
</ul>
```

`data-fallback="ComponentOrText"` is used to set a fallback text or component for a `Fetcher` while fetching data. If you don't add `data-fallback` to a `Fetcher`, it uses `loading...` by default.

:::info
Extra: We also have `data-defer` to prevent a component from running on the server.
:::

### Calling a fetcher

- Use a fetcher as a component
  > Without props

```html
<Users />
```

`Or`

```js
$render(Users);
```

> With props

```js
//Dynamically
<Users users=${users} />
or
$render(Users, ${users})


//Statically
<Users users="[{}, {}, {}]" />
or
$render(Users, [{}, {}, {}])

// Use as as event handler
<button onClick="$render(Users, ${users}">
  Load users
</button>
```

<!-- ## Static fetchers

Static fetchers are fetchers that can't get `props` via `$render` instead they depend on the `DOM` to determine the next update.

They either put static re-rendering `triggers` outside of a component wrapping `<div>` so that they won't re-render or are inserted outside of the current component.

### Static re-rendering `trigger`

```js
const AddTodoForm = (id = 0) => {
  const todoForm = $select(`#todo-form>:nth-last-child(2)`);
  id = todoForm ? Number(todoForm.dataset.id) + 1 : id;

  return `
    <div
      id="todo-form"
      class="todo-form"
      data-append="#todo-form"
    >
      <input id="input-${id}" data-id="${id}">
    </div>
    <button onclick="$render(AddTodoForm)">plus</button>
  `;
};
```

`AddTodoForm` avoids putting the button inside of `#todo-form`. If you do so, the button will be repeated unexpectedly.

### Streaming pages

````js
async function Articles() {
  const page = $select(`#article-page`);
  const nextPage = page ? Number(page.value) + 1 : 1;

  if (page) {
    page.value = nextPage;
  }

  const articles = await sapabase.loadData(nextPage);

  return `
    <input type="hidden" value="${nextPage}" id="article-page">
    <div id="articles" data-append="#articles">
      ${
        !articles.status
          ? articles.map((article) => {
              return `
          <div id="article-${article.id}" class="article">
            <h1>${article.title}</h1>
            <img src="${article.cover_image}">
            <div class="tags">
              ${article.tags
                .split(",")
                .map((tag) => `<div class="tag">${tag}</div>`)}
            </div>
            <div class="created_at">
              Published on: ${new Date(article.createdAt).toLocaleDateString()}
            </div>
            <div
              class="content truncate-multiline"
              onclick="$select('#article-${
                article.id
              }>.content[toggle|class=truncate-multiline]')">
              ${article.content
                .replace(/```js([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
                .replace(/\n/g, "<br>")}
            </div>
          </div>
        `;
            })
          : "<div>No more article or you have read a lot of articles so come back in the next one hour</div>"
      }
    </div>
    <button type="button" onclick="$render(Articles)">Load more...</button>
  `;
}
```` -->

### Inserting a component outside of current component

In this case, fetcher attributes `data-after` or `data-before` must be used to insert component before or after another component.

```js
function InsertionTest() {
  return `
    <div id="insertion-test" data-after="#counter">
      It works;
    </div>
  `;
}

const Counter = (count = 0) => {
  return `
      <div id="counter">
      <div>${count}</div>
        <button 
          onClick="$render(Counter, ${count + 1})" 
          style="height:30px; width:50px">Increase
        </button>
        <button 
          onClick="$render(InsertionTest)">Before
        </button>
      </div>
    `;
};
```

`InsertionTest` component will be inserted after `Counter` component.
