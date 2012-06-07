(function() {

  require(["objData/objData", "display/display", 'text!../tmpl/objInf.hbs', "vender/jq-plugin/jquery.mousewheel"], function(OBJDATA, DISPLAY, INFTMPL) {
    var DEMOVIEW, INFVIEW, demo_view;
    console.log("---main-read2---");
    INFVIEW = Backbone.View.extend({
      "initialize": function() {},
      "render": function(objData) {
        var tpl;
        this.remove();
        tpl = Mustache.render(INFTMPL, objData);
        return this.$el.append($(tpl));
      },
      "remove": function() {
        return this.$el.empty();
      }
    });
    DEMOVIEW = Backbone.View.extend({
      "initialize": function(params) {
        this.objs = [];
        this.display = null;
        this.info = new INFVIEW({
          el: "#obj-inf"
        });
        return this;
      },
      "events": {
        "change input[name=shape]": "readObj",
        "change input[name=mode]": "mode_change",
        "change input[name=evts]": "evts_change",
        "click #all-reset": "allreset_click",
        "click #loadModelCenter": "center_obj",
        "click #setLookAt": "set_lookat",
        "click #clearMtx": "clearMtx",
        "click #pushMtx": "pushMtx",
        "click #reset-ev-log": "resetlog",
        "mousewheel canvas": "wheelFn"
      },
      "readObj": function(e) {
        var fileUrl, routines, target, thisView;
        target = e.target;
        fileUrl = $(target).attr("val");
        thisView = this;
        routines = thisView.routines;
        $("input[name=evts]").each(function() {
          return $(this).attr("checked", false);
        });
        $("#evlog").html("");
        return $.ajax({
          type: "GET",
          url: fileUrl,
          contentType: "application/x-www-form-urlencoded;charset=utf-8"
        }).done(function() {
          var cb, data;
          data = new OBJDATA(arguments);
          thisView.objs = [data];
          cb = function(params) {
            thisView.display = params.display;
            return console.log(thisView);
          };
          return routines.doneFn(data, {
            view: thisView
          });
        }).fail(function() {
          return alert("The file cant be found.");
        });
      },
      "mode_change": function() {
        var data, display, objs, routines;
        display = this.display;
        objs = this.objs;
        routines = this.routines;
        if (display && objs.length) {
          display.updateCanvas({
            mode: $("input[name=mode]:checked").attr("val"),
            cb: function() {}
          });
          data = objs[0].data;
          return routines.initMtx({
            at: data.cp
          });
        }
      },
      "evts_change": function(e) {
        var $target, chk, display, ev, evAct, objs, routines;
        routines = this.routines;
        $target = $(e.target);
        display = this.display;
        objs = this.objs;
        if (display && objs.length) {
          chk = !!($target.attr("checked"));
          evAct = chk ? "bindEvt" : "cancelEvt";
          ev = $target.attr("val");
          return objs.forEach(function(obj_i) {
            return obj_i[evAct](ev, routines.evDef);
          });
        }
      },
      "allreset_click": function() {
        var display, objData, routines;
        display = this.display;
        objData = this.objs[0];
        routines = this.routines;
        return routines.initMtx({
          display: display,
          objData: objData
        });
      },
      "center_obj": function() {
        var display, objData, routines;
        display = this.display;
        objData = this.objs[0];
        routines = this.routines;
        return routines.initMtx({
          at: objData.data.cp,
          display: display,
          objData: objData
        });
      },
      "set_lookat": function() {
        var at, display, objData, routines;
        display = this.display;
        objData = this.objs[0];
        routines = this.routines;
        at = routines.dataOut("lookat");
        if (at) {
          return routines.setLookMtx(at, {
            display: display,
            objData: objData
          });
        }
      },
      "clearMtx": function() {
        return $(".local").each(function() {
          return $(this).val("");
        });
      },
      "pushMtx": function() {
        var dataOut, display, mvMtx, objData, objs, rotate, rotval, routines, scaleMtx;
        routines = this.routines;
        dataOut = routines.dataOut;
        objs = this.objs;
        display = this.display;
        if (objs[0] && display) {
          objData = objs[0];
          mvMtx = dataOut("mv");
          mvMtx && objData.pushMtx("move", mvMtx);
          scaleMtx = dataOut("scale");
          scaleMtx && objData.pushMtx("scale", scaleMtx);
          rotval = $(".angle").eq(0).val();
          rotate = /^-?\d+.?\d*$/g.test(rotval) ? parseFloat(rotval) : false;
          rotval && objData.pushMtx("rotate", rotate);
          return display.updateCanvas({
            objs: objs,
            mode: $("input[name=mode]:checked").attr("val"),
            cb: function() {}
          });
        }
      },
      "resetlog": function(e) {
        return $("#evlog").html("");
      },
      "wheelFn": function(e, delta) {
        var scale;
        if (this.display && this.objs.length) {
          scale = delta > 0 ? 0.5 : 1.5;
          this.objs[0].pushMtx("scale", [scale, scale]);
          $(".scale").each(function() {
            return $(this).val(scale);
          });
          return this.display.updateCanvas({
            objs: this.objs,
            mode: $("input[name=mode]:checked").attr("val"),
            cb: (function() {})
          });
        }
      },
      "routines": {
        evDef: function(e) {
          var $log;
          $log = $("<div></div>").html(e.type);
          return $("#evlog").append($log);
        },
        dataOut: function(className) {
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
        },
        initMtx: function(params) {
          var display, objData;
          params = params ? params : {};
          display = params.display;
          objData = params.objData;
          if (display && objData) {
            $(".mv").val("0");
            $(".scale").val("1");
            $(".angle").val("0");
            objData.reset();
            return this.setLookMtx(params.at, params);
          }
        },
        setLookMtx: function(at, params) {
          var $lookat, display, objData;
          params = params ? params : {};
          display = params.display;
          objData = params.objData;
          at = at ? at : null;
          if (display && objData) {
            display.reset().lookAt(at).updateCanvas({
              objs: [objData],
              mode: $("input[name=mode]:checked").attr("val"),
              cb: function() {}
            });
            $lookat = $(".lookat");
            return display.lookat.forEach(function(val, idx) {
              return $lookat.eq(idx).val(val);
            });
          }
        },
        doneFn: function(model, params) {
          var cb, data, display, objData, showData, val, view;
          params = params ? params : {};
          cb = params.cb ? params.cb : (function() {});
          view = params.view;
          display = view.display;
          objData = model;
          data = model.data;
          val = data.g ? data.g : "--";
          $("#ctx-title").html(val);
          showData = {};
          if (data.g) showData.name = data.g;
          showData.vnum = data.vnum;
          if (data.fnum) showData.fnum = data.fnum;
          showData.rinf = false;
          if (data.r) {
            showData.rinf = {};
            showData.rinf.r = data.r;
          }
          showData.cp = data.cp.join(" , ");
          showData.size = data.size.join(" , ");
          showData.va = {};
          (function(v) {
            return showData.va = v.map(function(vi) {
              return {
                v: vi.join(" , ")
              };
            });
          })(data.v);
          showData.fa = false;
          if (data.f) {
            showData.fa = {};
            (function(f) {
              return showData.fa = f.map(function(fi) {
                return {
                  f: fi.join(" , ")
                };
              });
            })(data.f);
          }
          view.info.render(showData);
          if (!display) {
            display = new DISPLAY({
              display: $("#render"),
              width: 750,
              height: 600
            });
            view.display = display;
          }
          display.pushObj({
            "clear": true,
            "obj": model
          });
          model.cache();
          this.initMtx({
            at: data.cp,
            display: display,
            objData: objData
          });
          return cb();
        }
      }
    });
    return demo_view = new DEMOVIEW({
      "el": "body"
    });
  });

}).call(this);
