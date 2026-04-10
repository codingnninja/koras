import { $register, $render } from "../../dist/esm/koras.js";
import { $select } from "../../dist/esm/query.js";

function Cells({ id = 0, count = 10000, classes = "tile dead" } = {}) {

    function updateTiles(event){
        const id = event.target.dataset.id;

        $select(`#tile-${id}[add|class=tile dead blue]`);
    }

    return `
      <div id="container" onpointerdown=${updateTiles(event)}>
        <div class="board">
            ${
              Array.from({ length: count }, (_, i) => 
                `<div 
                   id="tile-${id + i}" 
                   class="${classes}" 
                   data-id="${id + i}">
                </div>`
              )
            }
        </div>
      </div>
    `;
  }


  // ---- Cell ----
  function Cell({ rows, cols, id, alive = false, onToggle, grid } = {}) {
  
    return `
      <div 
        id="cell-${id}" 
        class="cell ${alive ? 'alive' : 'dead'}"
        onclick="${onToggle({ rows, cols, grid, cellId: id })}"
      ></div>
    `;
  }
  
  // ---- Grid ----
  function Grid({ grid = [], toggleCell, myRows, myCols } = {}) {
    const myGrid = grid;
    return `
      <div id="grid" class="grid">
        ${grid.map(row => row.map(cell =>  
          `<Cell 
            id="${cell.id}" 
            alive="${cell.alive}" 
            onToggle="${toggleCell}"
            grid=${myGrid}
            rows=${myRows} 
            cols=${myCols}
          />`
        ))}
      </div>
    `;
  }
  
  // ---- Controls ----
  function Controls({ onStart, onPause, onReset, onRandom, onSpeedChange, speed } = {}) {
  
    function handleSpeed({}) {
      const value = Number($select("#speed-input").value);
      onSpeedChange({ value });
    }
  
    return `
    
    `;
  }
  
  // ---- Main ----
  function GameOfLife({
    rows = 20,
    cols = 20,
    grid = null,
    running = false,
    speed = 300
  } = {}) {
  
    // ---- INIT GRID ----
    function createGrid() {
      const g = [];
      for (let r = 0; r < rows; r++) {
        const row = [];
        for (let c = 0; c < cols; c++) {
          row.push({ id: `${r}-${c}`, alive: false });
        }
        g.push(row);
      }
      return g;
    }
  
    const currentGrid = grid || createGrid();
  
    // ---- LOGIC ----
    function getNextGrid(g) {
  
      function countNeighbors(r, c) {
        let count = 0;
  
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
  
            const nr = r + i;
            const nc = c + j;
  
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
              if (g[nr][nc].alive) count++;
            }
          }
        }
  
        return count;
      }
  
      return g.map((row, r) =>
        row.map((cell, c) => {
          const n = countNeighbors(r, c);
  
          if (cell.alive && (n < 2 || n > 3)) return { ...cell, alive: false };
          if (!cell.alive && n === 3) return { ...cell, alive: true };
  
          return cell;
        })
      );
    }
  
    function randomize(g) {
      return g.map(row =>
        row.map(cell => ({
          ...cell,
          alive: Math.random() > 0.7
        }))
      );
    }
  
    // ---- ACTIONS ----
    const toggleCell = ({cellId}) =>  $select(`#cell-${cellId}[toggle|class=alive]`);
    
  
    function start() {
      if (running) return;
  
      function loop(g) {
        setTimeout(() => {
          const next = getNextGrid(g);
  
          $render(GameOfLife, {
            rows,
            cols,
            grid: next,
            running: true,
            speed: Number($select("#speed-input").value),
          });
  
          loop(next);
        }, speed);
      }
  
      loop(currentGrid);
    }
  
    function pause() {
      $render(GameOfLife, { rows, cols, grid: currentGrid, running: false, speed });
    }
  
    function reset() {
      $render(GameOfLife, {
        rows,
        cols,
        grid: createGrid(),
        running: false,
        speed
      });
    }
  
    function randomSeed() {
      $render(GameOfLife, {
        rows,
        cols,
        grid: randomize(currentGrid),
        running,
        speed
      });
    }
  
    // function changeSpeed() {
    //   const value = ;

    //   $render(GameOfLife, {
    //     rows,
    //     cols,
    //     grid: currentGrid,
    //     running,
    //     speed: value
    //   });
    // }

    return `
      <section id="gameoflife">
        <div id="controls">
          <button onclick=${start()}>Start</button>
          <button onclick=${pause()}>Pause</button>
          <button onclick=${reset()}>Reset</button>
          <button onclick=${randomSeed()}>Random</button>
    
          <input 
            id="speed-input" 
            type="range" 
            min="50" 
            max="1000" 
            value="${speed}" 
          />
        </div>
       
        <Grid 
          grid="${currentGrid}" 
          toggleCell="${toggleCell}"
          myRows=${rows}
          myCols=${cols} 
        />
      </section>
    `;
  }
  
  // ---- Register ----
  $register({ GameOfLife, Grid, Cell, Controls });
  
  // ---- Init ----


  // $register({Cells});
  const start = performance.now();
  // $render(Cells);
  $render(GameOfLife, {});
  const end = performance.now();
  const duration = end - start;
  console.log(`Execution time: ${duration.toFixed(4)}`);