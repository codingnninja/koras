import { $render, $register, If} from "../../dist/esm/koras.js";
import { $select} from "../../dist/esm/query.js";

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
          <ListItems />
          <Counteral />
          <CounterFib />
          <Counter /><!-- It should count={0} should be made to work or give validation error.-->
          <Home 
            images=${props.images} 
            deeplyNested=${props.deeplyNested}
            details=${props.details}
            play=${props.play}
            user=${images}
          />
          <AddTodoForm />
          <Others {...props} e="{true}" d="${1}" audioUrL="a.mp3" anotherOne="nothing" />

          <TodoList />
        </div>
      `;
}
//c="{{a:[1, {b: "ayobami"}]}}" <Users />
export function Defer({ id, component, props }) {
  return `
        <div id="${id}" data-render="defer">
          <img src="https://cdn.pixabay.com/animation/2023/08/11/21/18/21-18-05-265_512.gif" style="width:32px" loading="lazy"> loading...
          <iframe 
            onload="$render(${component}, ${props})" height="0">
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
            src='${images[0].src}' 
            alt="${images[0].alt}"
            yes="{test}"
            something="{{test}}"
          />
          <Pagination images="{ images }" yes="{ test }" />
        </Gallary>
      </div>
    `;
};

const Others = (props) => {
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

function Item({item} = {}){
  return`
    <div id="item-${item.id}">${item.id}</div>
  `;
}

function ListItems({items = [{id:1}, {id:2},{id:3}]} = {}){

  function reRender(){
    $render(ListItems, {items:[{id:4}, {id:5},{id:6}]});
  }

  return`
    <section id="list">
      <section id="items">
        ${
          items && items.length !== 0 ? items.map(item => `
            <Item item=${item} />
          `) : 'No Item found'
        }
        </section>
        <button onclick="${reRender()}"> 
          re-render 
        </button>
    </section>
  `;
}

function InsertionTest() {
  return`
    <Insert target="#counter" position="after">
      <div id="intest">
        It works;
      </div>
    </Insert>
  `
}

function TodoItem({ todo, toggleComplete }) {
  console.log(`Rendering TodoItem: ${todo.text}`);
  return `
    <li id="item-${todo.id}">
      <input
        type="checkbox"
        onChange="${toggleComplete(todo.id)}"
      />
      ${todo.text}
    </li>
  `;
}

function TodoList() {
  const todos = [
    { id: 1, text: 'Learn React', completed: false },
    { id: 2, text: 'Build an app', completed: false },
  ];

  const toggleComplete = (id) => {
    console.log(id);
    const currentInput = $select(`#item-${id}>input`);
    console.log(currentInput.checked);
  };

  return `
      <ul id="todo-list">
        ${todos.map(todo => `
          <TodoItem 
            id=${todo.id} 
            todo=${todo}  
            toggleComplete=${toggleComplete} />
        `)}
      </ul>
  `;
}

function Counteral({ id=0, signalClass="count", count=0} = {}){

  // Signal({
  //   when:"after",
  //   signalClass,
  //   count: count
  // });

  return`
    <div id="counteral-${id}" class="${signalClass}">
      <button onclick="$render(Counteral, ${{signalClass, count: count + 1}})">
        increment ${count}   
      </button>
    </div>
  `;
}

function RealSignal({id=0, count=0}= {}){
  return`
    <select>
      <Cart id="cart" count="${count}" />
      <Counteral id="${id}" count="${count + 1}" />
      <Counteral id="${id+1}" count="${count + 2}" />
    </section>
  `;
}

const Counter = ({count = 0} = {}) => {
  const memoize = () => {
    alert("working")
    console.log("works");
  };

  return `
      <div id="counter">
      <div>${count}</div>
        <button 
          onClick="$render(Counter, ${{count: count + 1}})" 
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
        <div id="${key}" data-state="{{images}}">
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
  console.log(src, alt, yes)
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
  console.log(audio);
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
  const { images, audioUrL, play, pause, setVolume } = props;
  const yoo = { fac: (a) => a };
  const moo = { selector: `#myAudio` };
  const yo = (a) => a;
  if( 1 <= 1 || 2 >= 1){
    console.log('it works');
  }


  return `
      <audio src="${audioUrL}" id="myAudio"></audio>
      <button onClick="${pause(moo)}"> Pause Audio </button>
      <button 
        {yoo && audioUrL}
        onFocus="{yo()}"
        onBlur={yo()}
        onChange="${ play() }"
        onClick="${play({
          item: images,
          selector: '#myAudio'
        })}" class="m-3">Play Audio </button> 
      <input type="range" id="volume" min="0" max="1" step="0.01" value="1"
        onChange="${setVolume({ selector: `#myAudio, #volume` })}">
      <button onClick="console.log(Math.floor(5.2))" >do something</button>
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

const MyTodo = ({ id=0 } = {}) => {
  const todoForm = $select(`#todo-form>:nth-last-child(2)`);
  id = todoForm ? Number(todoForm.dataset.id) + 1 : id;

  return `
    <Insert target="btn" position="before">
      <input type="text" id="input-${id}" data-id="${id}">
    </Insert>
  `;
}
const AddTodoForm = () => {
  
  return `
    <div 
      id="todo-form"
      class="todo-form" 
    >  
      <MyTodo id="0" />
      <button id="btn" onclick="$render(MyTodo)">plus</button>
    </div>
  `;
};

function RenderErrorLogger({ error }) {
  console.error(error);
  console.log("This is called by render internal");
  return "";
}

console.log($select(".post[0], .post[add|class=rubbish fade, add|data-name=ayobami]"));
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

function CounterFib({count=1} = {}) {
  
  function fib(num) {
    if (num <= 1) return 1;
  
    return fib(num - 1) + fib(num - 2);
  }
  
  return`
    <div id="counter-fib">
      <button onClick="$render(CounterFib, ${{count: count + 1}})">Count: ${count}</button>
      <div>1. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <div>2. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <div>3. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <div>4. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <div>5. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <div>6. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <div>7. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <div>8. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <div>9. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <div>10. ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)} ${fib(count)}</div>
      <If condition="${count < 9}"> Count ${count} is less than 9 </If>
      <If condition="${count > 9}"> Count ${count} is greater than 9 </If>
      <If condition="${count === 9}"> Count ${count} is equal to 9 </If>
    </div>
    `;
}

function Toggle({ id, children} = {}){
  return `
    <section 
      id="${id}" 
      onclick="$select('#${id}[toggle|class=hidden]')">
      ${children}
    </section>
  `;
}

function Toggler({ id, children, status=false} = {}){
  return `
    <section 
      id="${id}" 
      onclick="$render(Toggler, ${!status})">
      ${children}
    </section>
  `;
}



/* function For({ each=[], render, target="eueei", position, fallback} = {}){
  let parent = target.startsWith("#") 
      ? $select(target) 
      : $select(`#${target}`);
  
  console.log(each)
  const items = Array.isArray(each) ? each : JSON.parse(each);
  const key = parent ? parent.children.length : items.length;
  const lastItem = items[items.length - 1];
  const lastKey = lastItem && (lastItem.id ?? lastItem);

  if (parent && lastKey === Number(key)) {
    return parent.innerHTML;
  }

  let children = items[0] && items.map((item, index) => {
    index = parent? index + Number(parent.children.length) : index;
    return globalThis[`${render}`]({item, index})
  }).join(" ");

  if(parent){
    children = position === "prepend" 
           ? `${children} ${parent.innerHTML}`
           : `${parent.innerHTML} ${children}`;
  }

  return children;
} */

function Insert({ position = "before", children, target } = {}) {
  let el = document.createElement("div");
  const targetComponent = target.startsWith("#") 
  ? $select(target) 
  : $select(`#${target}`);
  
  if (!targetComponent) {
    return children.trim();
  }

  let nodes;

  // Detect if children looks like raw text (no tags)
  if (typeof children === "string" && !/<[a-z][\s\S]*>/i.test(children)) {
    // Just a plain text string → make TextNode
    nodes = [document.createTextNode(children.trim())];
  } else {
    el.innerHTML = children.trim();
    nodes = Array.from(el.children);
  } 

  function handleOutboundInsertion(targetComponent, position){
    // Decide reference node
    const referenceNode = position === "before"
      ? targetComponent
      : targetComponent.nextSibling;

    // Insert each node
    nodes.forEach(node => {
      if($select(`#${node.id}`) && node.dataset.once){
        return " ";
      }
      targetComponent.parentNode.insertBefore(node, referenceNode);
    });
  }

  handleOutboundInsertion(targetComponent, position)
  return " ";
}


function Fore({ each = [], render, target, position, fallback }) {
  const parent = $select(`#${target}`);
  const children = each.length
    ? each.map((item, index) => render({ item, index }))
    : (typeof fallback === "function" ? fallback() : 'loading...');


  if (!parent) return children;

  const fragment = document.createDocumentFragment();
  children.forEach(child => fragment.append(
    child instanceof Node ? child : document.createTextNode(child)
  ));

  if (!position || position === "append") {
    parent.append(fragment);
  } else if (position === "prepend") {
    parent.prepend(fragment);
  } else if (position === "after") {
    parent.after(fragment);
  } else {
    parent.insertAdjacentElement(position, fragment);
  }

  return children;
}

function Signal(props) {
  //Stop if a signal is queued for propcessing
  if(__$signal.props){
    return " ";
  }

  //Stop if a signal is being processed
  if(__$signal.props && __$signal.props.triggered){
    return " ";
  }

  function extractKorasKeysFromHTML(el) {
    if (!el || !el.innerHTML) return [];
  
    const results = [];
    const renderCalls = el.innerHTML.match(/\$render\([^)]*\)/g);
  
    if (renderCalls) {
      renderCalls.forEach(call => {
        const match = call.match(/\$render\(\s*([a-zA-Z0-9_.$]+)\s*,\s*['"]?(koras_[a-zA-Z0-9_-]+)['"]?\s*\)/);
        if (match) {
          results.push({
            component: match[1],
            key: match[2]
          });
        }
      });
    }
  
    return results;
  }

  function triggerSubscribers(props) {
    if (!props.signalClass) {
        console.error("Missing signalClass in message.");
        return " ";
    }

    const elements = document.querySelectorAll(`.${props.signalClass}`);
    if (elements.length === 0) {
        console.warn(`No elements found with class name`);
        return " ";
    }

    elements.forEach(element => {
      const id = element.id.split("-")[1];
      if(id === props.id){
        return " ";
      }
      const target = extractKorasKeysFromHTML(element);
      delete globalThis[target[0].key];
      const signalProps = { id, ...props};
      $render(globalThis[target[0].component], signalProps); 
    })

    // clear any processed signal
    __$signal = { }
  }

  globalThis.__$signal = {
    action: triggerSubscribers,
    props,
    triggered: true
  };

 return " ";
}

async function startRendering(){
  $register({
    App,
    Counteral,
    If,
    CounterFib,
    TodoItem,
    TodoList,
    Insert,
    MyTodo,
    InsertionTest,
    ListItems,
    Item,
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
});
  
  const starta = performance.now();
  const a = await $render(App, state);
  const end = performance.now();
  console.log(a)
  const duration = end - starta;
  console.log(duration);
  // console.log(koras_bundle)
}

startRendering();
