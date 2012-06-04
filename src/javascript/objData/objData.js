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
        this.cache = new CACHE(params);
        return this;
      },
      "updateCache": function(params) {
        params = params ? params : {};
        params.mtx = this.data["mtxScript"];
        params.objs = [this];
        this.cache.updateCanvas(params);
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
        var cache, cacheCtx, color, fna, localPt, pt, result;
        result = false;
        pt = params.pt;
        localPt = this.pt2local(params);
        cache = this.cache;
        localPt = [localPt[0] - cache.x, localPt[1] - cache.y];
        cacheCtx = cache.ctx[0];
        color = cacheCtx.getImageData(localPt[0], localPt[1], 1, 1).data;
        result = false;
        if (!!color[3]) {
          fna = $.extend([], this.evts[params.e.type]);
          result = {
            fna: fna
          };
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
        mtxArr[0][2] = mtx[4];
        mtxArr[1][2] = mtx[5];
        invMtx = MTX.invert(mtxArr);
        pta = [[pt[0]], [pt[1]], [1]];
        localPtMtx = MTX.multiMtx(invMtx, pta);
        cache = this.cache;
        cacheCtx = cache.ctx[0];
        localPt = [localPtMtx[0][0], localPtMtx[1][0]];
        return localPt;
      },
      "pt2globle": function(params) {
        var cb, globlePt, globlePtMtx, mtx, mtxArr, pt, pta;
        params = params ? params : {};
        cb = params.cb ? params.cb : (function() {});
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
        cb(globlePt);
        return globlePt;
      }
    });
    return OBJDATA;
  });

}).call(this);
