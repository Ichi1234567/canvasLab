define([
], () ->
    VIEW =
        "viewAt": (params) ->
            params = if (params) then (params) else ({})
            ctx = params.ctx
            canvas = params.canvas
            dataObj = params.data
            at = params.pos
            if (ctx && canvas && dataObj)
                pos = if (dataObj["_cp"]) then (dataObj["_cp"]) else ([0, 0])
                pos = if(at) then (at) else (pos)
                center = [canvas.width / 2, canvas.height / 2]
                ctx.setTransform(1, 0, 0, 1, (center[0] - parseFloat(pos[0])), (center[1] - parseFloat(pos[1])))
            pos

        "scale": (params) ->
            #console.log("scale")
            params = if (params) then (params) else ({})
            ctx = params.ctx
            canvas = params.canvas
            scale = params.scale
            dataObj = params.data
            if (ctx && canvas && dataObj)
                origin_size = [dataObj.w, dataObj.h]
                at = if (params.at) then (params.at) else (dataObj["_cp"])
                switch (scale)
                    when ("auto")
                        scale = [1, 1]
                        center = [0, 0]
                        if (origin_size)
                            min = Math.min(origin_size[0], origin_size[1])
                            min = Math.floor(Math.min(canvas.width, canvas.height) / min)
                            scale = [min, min]

                #console.log(scale[0] + " , " + scale[1])
                #console.log(center[0] + " , " + center[1])
                ctx.transform(scale[0], 0, 0, scale[1], -at[0] * scale[0], -at[1] * scale[1])
                ctx.lineWidth = ctx.lineWidth / (scale[0] + scale[1]) / 2
                
    VIEW
)
