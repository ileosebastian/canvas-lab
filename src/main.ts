import './style.css'

import { Editor } from './editor';
import { Box, BoxType } from './boxes';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div id="guide"></div>
    <canvas id="canvas" width="700" height="400" class="canvas"></canvas>
  </div>
  <div>
    <label for="toggleGuide">Guia: </label>
    <input type="checkbox" name="" id="toggleGuide" checked>

    <button id="obstacle-btn">Obstaculo</button> 
    <button id="start-btn">Origen</button> 
    <button id="end-btn">Destino</button> 
    <button id="init-path-btn">Iniciar Recorrido</button> 
    <button id="clear-btn">Limpiar Recorrido</button> 
  </div>
`;

const canvas = document.getElementById('canvas');
const guide = document.getElementById('guide');
const toggleInput = document.getElementById('toggleGuide');
const obstacleBtn = document.getElementById('obstacle-btn');
const startBtn = document.getElementById('start-btn');
const endBtn = document.getElementById('end-btn');
const initPathBtn = document.getElementById('init-path-btn');
const clearPathBtn = document.getElementById('clear-btn');

let boxType: BoxType = 'ground';

if (canvas instanceof HTMLCanvasElement && guide && toggleInput instanceof HTMLInputElement) {
  const editor = new Editor(canvas);

  // console.log(editor.widthTiles, editor.heightTiles);
  // console.log(editor.stage)

  guide.style.width = `${canvas.width}px`;
  guide.style.height = `${canvas.height}px`;
  guide.style.gridTemplateColumns = `repeat(${editor.rows * 2}, 1fr)`;
  guide.style.gridTemplateRows = `repeat(${editor.rows}, 1fr)`;

  [...Array(editor.rows ** 2)].forEach(() =>
    guide.insertAdjacentHTML("beforeend", "<div></div><div></div>")
  );

  canvas.addEventListener('mousedown', event => {
    if (event.button !== 0) return;

    const canvasBoundingRect = editor.canvas.getBoundingClientRect();
    const x = event.clientX - canvasBoundingRect.left;
    const y = event.clientY - canvasBoundingRect.top;

    const cellX = Math.floor(x / editor.heightTiles);
    const cellY = Math.floor(y / editor.heightTiles);


    if (boxType.length > 0) {
      let box = editor.findBox(cellX, cellY);
      if (box?.type !== 'ground') {
        // isStartFilled = box?.type === 'user' ? null : box;
        // isEndFilled = box?.type === 'place' ? null : box;
        editor.toggleBox(cellX, cellY, 'ground');
        return;
      }

      editor.toggleBox(cellX, cellY, boxType);
    }
  });

  toggleInput.addEventListener("change", () => {
    guide.style.display = toggleInput.checked ? '' : 'none';
  });

  let res = [obstacleBtn, startBtn, endBtn, initPathBtn, clearPathBtn].every(btn => btn instanceof HTMLButtonElement);

  let isClicked = false;
  let isClickedObstacle = false;
  let isClickedStart = false;
  let isClickedEnd = false;

  let path: Box[] | null;

  if (res && obstacleBtn && startBtn && endBtn && initPathBtn && clearPathBtn) {
    obstacleBtn.addEventListener('click', () => {
      isClicked = isClickedObstacle ? false : true;

      let s = obstacleBtn.style
      s.color = isClicked ? "black" : "white";
      boxType = isClicked ? 'wall' : 'ground';

      isClickedObstacle = isClickedObstacle ? false : true;
    });
    startBtn.addEventListener('click', () => {
      isClicked = isClickedStart ? false : true;

      let s = startBtn.style
      s.color = isClicked ? "green" : "white";
      boxType = isClicked ? 'user' : 'ground';

      isClickedStart = isClickedStart ? false : true;
    });
    endBtn.addEventListener('click', () => {
      isClicked = isClickedEnd ? false : true;

      let s = endBtn.style
      s.color = isClicked ? "red" : "white";
      boxType = isClicked ? 'place' : 'ground';

      isClickedEnd = isClickedEnd ? false : true;
    });

    initPathBtn.addEventListener('click', async () => {
      path = await editor.initPathFinding();

      if (path) {
        // draw 2D tour
        // path.forEach(g => console.log(`->${g.kindOption} (${g.x},${g.y}) es ${g.type}`))

        editor.walkingThePath(path);
      } else {
        alert("Debe ingresar el origen y destino antes de iniciar el recorrido");
      }
    });

    clearPathBtn.addEventListener('click', () => {
      if (path)
        editor.clearPath(path);
    });
  }
}