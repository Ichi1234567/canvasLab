define([
    "../geom/geom"
] , (GEOM) ->
    # polydraw
    polyDraw =
        "noFace": (params) ->
            data = params.data
            ctx = params.ctx
            cb = if (params.cb) then (params.cb) else (()->)

            vnum = data.vnum
            v = data.v
            ctx.beginPath()
            ctx.moveTo(v[0][0], v[0][1])
            for i in [1..vnum]
                v_i = v[i]
                ctx.lineTo(v_i[0], v_i[1])

            cb()

        "hasFace": (params) ->
            data = params.data
            ctx = params.ctx
            cb = if (params.cb) then (params.cb) else (()->)
            type = params.type

            fnum = data.fnum
            f = data.f
            v = data.v
            switch (type)
                when ("fill")
                    paintFn = (f_ij, v, ctx) ->
                        f_ij_full = f_ij.split("/")
                        idx = parseInt(f_ij_full[0])
                        ctx.lineTo(v[idx][0], v[idx][1])
                        false
                else
                    paintFn = (f_ij, v, ctx, b_mv) ->
                        f_ij_full = f_ij.split("/")
                        idx = parseInt(f_ij_full[0])
                        if (b_mv)
                            ctx.moveTo(v[idx][0], v[idx][1])
                        else
                            ctx.lineTo(v[idx][0], v[idx][1])
                        b_mv = if (f_ij_full.length > 1) then (!parseInt(f_ij_full[1])) else (false)
                        b_mv

            for f_i, i in f
                ctx.beginPath()
                b_mv = true
                for f_ij, j in f_i
                    b_mv = paintFn(f_ij, v, ctx, b_mv)
                f0 = f_i[0].split("/")
                idx = parseInt(f0[0])
                if b_mv
                    ctx.moveTo(v[idx][0], v[idx][1])
                else
                    ctx.lineTo(v[idx][0], v[idx][1])
                #ctx.closePath()
                cb()
    # realPaint
    realPaint =
        "polyEdge": (data, params) ->
            display = params.display
            current = display.current
            ctx = display.ctx[current]
            mode = params.mode
            style_edge = params.style_edge
            if (mode == "SKELETON")
                ###
                # if mode is SKELETON, the canvas doesnt have graph info.
                # we must run the process for draw
                ###
                (data.f && polyDraw.hasFace({
                    "data": data
                    "ctx": ctx
                    "cb": (() ->
                        (style_edge && display.setStyle(style_edge))
                        ctx.stroke()
                    )
                }))
                (!data.f && polyDraw.noFace({
                    "data": data
                    "ctx": ctx
                    "cb": (() ->
                        (style_edge && display.setStyle(style_edge))
                        ctx.stroke()
                    )
                }))
        "polyFill": (data, params) ->
            display = params.display
            current = display.current
            ctx = display.ctx[current]
            style_fill = params.style_fill
            polyDraw.hasFace({
                "data": data
                "ctx": ctx
                "type": "fill"
                "cb": (() ->
                    (style_fill && display.setStyle(style_fill))
                    ctx.fill()
                )
            })
        "cirEdge": (data, params) ->
            display = params.display
            current = display.current
            ctx = display.ctx[current]
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
            (style_edge && display.setStyle(style_edge))
            ctx.stroke()
        "cirFill": (data, params) ->
            #console.log(arguments)
            display = params.display
            current = display.current
            ctx = display.ctx[current]
            style_fill = params.style_fill
            ###
            # draw start
            ###
            v = data.v
            r = data.r
            ctx.beginPath()
            ctx.arc(v[0][0], v[0][1], r, 0, (Math.PI * 2), false)
            ctx.closePath()
            ####
            ## draw end
            ####
            (style_fill && display.setStyle(style_fill))
            ctx.fill()

    console.log("---display---")
    DISPLAY = Backbone.Model.extend(
        "initialize": (params) ->
            #@mode = "GENERAL"
            @current = 0
            @w = params.width
            @h = params.height
            @canvas = [
                $("<canvas></canvas>").css({
                    "display": "block"
                    "border": "1px solid black"
                }),
                $("<canvas></canvas>").css({
                    "display": "none"
                    "border": "1px solid black"
                })
            ]
            @canvas[0].get(0).width = @w
            @canvas[0].get(0).height = @h
            @canvas[1].get(0).width = @w
            @canvas[1].get(0).height = @h
            @ctx = [
                @canvas[0].get(0).getContext("2d"),
                @canvas[1].get(0).getContext("2d")
            ]
            @ctx[0].lineCap = "round"
            @ctx[1].lineCap = "round"
            @ctx[0].lineJoin = "round"
            @ctx[1].lineJoin = "round"
            params.display.append(@canvas[0])
                            .append(@canvas[1])
            @lookat = [(@w / 2), (@h / 2)]
            @

        "reset": (params) ->
            @lookat = [(@w / 2), (@h / 2)]
            @

        # switch the canvas
        "switchCanvas": (params) ->
            params = if (params) then (params) else ({})
            prev = params.prev
            current = params.current
            displayVal = ["block", "none"]
            @clear()
            @canvas[current].css("display", displayVal[0])
            @canvas[prev].css("display", displayVal[1])
            @current = current
            @

        "clear": (params) ->
            params = if (params) then (params) else ({})
            current = @current
            x = if (params.x) then (params.x) else (0)
            y = if (params.y) then (params.y) else (0)
            w = if (params.w) then (params.w) else (@w)
            h = if (params.h) then (params.h) else (@h)
            #reset ctx
            @ctx[current].setTransform(1, 0, 0, 1, 0, 0)
            @ctx[current].clearRect(x, y, w, h)
            @

        "setStyle": (params) ->
            params = if (params) then (params) else ({})
            current = @current
            ctx = @ctx[current]
            for val, i of params
                ctx[i] = val
            @
        "lookAt": (at) ->
            at = if (at && at.length == 2) then (at) else (@.lookat)
            if (at && at.length == 2)
                @lookat = at
                GEOM.lookAt(at, {
                    display: @
                })
            @

        "updateCanvas": (params) ->
            params = if (params) then (params) else ({})
            #
            #
            mode = params.mode
            data = params.data
            cb = if (params.cb) then (params.cb) else (()->)

            # switch to the clear canvas
            prev = @current
            current = (@current + 1) % 2
            @switchCanvas({
                prev: prev
                current: current
            })
            canvas = @canvas[current]
            ctx = @ctx[current]
            otherCtx = @ctx[prev]
            # drawing on the canvas
            #

            at = @at
            GEOM.lookAt(at, {
                display: @
            })
            for data_i, i in data
                mode_i = if (mode) then (mode) else (data_i.mode)
                switch (mode_i)
                    when ("SKELETON")
                        fn = (data, params) ->
                            (!data.r && realPaint.polyEdge(data, params))
                            (data.r && realPaint.cirEdge(data, params))
                    when ("ONLYFACE")
                        fn = (data, params) ->
                            (!data.r && realPaint.polyFill(data, params))
                            (data.r && realPaint.cirFill(data, params))
                    else
                        mode = "GENERAL"
                        fn = (data, params) ->
                            if (data.r)
                                realPaint.cirFill(data, params)
                                realPaint.cirEdge(data, params)
                            (data.f && realPaint.polyFill(data, params))
                            (!data.r && realPaint.polyEdge(data, params))
                ctx.save()
                otherCtx.save()
                GEOM.unwrapMtx(data_i.mtxScript, {
                    display: @
                    center: data_i["cp"]
                })
                fn(data_i, {
                    display: @
                    mode: mode_i
                    style_edge: if (params.style_edge) then (params.style_edge) else (null)
                    style_fill: if (params.style_fill) then (params.style_fill) else (null)
                })
                ctx.restore()
                otherCtx.restore()

            # update current status
            @mode = mode
            cb()
            @
    )
    DISPLAY
)
