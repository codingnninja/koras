import { $register, $render } from "../../dist/esm/koras.js";

async function AsyncChild({ id, delay = 0, value = null } = {}) {
    const vvv = delay !== "undefined" ? delay : 'no delay yet: click start to test'
    value = "Resolved in " + vvv + " ms"
    console.table({delay, id})
    await new Promise(r => setTimeout(r, delay));
  
    async function resolve({ childId, wait }) {
  
      $render(AsyncChild, {
        id: childId,
        delay: wait,
        value: "Resolved in " + wait + "ms"
      });
    }
  
    return `
      <div id="asyncchild-${id}">
        <If condition="${value}">
          <p>Child ${id}: ${value}</p>
        </If>
        <If condition="${!value}">
          <p>Child ${id}: Loading...</p>
          <button onclick="${resolve({ childId: id, wait: delay })}">click me</button>
        </If>
      </div>
    `;
  }
  
  async function AsyncNestedTest({ delays = [] } = {}) {
  
    function start() {
      const generated = [
        Math.random() * 3000,
        Math.random() * 3000,
        Math.random() * 3000,
        Math.random() * 3000,
        Math.random() * 3000
      ].map(n => Math.floor(n));
  
      const start = performance.now();  
      $render(AsyncNestedTest, { delays: generated });
      const end = performance.now();
      const duration = end - start;
    
      console.log(`Execution time: ${duration.toFixed(4)}`);
    }
    
    return `
      <section id="asyncnestedtest">
        <h3>Nested Async Children Test</h3>
        <button onclick=${start()}>
          Start Test
        </button>
  
        <AsyncChild id="1" delay="${delays[0]}" />
        <AsyncChild id="2" delay="${delays[1]}" />
        <AsyncChild id="3" delay="${delays[2]}" />
        <AsyncChild id="4" delay="${delays[3]}" />
        <AsyncChild id="5" delay="${delays[4]}" />
      </section>
    `;
  }
  
  $register({
    AsyncNestedTest,
    AsyncChild
  });
  
  const start = performance.now();
    
  await $render(AsyncNestedTest);
  
  const end = performance.now();
  const duration = end - start;
    
  console.log(`Execution time: ${duration.toFixed(4)}`);
  