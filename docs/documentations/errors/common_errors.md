# Common Errors in $render

This is the documentation for possible errors in $render.

### Design mistakes

- Prop drilling

### Runtime errors:

- ReferenceError: $render is not defined

This happens when `$render` is not installed, properly imported or linked.

### Error [object Object]

Whenever you get `[object Object]` as an error in `$render.jsx`, you're most likely to have not registered your component with `$register`.