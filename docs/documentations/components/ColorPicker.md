# Tailwind ColorPicker

Dynamic color picker component for Tailwind color classes.

## PickerIndicatorRenderer

```js
function PickerIndicatorRenderer({ color }) {
  $render(PickerIcon, { color });
  $render(ColorCodeIndicator, { colorCode: color });
  return "";
}
```

## PickerIcon

```js
function PickerIcon({ color }) {
  const pickerIconColor =
    Number(color.split("-")[1]) >= 500 ? "text-white" : "";

  return `
    <div id="pickerIcon"
      <button type="button"
        class="picker-icon w-10 h-10 rounded-full focus:outline-none focus:shadow-outline inline-flex p-2 shadow bg-${color}"
      >
        <svg onclick="$select('#colors[toggle|class=hidden]')" class="w-6 h-6 fill-current ${pickerIconColor}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path fill="none" d="M15.584 10.001L13.998 8.417 5.903 16.512 5.374 18.626 7.488 18.097z"/>
          <path d="M4.03,15.758l-1,4c-0.086,0.341,0.015,0.701,0.263,0.949C3.482,20.896,3.738,21,4,21c0.081,0,0.162-0.01,0.242-0.03l4-1 c0.176-0.044,0.337-0.135,0.465-0.263l8.292-8.292l1.294,1.292l1.414-1.414l-1.294-1.292L21,7.414 c0.378-0.378,0.586-0.88,0.586-1.414S21.378,4.964,21,4.586L19.414,3c-0.756-0.756-2.072-0.756-2.828,0l-2.589,2.589l-1.298-1.296 l-1.414,1.414l1.298,1.296l-8.29,8.29C4.165,15.421,4.074,15.582,4.03,15.758z M5.903,16.512l8.095-8.095l1.586,1.584 l-8.096,8.096l-2.114,0.529L5.903,16.512z"/>
        </svg>
      </button>
    </div>
  `;
}
```

## ColorCodeIndicator

```js
function ColorCodeIndicator({ colorCode }) {
  return `<div id="color-code-indicator" class="border border-transparent shadow px-4 py-2 leading-normal text-gray-700 bg-white rounded-md focus:outline-none focus:shadow-outline mb-2 cursor-pointer" style="font-weight:700">color code: ${colorCode}</div>`;
}
```

## ColorPicker

```js
function ColorPicker(color = "indigo-900") {
  const colors = [
    "gray",
    "indigo",
    "blue",
    "red",
    "yellow",
    "green",
    "purple",
    "pink",
  ];
  const variants = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

  return `
   <div id="color-picker">
      <div class="relative ml-3 mt-8">
        <div class="origin-top-right absolute right-80 mt-2 w-80 rounded-md">
          <PickerIcon color="${color}" />
          <div class="rounded-md bg-white shadow-xs px-4 py-3" id="colors">
            <ColorCodeIndicator colorCode=${color} />
            <div class="flex flex-wrap -mx-2">
          ${colors.map((color) =>
            variants.flatMap((variant, index) => {
              const props = {
                color: `${color}-${variant}`,
              };
              return `
                <div class="color w-8 h-8 inline-flex rounded-full cursor-pointer border-4 border-white bg-${color}-${variant} ${
                !index ? `focus:outline-none focus:shadow-outline` : ``
              }" onclick="$render(PickerIndicatorRenderer, ${props})"></div>

            `;
            })
          )}
          </div>
        </div>
      </div>
   </div>
  `;
}
```

## $render ColorPicker

```js
$register(
  PickerIcon,
  PickerIndicatorRenderer,
  PickerIcon,
  ColorCodeIndicator,
  ColorPicker
);

$render(ColorPicker);
```
