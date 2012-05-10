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
            len = @objs.length
            rmNo = if (isclear) then (len) else (0)
            (params.obj && @objs.splice(len, rmNo, params.obj))
            @

        "updateCanvas": (params) ->
            # switch to the clear canvas
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
                        console.log("down")
                        pt = [e.offsetX, e.offsetY]
                        display._handleEvts({
                            pt: pt
                            e: e
                        })
                    #"mousemove": (e) ->
                    #    console.log("move")
                    "mouseup": (e) ->
                        console.log("up")
                    "mouseover": (e) ->
                        console.log("over")
                        #console.log(e)
                        #pt = [e.offsetX, e.offsetY]
                    "mouseout": (e) ->
                        console.log("out")
                    "click": (e) ->
                        console.log("click")
                    "dblclick": (e) ->
                        console.log("dblclick")
                })
            )
            @
        "disableEvts": () ->
            @
        "_handleEvts": (params) ->
            #target = getObjectsUnderPoint
            #if tartget != null
            #target.onXXX(evt)
            pt = params.pt
            ctx = @ctx[@current]
            h = @h
            w = @w
            color = ctx.getImageData(pt[0], pt[1], 1, 1).data
            #has alpha
            if (color[3])
                @getObjectsUnderPoint(params)
            @
        "getObjectsUnderPoint": (params) ->
            result = null
            result

    DISPLAY
)
