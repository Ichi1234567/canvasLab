define([
], () ->
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
            #display = params.display
            #current = display.current
            #ctx = display.ctx[current]
            ctx = params.ctx
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
            #display = params.display
            #current = display.current
            #ctx = display.ctx[current]
            ctx = params.ctx
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
            #display = params.display
            #current = display.current
            #ctx = display.ctx[current]
            ctx = params.ctx
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
            #display = params.display
            #current = display.current
            #ctx = display.ctx[current]
            ctx = params.ctx
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
    realPaint
)
