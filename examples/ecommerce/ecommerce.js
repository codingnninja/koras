import { $render, $register} from "../../dist/esm/koras.js";
import { $select} from "../../dist/esm/query.js";
  
function TodoApp(props) {
    function addTodo(props) {
        console.log(StorageUtils())
        const input = $select("#todo-input").value;
        const updatedTodos = [...props.todos, input];
        $render(TodoApp, { todos: updatedTodos });
    }

    return `
        <div id="todo-app">
            <input id="todo-input">
            <button onClick=${addTodo(props)}>Add</button>
            <ul>
                ${props.todos.map(todo => `<li>${todo}</li>`)}
            </ul>
        </div>
    `;
}

function ProductList(props) {

  // Define categories & products with category
  const baseUrl = 'https://tailwindcss.com/plus-assets/img/ecommerce-images/';
  const categories = ['All', 'Fruit', 'Vegetable'];
  const products = [
    { id: 1, name: "Earthen a's Bottle", price: 50, category: 'Fruit', imgUrl:`${baseUrl}category-page-04-image-card-01.jpg`},
    { id: 2, name: 'Machined Mechanical Pencil', price: 30, category: 'Fruit', imgUrl:`${baseUrl}category-page-04-image-card-02.jpg`},
    { id: 3, name: 'Focus Paper Refill', price: 40, category: 'Vegetable', imgUrl:`${baseUrl}category-page-04-image-card-03.jpg`},
    { id: 4, name: 'Nomad Tumbler', price: 40, category: 'Vegetable', imgUrl:`${baseUrl}category-page-04-image-card-03.jpg`},
  ];

  if(!props){
    return products;
  }
  
  // Handlers defined inside the component
  function addToCart(productId) {

    const products = ProductList();
    const storage = StorageUtils();
    const cart = storage.loadCart();
    const product = products.find(p => p.id === productId);
    const existing = cart.find(p => p.id === productId);

    const updatedCart = existing
      ? cart.map(p =>
          p.id === productId ? { ...p, quantity: p.quantity + 1 } : p)
      : [...cart, { ...product, quantity: 1 }];

      $render(ShoppingCart, { cart: updatedCart });
      storage.saveCart(updatedCart);
  }

  // Filter products by category and searchTerm
  const filteredProducts = products.filter(p => {
    const matchesCategory = props.category === 'All' || !props.category ? true : p.category === props.category;
    const matchesSearch = !props.searchTerm || p.name.toLowerCase().includes(props.searchTerm);
    return matchesCategory && matchesSearch;
  });

  return `
    <div 
      class="bg-white" 
      id="product-list" 
    >
      <div class="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 class="sr-only">Products</h2>
        <label>
          Category:
          <select onChange="$select('.product[search|title=*' + this.value + ']')">
            ${categories.map(cat => `
              <option 
                value="${cat}" ${cat === props.category ? 'selected' : ''}>
                ${cat}
              </option>
            `)}
          </select>
        </label>

        <label>
          Search:
          <input 
            type="search" 
            onInput="$select('.product[search|textContent=*' + this.value + ']')" 
            placeholder="Search products..."
          />
        </label>
        
        <div class="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-10">
        ${filteredProducts.map(product => `
          <div href="#" 
            class="group product" 
            id="product-${product.id}" 
            data-id="${product.id}"
            title="all ${product.category}"
          >
            <img src="${product.imgUrl}" alt="Hand holding black machined steel mechanical pencil with brass tip and top." class="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8">
            <h3 class="mt-4 text-sm text-gray-700">${product.name} </h3>
            <p class="mt-1 text-lg font-medium text-gray-900">$${product.price}</p>
            <button  
              onClick=${addToCart(Number(product.id))}>
              Add to Cart
            </button>
          </div>
          `)}
          <!-- More products... -->
        </div>
      </div>
    </div>
  `;
}


$register({ProductList});

function StorageUtils(){
  function loadCart() {
    try {
      const data = localStorage.getItem('koras-cart');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }
  
  function saveCart(cart) {
    localStorage.setItem('koras-cart', JSON.stringify(cart));
  }

  return {
    loadCart,
    saveCart
  }
}

function ShoppingCart(props) {
  function changeQty(event) {
    const el = event.target.closest('button');
    const storage = StorageUtils();
    const cart = storage.loadCart();

    const productId = parseInt(el.dataset.id);
    const delta = parseInt(el.dataset.delta);

    const updatedCart = cart
      .map(p =>
        p.id === productId
          ? { ...p, quantity: p.quantity + delta }
          : p
      )
      .filter(p => p.quantity > 0);

      $render(ShoppingCart, { cart: updatedCart });
      storage.saveCart(updatedCart);
  }

  function removeItem(event) {
    const el = event.target;
    const storage = StorageUtils();
    const cart = storage.loadCart()
    const productId = parseInt(el.dataset.id);
    const updatedCart = cart.filter(p => p.id !== productId);
    $render(ShoppingCart, { cart: updatedCart });
    storage.saveCart(updatedCart);
  }

  const total = props.cart.reduce((sum, p) => sum + p.price * p.quantity, 0);

  return `
    <div id="shopping-cart" class="max-w-5xl max-lg:max-w-2xl mx-auto p-4">
      <h1 class="text-xl font-semibold text-slate-900">Shopping Cart</h1>
      ${
        props.cart.length === 0
          ? `<p>Your cart is empty.</p>`
          : `      
                ${props.cart.length === 0
                  ? `<p>Your cart is empty.</p>`
                  : `
                  <div class="grid lg:grid-cols-3 lg:gap-x-8 gap-x-6 gap-y-8 mt-6">
                  <div class="lg:col-span-2 space-y-6" id="cart-items">
                  ${props.cart.map(p => `
                    <div class="flex gap-4 bg-white px-4 py-6 rounded-md shadow-sm border border-gray-200">
                    <div class="flex gap-6 sm:gap-4 max-sm:flex-col">
                        <div class="w-24 h-24 max-sm:w-24 max-sm:h-24 shrink-0">
                            <img src='${p.imgUrl}' class="w-full h-full object-contain" />
                        </div>
                        <div class="flex flex-col gap-4">
                            <div>
                                <h3 class="text-sm sm:text-base font-semibold text-slate-900">${p.name}</h3>
                                <p class="text-[13px] font-medium text-slate-500 mt-2 flex items-center gap-2">Color: <span class="inline-block w-4 h-4 rounded-sm bg-[#ac7f48]"></span></p>
                            </div>
                            <div class="mt-auto">
                                <h3 class="text-sm font-semibold text-slate-900">$${p.price}</h3>
                            </div>
                        </div>
                    </div>

                    <div class="ml-auto flex flex-col">
                        <div class="flex items-start gap-4 justify-end">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-pink-600 inline-block" viewBox="0 0 64 64">
                                <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z" data-original="#000000"></path>
                            </svg>

                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 cursor-pointer fill-slate-400 hover:fill-red-600 inline-block" viewBox="0 0 24 24" data-id="${p.id}" onClick=${removeItem(event)}>
                                <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" data-original="#000000"></path>
                                <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" data-original="#000000"></path>
                            </svg>
                        </div>
                        <div class="flex items-center gap-3 mt-auto">
                            <button 
                              type="button"
                                class="flex items-center justify-center w-[30px] h-[30px] cursor-pointer bg-slate-400 outline-none rounded-full" data-id="${p.id}" data-delta="-1"
                                id="qtd_button" 
                                onClick=${changeQty(event)}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-2 fill-white" viewBox="0 0 124 124">
                                    <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" data-original="#000000"></path>
                                </svg>
                            </button>
                            <span class="font-semibold text-base leading-[18px]">${p.quantity}</span>
                            <button
                              type="button"
                                class="flex items-center justify-center w-[30px] h-[30px] cursor-pointer bg-slate-800 outline-none rounded-full" data-id="${p.id}" data-delta="1" onClick=${changeQty(event)}>
                                <svg xmlns="http://www.w3.org/2000/svg" class="w-2 fill-white" viewBox="0 0 42 42" >              
                                    <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" data-original="#000000"></path>
                                </svg>
                            </button>
                        </div>
                      </div>
                    </div>
                    `)}
              </div>`
              }
              <div class="bg-white rounded-md px-4 py-6 h-max shadow-sm border border-gray-200">
                  <ul class="text-slate-500 font-medium space-y-4">
                      <li class="flex flex-wrap gap-4 text-sm">Subtotal <span class="ml-auto font-semibold text-slate-900">$${total}
                      </span></li>
                      <li class="flex flex-wrap gap-4 text-sm">Shipping <span class="ml-auto font-semibold text-slate-900">$2.00</span></li>
                      <li class="flex flex-wrap gap-4 text-sm">Tax <span class="ml-auto font-semibold text-slate-900">$4.00</span></li>
                      <hr class="border-slate-300" />
                      <li class="flex flex-wrap gap-4 text-sm font-semibold text-slate-900">Total <span class="ml-auto">$${total + 2 + 4}</span></li>
                  </ul>
                  <div class="mt-8 space-y-4">
                      <button type="button" class="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-slate-800 hover:bg-slate-900 text-white rounded-md cursor-pointer">Buy Now</button>
                      <button type="button" class="text-sm px-4 py-2.5 w-full font-medium tracking-wide bg-slate-50 hover:bg-slate-100 text-slate-900 border border-gray-300 rounded-md cursor-pointer">Continue Shopping</button>
                  </div>
                  <div class="mt-5 flex flex-wrap justify-center gap-4">
                      <img src='https://readymadeui.com/images/master.webp' alt="card1" class="w-10 object-contain" />
                      <img src='https://readymadeui.com/images/visa.webp' alt="card2" class="w-10 object-contain" />
                      <img src='https://readymadeui.com/images/american-express.webp' alt="card3" class="w-10 object-contain" />
                  </div>
              </div>
          </div>
      </div>
      `
      }
    </div>
  `;

  function checkout() {
    alert('Proceeding to checkout...');
  }
}

$register({ShoppingCart, StorageUtils});

function App(props) {
  const state = {
    cart:props.cart || props.loadCart(), 
    categories: props.category || 'All', 
    searchTerm: props.searchTerm || ''
  }

  return `
    <div id="app">
      <ProductList {...state} saveCart="${props.saveCart}" />
      <ShoppingCart {...state} />
    </div>
  `;
}

function CreateStorage(storageKey = 'todos'){
  return {
    loadTodos(){
      const data = localStorage.getItem(storageKey);
      return data ? JSON.parse(data) : [];
    },

    saveTodos(todos){
      localStorage.setItem(storageKey, JSON.stringify(todos));
    }
  }
}

$register({App, TodoApp});

$render(App, StorageUtils());

$render(TodoApp, {todos:[]})
         