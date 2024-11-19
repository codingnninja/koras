# $select utility

$select is a unified utility to access the DOM. It accesses single and multiple elements with JavaScript. $select returns an element or an `array` of found elements but returns `null` for any element not found. It supports all `CSS selectors`.

It's like `import` for the DOM.

```js
$select("selector(s)");
```

:::info

- You can write as many as possible custom selections and constrains so you're not limited to the examples in this section.

- It is recommended to use `backticks` with `$select` in a function but you can use whatever you like if you know what you're doing.

:::

## Quick demo

```html copy
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body>
    <div id="root">
      <div class="audio"></div>
      <div class="post">first</div>
      <div class="post">second</div>
      <div class="post">third</div>
      <div class="post">fourth</div>
      <div class="comment"></div>
      <div class="comment"></div>
      <div class="comment"></div>
      <div class="comment"></div>
      <div class="result"></div>
    </div>
    <script type="module">
      import { $select } from "https://cdn.jsdelivr.net/npm/@codingnninja/render/dist/esm/render.min.js";
      const [audio, posts, comments] = $select(".audio, .post, .comment");
      const firstPost = $select(".post[0]");
      const forthPost = $select(".post[3]");
      console.log(audio, firstPost, forthPost);
      posts.map((post) => console.log(post));
      comments.map((comment) => console.log(comment));

      console.log($select(".post[0], .post[add|class=rubbish fade]"));
      console.log($select(".post:not(#e3)"));
      console.log($select(".post[filterOut|textContent=*m]"));
      console.log($select(".post[sort|order=lengthSortAsc]"));
      console.log($select(".post[sort|order=shuffle]"));
      console.log(
        $select(`
            .post[id~=e3],
            .post:not(#e3)  
        `)
      );
    </script>
  </body>
</html>
```

- Playground

   <iframe src="https://codesandbox.io/embed/zktczg?view=Editor+%2B+Preview&module=%2Findex.html&expanddevtools=1"
     width="100%" 
     height="500px" 
     border="0"
     title="select"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

:::info
Note: always make sure selectors are separated by commas and destructured variables should correspond to the selectors.
:::

## Regular selections

- #### Select an element

```js copy
const audio = $select("#audio");
console.log(audio);
```

- #### Select grouped elements

Elements selected with a `class`, `tag` and other group `selectors` are grouped into an array.

```js
const posts = $select(".post");
posts.map((post) => console.log(post));
```

- #### Select multiple elements

Select multiple elements including single and grouped elements.

```js
const [audio, posts, comments] = $select("#audio, .post, .comment");

console.log(audio);

posts.map((post) => console.log(post));

comments.map((comment) => console.log(comment));
```

- #### Selection with attributes

```js
const [logo, article] = $select('a[class~="logo"], [article]');
```

- #### Selection with psuedo-selectors

```js
const [activeSong, queuedSongs] = $select(
  ".audio:is(.playing), .audio:not(.playing)"
);
```

- #### A more complex selection

```js
const [
    posts,
    comments,
    audios,
    features
    articles,
    navs,
    queuedSongs
] = $select('posts, comments, .audios, #features>.feature, [article], .nav, .audio:not(.playing)');
```

- #### Handling variable re-assignment with $select

It is recommended to use `$select` with `const` until you need to re-assign a variable. Then, you can select such a variable separately using `$select` and `let`.

```js
const [audio, posts, comments] = $select("#audio, .post, .comment");
```

So when you need to re-assign the `audio` element, you can re-write the code snippet.

```js
let audio = $select("#audio");
const [posts, comments] = $select(".post, .comment");
```

Going with `const` and `$select` by default helps to avoid unnecessary bugs.

`$select` is a unified utility to access the DOM.

- #### Handling self-selection in a component

Self-selection is when a componet selects an element within itself. Self-selection will return undefined in the first rendering because the elements selected won't be available in the DOM.

So, it is necessary to check if the selected elements are available whenever a component self-select.

```js
const Volume = (song) => {
  const volumeBtn = $select("#volumeBtn");
  if (volumeBtn) {
    // use volumeBtn here
  }
  // the rest of the component without using audio
};
```

## Selection by index

Select an item from a group of items using an index.

- #### select the first post

```js
const const firstPost = $select('.post[0]');
```

- #### select the sixth post

```js
const const seventhDiv = $select('div[6]');
```

## Selections with constraints

Selection with constraints allows you to `delete`, `filter`, `search`, `sort`, `add`, `toggle` and `remove` elements using attributes and values.

You can use any attributes such as `class`, `textContent`, `id` and so on in constraints.

### Constrainst operators

- Equality operator ( = )
- Inequality operators ( >, <, >=, <=, !=)
- Incremental operator (+=)
- Decremental operator (-=)
- Fuzzy match operator (=\*)

### A single constraint

Single constraint is used to set an attribute or value of an element or elements in a selection.

```js
const posts = $select(".post[add|class=hidden]");
```

`[add|class=hidden]` is a single constraint because it only add class name to the `class` attributes of the elements selected.

### Grouped constraints

You can use as many as possible constraints on a selection.

```js
const targetPost = $select(".post[filterIn|id=3, toggle|class=hidden]");
```

### Multiple selections with grouped constraints

You can use multiple `selectors` with as many as possible constraints.

```js
const [targetPost, comment] = $select(`
  .post[filterIn|id=3, toggle|class=hidden],
  .comments[add|class=animate bounce, sort|order=shuffle]
`);
```

### $select and `add` attributes or values with constraints

> Set audio `id` to `3`

```js
const currentPost = $select("#audio[add|id=3]");
```

> Hide all posts

```js
const currentPost = $select(".post[add|class=hidden]");
```

> Show all posts and make them slide in.

```js
const posts = $select(".post[remove|class=hidden, add|class=slideIn]");
```

### $select and delete with constraints

> Delete any post with `id` > 3

```js
const remainingPosts = $select(".post[delete|id>3]");
```

> Delete any post with `id` < 3

```js
const remainingPosts = $select(".post[delete|id<3]");
```

> Delete the post with `id` = 3

```js
const remainingPosts = $select(".post[delete|id=3]");
```

> Delete the post with value "yeah"

```js
const remainingPosts = $select(".post[delete|textContent=yeah]");
```

> Delete any posts that contain "yeah" in its class attribute

```js
const remainingPosts = $select(".post[delete|class=*yeah]");
```

> Delete all posts where `id` is less or equals to `4`

```js
const remainingPosts = $select(".post[delete|id<=4]");
```

- ### $select and filter with constraint

`filter` is a constraint that uses attributes and values to exclude or include elements. It doesn't mutate the `DOM`.

> Return posts with `id` 3 or less

```js
const remainingPosts = $select(".post[filterOut|id>3]");
```

> Return only post with `id` 3

```js
const targetPost = $select(".post[filterIn|id=3]");
```

> Return only the posts not containing `ty` in `id` value.

```js
const targetPosts = $select(".post[filterOut|id=*ty]");
```

- ### $select and sort with constraints

`sort` is a constraint that uses `textContent` to order elements. It mutates the `DOM`.

> Shuffle

```js
const shuffledPosts = $select(".post[sort|order=shuffle]");
```

> Ascending order for alphabets

```js
const posts = $select(".post[sort|order=ascAlphabet]");
```

> Descending order for alphabets

```js
const reversedPosts = $select(".post[sort|order=descAlphabet]");
```

> Ascending order for numbers

```js
const posts = $select(".post[sort|order=ascNumber]");
```

> Descending order for numbers

```js
const posts = $select(".post[sort|order=descNumber]");
```

> Length sorting ascending order

```js
const posts = $select(".post[sort|order=lengthSortAsc]");
```

> Length sorting descending order

```js
const posts = $select(".post[sort|order=lengthSortDesc]");
```

### $select and search with constraints

`search` a is constraint similar to `filter` but it changes elements directly in the `DOM`. It can match any value of an attribute or text content of an element.

> Fuzzy match elements containing input

```js
//usage as an event handler.
$select("tr[search|textContent=*" + this.value + "]");

//usage in a component
const matchedRows = $select(`.row[search|textContent=*${searchTerm}]`);
```

[Click to check]() the common errors in using `$select`.
