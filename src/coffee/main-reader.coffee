require([
    "objData/reader",
    "display/display"
], (READER, DISPLAY) ->
    console.log("---main-read---")
    #console.log(arguments)

    display = null
    objData = null
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
                width: 800
                height: 600
            })
        display.lookAt(data.cp, {
            display: display
        })
        #model.pushMtx("rotate", (Math.PI / 2))
        #model.pushMtx("scale", [2, 2])
        #model.pushMtx("moveTo", [400, 300])
        #model.pushMtx("move", [100, 100])
        display.updateCanvas(
            data: [data]
            mode: $("input[name=mode]:checked").attr("val")
            cb: () ->
        )
        #console.log(display)


    $("#mymodel").readObjEvt({
        done: doneFn
    })
    $("input[name=shape]").readObjEvt({
        done: doneFn
    })
    $("input[name=mode]").bind("change", () ->
        if (display && objData)
            display.updateCanvas(
                data: [objData.data]
                mode: $("input[name=mode]:checked").attr("val")
                cb: () ->
                    #objData.resetMtx()
            )
    )
)
