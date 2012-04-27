define([
], () ->
    console.log("canvas util")

    CANVAS_UTIL = {
        "show": (params) ->
            params = if (params) then (params) else ({})
            if (params.canvas)
                canvas = params.canvas
                params.hide = if (typeof params.hide == "boolean") then (params.hide) else (false)
                canvas.style.display = "block"
                (params.hide && (canvas.style.display = "none"))
            CANVAS_UTIL
        "clear": (params) ->
            params = if (params) then (params) else ({})
            if (params.canvas && params.ctx)
                canvas = params.canvas
                params = if (params) then (params) else ({})
                x = if (params.x) then (params.x) else (if (canvas.style.left) then (parseInt(canvas.style.left)) else (0))
                y = if (params.y) then (params.y) else (if (canvas.style.top) then (parseInt(canvas.style.top)) else (0))
                w = if (params.w) then (params.w) else (canvas.width)
                h = if (params.h) then (params.h) else (canvas.height)
                params.ctx.clearRect(x, y, w, h)
                params.ctx.clearRect(0, 0, w, h)
            CANVAS_UTIL
        "setStyle": (params) ->
            params = if (params) then (params) else ({})
            ctx = params.ctx
            if (ctx)
                for val, i of params
                    ctx[i] = val
            CANVAS_UTIL
    }
    CANVAS_UTIL.initLine = CANVAS_UTIL.setStyle
    CANVAS_UTIL.initFill = CANVAS_UTIL.setStyle

    CANVAS_UTIL
)
