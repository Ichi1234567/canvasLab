require([
    "objData/objData",
    "display/display",
    'text!../tmpl/objInf.hbs',
    "vender/jq-plugin/jquery.mousewheel"
], (OBJDATA, DISPLAY, INFTMPL) ->
    console.log(123123123123)
    console.log("---main-read2---")
    INFVIEW = Backbone.View.extend(
        "initialize": () ->
        "render": (objData) ->
            @remove()
            tpl = Mustache.render(INFTMPL, objData)
            @$el.append($(tpl))
        "remove": () ->
            @$el.empty()
    )
    DEMOVIEW = Backbone.View.extend(
        "initialize": (params) ->
            @objs = []
            @display = null
            @info = new INFVIEW({
                el: "#obj-inf"
            })
            @
        "events": {
            "change input[name=shape]": "readObj"
            "change input[name=mode]": "mode_change"
            "click #all-reset": "allreset_click"
            "click #loadModelCenter": "center_obj"
            "click #setLookAt": "set_lookat"
            "click #clearMtx": "clearMtx"
            "click #pushMtx": "pushMtx"
            "mousewheel canvas": "wheelFn"
        }
        "readObj": (e) ->
            #console.log("read obj")
            target = e.target
            fileUrl = $(target).attr("val")
            thisView = @
            routines = thisView.routines
            $.ajax({
                type: "GET"
                url: fileUrl
                contentType: "application/x-www-form-urlencoded;charset=utf-8"
            }).done(() ->
                data = new OBJDATA(arguments)

                thisView.objs = [data]
                cb = (params) ->
                    thisView.display = params.display
                    console.log(thisView)
                routines.doneFn(data, {
                    view: thisView
                })
            ).fail(() ->
                alert("The file cant be found.")
            )
        "mode_change": () ->
            #console.log("mode change")
            display = @display
            objs = @objs
            routines = @routines
            if (display && objs.length)
                display.updateCanvas(
                    #objs: objs
                    mode: $("input[name=mode]:checked").attr("val")
                    cb: () ->
                        #objData.resetMtx()
                )
                data = objs[0].data
                routines.initMtx({
                    at: data.cp
                })
        "allreset_click": () ->
            #console.log("allreset_click")
            display = @display
            objData = @objs[0]
            routines = @routines
            routines.initMtx({
                display: display
                objData: objData
            })
        "center_obj": () ->
            #console.log("center_obj")
            display = @display
            objData = @objs[0]
            routines = @routines
            routines.initMtx({
                at: objData.data.cp
                display: display
                objData: objData
            })
        "set_lookat": () ->
            #console.log("set_lookat")
            display = @display
            objData = @objs[0]
            routines = @routines
            at = routines.dataOut("lookat")
            if (at)
                routines.setLookMtx(at, {
                    display: display
                    objData: objData
                })
        "clearMtx": () ->
            #console.log("clearMtx")
            $(".local").each(() ->
                $(@).val("")
            )
        "pushMtx": () ->
            #console.log("pushMtx")
            routines = @routines
            dataOut = routines.dataOut
            objs = @objs
            display = @display
            if (objs[0] && display)
                objData = objs[0]
                mvMtx = dataOut("mv")
                (mvMtx && objData.pushMtx("move", mvMtx))
                scaleMtx = dataOut("scale")
                (scaleMtx && objData.pushMtx("scale", scaleMtx))

                rotval = $(".angle").eq(0).val()
                rotate = if ((/^-?\d+.?\d*$/g).test(rotval)) then (parseFloat(rotval)) else (false)
                (rotval && objData.pushMtx("rotate", rotate))

                display.updateCanvas(
                    objs: objs
                    mode: $("input[name=mode]:checked").attr("val")
                    cb: () ->
                )
        "wheelFn": (e, delta) ->
            #console.log("wheelFn")
            if (@display && @objs.length)
                scale = if (delta > 0) then (0.5) else (1.5)
                @objs[0].pushMtx("scale", [scale, scale])
                $(".scale").each(() ->
                    $(@).val(scale)
                )
                @display.updateCanvas(
                    objs: @objs
                    mode: $("input[name=mode]:checked").attr("val")
                    cb: (() ->)
                )

        "routines": {
            dataOut: (className) ->
                data = []
                isValid = true
                $("." + className).each(()->
                    vali = $(@).val()
                    isValid = (isValid && (/^-?\d+.?\d*$/g).test(vali))
                    data.push(parseFloat(vali))
                )
                data = if (isValid) then (data) else (isValid)
                data
            initMtx: (params) ->
                params = if (params) then (params) else ({})
                display = params.display
                objData = params.objData
                if (display && objData)
                    $(".mv").val("0")
                    $(".scale").val("1")
                    $(".angle").val("0")
                    objData.reset()
                    @setLookMtx(params.at, params)
            setLookMtx: (at, params) ->
                params = if (params) then (params) else ({})
                display = params.display
                objData = params.objData
                at = if (at) then (at) else (null)
                if (display && objData)
                    display.reset().lookAt(at).updateCanvas(
                        objs: [objData]
                        mode: $("input[name=mode]:checked").attr("val")
                        cb: () ->
                    )
                    $lookat = $(".lookat")
                    display.lookat.forEach((val, idx) ->
                        $lookat.eq(idx).val(val)
                    )
            doneFn: (model, params) ->
                params = if (params) then (params) else ({})
                cb = if (params.cb) then (params.cb) else (() ->)
                view = params.view
                display = view.display

                objData = model
                data = model.data
                #console.log(data)

                val = if (data.g) then (data.g) else ("--")
                $("#ctx-title").html(val)
                #show obj start
                showData = {}
                if (data.g) then (showData.name = data.g)
                showData.vnum = data.vnum
                if (data.fnum) then (showData.fnum = data.fnum)
                showData.rinf = false
                if (data.r)
                    showData.rinf = {}
                    showData.rinf.r = data.r
                showData.cp = data.cp.join(" , ")
                showData.size = data.size.join(" , ")
                showData.va = {}
                ((v) ->
                    showData.va = v.map((vi) ->
                        {v: vi.join(" , ")}
                    )
                )(data.v)
                showData.fa = false
                if (data.f)
                    showData.fa = {}
                    ((f) ->
                        showData.fa = f.map((fi) ->
                            {f: fi.join(" , ")}
                        )
                    )(data.f)

                view.info.render(showData)
                #show obj end


                if (!display)
                    display = new DISPLAY({
                        display: $("#render")
                        width: 750
                        height: 600
                    }).pushObj({
                        "clear": true
                        "obj": model
                    })
                    view.display = display
                    model.cache()
                @initMtx({
                    at: data.cp
                    display: display
                    objData: objData
                })
                cb()
        }
    )

    demo_view = new DEMOVIEW({
        "el": "body"
    })
)
