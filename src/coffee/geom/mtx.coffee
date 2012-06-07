define([
], () ->
    # 3x3 mtx, row major
    # [                          [
    #   [m11, m12, m13]   in 2D    [m11, m12, dx]
    #   [m21, m22, m23]   ----->   [m21, m22, dy]
    #   [m31, m32, m33]            [ 0,   0,   1]
    # ]                          ]
    #
    #    in canvas
    #  ------------>  ctx.setTransform(m11, m21, m12, m22, dx, dy)
    #  transform fn
    MTX =
        "loadIdentity": (params) ->
            params = if (params) then (params) else ({})
            r = if (params.r) then (params.r) else (3)
            c = if (params.c) then (params.c) else (3)
            result = []
            for i in [0...r]
                rs = []
                for j in [0...c]
                    val = if (i == j) then (1) else (0)
                    rs.push(val)
                result.push(rs)
            result
        "loadZero": (params) ->
            params = if (params) then (params) else ({})
            r = if (params.r) then (params.r) else (3)
            c = if (params.c) then (params.c) else (3)
            result = []
            for i in [0...r]
                rs = []
                for j in [0...c]
                    rs.push(0)
                result.push(rs)
            result
        "mesureDim": (mtx) ->
            {
                "r": mtx.length
                "c": mtx[0].length
            }
        "cloneMtx": (mtx) ->
            dim = MTX.mesureDim(mtx)
            result = MTX.loadZero(dim)
            result = MTX.add(result, mtx)
            result
        # mtx1 + mtx2
        "add": (mtx1, mtx2) ->
            result = mtx1.map((row, rowIdx) ->
                row.map((val, colIdx) ->
                    (val + mtx2[rowIdx][colIdx])
                )
            )
            result
        # mtx1 - mtx2
        "sub": (mtx1, mtx2) ->
            result = mtx1.map((row, rowIdx) ->
                row.map((val, colIdx) ->
                    (val - mtx2[rowIdx][colIdx])
                )
            )
            result
        "multiMtx": (mtx1, mtx2) ->
            phi = 100000
            dim1 = MTX.mesureDim(mtx1)
            dim2 = MTX.mesureDim(mtx2)
            dim = {
                r: dim1.r
                c: dim2.c
            }
            #console.log(dim.r + " , " + dim.c)
            result = MTX.loadZero(dim)
            rows = mtx1.length
            cols = mtx2[0].length
            for i in [0...dim1.r]
                for j in [0...dim1.c]
                    for k in [0...dim2.c]
                        result[i][k] += (mtx1[i][j] * mtx2[j][k])
                result[i][(k - 1)] = Math.floor(result[i][(k - 1)] * phi) / phi
            result
        "multiNum": (mtx1, num) ->
            phi = 100000
            result = mtx1.map((row) ->
                row.map((val) ->
                    (Math.floor((num * val * phi)) / phi)
                )
            )
            result
        "transpose": (mtx) ->
            dim = MTX.mesureDim(mtx)
            result = MTX.loadZero(dim)
            mtx.map((row, rowIdx) ->
                row.map((val, colIdx) ->
                    result[colIdx][rowIdx] = val
                )
            )
            result
        #方陣才可以用
        "reductMtx": (mtx, ridx, cidx, dim, opts) ->
            opts = if (opts) then (opts) else ({})
            coef = if (opts.nocoef) then (false) else (true)
            result = MTX.loadZero(dim)
            #pre_val = if (coef) then (Math.pow((-1), ((ridx + cidx) % 2)) * mtx[ridx][cidx]) else (1)
            sgn = Math.pow((-1), (ridx + cidx))
            #console.log("-------------------------")
            #console.log(ridx + " , " + cidx)
            mtx.map((row, rowIdx) ->
                if (rowIdx != ridx)
                    new_r = if (rowIdx < ridx) then (rowIdx) else (rowIdx - 1)
                    one_row = row.map((val, colIdx) ->
                        if (colIdx != cidx)
                            new_c = if (colIdx < cidx) then (colIdx) else (colIdx - 1)
                            #console.log(new_r + " , " + new_c)
                            #console.log(val)
                            #console.log(pre_val)
                            #result[new_r][new_c] = val * pre_val
                            result[new_r][new_c] = val
                            result.coef = mtx.coef * mtx[ridx][cidx] * sgn
                    )
            )
            result
        "det": (mtx) ->
            dim = MTX.mesureDim(mtx)
            mtx.coef = 1
            det = [mtx]
            count = 0
            if (dim.r == dim.c)
                while (det[0].length != 1)
                    count++
                    if (count == 10)
                        console.log("error")
                        return
                    newdim = {
                        r: (dim.r - 1)
                        c: (dim.c - 1)
                    }
                    newr = dim.r - 1
                    newc = dim.c - 1
                    half = []
                    det.map((mtx) ->
                        mtx.map((mtx_i, ridx) ->
                            result = MTX.reductMtx(mtx, ridx, 0, newdim)
                            half.push(result)
                        )
                    )
                    #console.log(half)
                    #debugger
                    det = half
                    dim = newdim
                if (det.length > 1)
                    detResult = MTX.loadZero(newdim)
                    #console.log(det)
                    det.map((mtx) ->
                        tmp = mtx
                        if (typeof mtx.coef == "number")
                            tmp = MTX.multiNum(mtx, mtx.coef)
                        detResult = MTX.add(detResult, tmp)
                    )
                else
                    detResult = mtx
            detResult[0]

        "adjustMtx": (mtx) ->
            dim = MTX.mesureDim(mtx)
            subdim = {
                r: dim.r - 1
                c: dim.c - 1
            }
            tmtx = MTX.loadZero(dim)
            # 依照順序求sub-det
            mtx.map((row, ridx) ->
                row.map((val, cidx) ->
                    submtx = MTX.reductMtx(mtx, ridx, cidx, subdim, {nocoef: true})
                    #console.log(submtx)
                    subdet = MTX.det(submtx)
                    #console.log(subdet)
                    tmtx[ridx][cidx] = Math.pow(-1, (ridx + cidx)) * subdet
                )
            )
            adjustMtx = MTX.transpose(tmtx)
            adjustMtx

        "invert": (mtx) ->
            dim = MTX.mesureDim(mtx)
            result = false
            # det
            det = MTX.det(mtx)
            if (det)
                # middle-mtx
                adjustMtx = MTX.adjustMtx(mtx)
                result = MTX.multiNum(adjustMtx, (1 / det))
            
            result

    MTX
)
