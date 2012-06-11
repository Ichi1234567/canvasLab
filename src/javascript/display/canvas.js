(function() {

  define(["../geom/geom", "../geom/mtx", "display/paint"], function(GEOM, MTX, PAINT) {
    var CACHE, ROUTINES;
    ROUTINES = {
      mtxarr2mtx: function(mtxarr) {
        var mtx;
        mtx = MTX.loadIdentity();
        mtx[0][0] = mtxarr[0];
        mtx[1][0] = mtxarr[1];
        mtx[0][1] = mtxarr[2];
        mtx[1][1] = mtxarr[3];
        mtx[0][2] = mtxarr[4];
        mtx[1][2] = mtxarr[5];
        return mtx;
      },
      mtx2mtxarr: function(mtx) {
        var mtxarr;
        mtxarr = [mtx[0][0], mtx[1][0], mtx[0][1], mtx[1][1], mtx[0][2], mtx[1][2]];
        return mtxarr;
      },
      assignPt2mtx: function(pt) {
        var ptmtx;
        ptmtx = MTX.loadZero({
          r: 3,
          c: 1
        });
        ptmtx[0][0] = pt[0];
        ptmtx[1][0] = pt[1];
        ptmtx[2][0] = 1;
        return ptmtx;
      },
      assignmtx2Pt: function(mtx) {
        var pt;
        pt = [mtx[0][0], mtx[1][0]];
        return pt;
      },
      getbb: function(x, y, w, h) {
        var bb;
        bb = [[x, y], [x + w, y], [x + w, y + h], [x, y + h]];
        return bb;
      }
    };
    console.log("---cache---");
    CACHE = Backbone.Model.extend({
      "clear": function(params) {
        var ctx, h, w, x, y;
        x = params.x;
        y = params.y;
        w = params.w;
        h = params.h;
        ctx = params.ctx;
        ctx.setTransform(1, 0, 0, 1, x, y);
        return ctx.clearRect(x, y, w, h);
      },
      "reset": function(params) {
        return this.lookat = [this.w / 2, this.h / 2];
      },
      "setStyle": function(params) {
        var ctx, i, val, _results;
        ctx = params.ctx;
        delete params.ctx;
        _results = [];
        for (val in params) {
          i = params[val];
          _results.push(ctx[i] = val);
        }
        return _results;
      },
      "lookAt": function(at) {
        var params;
        at = at && at.length === 2 ? at : null;
        if (at) {
          this.lookat = at.map(function(val) {
            return val;
          });
          params = {
            at: at,
            ctx: this.ctx,
            w: this.w,
            h: this.h
          };
          GEOM.lookAt(at, params);
        }
        return this;
      },
      "updateCanvas": function(params) {
        var bb, canvas, cb, cp, ctx, data_i, display, fn, i, mixMtxInf, mode, mode_i, mtx, obj_i, objs, tmpbb, _len, _max, _min, _size;
        mode = params.mode;
        objs = params.objs;
        cb = params.cb ? params.cb : (function() {});
        canvas = params.canvas;
        ctx = params.ctx;
        display = this;
        for (i = 0, _len = objs.length; i < _len; i++) {
          obj_i = objs[i];
          data_i = obj_i.data;
          mode_i = mode ? mode : data_i.mode;
          cp = data_i["cp"];
          switch (mode_i) {
            case "SKELETON":
              fn = function(data, params) {
                !data.r && PAINT.polyEdge(data, params);
                return data.r && PAINT.cirEdge(data, params);
              };
              break;
            case "ONLYFACE":
              fn = function(data, params) {
                !data.r && PAINT.polyFill(data, params);
                return data.r && PAINT.cirFill(data, params);
              };
              break;
            default:
              mode = "GENERAL";
              fn = function(data, params) {
                if (data.r) {
                  PAINT.cirFill(data, params);
                  PAINT.cirEdge(data, params);
                }
                data.f && PAINT.polyFill(data, params);
                return !data.r && PAINT.polyEdge(data, params);
              };
          }
          mixMtxInf = GEOM.unwrapMtx(data_i.mtxScript, {
            display: display,
            center: cp
          });
          obj_i.reset().pushMtx(mixMtxInf[0], mixMtxInf[1]);
          fn(data_i, {
            ctx: ctx,
            display: display,
            mode: mode_i,
            style_edge: params.style_edge ? params.style_edge : null,
            style_fill: params.style_fill ? params.style_fill : null
          });
          if (!params.cache) {
            mtx = ROUTINES.mtxarr2mtx(mixMtxInf[1]);
            _min = data_i.min;
            _max = data_i.max;
            _size = data_i.size;
            tmpbb = ROUTINES.getbb(_min[0], _min[1], _size[0], _size[1]);
            bb = tmpbb.map(function(val) {
              var tmp, valmtx;
              valmtx = ROUTINES.assignPt2mtx(val);
              tmp = MTX.multiMtx(mtx, valmtx);
              val = ROUTINES.assignmtx2Pt(tmp);
              return val;
            });
            _min = $.extend([], bb[0]);
            _max = $.extend([], bb[0]);
            bb.map(function(val) {
              _min[0] = Math.min(_min[0], val[0]);
              _min[1] = Math.min(_min[1], val[1]);
              _max[0] = Math.max(_max[0], val[0]);
              return _max[1] = Math.max(_max[1], val[1]);
            });
            _size = [Math.abs(_min[0] - _max[0]), Math.abs(_min[1] - _max[1])];
            obj_i.updateCache({
              canvas: canvas,
              ctx: ctx,
              display: display,
              min: _min,
              max: _max,
              size: _size
            });
          }
        }
        cb();
        return mode;
      }
    });
    return CACHE;
  });

}).call(this);
