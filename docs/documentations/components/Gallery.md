# Image Gallery

Image gallary displays images in sequence.

:::info
Note: Use Tailwind CSS to view Gallary properly.
:::

### Import $render utilities

```js
import { $render, stringify } from "@codingnninja/render";
```

### Gallery component

```js
const Gallary = () => {
  const images = [
    {
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
      alt: "",
    },
    {
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
      alt: "",
    },
    {
      src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
      alt: "",
    },
  ];

  return `
      <div 
        class="grid gap-4"
        id="gallary">
        <CurrentImage image=${images[0]} />
        <Pagination images=${images}/>
      </div>
    `;
};
```

### Pagination component

```js
const Pagination = (images) => {
  return `
      <div 
        class="grid grid-cols-5 gap-4"
        id="pagination">
        ${images.map((image, key) => {
          return `
          <div id="${key}">
            <img
              onClick="$render(CurrentImage, ${image})"
              class="h-auto max-w-full rounded-lg" 
              src=${image.src}
            />
          </div>
        `;
        })}
      </div>
    `;
};
```

### CurrentImage component

```js
const CurrentImage = ({ src, alt }) => {
  return `
      <div id="current-image">
        <img class="h-auto max-w-full rounded-lg" src="${src}" alt="${alt}">
      </div>
    `;
};
```

### Render Gallery

```js
$render(Gallery);
```

- Playground

  <iframe src="https://codesandbox.io/embed/yq4sn7?view=Editor+%2B+Preview&module=%2Findex.html"
     width="100%" 
     height="500px"
     title="wandering-voice-yq4sn7"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
