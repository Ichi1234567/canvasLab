require([
    "geom/mtx"
    "text!../tmpl/mtx.hbs"
], (MTX, MTXMPL) ->
    #console.log(MTXMPL)
    ID = {
        createMtxBtn: "createMtxBtn"
        mtx1in: "mtx1_in"
        mtx2in: "mtx2_in"
        numin: "num_in"
        mtx1out: "mtx1_out"
        mtx2out: "mtx2_out"
        render: "render"
        run: "run"
    }
    CLASS = {
        mtx2: "mtx2"
        mtxInf: "mtx-inf"
        mtxIn: "mtx-in"
        mtxOut: "mtx-out"
    }
    NAME = {
        op: "op"
    }

    ROUTINES =
        opMap: {
            "add": {
                "sym": "+"
                "mtx2_type": "mtx"
            }
            "sub": {
                "sym": "-"
                "mtx2_type": "mtx"
            }
            "multiMtx": {
                "sym": "X"
                "mtx2_type": "mtx"
            }
            "multiNum": {
                "sym": "X"
                "mtx2_type": "num"
            }
            "transpose": {
                "sym": "T"
                "mtx2_type": "none"
            }
            "det": {
                "sym": "det"
                "mtx2_type": "none"
            }
            "invert": {
                "sym": "ivt"
                "mtx2_type": "none"
            }
            "adjustMtx": {
                "sym": "adj"
                "mtx2_type": "none"
            }
        }
        mtx2In: (mtx) ->
            format = mtx.map((row) ->
                result = {}
                result.col = row.map((val) ->
                    {val: val}
                )
                result
            )
            format
        mtx2Out: (mtx) ->
            format = {
                row: mtx.map((row) ->
                    {val: row.join("    ")}
                )
            }
            format
        arr2mtx: (arr, mtxinf) ->
            row = mtxinf[0]
            col = mtxinf[1]
            mtx = MTX.loadZero({
                r: row
                c: col
            })
            arr.map((val, idx) ->
                r = Math.floor(idx / col)
                c = idx % col
                mtx[r][c] = val
            )
            mtx

    VIEW = Backbone.View.extend({
        "initialize": (params) ->
            params = if (params) then (params) else ({})
            r = if (params.r) then (params.r) else (2)
            c = if (params.c) then (params.c) else (2)
            # m1 init
            @m = [0, 1].map(() ->
                MTX.loadIdentity({
                    r: r
                    c: c
                })
            )
            @num = 1
            @

        "events": {
            #"change select[name=op]": "update"
            "click #run": "update"
            "click #createMtxBtn": "newPanel"
        }

        "newPanel" : () ->
            # new matrix data
            mtxinf = [0, 0]
            $("." + CLASS.mtxInf).each((idx) ->
                mtxinf[idx] = parseFloat($(@).attr("value"))
            )
            @initialize({
                r: mtxinf[0]
                c: mtxinf[1]
            })
            # remove input area
            $("." + CLASS.mtxIn).children().remove()
            @renderIn()
            @

        "renderIn": () ->
            $("." + CLASS.mtxIn).children().remove()
            inData = @m.map((mtx) ->
                {
                    IN: {
                        row: ROUTINES.mtx2In(mtx)
                    }
                }
            )
            outData = @m.map((mtx) ->
                ROUTINES.mtx2Out(mtx)
            )
            tplin = inData.map((val) ->
                Mustache.render(MTXMPL, val)
            )
            $("#" + ID.mtx1in).append(tplin[0])

            opVal = $("select[name=op]").attr("value")
            opSymInf = ROUTINES.opMap[opVal]
            opType = opSymInf.mtx2_type
            switch (opType)
                when ("mtx")
                    $("#" + ID.mtx2in).append(tplin[1])
                when ("num")
                    num = {
                        IN: {
                            num: {val: @num}
                        }
                    }
                    tplnum = Mustache.render(MTXMPL, num)
                    $("#" + ID.numin).append(tplnum)

            @
        "render": () ->
            outData = @m.map((mtx) ->
                ROUTINES.mtx2Out(mtx)
            )

            opVal = $("select[name=op]").attr("value")
            opSymInf = ROUTINES.opMap[opVal]
            opSym = opSymInf.sym
            #$("." + CLASS.mtx2).css("visibility", "hidden")
            part2Data = false
            para2 = false
            switch (opSymInf.mtx2_type)
                when ("num")
                    #$("." + CLASS.mtx2).eq(0).css("display", "none")
                    #$("." + CLASS.mtx1).eq(0).css("visibility", "visible")
                    part2Data = {num: {val: @num}}
                    para2 = @num
                when ("mtx")
                    #$("." + CLASS.mtx2).eq(0).css("visibility", "visible")
                    part2Data = outData[1]
                    para2 = @m[1]


            resultVal = MTX[opVal](@m[0], para2)
            console.log(resultVal)
            switch (true)
                when (typeof resultVal[0] == "number")
                    resultData = {
                        num: {
                            val: resultVal[0]
                        }
                    }
                when (resultVal == false)
                    resultData = false
                else
                    resultData = ROUTINES.mtx2Out(resultVal)
            #if (typeof resultVal[0] == "number")
            #    resultData = {
            #        num: {
            #            val: resultVal[0]
            #        }
            #    }
            #else
            #    resultData = ROUTINES.mtx2Out(resultVal)


            outPara = {
                OUT: {
                    mtx1: outData[0]
                    op: opSym
                    mtx2: part2Data
                    result: resultData
                }
            }

            tplout = Mustache.render(MTXMPL, outPara)
            $("#" + ID.render).append(tplout)
            @

        "remove": () ->
            #$("." + CLASS.mtxIn).children().remove()
            $("#" + ID.render).children().remove()
            @
 
        "update": (params) ->
            params = if (params) then (params) else ({})
            view = @
            $inputs = $("." + CLASS.mtxIn).children()
            if ($inputs.length)
                mtxinf = [0, 0]
                $("." + CLASS.mtxInf).each((idx) ->
                    mtxinf[idx] = parseFloat($(@).attr("value"))
                )
                inputVals = $inputs.each((idx, elm) ->
                    inputVals = (() ->
                        vals = []
                        $(elm).children(":input").each(() ->
                            vals.push(parseFloat($(@).attr("value")))
                        )
                        vals
                    )()
                    view.m[idx] = ROUTINES.arr2mtx(inputVals, mtxinf)
                )
                num_val = $("#" + ID.numin).find(":input").eq(0).attr("value")
                view.num = parseFloat(num_val)
            else
                @renderIn()
            @remove()
            @render()
            @

    })
    new VIEW({
        el: "body"
    }).update()

    console.log(MTX)
)
