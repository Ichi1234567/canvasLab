define([
    "../geom/geom",
    "display/paint"
] , (GEOM, PAINT) ->
    console.log("---cache---")
    CACHE = Backbone.Model.extend(
        "clear": (params) ->
            x = params.x
            y = params.y
            w = params.w
            h = params.h
            ctx = params.ctx
            #reset ctx
            ctx.setTransform(1, 0, 0, 1, x, y)
            ctx.clearRect(x, y, w, h)
        "reset": (params) ->
            @lookat = [(@w / 2), (@h / 2)]

        "setStyle": (params) ->
            ctx = params.ctx
            delete params.ctx
            for val, i of params
                ctx[i] = val

        "lookAt": (at) ->
            at = if (at && at.length == 2) then (at) else (null)
            if (at)
                @lookat = at.map((val) -> val)
                params = {
                    at: at
                    ctx: @ctx
                    w: @w
                    h: @h
                }
                GEOM.lookAt(at, params)
            @
            #at = params.at
            #delete params.at

            #GEOM.lookAt(at, params)

        "updateCanvas": (params) ->
            mode = params.mode
            objs = params.objs
            cb = if (params.cb) then (params.cb) else (()->)

            #current
            canvas = params.canvas
            ctx = params.ctx

            for obj_i, i in objs
                data_i = obj_i.data
                mode_i = if (mode) then (mode) else (data_i.mode)
                switch (mode_i)
                    when ("SKELETON")
                        fn = (data, params) ->
                            (!data.r && PAINT.polyEdge(data, params))
                            (data.r && PAINT.cirEdge(data, params))
                    when ("ONLYFACE")
                        fn = (data, params) ->
                            (!data.r && PAINT.polyFill(data, params))
                            (data.r && PAINT.cirFill(data, params))
                    else
                        mode = "GENERAL"
                        fn = (data, params) ->
                            if (data.r)
                                PAINT.cirFill(data, params)
                                PAINT.cirEdge(data, params)
                            (data.f && PAINT.polyFill(data, params))
                            (!data.r && PAINT.polyEdge(data, params))
                mixMtxInf = GEOM.unwrapMtx(data_i.mtxScript, {
                    display: @
                    center: data_i["cp"]
                })
                if (!params.cache)
                    obj_i.reset().pushMtx(mixMtxInf[0], mixMtxInf[1]).updateCache()
                fn(data_i, {
                    ctx: ctx
                    display: @
                    mode: mode_i
                    style_edge: if (params.style_edge) then (params.style_edge) else (null)
                    style_fill: if (params.style_fill) then (params.style_fill) else (null)
                })

            # update current status
            cb()
            mode
    )

    CACHE
)
