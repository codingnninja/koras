# Modal Components

Modals show components by stacking or popping them up above the main page. There are different needs for modal so it has to be flexible.

### App component

```js
const App = (props) => {
  return `
    <button 
      onClick="$render(LoginModal,'${stringify(items)}')">
      Show login
    </button>
    <button 
      onClick="$render(PriceModal,'${stringify(items)}')">
      Show price
    </button>
    <ModalPlaceholder />
  `;
};
```

### ModalPlaceholder component

```js
const ModalPlaceholder = (status = false) =>
  `<div id="modal" class="${!status ? "hidden" : ""}"></div>`;
```

### PriceModal component

```js
const PriceModal = (items) => {
  return `
    <div id="modal" class="flex h-screen overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-700 text-white">
      <div class="price">
        This modal contains prices of good and services.
      </div>

      <button 
        onClick="$render(ModalPlaceholder)"
        class="block text-white bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        > close </button>
    </div>
  `;
};
```

### LoginModal component

```js
const LoginModal = (props) => {
  return `
    <div id="modal" class="flex h-screen overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-gray-700">
        <div class="relative p-4 w-full max-w-md max-h-full">
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                onClick="$render(ModalPlaceholder)">
                    <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <div class="p-4 md:p-5 text-center">
                    <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                    <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to logint?</h3>
                    <button data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
                        Yes, I'm sure
                    </button>
                    <button
                      onClick="$render(ModalPlaceholder)"
                      type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600">No, cancel</button>
                </div>
            </div>
        </div>
    </div>
  `;
};
```

### Render App

```js
$render(App);
```

- Playground

<iframe src="https://codesandbox.io/embed/qnmlc4?view=Editor+%2B+Preview&module=%2Findex.html"
     width="100%" 
     height="500px"
     title="modal system in render"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
