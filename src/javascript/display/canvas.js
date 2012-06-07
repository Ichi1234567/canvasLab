(function() {

  define(["../geom/geom", "display/paint"], function(GEOM, PAINT) {
    var CACHE;
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
        var canvas, cb, cp, ctx, data_i, fn, i, mixMtxInf, mode, mode_i, newcp, obj_i, objs, _len;
        mode = params.mode;
        objs = params.objs;
        cb = params.cb ? params.cb : (function() {});
        canvas = params.canvas;
        ctx = params.ctx;
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
            display: this,
            center: cp
          });
          newcp = [cp[0] * mixMtxInf[1][0] + cp[1] * mixMtxInf[1][2] + mixMtxInf[1][4], cp[0] * mixMtxInf[1][1] + cp[1] * mixMtxInf[1][3] + mixMtxInf[1][5]];
          obj_i.data.newcp = newcp;
          obj_i.reset().pushMtx(mixMtxInf[0], mixMtxInf[1]);
          if (!params.cache) obj_i.updateCache();
          fn(data_i, {
            ctx: ctx,
            display: this,
            mode: mode_i,
            style_edge: params.style_edge ? params.style_edge : null,
            style_fill: params.style_fill ? params.style_fill : null
          });
        }
        cb();
        return mode;
      }
    });
    return CACHE;
  });

}).call(this);
