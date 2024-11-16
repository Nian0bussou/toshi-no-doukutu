export function init() {
    const canvas = document.getElementById('gameCanvas')
    const ctx = canvas.getContext('2d')
    const checkbox = document.getElementById('check')
    const check_focused_matter = document.getElementById('focuspause')
    const trace_pause = document.getElementById('tracePause')
    const size_text = document.getElementById('sizeID')
    const frame_laber = document.getElementById('frameLabel')
    const toggle_pause = document.getElementById('bTogglePause')
    const refresh_id = document.getElementById('refreshID')
    const len_tail = document.getElementById('LenText')
    const file_input = document.getElementById('fileInput')
    return {
        canvas,
        ctx,
        checkbox,
        check_focused_matter,
        trace_pause,
        size_text,
        frame_laber,
        toggle_pause,
        refresh_id,
        len_tail,
        file_input,
    }
}
