(function() {

  require(["canvas/canvas_paint"], function(CANVAS) {
    var canvas, ctx, _objData, _parse, _render, _save;
    console.log("main-load");
    _objData = {
      "v": [],
      "f": []
    };
    _parse = function(fileTxt) {
      var lines;
      console.log("parse");
      lines = fileTxt.split("\n");
      return lines.forEach(function(line) {
        var j, _datai, _datai_j, _html, _len;
        if (line.length) {
          switch (true) {
            case /^_g/g.test(line):
              _objData.name = line.split(" ")[1];
              $("#name").html(_objData.name);
              $("#ctx-title").html(_objData.name);
              break;
            case /^_v/g.test(line):
              _objData.vnum = parseInt(line.split(" ")[1]);
              $("#vnum").html(_objData.vnum);
              break;
            case /^_f/g.test(line):
              _objData.fnum = parseInt(line.split(" ")[1]);
              $("#fnum").html(_objData.fnum);
              break;
            case /^_cp/g.test(line):
              _objData["_cp"] = line.slice(4).split(" ");
              $("#cpx").html(_objData["_cp"][0]);
              $("#cpy").html(_objData["_cp"][1]);
              break;
            case /^_/g.test(line):
              _datai = line.split(" ");
              _objData[_datai[0]] = _datai[1];
              $("#objdata").append($("<div>").html(line));
              break;
            case /r/g.test(line):
              _objData.r = parseFloat(line.split(" ")[1]);
              $("#r").html(_objData.r);
              break;
            case /v/g.test(line):
              _datai = line.slice(2).split(" ");
              for (j = 0, _len = _datai.length; j < _len; j++) {
                _datai_j = _datai[j];
                _datai[j] = parseFloat(_datai_j);
              }
              _objData["v"].push(_datai);
              _html = $("#v").html();
              $("#v").html(_html + "<br>" + _datai.join(" , "));
              break;
            case /f/g.test(line):
              _datai = line.slice(2).split(" ");
              _objData["f"].push(_datai);
              _html = $("#f").html();
              $("#f").html(_html + "<br>" + _datai.join(" , "));
          }
          typeof _objData["vnum"] !== "number" && (_objData["vnum"] = _objData["v"].length);
          return typeof _objData["fnum"] !== "number" && (_objData["fnum"] = _objData["f"].length);
        }
      });
    };
    _save = function() {
      return console.log("save");
    };
    canvas = $("#render").get(0);
    ctx = canvas.getContext("2d");
    _render = function() {
      var mode;
      console.log("render");
      mode = $("input[name=mode]:checked").attr("val");
      CANVAS.clear({
        "canvas": canvas,
        "ctx": ctx
      });
      return CANVAS.draw({
        "canvas": canvas,
        "ctx": ctx,
        "data": _objData,
        "mode": mode
      });
    };
    $("#mymodel").bind("change", function(e) {
      var objFile, reader;
      objFile = this.files[0];
      if (!objFile.name.match(/\.obj$/)) {
        alert('Please select a .obj file');
        return;
      }
      reader = new FileReader();
      reader.onload = function(e) {
        $("#v").html();
        $("#f").html();
        _objData = {
          "v": [],
          "f": []
        };
        _parse(e.target.result);
        return _render();
      };
      return reader.readAsText(objFile);
    });
    $("input[name=shape]").bind("change", function(e) {
      var fileUrl;
      fileUrl = $("input[name=shape]:checked").attr("val");
      return $.ajax({
        type: "GET",
        url: fileUrl,
        contentType: "application/x-www-form-urlencoded;charset=utf-8"
      }).done(function(data) {
        if (data && data.length) {
          $("#v").html();
          $("#f").html();
          _objData = {
            "v": [],
            "f": []
          };
          _parse(data);
          return _render();
        }
      });
    });
    return $("input[name=mode]").bind("change", function(e) {
      if (_objData.v) {
        CANVAS.clear({
          "canvas": canvas,
          "ctx": ctx
        });
        return _render();
      }
    });
  });

}).call(this);
