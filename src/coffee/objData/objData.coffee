define([
    #"../evts/evts",
    "../display/cache"
    "../geom/mtx"
], (CACHE, MTX) ->
    console.log("---objData---")

    parse = (txt) ->
        #console.log("parse")
        #console.log(txt)
        objData = {
            v: []
            f: []
        }
        lines = txt.split("\n")
        sumv = [0, 0]
        lines.forEach((line) ->
            if (line.length)
                vals = line.split(" ")
                key = vals[0].replace("_", "")
                switch (true)
                    #v, _cp
                    when ((/^v/g).test(line)), ((/_cp/g).test(line))
                        val = vals.slice(1)
                        (!objData[key] && (objData[key] = []))
                        if (key != "cp")
                            sumv.forEach((data, idx) ->
                                val[idx] = parseFloat(val[idx])
                                sumv[idx] += val[idx]
                                if (!objData["min"])
                                    objData["min"] = []
                                    objData["max"] = []
                                if (typeof objData["min"][idx] != "number")
                                    objData["min"][idx] = val[idx]
                                    objData["max"][idx] = val[idx]
                                objData["min"][idx] = Math.min(objData["min"][idx], val[idx])
                                objData["max"][idx] = Math.max(objData["max"][idx], val[idx])
                            )
                            objData[key].push(val)
                        else
                            val.forEach((data) ->
                                objData[key].push(parseFloat(data))
                            )
                    #f
                    when ((/^f/g).test(line))
                        val = vals.slice(1)
                        objData[key].push(val)
                    #_g, _v, _f, r
                    when ((/^_g/g).test(line)), ((/^_v/g).test(line)), ((/^_f/g).test(line)), ((/^r/g).test(line))
                        val = vals[1]
                        ((key == "f" or key == "v") && (key += "num"))
                        ((key != "g") && (val = parseFloat(val)))
                        objData[key] = val
                    #default
                    else
                        val = vals.slice(1)
                        objData[key] = val
        )
        # the whole info
        (!objData["g"] && (objData["g"] = ""))
        (!objData["vnum"] && (objData["vnum"] = objData["v"].length))
        (!objData["fnum"] && (objData["fnum"] = objData["f"].length))
        (!objData["cp"] && (objData["cp"] = [(sumv[0] / objData["vnum"]), (sumv[1] / objData["vnum"])]))
        if (objData["r"])
            objData["size"] = []
            objData["size"] = [(2 * objData["r"]), (2 * objData["r"])]
            objData["cp"].forEach((data, idx) ->
                r = objData["r"]
                objData["min"][idx] = data - r
                objData["max"][idx] = data + r
                objData["size"][idx] = 2 * r
            )
        else
            objData["size"] = []
            objData["min"].forEach((data, idx) ->
                objData["size"][idx] = objData["max"][idx] - objData["min"][idx]
            )
        # return data
        objData

    OBJDATA = Backbone.Model.extend(
        "initialize": (params) ->
            #console.log("objData initialize")
            #console.log(params)
            if (params[1] == "success")
                @data = parse(params[0])
                @data["mtxScript"] = []
                @data["mode"] = "GENERAL"
                @parent = if (params.parent) then (params.parent) else (null)
                @children = if (params.children) then (params.children) else ([])
                @evts = {
                    "mousedown": []
                    "mouseup": []
                    "click": []
                    "dblclick": []
                }
            @
        "reset": (params) ->
            @data["mtxScript"] = []
            @
        "pushMtx": (key, mtx, params) ->
            @data["mtxScript"].push([key, mtx, params])
            @
        "cache": (params) ->
            params = if (params) then (params) else ({})
            min = @data.min
            size = @data.size
            params.x = min[0]
            params.y = min[1]
            params.w = size[0]
            params.h = size[1]
            params.mtx = @data["mtxScript"]
            @cache = new CACHE(params)
            @
        "updateCache": (params) ->
            #console.log("updateCache")
            params = if (params) then (params) else ({})
            params.mtx = @data["mtxScript"]
            params.objs = [@]
            @cache.updateCanvas(params)
            @

        "bindEvt": (evtype, fn) ->
            if (typeof @evts[evtype] != "undefined")
                @evts[evtype].push(fn)
            @
        "cancelEvt": (evtype, fn) ->
            if (typeof @evts[evtype] != "undefined")
                for fn_i, i in @evts[evtype]
                    if (fn_i == fn)
                        delete @evts[evtype][i]
                        i = @evts[evtype].length
            @

        "_hitTest": () ->
            result = false
            result
        "isIn": (params) ->
            #console.log("isIn~?")
            result = false
            pt = params.pt
            #console.log(pt.join())
            localPt = @pt2local(params)
            #localPt2 = [
            #    (localPt[0] + cache.x),
            #    (localPt[1] + cache.y)
            #]
            #console.log("--- local ---")
            #console.log(localPt0.join())
            #console.log("local-pt：" + localPt.join())
            #console.log(localPt2.join())
            cache = @cache
            #console.log(cache)
            localPt = [
                (localPt[0] - cache.x),
                (localPt[1] - cache.y)
            ]
            cacheCtx = cache.ctx[0]
            color = cacheCtx.getImageData(localPt[0], localPt[1], 1, 1).data
            #console.log(color)
            #result
            #(!!color[3])
            result = false
            if (!!color[3])
                #console.log("-------------------------")
                #console.log(params.e.type)
                #console.log(@evts["click"])
                #console.log(@evts[params.e.type])
                fna = $.extend([], @evts[params.e.type])
                result = {
                    fna: fna
                }
            result

        "pt2local": (params) ->
            params = if (params) then (params) else ({})

            localPt = false
            pt = params.pt
            #console.log(pt.join())
            mtx = @data["mtxScript"][0][1]
            mtxArr = MTX.loadIdentity()
            mtxArr[0][0] = mtx[0]
            mtxArr[1][0] = mtx[1]
            mtxArr[0][1] = mtx[2]
            mtxArr[1][1] = mtx[3]
            mtxArr[0][2] = mtx[4]
            mtxArr[1][2] = mtx[5]
            invMtx = MTX.invert(mtxArr)
            #console.log("--- invMtx ---")
            #console.log(invMtx)
            pta = [[pt[0]], [pt[1]], [1]]
            #console.log("pta")
            #console.log(pta)
            localPtMtx = MTX.multiMtx(invMtx, pta)
            #console.log(mtx)
            #console.log(mtxArr)
            #console.log(MTX)
            #console.log(localPtMtx)
            cache = @cache
            #console.log(cache)
            cacheCtx = cache.ctx[0]
            localPt = [
                localPtMtx[0][0],
                localPtMtx[1][0]
            ]

            localPt

        "pt2globle": (params) ->
            params = if (params) then (params) else ({})
            cb = if (params.cb) then (params.cb) else (() ->)

            globlePt = false

            pt = params.pt
            mtx = @data["mtxScript"][0][1]
            mtxArr = MTX.loadIdentity()
            mtxArr[0][0] = mtx[0]
            mtxArr[1][0] = mtx[1]
            mtxArr[0][1] = mtx[2]
            mtxArr[1][1] = mtx[3]
            mtxArr[0][2] = mtx[4]
            mtxArr[1][2] = mtx[5]
            pta = [[pt[0]], [pt[1]], [1]]
            globlePtMtx = MTX.multiMtx(mtxArr, pta)
            globlePt = [
                globlePtMtx[0][0],
                globlePtMtx[1][0]
            ]

            cb(globlePt)

            globlePt
    )
    

    OBJDATA
)
