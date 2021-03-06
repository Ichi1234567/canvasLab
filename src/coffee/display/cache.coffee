define([
    "display/canvas",
    "../geom/mtx"
] , (CANVAS, MTX) ->
    console.log("---cache---")
    class CACHE extends CANVAS
        "initialize": (params) ->
            @x = params.x
            @y = params.y
            @w = params.w
            @h = params.h
            @mtx = params.mtx
            
            @canvas = [$("<canvas></canvas>")]
            canvas = @canvas[0].get(0)
            canvas.width = @w
            canvas.height = @h
            
            @ctx = [canvas.getContext("2d")]
            ctx = @ctx[0]
            ctx.setTransform(1, 0, 0, 1, -@x, -@y)
            #ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            
            @lookat = [(@x + @w / 2), (@y + @h / 2)]
            $("#cache").append(canvas)
            @

        "clear": (params) ->
            #console.log("cache clear")
            params = if (params) then (params) else ({})
            params.ctx = @ctx[0]
            ctx = params.ctx
            params.x = if (params.x) then (params.x) else (0)
            params.y = if (params.y) then (params.y) else (0)
            params.w = if (params.w) then (params.w) else (@w)
            params.h = if (params.h) then (params.h) else (@h)
            ctx.setTransform(1, 0, 0, 1, 0, 0)

            super params
            @

        "setStyle": (params) ->
            params = if (params) then (params) else ({})
            params.ctx = @ctx[0]

            super params
            @

        "reset": (params) ->
            super params
            @
        "updateCanvas": (params) ->
            #console.log("--------------------------")
            #console.log("cache update")
            #console.log(params)
            size = params.size
            
            canvas = @canvas[0]
            $(canvas).attr("width", size[0])
                    .attr("height", size[1])
            ctx = @ctx[0]
            ctx.putImageData(params.data, 0, 0)
            @new_min = params.min
            @new_max = params.max
            #console.log("--------------------------")
            @

    CACHE
)
