import { create_grid } from "./game.js";

export function processBitmap(sta, bitmap) {
  const bmpWidth = bitmap.width;
  const bmpHeight = bitmap.height;

  sta.vals.rows = bmpHeight;
  sta.vals.cols = bmpWidth;

  sta.grid = (0, create_grid)(sta.vals.rows, sta.vals.cols);
  sta.def_grid = (0, create_grid)(sta.vals.rows, sta.vals.cols);
  sta.tracegrid = (0, create_grid)(sta.vals.rows, sta.vals.cols);

  sta.canvas.width = sta.vals.cols * sta.vals.cell_size;
  sta.canvas.height = sta.vals.rows * sta.vals.cell_size;

  for (let y = 0; y < bmpHeight; y++) {
    for (let x = 0; x < bmpWidth; x++) {
      const index = (y * bmpWidth + x) * 4;
      const r = bitmap.data[index]; // Red channel
      const g = bitmap.data[index + 1]; // Green channel
      const b = bitmap.data[index + 2]; // Blue channel
      const brightness = r + g + b;
      sta.grid[y][x] = brightness > 382 ? 0 : 1;
      sta.def_grid[y][x] = brightness > 382 ? 0 : 1;
    }
  }
  return sta;
}
