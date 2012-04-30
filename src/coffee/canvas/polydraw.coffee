define([
], () ->
    POLYDRAW =
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

    POLYDRAW
)
