# If utility

If is an utility in koras to handle conditional rendering to avoid template literals headache with deeply nested tags.

```js copy
<section id="app">
  <If condition="${ step > 1}">
    <span> Step is greater than ${step}.</span>
  </If>
  <If condition="${ step === 10}">
    <span> Step is greater than ${step}.</span>
  </If>
</section>
```

It is comfortable to write nested html tags in If statements than using template literals.
