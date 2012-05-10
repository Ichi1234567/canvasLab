define([
    #"../evts/evts",
    "../display/cache"
], (CACHE) ->
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
            console.log("updateCache")
            params = if (params) then (params) else ({})
            params.mtx = @data["mtxScript"]
            params.objs = [@]
            @cache.updateCanvas(params)
            @

        "_hitTest": () ->
            result = false
            result
        "mouseover": (params) ->
            params = if (params) then (params) else ({})
            pt = params.pt
            if (pt)
                console.log(pt)
            @
        "isIn": (params) ->
            result = false
            pt = params.pt
            result
        "pt2local": () ->
    )
    

    OBJDATA
)
