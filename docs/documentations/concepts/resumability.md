# Resumability

It is the ability of a component to change (stop, pause or continue) initiated operations without the need to re-hydrate and re-render. Imagine an `Audio` component playing a song. If you pause the song, instead of the component to re-render, it will trigger the audio element to stop or resume when necessary.

That is resumability in the context of `koras`.

`$select` and `$render` utilities make it possible to change operations of any elements in a `koras` component without re-rendering and re-hydration like in `React`.

Learn more about [$select](../utils/$select).
