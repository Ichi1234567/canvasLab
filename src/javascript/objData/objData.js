(function() {

  define(["../display/cache", "../geom/mtx"], function(CACHE, MTX) {
    var OBJDATA, parse;
    console.log("---objData---");
    parse = function(txt) {
      var lines, objData, sumv;
      objData = {
        v: [],
        f: []
      };
      lines = txt.split("\n");
      sumv = [0, 0];
      lines.forEach(function(line) {
        var key, val, vals;
        if (line.length) {
          vals = line.split(" ");
          key = vals[0].replace("_", "");
          switch (true) {
            case /^v/g.test(line):
            case /_cp/g.test(line):
              val = vals.slice(1);
              !objData[key] && (objData[key] = []);
              if (key !== "cp") {
                sumv.forEach(function(data, idx) {
                  val[idx] = parseFloat(val[idx]);
                  sumv[idx] += val[idx];
                  if (!objData["min"]) {
                    objData["min"] = [];
                    objData["max"] = [];
                  }
                  if (typeof objData["min"][idx] !== "number") {
                    objData["min"][idx] = val[idx];
                    objData["max"][idx] = val[idx];
                  }
                  objData["min"][idx] = Math.min(objData["min"][idx], val[idx]);
                  return objData["max"][idx] = Math.max(objData["max"][idx], val[idx]);
                });
                return objData[key].push(val);
              } else {
                return val.forEach(function(data) {
                  return objData[key].push(parseFloat(data));
                });
              }
              break;
            case /^f/g.test(line):
              val = vals.slice(1);
              return objData[key].push(val);
            case /^_g/g.test(line):
            case /^_v/g.test(line):
            case /^_f/g.test(line):
            case /^r/g.test(line):
              val = vals[1];
              (key === "f" || key === "v") && (key += "num");
              (key !== "g") && (val = parseFloat(val));
              return objData[key] = val;
            default:
              val = vals.slice(1);
              return objData[key] = val;
          }
        }
      });
      !objData["g"] && (objData["g"] = "");
      !objData["vnum"] && (objData["vnum"] = objData["v"].length);
      !objData["fnum"] && (objData["fnum"] = objData["f"].length);
      !objData["cp"] && (objData["cp"] = [sumv[0] / objData["vnum"], sumv[1] / objData["vnum"]]);
      if (objData["r"]) {
        objData["size"] = [];
        objData["size"] = [2 * objData["r"], 2 * objData["r"]];
        objData["cp"].forEach(function(data, idx) {
          var r;
          r = objData["r"];
          objData["min"][idx] = data - r;
          objData["max"][idx] = data + r;
          return objData["size"][idx] = 2 * r;
        });
      } else {
        objData["size"] = [];
        objData["min"].forEach(function(data, idx) {
          return objData["size"][idx] = objData["max"][idx] - objData["min"][idx];
        });
      }
      return objData;
    };
    OBJDATA = Backbone.Model.extend({
      "initialize": function(params) {
        if (params[1] === "success") {
          this.data = parse(params[0]);
          this.data["mtxScript"] = [];
          this.data["mode"] = "GENERAL";
          this.parent = params.parent ? params.parent : null;
          this.children = params.children ? params.children : [];
          this.evts = {
            "mousedown": [],
            "mouseup": [],
            "click": [],
            "dblclick": []
          };
          this.evStatus = null;
        }
        return this;
      },
      "reset": function(params) {
        this.data["mtxScript"] = [];
        return this;
      },
      "pushMtx": function(key, mtx, params) {
        this.data["mtxScript"].push([key, mtx, params]);
        return this;
      },
      "cache": function(params) {
        var min, size;
        params = params ? params : {};
        min = this.data.min;
        size = this.data.size;
        params.x = min[0];
        params.y = min[1];
        params.w = size[0];
        params.h = size[1];
        params.mtx = this.data["mtxScript"];
        this._cache = new CACHE(params);
        return this;
      },
      "updateCache": function(params) {
        var ctx, data, display, display_at, display_h, display_w, globalMin, _max, _min, _params, _size;
        params = params ? params : {};
        params.mtx = this.data["mtxScript"];
        params.objs = [this];
        display = params.display;
        ctx = params.ctx;
        _min = params.min;
        _max = params.max;
        _size = params.size;
        display_w = display.w;
        display_h = display.h;
        display_at = display.lookat;
        globalMin = [display_w / 2 - display_at[0] + _min[0], display_h / 2 - display_at[1] + _min[1]];
        data = display.getImgData(ctx, globalMin[0], globalMin[1], _size[0], _size[1]);
        _params = $.extend({}, params);
        _params.data = data;
        this._cache.updateCanvas(_params);
        return this;
      },
      "bindEvt": function(evtype, fn) {
        if (typeof this.evts[evtype] !== "undefined") this.evts[evtype].push(fn);
        return this;
      },
      "cancelEvt": function(evtype, fn) {
        var fn_i, i, _len, _ref;
        if (typeof this.evts[evtype] !== "undefined") {
          _ref = this.evts[evtype];
          for (i = 0, _len = _ref.length; i < _len; i++) {
            fn_i = _ref[i];
            if (fn_i === fn) {
              delete this.evts[evtype][i];
              i = this.evts[evtype].length;
            }
          }
        }
        return this;
      },
      "_hitTest": function() {
        var result;
        result = false;
        return result;
      },
      "isIn": function(params) {
        var cache, cacheCtx, color, color_i, fna, hasColor, i, localPt, pt, result, _len, _step;
        result = false;
        cache = this._cache;
        pt = params.pt;
        localPt = [pt[0] - cache.new_min[0], pt[1] - cache.new_min[1]];
        cacheCtx = cache.ctx[0];
        color = cacheCtx.getImageData(localPt[0], localPt[1], 1, 1).data;
        cacheCtx.beginPath();
        cacheCtx.arc(localPt[0], localPt[1], cache.w / 4, 0, 2 * Math.PI, false);
        cacheCtx.closePath();
        cacheCtx.fillStyle = "rgba(0, 255, 0, 1)";
        cacheCtx.fill();
        cacheCtx.fillStyle = "rgba(0, 0, 0, 1)";
        result = {
          inside: false
        };
        hasColor = false;
        for (i = 0, _len = color.length, _step = 3; i < _len; i += _step) {
          color_i = color[i];
          if (color_i) {
            hasColor = true;
            i = color.length;
          }
          i && (i++);
        }
        if (hasColor) {
          fna = $.extend([], this.evts[params.e.type]);
          result = {
            inside: true,
            fna: fna
          };
          this.evStatus = params.e.type === "mousedown" ? "mousedown" : this.evStatus;
        }
        switch (params.e.type) {
          case "click":
          case "dblclick":
            if (this.evStatus !== "mousedown") result.fna = [];
            this.evStatus = null;
        }
        return result;
      },
      "pt2local": function(params) {
        var cache, cacheCtx, invMtx, localPt, localPtMtx, mtx, mtxArr, pt, pta;
        params = params ? params : {};
        localPt = false;
        pt = params.pt;
        mtx = this.data["mtxScript"][0][1];
        mtxArr = MTX.loadIdentity();
        mtxArr[0][0] = mtx[0];
        mtxArr[1][0] = mtx[1];
        mtxArr[0][1] = mtx[2];
        mtxArr[1][1] = mtx[3];
        mtxArr[0][2] = params.nodelta ? 0. : mtx[4];
        mtxArr[1][2] = params.nodelta ? 0. : mtx[5];
        pta = [[pt[0]], [pt[1]], [1]];
        invMtx = MTX.invert(mtxArr);
        pta = [[pt[0]], [pt[1]], [1]];
        localPtMtx = MTX.multiMtx(invMtx, pta);
        cache = this._cache;
        cacheCtx = cache.ctx[0];
        localPt = [localPtMtx[0][0], localPtMtx[1][0]];
        return localPt;
      },
      "pt2globle": function(params) {
        var globlePt, globlePtMtx, mtx, mtxArr, pt, pta;
        params = params ? params : {};
        globlePt = false;
        pt = params.pt;
        mtx = this.data["mtxScript"][0][1];
        mtxArr = MTX.loadIdentity();
        mtxArr[0][0] = mtx[0];
        mtxArr[1][0] = mtx[1];
        mtxArr[0][1] = mtx[2];
        mtxArr[1][1] = mtx[3];
        mtxArr[0][2] = mtx[4];
        mtxArr[1][2] = mtx[5];
        pta = [[pt[0]], [pt[1]], [1]];
        globlePtMtx = MTX.multiMtx(mtxArr, pta);
        globlePt = [globlePtMtx[0][0], globlePtMtx[1][0]];
        return globlePt;
      }
    });
    return OBJDATA;
  });

}).call(this);
