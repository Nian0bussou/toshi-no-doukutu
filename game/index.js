import { create_empty_state, create_grid, draw, update } from "./game.js";
import { processBitmap } from "./file.js";
import { init } from "./initial.js";

const elems = init();
let sta = create_empty_state(
  {
    is_paused: false,
    has_file: false,
    tail_length: 512,
    cell_size: 5,
    scale_width: 1.2,
    rows: 50,
    cols: 120,
    trace: 200,
  },
  elems
);

sta.canvas.width = sta.vals.cols * sta.vals.cell_size;
sta.canvas.height = sta.vals.rows * sta.vals.cell_size;

elems.len_tail.addEventListener(
  "change",
  () => (sta.vals.tail_length = Number(elems.len_tail.value))
);
elems.toggle_pause.addEventListener("mousedown", () => {
  sta.vals.is_paused = !sta.vals.is_paused;
});
elems.refresh_id.addEventListener("mousedown", () => {
  sta.grid = sta.def_grid;
  if (elems.checkbox.checked)
    sta.tracegrid = (0, create_grid)(sta.vals.rows, sta.vals.cols);
});
elems.size_text.addEventListener("change", () => {
  sta.vals.cell_size = Number(elems.size_text.value);
  sta.canvas.width = sta.vals.cols * sta.vals.cell_size;
  sta.canvas.height = sta.vals.rows * sta.vals.cell_size;
});
elems.file_input.addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function (e) {
    const img = new Image();
    img.onload = function () {
      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      tempCanvas.width = img.width;
      tempCanvas.height = img.height;

      tempCtx.drawImage(img, 0, 0);
      const imageData = tempCtx.getImageData(0, 0, img.width, img.height);

      sta = processBitmap(sta, imageData);
      sta.vals.has_file = true;
      startAnimation();
    };
    img.src = e.target.result;
  };

  reader.readAsDataURL(file);
});

let isFocused = true;
let animationFrameId;

function gameLoop() {
  if (isFocused && sta.vals.has_file) {
    draw(sta);
    if (!sta.vals.is_paused) sta = update(sta);
  }
  animationFrameId = requestAnimationFrame(gameLoop);
}

function startAnimation() {
  animationFrameId = requestAnimationFrame(gameLoop);
  console.log("game loop started");
}
function stopAnimation() {
  cancelAnimationFrame(animationFrameId);
  console.log("game loop stopped");
}
window.addEventListener("focus", () => {
  if (elems.check_focused_matter.checked) {
    isFocused = true;
    startAnimation();
  }
});

window.addEventListener("blur", () => {
  if (elems.check_focused_matter.checked) {
    isFocused = false;
    stopAnimation();
  }
});

startAnimation();
