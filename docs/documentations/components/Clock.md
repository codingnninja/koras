# Clock component

```js
function Clock() {
  setInterval(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");
    const time = `${hours}:${minutes}:${seconds}`;
    $select("#clock") && $select(`#time[add|textContent=${time}]`);
  }, 1000);

  return `
    <div 
    id="clock"
    style="
        display: flex; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        font-size: 5em; 
        font-family: Arial, sans-serif;">
        <span id="time"></span>
    </div>
  `;
}
```
