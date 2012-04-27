require([
    "canvas/canvas_paint",
], (CANVAS) ->
    console.log("main-load")
    _objData = {
        "v": []
        "f": []
    }
    _parse = (fileTxt) ->
        console.log("parse")
        #console.log(fileTxt)
        lines = fileTxt.split("\n")
        lines.forEach((line) ->
            if (line.length)
                switch (true)
                    when ((/^_g/g).test(line))
                        _objData.name = line.split(" ")[1]
                        $("#name").html(_objData.name)
                        $("#ctx-title").html(_objData.name)
                    when (/^_v/g).test(line)
                        _objData.vnum = parseInt(line.split(" ")[1])
                        $("#vnum").html(_objData.vnum)
                    when ((/^_f/g).test(line))
                        _objData.fnum = parseInt(line.split(" ")[1])
                        $("#fnum").html(_objData.fnum)
                    when ((/^_cp/g).test(line))
                        _objData["_cp"] = line.slice(4).split(" ")
                        $("#cpx").html(_objData["_cp"][0])
                        $("#cpy").html(_objData["_cp"][1])
                    when ((/^_/g).test(line))
                        _datai = line.split(" ")
                        _objData[_datai[0]] = _datai[1]
                        $("#objdata").append($("<div>").html(line))
                    when ((/r/g).test(line))
                        _objData.r = parseFloat(line.split(" ")[1])
                        $("#r").html(_objData.r)
                    when ((/v/g).test(line))
                        _datai = line.slice(2).split(" ")
                        for _datai_j, j in _datai
                            _datai[j] = parseFloat(_datai_j)
                        _objData["v"].push(_datai)
                        _html = $("#v").html()
                        $("#v").html(_html + "<br>" + _datai.join(" , "))
                    when ((/f/g).test(line))
                        _datai = line.slice(2).split(" ")
                        _objData["f"].push(_datai)
                        _html = $("#f").html()
                        $("#f").html(_html + "<br>" + _datai.join(" , "))
                (typeof _objData["vnum"] != "number" && (
                 _objData["vnum"] = _objData["v"].length))
                (typeof _objData["fnum"] != "number" && (
                 _objData["fnum"] = _objData["f"].length))
        )

    _save = () ->
        console.log("save")


    canvas = $("#render").get(0)
    ctx = canvas.getContext("2d")
    _render = () ->
        console.log("render")
        #console.log(CANVAS)
        mode = $("input[name=mode]:checked").attr("val")
        CANVAS.clear({
            "canvas": canvas
            "ctx": ctx
        })
        CANVAS.draw({
            "canvas": canvas
            "ctx": ctx
            "data": _objData
            "mode": mode
        })

    $("#mymodel").bind("change", (e) ->
        objFile = @.files[0]
        if (!objFile.name.match(/\.obj$/))
          alert('Please select a .obj file')
          return

        reader = new FileReader()

        reader.onload = (e) ->
            $("#v").html()
            $("#f").html()
            _objData = {
                "v": []
                "f": []
            }
            _parse(e.target.result)
            _render()
        reader.readAsText(objFile)
    )
    $("input[name=shape]").bind("change", (e) ->
        fileUrl = $("input[name=shape]:checked").attr("val")
        $.ajax({
            type: "GET"
            url: fileUrl
            contentType: "application/x-www-form-urlencoded;charset=utf-8"
        }).done((data) ->
            if (data && data.length)
                $("#v").html()
                $("#f").html()
                _objData = {
                    "v": []
                    "f": []
                }
                _parse(data)
                _render()
        )
    )
    $("input[name=mode]").bind("change", (e) ->
        if (_objData.v)
            CANVAS.clear({
                "canvas": canvas
                "ctx": ctx
            })
            _render()
    )
)
