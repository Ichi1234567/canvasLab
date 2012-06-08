define([
    "display/canvas"
] , (CANVAS) ->
    console.log("---display---")
    class DISPLAY extends CANVAS
        "initialize": (params) ->
            console.log("init - display")
            @objs = []
            @current = 0
            @w = params.width
            @h = params.height
            @canvas = [
                $("<canvas></canvas>").css({
                    "display": "block"
                    "border": "1px solid black"
                }),
                $("<canvas></canvas>").css({
                    "display": "none"
                    "border": "1px solid black"
                })
            ]
            @canvas[0].get(0).width = @w
            @canvas[0].get(0).height = @h
            @canvas[1].get(0).width = @w
            @canvas[1].get(0).height = @h
            @ctx = [
                @canvas[0].get(0).getContext("2d"),
                @canvas[1].get(0).getContext("2d")
            ]
            @ctx[0].lineCap = "round"
            @ctx[1].lineCap = "round"
            @ctx[0].lineJoin = "round"
            @ctx[1].lineJoin = "round"
            #@ctx[0].setTransform(1, 0, 0, 1, 0, 0)
            #@ctx[1].setTransform(1, 0, 0, 1, 0, 0)
            params.display.append(@canvas[0])
                            .append(@canvas[1])
            @lookat = [(@w / 2), (@h / 2)]
            @status = ""
            @enableEvts()
            @

        # switch the canvas
        "switchCanvas": (params) ->
            params = if (params) then (params) else ({})
            prev = params.prev
            current = params.current
            displayVal = ["block", "none"]
            @clear()
            @canvas[current].css("display", displayVal[0])
            @canvas[prev].css("display", displayVal[1])
            @current = current
            @

        "clear": (params) ->
            params = if (params) then (params) else ({})
            params.ctx = @ctx[@current]
            params.x = if (params.x) then (params.x) else (0)
            params.y = if (params.y) then (params.y) else (0)
            params.w = if (params.w) then (params.w) else (@w)
            params.h = if (params.h) then (params.h) else (@h)

            super params
            @

        "setStyle": (params) ->
            params = if (params) then (params) else ({})
            params.ctx = @ctx[@current]

            super params
            @

        "reset": (params) ->
            super params
            @
        "pushObj": (params) ->
            params = if (params) then (params) else ({})
            isclear = if (params.clear) then (true) else (false)
            len = if (isclear) then (0) else (@objs.length)
            rmNo = if (isclear) then (@objs.length) else (0)
            (params.obj && @objs.splice(len, rmNo, params.obj))
            #console.log(@objs)
            @

        "updateCanvas": (params) ->
            # switch to the clear canvas
            #console.log("in display")
            prev = @current
            current = (@current + 1) % 2
            @switchCanvas({
                prev: prev
                current: current
            })
            canvas = @canvas[current]
            ctx = @ctx[current]
            otherCtx = @ctx[prev]

            params.objs = @objs
            params.canvas = canvas
            params.ctx = ctx
            at = @lookat
            @lookAt(at)
            ctx.save()
            otherCtx.save()
            mode = super params
            ctx.restore()
            otherCtx.restore()
            @mode = mode
            @
        "enableEvts": () ->
            display = @
            canvas = @canvas
            canvas.map(($canvas_i) ->
                $canvas_i.bind({
                    "mousedown": (e) ->
                        #console.log("down")
                        pt = [
                            e.offsetX,
                            e.offsetY
                        ]
                        display._handleEvts({
                            pt: pt
                            e: e
                        })
                    "mouseup": (e) ->
                        #console.log("up")
                        pt = [
                            e.offsetX,
                            e.offsetY
                        ]
                        display._handleEvts({
                            pt: pt
                            e: e
                        })
                    "click": (e) ->
                        #console.log("click")
                        pt = [
                            e.offsetX,
                            e.offsetY
                        ]
                        display._handleEvts({
                            pt: pt
                            e: e
                        })
                    "dblclick": (e) ->
                        #console.log("dblclick")
                        pt = [
                            e.offsetX,
                            e.offsetY
                        ]
                        display._handleEvts({
                            pt: pt
                            e: e
                        })
                    #"mouseover": (e) ->
                    #    console.log("over")
                    #    #console.log(e)
                    #    #pt = [e.offsetX, e.offsetY]
                    #"mouseout": (e) ->
                    #    console.log("out")
                    #"mousemove": (e) ->
                    #    console.log("move")
                })
            )
            @
        "disableEvts": () ->
            @
        "_handleEvts": (params) ->
            #console.log("_handleEvts")
            #target = getObjectsUnderPoint
            #if tartget != null
            #target.onXXX(evt)
            pt = params.pt
            ctx = @ctx[@current]
            h = @h
            w = @w
            color = ctx.getImageData(pt[0], pt[1], 1, 1).data
            #has alpha
            #這個，可能也要改成%4==3
            if (color[3])
                # at + delta = center ---> delta = center - at
                # ? + delta = pt
                # ? = pt - delta = pt - (center - at)
                lookat = @lookat #center
                #console.log(lookat.join())
                newpt = [
                    (pt[0] - (w / 2) + lookat[0]),
                    (pt[1] - (h / 2) + lookat[1])
                ]
                params.pt = newpt
                result = @getObjectsUnderPoint(params)
                if (result.inside)
                    #console.log(result)
                    if (!!result.fna && result.fna.length)
                        for fna_i, i in result.fna
                            fna_i(params.e, result.target)
                    #console.log(params.e.type)
            else
                @getObjectsUnderPoint(params)
            @
        "getObjectsUnderPoint": (params) ->
            result = null
            children = @objs
            for children_i, i in children
                result = children_i.isIn(params)
                (result && (result.target = children_i
                i = children.length))
            result

        "getPtFromObject": (params) ->
            result = null
            params = if (params) then (params) else ({})
            obj = if (params.obj) then (params.obj) else (null)
            tmpPt = if (params.pt) then (params.pt) else (null)
            #if (obj && tmpPt)
            #   console.log(123) 
            result

    DISPLAY
)
