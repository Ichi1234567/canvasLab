(function() {

  require(["objData/reader", "display/display"], function(READER, DISPLAY) {
    var display, doneFn, objData;
    console.log("---main-read---");
    display = null;
    objData = null;
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
          width: 800,
          height: 600
        });
      }
      display.lookAt(data.cp, {
        display: display
      });
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
    return $("input[name=mode]").bind("change", function() {
      if (display && objData) {
        return display.updateCanvas({
          data: [objData.data],
          mode: $("input[name=mode]:checked").attr("val"),
          cb: function() {}
        });
      }
    });
  });

}).call(this);
