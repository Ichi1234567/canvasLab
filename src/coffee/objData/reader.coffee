define([
    "objData/objData"
], (OBJDATA) ->
    console.log("---reader---")

    # jq plugin
    jQuery.fn.readObjEvt = (params) ->
        #console.log("readObjEvt")
        params = if (typeof params == "object") then (params) else ({})
        doneFn = if (typeof params.done == "function") then (params.done) else (() ->)

        $elm = @
        $elm.bind("change", (e) ->
            type = $elm.attr("type")
            switch (type)
                when ("radio")
                    #console.log($elm.filter(":checked"))
                    $file = $elm.filter(":checked")
                    fileUrl = $file.attr("val")
                    $.ajax({
                        type: "GET"
                        url: fileUrl
                        contentType: "application/x-www-form-urlencoded;charset=utf-8"
                    }).done(() ->
                        data = new OBJDATA(arguments)
                        doneFn(data)
                    ).fail(() ->
                        alert("The file cant be found.")
                    )
                when ("file")
                    objFile = $elm.get(0).files[0]
                    if (!objFile.name.match(/\.obj$/))
                        alert("Please select a .obj file.")
                        return

                    reader = new FileReader()
                    reader.onload = (e) ->
                        desc = if (e.target.result.length) then ("success") else ("fail")
                        data = new OBJDATA([e.target.result, desc, e])
                        doneFn(data)

                    reader.readAsText(objFile)
        )
)
