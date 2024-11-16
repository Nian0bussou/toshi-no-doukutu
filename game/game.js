export function create_empty_state(vals, elems) {
    return {
        vals: vals,
        grid: [],
        def_grid: [],
        tracegrid: [],
        ctx: elems.ctx,
        canvas: elems.canvas,
        tracepause: elems.trace_pause,
    }
}
export function create_grid(rows, cols) {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0))
}
export function get_gradients(len) {
    const colors = []
    const colorStops = [
        { r: 255, g: 0, b: 0 },
        { r: 0, g: 255, b: 0 },
        { r: 0, g: 0, b: 255 },
        { r: 128, g: 0, b: 128 },
    ]
    const steps = len / (colorStops.length - 1)
    for (let i = 0; i < colorStops.length - 1; i++) {
        const startColor = colorStops[i]
        const endColor = colorStops[i + 1]
        for (let j = 0; j < steps; j++) {
            const r = Math.floor(
                startColor.r + ((endColor.r - startColor.r) * j) / steps
            )
            const g = Math.floor(
                startColor.g + ((endColor.g - startColor.g) * j) / steps
            )
            const b = Math.floor(
                startColor.b + ((endColor.b - startColor.b) * j) / steps
            )
            colors.push(
                `#${((1 << 24) + (r << 16) + (g << 8) + b)
                    .toString(16)
                    .slice(1)}`
            )
        }
    }
    colors.push(
        `#${(
            (1 << 24) +
            (colorStops[colorStops.length - 1].r << 16) +
            (colorStops[colorStops.length - 1].g << 8) +
            colorStops[colorStops.length - 1].b
        )
            .toString(16)
            .slice(1)}`
    )
    return colors
}
export function draw(sta) {
    sta.ctx.clearRect(0, 0, sta.canvas.width, sta.canvas.height)
    let colors = get_gradients(sta.vals.tail_length)

    for (let row = 0; row < sta.vals.rows; row++) {
        for (let col = 0; col < sta.vals.cols; col++) {
            sta.ctx.beginPath()
            sta.ctx.rect(
                col * sta.vals.cell_size,
                row * sta.vals.cell_size,
                sta.vals.cell_size,
                sta.vals.cell_size
            )

            sta.ctx.font = `${sta.vals.cell_size / 2}px Arial` // Adjust font size relative to cell size
            sta.ctx.textAlign = 'center' // Center horizontally
            sta.ctx.textBaseline = 'middle' // Center vertically

            if (sta.grid[row][col] === 1) {
                sta.ctx.fillStyle = '#333'
                sta.tracegrid[row][col] = 1
            } else if (sta.tracegrid[row][col] >= 1) {
                sta.ctx.fillStyle = colors[sta.tracegrid[row][col]] + '44'
                if (
                    !sta.vals.is_paused ||
                    (sta.vals.is_paused && sta.tracepause.checked)
                )
                    sta.tracegrid[row][col] += 1
                if (sta.tracegrid[row][col] > colors.length)
                    sta.tracegrid[row][col] = 0
            } else {
                sta.ctx.fillStyle = '#999'
            }
            sta.ctx.fill()

            if (sta.vals.cell_size >= 15) {
                // draw a number on a square corresponding to the trace

                const n = sta.tracegrid[row][col]
                if (n != 0) {
                    sta.ctx.fillStyle = '#000' // Set the text color
                    sta.ctx.fillText(
                        String(n),
                        col * sta.vals.cell_size + sta.vals.cell_size / 2,
                        row * sta.vals.cell_size + sta.vals.cell_size / 2
                    )
                }
            }
        }
    }
}
export function update(sta) {
    const newGrid = sta.grid.map((arr) => [...arr])
    for (let row = 0; row < sta.vals.rows; row++) {
        for (let col = 0; col < sta.vals.cols; col++) {
            const cell = sta.grid[row][col]
            const numNeighbors = count_neighbors(sta, row, col)
            if (cell === 1 && (numNeighbors < 2 || numNeighbors > 3)) {
                newGrid[row][col] = 0
            } else if (cell === 0 && numNeighbors === 3) {
                newGrid[row][col] = 1
            }
        }
    }
    sta.grid = newGrid
    return sta
}
export function count_neighbors(sta, row, col) {
    let count = 0
    for (let i = -1; i <= 1; i++)
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue
            const newRow = row + i
            const newCol = col + j
            if (
                newRow >= 0 &&
                newRow < sta.vals.rows &&
                newCol >= 0 &&
                newCol < sta.vals.cols
            ) {
                count += sta.grid[newRow][newCol]
            }
        }
    return count
}
