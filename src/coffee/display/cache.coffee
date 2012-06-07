define([
    "display/canvas",
    "../geom/mtx"
] , (CANVAS, MTX) ->
    console.log("---cache---")
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
    }

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

        "getBBbyLimit": (min, max) ->
            bb = [
                min,
                [max[0], min[1]],
                max,
                [min[0], max[1]]
            ]
            bb
        "getBB": () ->
            #x = if (@new_min) then (@new_min[0]) else (@x)
            #y = if (@new_min) then (@new_min[1]) else (@y)
            x = @x
            y = @y
            bb = [
                [x, y],
                [(x + @w), y],
                [(x + @w), (y + @h)],
                [x, (y + @h)]
            ]
            bb
        "getSize": (bb) ->
            size = [
                Math.abs(bb[0][0] - bb[1][0]),
                Math.abs(bb[0][1] - bb[3][1])
            ]
            size

        "updateCanvas": (params) ->
            #console.log("--------------------------")
            #console.log("cache update")
            @clear()
            params = if (params) then (params) else ({})
            @mtx = if (params.mtx) then (params.mtx) else (@mtx)
            canvas = @canvas[0]
            ctx = @ctx[0]

            params.canvas = canvas
            params.ctx = ctx
            params.cache = true

            mtx = ROUTINES.mtxarr2mtx(@mtx[0][1])
            tmpbb = @getBB()
            bb = tmpbb.map((val) ->
                #console.log(val.join())
                valmtx = ROUTINES.assignPt2mtx(val)
                tmp = MTX.multiMtx(mtx, valmtx)
                val = ROUTINES.assignmtx2Pt(tmp)
                #console.log(val)
                val
            )
            min = $.extend([], bb[0])
            max = $.extend([], bb[0])
            bb.map((val) ->
                min[0] = Math.min(min[0], val[0])
                min[1] = Math.min(min[1], val[1])
                max[0] = Math.max(max[0], val[0])
                max[1] = Math.max(max[1], val[1])
            )
            @new_min = min
            @new_max = max
            #@x = min[0]
            #@y = min[1]
            #console.log("min：" + min.join())
            #console.log("max：" + max.join())
            bb = @getBBbyLimit(min, max)
            #size = @getSize(bb)
            size = [
                Math.abs(min[0] - max[0]),
                Math.abs(min[1] - max[1])
            ]
            #@w = size[0]
            #@h = size[1]
            #console.log("size：" + size.join())
            $(canvas).attr("width", size[0])
                    .attr("height", size[1])
            ctx.setTransform(1, 0, 0, 1, -min[0], -min[1])
            #ctx.setTransform(1, 0, 0, 1, -@x, -@y)


            at = @lookat
            #@lookat = at
            #@lookAt(at)
            # 改成setTransform，和lookAt合併
            ctx.save()
            mode = super params
            ctx.restore()
            @mode = mode
            #console.log("--------------------------")
            @

    CACHE
)
