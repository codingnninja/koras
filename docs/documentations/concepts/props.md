# Props

Props is the data or properties passed down to a JSX component as its attributes. Props is always an object so you have to use `{}` or `${}` whenever you're passing it down.

:::info
You don't need to wrap { } or ${ } in single or double quotes.
:::

```html
<!-- dynamically -->
<audio id="audio" song="${song}" />
<!-- statically or server-rendered -->
<audio song="{title:'go', url:'song.mp3'}" />
```

`song` is a prop because it is passed to the `Audio` component as one of its attributes.

### Passing down and using a prop

- Passing down an object as a prop

```js
//dynamically
<audio song=${song} />
<audio song={song} />
//statically
<audio song="{title:'go', url:'song.mp3'}" />
```

##### Passing down non-object data type as a prop

To pass down non-object data type, we will add `double quotes("")` and won't use `{}` or `${}` as it is only meant for an object or an array of objects.

- number

```js
//dynamically
<Counter count=${count} />
//statically
<Counter count=${1} />
<Counter count={1} />
```

- funciton

```js
//dynamically
<Post editPost=${editPost} />
<Post editPost={editPost} />
//statically
<Post editPost="function editPost(){ alert('editing'); }" />
```

- string

```js
//dynamically
<Post title=${title} />
<Post title=${title} />
//Or dynamically from an object
<Post title=${post.title} />
//statically
<Post title="How to get things done" />
```

- Boolean

```js
//dynamically
<Shuffle shuffle=${status} />
//or dynamically from an object
<Shuffle shuffle=${song.status} />
//statically
<Shuffle shuffle="true" />
```

##### Using a prop

All props, except functions, are consumed the same way.

- An object

```js
function Audio(song) {
  return `
      <div id="audio" class="${song.show ? "show" : "hide"}">
        <audio src="${song.url}"></audio>
      </div>
    `;
}
```

- A number

```js
const Counter = (count = 0) => {
  return `
      <div id="counter">
        <button 
          onClick="$render(Counter, ${count + 1})" 
          style="height:30px; width:100px">Count is ${count}
        </button>
      </div>
    `;
};
```

- A funciton call as an event value

Any function calls as a reponse to a DOM event like `onhover`, `onclick` and so on must be called directly just like in vanilla JavaScript.

```js
const Post = ({ post, editPost }) => {
  return `
      <div id="post">
        <h1>${post.title}</h1>
        <button 
          onClick="${editPost(post)})" 
          style="height:30px; width:100px"> Edit posst
        </button>
      </div>
    `;
};
```

- Function calls in component body.

You can call a funciton as in JavaScript within the body of a component. In this case, you don't need the `$trigger` utility.

```js copy
const LatestPost = (getLatestPost) => {
  const latestPost = getLatestPost();
  return `
      <div id="post">
        <h1>${latestPost.title}</h1>
        <p>
          ${$latestPost.body}
        </p>
      </div>
    `;
};
```

:::info
Note: Whenever you have to use a string containing `>` `<` and the like in the body of a function, you need to serialize the string.
:::

- boolean

```js
const Repeat = (status = false) => {
  return `
    <div id="repeat">
      <button class="btn-icon toggle">
        <span 
          class="material-symbols-rounded ${status ? "active" : ""}"
          onclick="$render(Repeat, ${!status})"
        >
        ${status ? "repeat_one" : "repeat"}
        </span>
      </button>
    </div>
  `;
};
```

### Passing down and using props

- Passing down props

```js
<audio
  song=${song)}
  autoplaySong=${autoplaySong}
/>
```

- Using props

```js
function Audio({ song, autoplaySong }) {
  return `
      <div id="audio">
        <audio src="${song.url}"></audio>
        <button onClick="${autoplaySong(song)}">Play song</button>
      </div>
    `;
}
```

Yeah! That is how to pass down and use single and multiple props in `koras`.
