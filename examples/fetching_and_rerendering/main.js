import { $render, $register, $select } from "../../dist/esm/koras.min.js";

// const { $render, $register, stringify, $select, $purify } = render;
const audioUrL = "a";

//broke json.stringify so I fixed it by implementing my own stringify
const imagess = [
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg",
    alt: "Ayoba_mope",
    mo: { y: [{ o: "ayo" }] },
    age: 40,
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg",
    alt: "Ope",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg",
    alt: "",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg",
    alt: "",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg",
    alt: "",
  },
  {
    src: "https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg",
    alt: "",
  },
];

//Used initially
const images = [
  {src:"https://flowbite.s3.amazonaws.com/docs/gallery/square/image-1.jpg", alt:"Ayoba_mope", mo:{y:[{o:'ayo'}]}, age:40},
  {src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-2.jpg", alt:""},
  {src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-3.jpg", alt:""},
  {src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-4.jpg", alt:""},
  {src: "https://flowbite.s3.amazonaws.com/docs/gallery/square/image-5.jpg", alt:""},
  {src: "https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg", alt:""}
];

const deeplyNested = [
  {
    label: "first",
    id: 1,
    children: [],
  },
  {
    label: "second",
    id: 2,
    children: [
      {
        label: "third",
        id: 3,
        children: [
          {
            label: "fifth",
            id: 5,
            children: [],
          },
          {
            label: "sixth",
            id: 6,
            children: [
              {
                label: "seventh",
                id: 7,
                children: [],
              },
            ],
          },
        ],
      },
      {
        label: "fourth",
        id: 4,
        children: [],
      },
    ],
  },
];

const details = {
  images: imagess,
  name: "John",
  age: 30,
  data: [
    {
      id: 1,
      name: `John Doe`,
      age: 30,
      address: {
        street: "123 Main St",
        city: "Anytown",
        country: "USA",
      },
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 25,
      address: {
        street: "456 Elm St",
        city: "Othertown",
        country: "USA",
      },
    },
    {
      id: 3,
      name: "Alice Johnson",
      age: 35,
      address: {
        street: "789 Oak St",
        city: "Another town",
        country: "USA",
      },
    },
  ],
  address: {
    street: "123 Main St",
    city: "New York",
  },
  hobbies: ["reading", "cooking", "traveling"],
  func: function () {},
  complexData,
};

function complexData() {
  const complexItems = {
    map: new Map([
      ["a", 1],
      ["b", 2],
    ]),
    weakMap: new WeakMap(),
    set: new Set([1, 2, 3]),
    weakSet: new WeakSet(),
    bigInt: BigInt(123),
  };

  return complexData;
}

function memoize() {
  alert("working");
}

const state = {
  details,
  images,
  memoize,
  play,
  pause,
  setVolume,
  deeplyNested,
};

function App(props) {
  const { images, play } = props;
  return `
        <div id="app" style="color: #000;" class="hide">
          <Counter /><!-- It should count={0} should be made to work or give validation error.-->
          <Home 
            images=${props.images} 
            deeplyNested=${props.deeplyNested}
            details=${props.details}
            play=${props.play}
            user=${{ images }}
          />
          <AddTodoForm />
          <Others {...props} e="{true}" d="${1}" a="${() => new Map()}" audioUrL="a.mp3" anotherOne="nothing" />
        </div>
      `;
}
//c="{{a:[1, {b: "ayobami"}]}}" <Users />
export function Defer({ id, component, props }) {
  return `
        <div id="${id}" data-render="defer">
          <img src="https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif" style="width:32px" loading="lazy"> loading...
          <iframe 
            onload="$render(${component}, '${stringify(props)}')" height="0">
          </iframe>
        </div>
      `;
}

const Home = ({ images, deeplyNested, ya, user }) => {
  const test = {
    student: {
      names: {
        first: "ayo",
      },
    },
  };

  return ` 
      <div id="page">
        <Gallary> 
          <CurrentImage 
            src='{images[0].src}' 
            alt={images[0].alt}
            yes={test}
          />
          <Pagination images="{images}" />
        </Gallary>
      </div>
    `;
};
const Others = (props) => {
  console.log(props);
  const { images, play, pause, setVolume, audioUrL, memoize } = props;
  return ` 
      <div id="page">
        <AudioPlayer
          images=${images} 
          audioUrL=${audioUrL}
          play=${play}
          pause=${pause}
          setVolume=${setVolume}  
        />
        <button onClick="${memoize()}">alert</button>
      </div>
    `;
};

function InsertionTest() {
  return`
    <div id="intest" data-after="#counter">
      It works;
    </div>
  `
}

const Counter = (count = 0) => {
  const memoize = () => {
    alert("working")
    console.log("works");
  };

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
        <button onClick="${memoize(1)}">alert</button>
      </div>
    `;
};

const Gallary = ({ children }) => {
  return `
        <div 
          class="grid gap-4"
          id="gallary">
          ${children}
        </div>`;
};
const Pagination = ({ images }) => {
  const listItems = images.map(
    (image, key) => `
        <div id="${key}">
          <img
            onClick="$render(CurrentImage, ${image})"
            class="h-auto max-w-full rounded-lg" 
            src="${image.src}"
          />
        </div>
      `
  );

  return `
        <div 
          class="grid grid-cols-5 gap-4"
          id="pagination">
          ${listItems}
        </div>
      `;
};
const CurrentImage = ({ src, alt, yes }) => {
  // jjdjd
  /* kdkdk */
  return `
        <div id="current-image">
          <img class="h-auto max-w-full rounded-lg" src="${src}" alt="${alt}">
        </div>
      `;
};

function AudioStatus({ msg }) {
  return `<div id="audioStatus" class="bg-indigo-800 text-white">${msg}</div>`;
}
function play(params) {
  const audio = $select(params.selector);
  console.log(audio)
  // audio.play();
  $render(AudioStatus, { msg: "Playing" });
}
function pause(params) {
  const audio = $select(params.selector);
  console.log(audio);
  // audio.pause();
  $render(AudioStatus, { msg: "Paused" });
}

function setVolume(params) {
  const elements = $select(params.selector);
  console.log(elements);
  console.log("it works");
  return (elements[0].volume = elements[1].value);
}

function AudioPlayer(props) {
  const { images, audioUrL, play, pause, setVolume } = props
  const yoo = { fac: (a) => a };

  return `
      <audio src="${audioUrL}" id="myAudio"></audio>
      <button 
        onClick="${play({
          item: images,
          selector: "#myAudio",
        })}" class="m-3">Play Audio </button> 
      <button 
        onClick="${pause({ selector: `#myAudio` })}"> Pause Audio </button>
      <input type="range" id="volume" min="0" max="1" step="0.01" value="1"
        onChange="${setVolume({ selector: `#myAudio, #volume` })}">
      <button onClick="{console.log(Math.floor(5.2))}" >do something</button>
      <p id="audioStatus" class="text-center"></p>
    `;
}

const Users = async () => {
  const response = await fetch("https://randomuser.me/api?results=30");
  const users = await response.json();

  return `
      <div id="users" data-append="#list">
        <h1 class="text-3xl">User list</h1>
        <ul class="list" id="list">
          ${users.results.map(
            (user) =>
              `<li class="item">
              <img src="${user.picture.medium}" loading="lazy">
              <p class="name">${user.name.first}</p>
            </li>`
          )}
        </ul>
          <button 
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-5"
            onClick="$render(Users)">Load more users...</button>
      </div>
    `;
};

const AddTodoForm = (id = 0) => {
  const todoForm = $select(`#todo-form>:nth-last-child(2)`);
  id = todoForm ? Number(todoForm.dataset.id) + 1 : id;

  return `
    <div 
      id="todo-form"
      class="todo-form" 
      data-append="#todo-form"
    >
      <input type="text" id="input-${id}" data-id="${id}">
    </div>
    <button onclick="$render(AddTodoForm)">plus</button>
  `;
};

function RenderErrorLogger({ error }) {
  console.error(error);
  console.log("This is called by render internal");
  return "";
}

console.log($select(".post[0], .post[add|class=rubbish fade]"));
console.log($select(".post:not(#e3)"));
console.log($select(".post[filterOut|textContent=*m]"));
console.log($select(".post[sort|order=lengthSortAsc]"));
console.log($select(".price[sort|order=shuffle]"));

const start = performance.now();

console.log(
  $select(`
    .post[id~=e3],
    .post:not(#e3)  
  `)
);

$register(
  InsertionTest,
  AddTodoForm,
  Users,
  Home,
  Others,
  Defer,
  Counter,
  Gallary,
  Pagination,
  CurrentImage,
  AudioStatus,
  AudioPlayer,
  RenderErrorLogger
);

const starta = performance.now();
const a = await $render(App, state);
const end = performance.now();

const duration = end - starta;
console.log(duration);

