define([
], () ->
    GEOM =
        #look at位置
        #at = [2]
        lookAt: (at, params) ->
            display = params.display
            w = display.w
            h = display.h
            ctx = display.ctx

            if (at && at.length == 2)
                center = [(w / 2), (h / 2)]
                ctx[0].setTransform(1, 0, 0, 1, (center[0] - at[0]), (center[1] - at[1]))
                ctx[1].setTransform(1, 0, 0, 1, (center[0] - at[0]), (center[1] - at[1]))
                display["at"] = at.map((val) -> val)

        #scale = [2]
        scale: (scale, params) ->
            display = params.display
            ctx = display.ctx
            center = params.center #obj center

            if (scale && scale.length == 2)
                dx = center[0] - center[0] * scale[0]
                dy = center[1] - center[1] * scale[1]
                ctx[0].transform(scale[0], 0, 0, scale[1], dx, dy)
                ctx[1].transform(scale[0], 0, 0, scale[1], dx, dy)

        #vec = [2]
        move: (vec, params) ->
            display = params.display
            ctx = display.ctx
            center = params.center #obj center

            if (vec && vec.length == 2)
                ctx[0].transform(1, 0, 0, 1, vec[0], vec[1])
                ctx[1].transform(1, 0, 0, 1, vec[0], vec[1])

        #position = [2]
        moveTo: (position, params) ->
            display = params.display
            ctx = display.ctx
            center = params.center #obj center

            if (position && position.length == 2)
                dx = position[0] - center[0]
                dy = position[1] - center[1]
                ctx[0].transform(1, 0, 0, 1, dx, dy)
                ctx[1].transform(1, 0, 0, 1, dx, dy)

        #tfMtx = [6]
        transform: (tfMtx, params) ->
            display = params.display
            ctx = display.ctx
            center = params.center

            if (tfMtx && tfMtx.length == 6)
                dx = center[0] - center[0] * tfMtx[0]
                dy = center[1] - center[1] * tfMtx[3]
                ctx[0].transform(tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], (dx + tfMtx[4]), (dy + tfMtx[5]))
                ctx[1].transform(tfMtx[0], tfMtx[1], tfMtx[2], tfMtx[3], (dx + tfMtx[4]), (dy + tfMtx[5]))

        #angle is a mutiple number of PI, the base is its center
        rotate: (angle, params) ->
            display = params.display
            ctx = display.ctx
            center = params.center

            if (typeof angle == "number")
                center_new = [
                    (center[0] * Math.cos(angle) + center[1] * Math.sin(angle)),
                    (-center[0] * Math.sin(angle) + center[1] * Math.cos(angle))
                ]
                vec = [
                    center_new[0] - center[0],
                    center_new[1] - center[1]
                ]
                ctx[0].rotate(angle)
                ctx[1].rotate(angle)
                GEOM.move(vec, params)

        unwrapMtx: (mtxInfos, params) ->
            mtxInfos.forEach((val) ->
                key = val[0]
                mtx = val[1]
                #console.log(val)
                #console.log(GEOM)
                #console.log(GEOM[key])
                GEOM[key](mtx, params)
            )

    GEOM
)
