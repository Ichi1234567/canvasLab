define([
    "display/canvas"
] , (CANVAS) ->
    console.log("---cache---")
    class CACHE extends CANVAS
        "initialize": (params) ->
            @x = params.x
            @y = params.y
            @w = params.width
            @h = params.height
            @mtx = params.mtx
            
            @canvas = [$("<canvas></canvas>")]
            canvas = @canvas[0].get(0)
            canvas.width = @w
            canvas.height = @h
            
            @ctx = [canvas.getContext("2d")]
            ctx = @ctx[0]
            ctx.setTransform(1, 0, 0, 1, @x, @y)
            ctx.lineCap = "round"
            ctx.lineJoin = "round"
            
            #@lookat = [(@x + @w / 2), (@y + @h / 2)]
            @

        "clear": (params) ->
            params = if (params) then (params) else ({})
            params.ctx = @ctx[0]
            params.x = if (params.x) then (params.x) else (@x)
            params.y = if (params.y) then (params.y) else (@y)
            params.w = if (params.w) then (params.w) else (@w)
            params.h = if (params.h) then (params.h) else (@h)
            ctx.setTransform(1, 0, 0, 1, params.x, params.y)

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
            console.log("cache update")
            params = if (params) then (params) else ({})
            @mtx = if (params.mtx) then (params.mtx) else (@mtx)
            canvas = @canvas[0]
            ctx = @ctx[0]

            params.canvas = canvas
            params.ctx = ctx
            params.cache = true
            #at = @lookat
            #@lookAt(at)
            ctx.save()
            mode = super params
            ctx.restore()
            @mode = mode
            @

    CACHE
)
