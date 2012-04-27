define([
    "canvas/canvas_intro"
    "canvas/polydraw"
], (CANVAS_UTIL, POLYDRAW) ->
    console.log("canvas_paint")

    realPaint =
        "polyEdge": (params) ->
            canvas = params.canvas
            ctx = params.ctx
            data = params.data
            mode = params.mode
            style_edge = params.style_edge
            if (mode == "SKELETON")
                ###
                # if mode is SKELETON, the canvas doesnt have graph info.
                # we must run the process for draw
                ###
                (data.f && POLYDRAW.hasFace({
                    "data": data
                    "ctx": ctx
                }))
                (!data.f && POLYDRAW.noFace({
                    "data": data
                    "ctx": ctx
                }))
            (!!style_edge && CANVAS_UTIL.initLine(style_edge))
            ctx.stroke()
        "polyFill": (params) ->
            canvas = params.canvas
            ctx = params.ctx
            data = params.data
            style_fill = params.style_fill
            POLYDRAW.hasFace({
                "data": data
                "ctx": ctx
            })
            (!!style_fill && CANVAS_UTIL.initFill(style_fill))
            ctx.fill()
        "cirEdge": (params) ->
            canvas = params.canvas
            ctx = params.ctx
            data = params.data
            mode = params.mode
            style_edge = params.style_edge
            if (mode == "SKELETON")
                ###
                # if mode is SKELETON, the canvas doesnt have graph info.
                # we must run the process for draw
                ###
                v = data.v
                r = data.r
                ctx.beginPath()
                ctx.arc(v[0][0], v[0][1], r, 0, (Math.PI * 2), false)
                ctx.closePath()
            (!!style_edge && CANVAS_UTIL.initLine(style_edge))
            ctx.stroke()
        "cirFill": (params) ->
            canvas = params.canvas
            ctx = params.ctx
            data = params.data
            style_fill = params.style_fill
            ###
            # draw start
            ###
            v = data.v
            r = data.r
            ctx.beginPath()
            ctx.arc(v[0][0], v[0][1], r, 0, (Math.PI * 2), false)
            ctx.closePath()
            ###
            # draw end
            ###
            (!!style_fill && CANVAS_UTIL.initFill(style_fill))
            ctx.fill()

    CANVAS_UTIL.draw = (params) ->
        params = if (params) then (params) else ({})
        data = params.data
        canvas = params.canvas
        ctx = params.ctx
        if (data && canvas && ctx)
            mode = params.mode
            ###
            # draw start, draw mode check
            ###
            switch (mode)
                when ("SKELETON")
                    (!data.r && realPaint.polyEdge(params))
                    (data.r && realPaint.cirEdge(params))
                when ("ONLYFACE")
                    (data.f && realPaint.polyFill(params))
                    (data.r && realPaint.cirFill(params))
                else
                    params.mode = "GENERAL"
                    (data.r && (realPaint.cirFill(params)
                    realPaint.cirEdge(params)))
                    (data.f && realPaint.polyFill(params))
                    (!data.r && realPaint.polyEdge(params))
        CANVAS_UTIL

    CANVAS_UTIL
)
