(function() {

  require(["objData/reader", "display/display", "vender/jq-plugin/jquery.mousewheel"], function(READER, DISPLAY) {
    var display, doneFn, initMtx, objData, pushData, setLookMtx;
    console.log("---main-read---");
    display = null;
    objData = null;
    initMtx = function(params) {
      params = params ? params : {};
      if (display && objData) {
        $(".coor-val").val("-");
        $(".angle").val("0");
        objData.reset();
        return setLookMtx(params.at);
      }
    };
    setLookMtx = function(at) {
      var $lookat, data;
      at = at ? at : null;
      if (display && objData) {
        data = objData.data;
        display.reset().lookAt(at).updateCanvas({
          data: [data],
          mode: $("input[name=mode]:checked").attr("val"),
          cb: function() {}
        });
        $lookat = $(".lookat");
        return display.lookat.forEach(function(val, idx) {
          return $lookat.eq(idx).val(val);
        });
      }
    };
    doneFn = function(model) {
      var data, val;
      objData = model;
      data = model.data;
      val = data.g ? data.g : "--";
      $("#name").html(val);
      $("#ctx-title").html(val);
      val = data.vnum;
      $("#vnum").html(val);
      val = data.fnum ? data.fnum : "--";
      $("#fnum").html(val);
      val = data.r ? data.r : "--";
      $("#r").html(val);
      $("#cp").html(data.cp.join(" , "));
      $("#size").html(data.size.join(" , "));
      (function(v) {
        var vstr;
        vstr = v.map(function(vi) {
          return vi.join(" , ");
        }).join("<br>");
        return $("#v").html(vstr);
      })(data.v);
      (function(f) {
        var fstr;
        fstr = f.map(function(fi) {
          return fi.join(" , ");
        }).join("<br>");
        return $("#f").html(fstr);
      })(data.f);
      if (!display) {
        display = new DISPLAY({
          display: $("#render"),
          width: 750,
          height: 600
        });
        $("canvas").bind("mousewheel", function(e, delta) {
          var scale;
          if (display && objData) {
            scale = delta > 0 ? 0.5 : 1.5;
            objData.pushMtx("scale", [scale, scale]);
            $(".scale").each(function() {
              return $(this).val(scale);
            });
            return display.updateCanvas({
              data: [objData.data],
              mode: $("input[name=mode]:checked").attr("val"),
              cb: function() {}
            });
          }
        });
      }
      initMtx({
        at: data.cp
      });
      display.lookAt(data.cp);
      return display.updateCanvas({
        data: [data],
        mode: $("input[name=mode]:checked").attr("val"),
        cb: function() {}
      });
    };
    $("#mymodel").readObjEvt({
      done: doneFn
    });
    $("input[name=shape]").readObjEvt({
      done: doneFn
    });
    $("input[name=mode]").bind("change", function() {
      var data;
      if (display && objData) {
        display.updateCanvas({
          data: [objData.data],
          mode: $("input[name=mode]:checked").attr("val"),
          cb: function() {}
        });
        data = objData.data;
        return initMtx({
          at: data.cp
        });
      }
    });
    pushData = function(className) {
      var data, isValid;
      data = [];
      isValid = true;
      $("." + className).each(function() {
        var vali;
        vali = $(this).val();
        isValid = isValid && /^-?\d+.?\d*$/g.test(vali);
        return data.push(parseFloat(vali));
      });
      data = isValid ? data : isValid;
      return data;
    };
    $("#all-reset").bind("click", function() {
      return initMtx();
    });
    $("#loadModelCenter").bind("click", function() {
      if (objData) return setLookMtx(objData.data.cp);
    });
    $("#setLookAt").bind("click", function() {
      var at;
      at = pushData("lookat");
      if (at) return setLookMtx(at);
    });
    $("#clearMtx").bind("click", function() {
      return $(".local").each(function() {
        return $(this).val("");
      });
    });
    return $("#pushMtx").bind("click", function() {
      var mvMtx, rotate, rotval, scaleMtx;
      if (objData && display) {
        mvMtx = pushData("mv");
        mvMtx && objData.pushMtx("move", mvMtx);
        scaleMtx = pushData("scale");
        scaleMtx && objData.pushMtx("scale", scaleMtx);
        rotval = $(".angle").eq(0).val();
        rotate = /^-?\d+.?\d*$/g.test(rotval) ? parseFloat(rotval) : false;
        rotval && objData.pushMtx("rotate", rotate);
        return display.updateCanvas({
          data: [objData.data],
          mode: $("input[name=mode]:checked").attr("val"),
          cb: function() {}
        });
      }
    });
  });

}).call(this);
