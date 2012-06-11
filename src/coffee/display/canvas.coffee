define([
    "../geom/geom",
    "../geom/mtx",
    "display/paint"
] , (GEOM, MTX, PAINT) ->
    ROUTINES = {
        mtxarr2mtx: (mtxarr) ->
            #console.log(MTX)
            mtx = MTX.loadIdentity()
            mtx[0][0] = mtxarr[0]
            mtx[1][0] = mtxarr[1]
            mtx[0][1] = mtxarr[2]
            mtx[1][1] = mtxarr[3]
            mtx[0][2] = mtxarr[4]
            mtx[1][2] = mtxarr[5]
            mtx
        mtx2mtxarr: (mtx) ->
            mtxarr = [
                mtx[0][0],
                mtx[1][0],
                mtx[0][1],
                mtx[1][1],
                mtx[0][2],
                mtx[1][2],
            ]
            mtxarr
        assignPt2mtx: (pt) ->
            ptmtx = MTX.loadZero({r: 3, c: 1})
            ptmtx[0][0] = pt[0]
            ptmtx[1][0] = pt[1]
            ptmtx[2][0] = 1
            ptmtx
        assignmtx2Pt: (mtx) ->
            pt = [
                mtx[0][0],
                mtx[1][0]
            ]
            pt
        getbb: (x, y, w, h) ->
            bb = [
                [x, y],
                [(x + w), y],
                [(x + w), (y + h)],
                [x, (y + h)]
            ]
            bb
    }

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

        "updateCanvas": (params) ->
            mode = params.mode
            objs = params.objs
            cb = if (params.cb) then (params.cb) else (()->)

            #current
            canvas = params.canvas
            ctx = params.ctx

            display = @

            for obj_i, i in objs
                data_i = obj_i.data
                mode_i = if (mode) then (mode) else (data_i.mode)
                cp = data_i["cp"]
                #console.log(data_i)
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
                    display: display
                    center: cp
                })

                obj_i.reset().pushMtx(mixMtxInf[0], mixMtxInf[1])

                fn(data_i, {
                    ctx: ctx
                    display: display
                    mode: mode_i
                    style_edge: if (params.style_edge) then (params.style_edge) else (null)
                    style_fill: if (params.style_fill) then (params.style_fill) else (null)
                })

                # update cache
                if (!params.cache)
                    mtx = ROUTINES.mtxarr2mtx(mixMtxInf[1])
                    _min = data_i.min
                    _max = data_i.max
                    _size = data_i.size
                    tmpbb = ROUTINES.getbb(_min[0], _min[1], _size[0], _size[1])
                    bb = tmpbb.map((val) ->
                        #console.log(val.join())
                        valmtx = ROUTINES.assignPt2mtx(val)
                        tmp = MTX.multiMtx(mtx, valmtx)
                        val = ROUTINES.assignmtx2Pt(tmp)
                        #console.log(val)
                        val
                    )
                    _min = $.extend([], bb[0])
                    _max = $.extend([], bb[0])
                    bb.map((val) ->
                        _min[0] = Math.min(_min[0], val[0])
                        _min[1] = Math.min(_min[1], val[1])
                        _max[0] = Math.max(_max[0], val[0])
                        _max[1] = Math.max(_max[1], val[1])
                    )
                    _size = [
                        Math.abs(_min[0] - _max[0]),
                        Math.abs(_min[1] - _max[1])
                    ]

                    obj_i.updateCache({
                        canvas: canvas
                        ctx: ctx
                        display: display
                        min: _min
                        max: _max
                        size: _size
                    })

            # update current status
            cb()
            mode
    )

    CACHE
)
