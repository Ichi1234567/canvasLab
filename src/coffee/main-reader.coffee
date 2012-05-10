require([
    "objData/reader",
    "display/display",
    "vender/jq-plugin/jquery.mousewheel"
], (READER, DISPLAY) ->
    console.log("---main-read---")
    #console.log(arguments)

    display = null
    objData = null
    initMtx = (params) ->
        params = if (params) then (params) else ({})
        if (display && objData)
            $(".mv").val("0")
            $(".scale").val("1")
            #$(".coor-val").val("-")
            $(".angle").val("0")
            objData.reset()
            setLookMtx(params.at)
    setLookMtx = (at) ->
        at = if (at) then (at) else (null)
        if (display && objData)
            data = objData.data
            display.reset().lookAt(at).updateCanvas(
                objs: [objData]
                mode: $("input[name=mode]:checked").attr("val")
                cb: () ->
            )
            $lookat = $(".lookat")
            display.lookat.forEach((val, idx) ->
                $lookat.eq(idx).val(val)
            )
    doneFn = (model) ->
        objData = model
        data = model.data
        #console.log(data)

        val = if (data.g) then (data.g) else ("--")
        $("#name").html(val)
        $("#ctx-title").html(val)

        val = data.vnum
        $("#vnum").html(val)

        val = if (data.fnum) then (data.fnum) else ("--")
        $("#fnum").html(val)

        val = if (data.r) then (data.r) else ("--")
        $("#r").html(val)

        $("#cp").html(data.cp.join(" , "))
        $("#size").html(data.size.join(" , "))

        ((v) ->
            vstr = v.map((vi) ->
                vi.join(" , ")
            ).join("<br>")
            $("#v").html(vstr)
        )(data.v)
        ((f) ->
            fstr = f.map((fi) ->
                fi.join(" , ")
            ).join("<br>")
            $("#f").html(fstr)
        )(data.f)

        if (!display)
            display = new DISPLAY({
                display: $("#render")
                width: 750
                height: 600
            })
            $("canvas").bind("mousewheel", (e, delta) ->
                if (display && objData)
                    scale = if (delta > 0) then (0.5) else (1.5)
                    objData.pushMtx("scale", [scale, scale])
                    $(".scale").each(() ->
                        $(@).val(scale)
                    )
                    display.updateCanvas(
                        objs: [objData]
                        mode: $("input[name=mode]:checked").attr("val")
                        cb: () ->
                    )
            )
        initMtx({
            at: data.cp
        })
        display.lookAt(data.cp)
        display.updateCanvas(
            objs: [objData]
            mode: $("input[name=mode]:checked").attr("val")
            cb: () ->
        )
        #console.log(display)


    #bind event
    $("#mymodel").readObjEvt({
        done: doneFn
    })
    $("input[name=shape]").readObjEvt({
        done: doneFn
    })
    $("input[name=mode]").bind("change", () ->
        if (display && objData)
            display.updateCanvas(
                objs: [objData]
                mode: $("input[name=mode]:checked").attr("val")
                cb: () ->
                    #objData.resetMtx()
            )
            data = objData.data
            initMtx({
                at: data.cp
            })
    )

    pushData = (className) ->
        data = []
        isValid = true
        $("." + className).each(()->
            vali = $(@).val()
            isValid = (isValid && (/^-?\d+.?\d*$/g).test(vali))
            data.push(parseFloat(vali))
        )
        data = if (isValid) then (data) else (isValid)
        data
    $("#all-reset").bind("click", () ->
        #console.log("all-reset click")
        initMtx()
    )
    $("#loadModelCenter").bind("click", () ->
        #console.log("loadModelCenter click")
        if (objData)
            setLookMtx(objData.data.cp)
    )
    $("#setLookAt").bind("click", () ->
        #console.log("setLookAt click")
        at = pushData("lookat")
        if (at)
            setLookMtx(at)
    )
    $("#clearMtx").bind("click", () ->
        #console.log("clearMtx click")
        $(".local").each(() ->
            $(@).val("")
        )
    )
    $("#pushMtx").bind("click", () ->
        #model.pushMtx("rotate", (Math.PI / 2))
        #model.pushMtx("scale", [2, 2])
        #model.pushMtx("scale", [0.5, 0.5])
        #model.pushMtx("moveTo", [400, 300])
        #model.pushMtx("move", [100, 100])

        if (objData && display)
            mvMtx = pushData("mv")
            (mvMtx && objData.pushMtx("move", mvMtx))
            scaleMtx = pushData("scale")
            (scaleMtx && objData.pushMtx("scale", scaleMtx))

            rotval = $(".angle").eq(0).val()
            rotate = if ((/^-?\d+.?\d*$/g).test(rotval)) then (parseFloat(rotval)) else (false)
            (rotval && objData.pushMtx("rotate", rotate))

            display.updateCanvas(
                objs: [objData]
                mode: $("input[name=mode]:checked").attr("val")
                cb: () ->
            )
    )
)
