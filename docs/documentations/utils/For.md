# For utility

`For` is a list-iterator. It is used to map over a list of items.

```js copy
<section id="now-playing">
  Now Playing:
  <For
    id="song-list"
    each="${songs}"
    render="SongComponent"
    fallback="Unknown Song"
  />
</section>
```

`For` expects `id`, `each`, `render`, `position` and `fallback` as parameters.

- `id` is used to identify the iterator.
- `each` is equal to the list of items.
- `render` is equal to the component to render.
- `postion` is equal to where to add the list - append or prepend.
- `fallback` is equal to the output when the operation fails. It can be a string or a component.

`For` should only be used instead of `.map()` to avoid template literals headache while dealing with deeply nested tags and components.
