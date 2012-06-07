define([
], () ->
    GEOM =
        #look at位置
        #at = [2]
        lookAt: (at, params) ->
            cb = if (params.cb) then (params.cb) else (() ->)
            #display = params.display
            #w = display.w
            #h = display.h
            #ctx = display.ctx
            w = params.w
            h = params.h
            ctx = params.ctx

            if (at && at.length == 2)
                center = [(w / 2), (h / 2)]
                dx = center[0] - at[0]
                dy = center[1] - at[1]
                ctx.map((ctx_i) ->
                    ctx_i.setTransform(1, 0, 0, 1, dx, dy)
                )
                #ctx[0].setTransform(1, 0, 0, 1, dx, dy)
                #ctx[1].setTransform(1, 0, 0, 1, dx, dy)
                #display["at"] = at.map((val) -> val)
                mtx_val = [1, 0, 0, 1, dx, dy]
                cb(mtx_val)

        #scale = [2]
        scale: (scale, params) ->
            cb = if (params.cb) then (params.cb) else (() ->)
            display = params.display
            ctx = display.ctx
            center = params.center #obj center

            if (scale && scale.length == 2)
                #dx = center[0] - center[0] * scale[0]
                #dy = center[1] - center[1] * scale[1]
                #console.log("--- in scale ---")
                #console.log(dx + " , " + dy)
                ctx.map((ctx_i) ->
                    #ctx_i.transform(scale[0], 0, 0, scale[1], dx, dy)
                    ctx_i.transform(scale[0], 0, 0, scale[1], 0, 0)
                )
                #ctx[0].transform(scale[0], 0, 0, scale[1], dx, dy)
                #ctx[1].transform(scale[0], 0, 0, scale[1], dx, dy)
                #mtx_val = [scale[0], 0, 0, scale[1], dx, dy]
                mtx_val = [scale[0], 0, 0, scale[1], 0, 0]
                cb(mtx_val)


        #vec = [2]
        move: (vec, params) ->
            cb = if (params.cb) then (params.cb) else (() ->)
            display = params.display
            ctx = display.ctx
            center = params.center #obj center

            if (vec && vec.length == 2)
                ctx.map((ctx_i) ->
                    ctx_i.transform(1, 0, 0, 1, vec[0], vec[1])
                )
                #ctx[0].transform(1, 0, 0, 1, vec[0], vec[1])
                #ctx[1].transform(1, 0, 0, 1, vec[0], vec[1])
                mtx_val = [1, 0, 0, 1, vec[0], vec[1]]
                cb(mtx_val)


        #position = [2]
        #relation position
        #moveTo: (position, params) ->
        #    display = params.display
        #    ctx = display.ctx
        #    center = params.center #obj center, center有問題

        #    if (position && position.length == 2)
        #        dx = position[0] - center[0]
        #        dy = position[1] - center[1]
        #        ctx[0].transform(1, 0, 0, 1, dx, dy)
        #        ctx[1].transform(1, 0, 0, 1, dx, dy)

        #tfMtx = [6]
        transform: (tfMtx, params) ->
            cb = if (params.cb) then (params.cb) else (() ->)
            display = params.display
            ctx = display.ctx
            center = params.center

            if (tfMtx && tfMtx.length == 6)
                ctx.map((ctx_i) ->
                    ctx_i.transform(tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], tfMtx[4], tfMtx[5])
                )
                #ctx[0].transform(tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], tfMtx[4], tfMtx[5])
                #ctx[1].transform(tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], tfMtx[4], tfMtx[5])
                mtx_val = [tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], tfMtx[4], tfMtx[5]]
                cb(mtx_val)


        #angle is a mutiple number of PI, the base is its center
        rotate: (angle, params) ->
            cb = if (params.cb) then (params.cb) else (() ->)
            display = params.display
            ctx = display.ctx
            center = params.center

            if (typeof angle == "number")
                center_new = [
                    (center[0] * Math.cos(angle) + center[1] * Math.sin(angle)),
                    (-center[0] * Math.sin(angle) + center[1] * Math.cos(angle))
                ]
                vec = [
                    center[0] - center_new[0],
                    center[1] - center_new[1]
                ]
                #ctx[0].rotate(angle)
                #ctx[1].rotate(angle)
                #params.cb = (mtx) ->
                #GEOM.move(vec, params)
                ctx.map((ctx_i) ->
                    #ctx_i.transform(Math.cos(angle), -Math.sin(angle), Math.sin(angle), Math.cos(angle), vec[0], vec[1])
                    ctx_i.transform(Math.cos(angle), -Math.sin(angle), Math.sin(angle), Math.cos(angle), 0, 0)
                )
                #mtx_val = [Math.cos(angle), -Math.sin(angle), Math.sin(angle), Math.cos(angle), vec[0], vec[1]]
                mtx_val = [Math.cos(angle), -Math.sin(angle), Math.sin(angle), Math.cos(angle), 0, 0]
                cb(mtx_val)


        unwrapMtx: (mtxInfos, params) ->
            mixMtx = [1, 0, 0, 1, 0, 0]
            mtxInfos.forEach((val) ->
                key = val[0]
                mtx = val[1]
                mtxArgs = val[2]
                if (mtxArgs)
                    for argi, i of mtxArgs
                        params[i] = argi
                #console.log(val)
                #console.log(GEOM)
                #console.log(GEOM[key])
                if (typeof GEOM[key] == "function")
                    newMtx = []
                    cb = (mtx_val, otherInf) ->
                        newMtx[0] = mtx_val[0] * mixMtx[0] + mtx_val[2] * mixMtx[1]
                        newMtx[1] = mtx_val[1] * mixMtx[0] + mtx_val[3] * mixMtx[1]
                        newMtx[2] = mtx_val[0] * mixMtx[2] + mtx_val[2] * mixMtx[3]
                        newMtx[3] = mtx_val[1] * mixMtx[2] + mtx_val[3] * mixMtx[3]
                        newMtx[4] = mtx_val[0] * mixMtx[4] + mtx_val[2] * mixMtx[5] + mtx_val[4]
                        newMtx[5] = mtx_val[1] * mixMtx[4] + mtx_val[3] * mixMtx[5] + mtx_val[5]
                        mixMtx = newMtx
                    params.cb = cb
                    GEOM[key](mtx, params)
            )
            ["transform", mixMtx]

    GEOM
)
