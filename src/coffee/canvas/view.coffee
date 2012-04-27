define([
], () ->
    VIEW =
        "viewAt": (params) ->
            params = if (params) then (params) else ({})
            ctx = params.ctx
            canvas = params.canvas
            if (ctx && canvas)
                pos = if (params.pos) then (params.pos) else ([0, 0])
                center = [canvas.width / 2, canvas.height / 2]
                ctx.transform(1, 0, 0, 1, (center[0] - parseFloat(pos[0])), (center[1] - parseFloat(pos[1])))
                
    VIEW
)
