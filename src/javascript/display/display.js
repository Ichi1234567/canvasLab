(function() {

  define(["../geom/geom"], function(GEOM) {
    var DISPLAY, polyDraw, realPaint;
    polyDraw = {
      "noFace": function(params) {
        var cb, ctx, data, i, v, v_i, vnum;
        data = params.data;
        ctx = params.ctx;
        cb = params.cb ? params.cb : (function() {});
        vnum = data.vnum;
        v = data.v;
        ctx.beginPath();
        ctx.moveTo(v[0][0], v[0][1]);
        for (i = 1; 1 <= vnum ? i <= vnum : i >= vnum; 1 <= vnum ? i++ : i--) {
          v_i = v[i];
          ctx.lineTo(v_i[0], v_i[1]);
        }
        return cb();
      },
      "hasFace": function(params) {
        var b_mv, cb, ctx, data, f, f0, f_i, f_ij, fnum, i, idx, j, paintFn, type, v, _len, _len2, _results;
        data = params.data;
        ctx = params.ctx;
        cb = params.cb ? params.cb : (function() {});
        type = params.type;
        fnum = data.fnum;
        f = data.f;
        v = data.v;
        switch (type) {
          case "fill":
            paintFn = function(f_ij, v, ctx) {
              var f_ij_full, idx;
              f_ij_full = f_ij.split("/");
              idx = parseInt(f_ij_full[0]);
              ctx.lineTo(v[idx][0], v[idx][1]);
              return false;
            };
            break;
          default:
            paintFn = function(f_ij, v, ctx, b_mv) {
              var f_ij_full, idx;
              f_ij_full = f_ij.split("/");
              idx = parseInt(f_ij_full[0]);
              if (b_mv) {
                ctx.moveTo(v[idx][0], v[idx][1]);
              } else {
                ctx.lineTo(v[idx][0], v[idx][1]);
              }
              b_mv = f_ij_full.length > 1 ? !parseInt(f_ij_full[1]) : false;
              return b_mv;
            };
        }
        _results = [];
        for (i = 0, _len = f.length; i < _len; i++) {
          f_i = f[i];
          ctx.beginPath();
          b_mv = true;
          for (j = 0, _len2 = f_i.length; j < _len2; j++) {
            f_ij = f_i[j];
            b_mv = paintFn(f_ij, v, ctx, b_mv);
          }
          f0 = f_i[0].split("/");
          idx = parseInt(f0[0]);
          if (b_mv) {
            ctx.moveTo(v[idx][0], v[idx][1]);
          } else {
            ctx.lineTo(v[idx][0], v[idx][1]);
          }
          _results.push(cb());
        }
        return _results;
      }
    };
    realPaint = {
      "polyEdge": function(data, params) {
        var ctx, current, display, mode, style_edge;
        display = params.display;
        current = display.current;
        ctx = display.ctx[current];
        mode = params.mode;
        style_edge = params.style_edge;
        if (mode === "SKELETON") {
          /*
                          # if mode is SKELETON, the canvas doesnt have graph info.
                          # we must run the process for draw
          */
          data.f && polyDraw.hasFace({
            "data": data,
            "ctx": ctx,
            "cb": (function() {
              style_edge && display.setStyle(style_edge);
              return ctx.stroke();
            })
          });
          return !data.f && polyDraw.noFace({
            "data": data,
            "ctx": ctx,
            "cb": (function() {
              style_edge && display.setStyle(style_edge);
              return ctx.stroke();
            })
          });
        }
      },
      "polyFill": function(data, params) {
        var ctx, current, display, style_fill;
        display = params.display;
        current = display.current;
        ctx = display.ctx[current];
        style_fill = params.style_fill;
        return polyDraw.hasFace({
          "data": data,
          "ctx": ctx,
          "type": "fill",
          "cb": (function() {
            style_fill && display.setStyle(style_fill);
            return ctx.fill();
          })
        });
      },
      "cirEdge": function(data, params) {
        var ctx, current, display, mode, r, style_edge, v;
        display = params.display;
        current = display.current;
        ctx = display.ctx[current];
        mode = params.mode;
        style_edge = params.style_edge;
        if (mode === "SKELETON") {
          /*
                          # if mode is SKELETON, the canvas doesnt have graph info.
                          # we must run the process for draw
          */
          v = data.v;
          r = data.r;
          ctx.beginPath();
          ctx.arc(v[0][0], v[0][1], r, 0, Math.PI * 2, false);
          ctx.closePath();
        }
        style_edge && display.setStyle(style_edge);
        return ctx.stroke();
      },
      "cirFill": function(data, params) {
        var ctx, current, display, r, style_fill, v;
        display = params.display;
        current = display.current;
        ctx = display.ctx[current];
        style_fill = params.style_fill;
        /*
                    # draw start
        */
        v = data.v;
        r = data.r;
        ctx.beginPath();
        ctx.arc(v[0][0], v[0][1], r, 0, Math.PI * 2, false);
        ctx.closePath();
        style_fill && display.setStyle(style_fill);
        return ctx.fill();
      }
    };
    console.log("---display---");
    DISPLAY = Backbone.Model.extend({
      "initialize": function(params) {
        this.current = 0;
        this.w = params.width;
        this.h = params.height;
        this.canvas = [
          $("<canvas></canvas>").css({
            display: "block"
          }), $("<canvas></canvas>").css({
            display: "none"
          })
        ];
        this.canvas[0].get(0).width = this.w;
        this.canvas[0].get(0).height = this.h;
        this.canvas[1].get(0).width = this.w;
        this.canvas[1].get(0).height = this.h;
        this.ctx = [this.canvas[0].get(0).getContext("2d"), this.canvas[1].get(0).getContext("2d")];
        params.display.append(this.canvas[0]).append(this.canvas[1]);
        this.lookat = [this.w / 2, this.h / 2];
        return this;
      },
      "switchCanvas": function(params) {
        var current, displayVal, prev;
        params = params ? params : {};
        prev = params.prev;
        current = params.current;
        displayVal = ["block", "none"];
        this.clear();
        this.canvas[current].css("display", displayVal[0]);
        this.canvas[prev].css("display", displayVal[1]);
        this.current = current;
        return this;
      },
      "clear": function(params) {
        var current, h, w, x, y;
        params = params ? params : {};
        current = this.current;
        x = params.x ? params.x : 0.;
        y = params.y ? params.y : 0.;
        w = params.w ? params.w : this.w;
        h = params.h ? params.h : this.h;
        this.ctx[current].setTransform(1, 0, 0, 1, 0, 0);
        this.ctx[current].clearRect(x, y, w, h);
        return this;
      },
      "setStyle": function(params) {
        var ctx, current, i, val;
        params = params ? params : {};
        current = this.current;
        ctx = this.ctx[current];
        for (val in params) {
          i = params[val];
          ctx[i] = val;
        }
        return this;
      },
      "lookAt": function(at) {
        if (at && at.length === 2) {
          this.lookat = at;
          return GEOM.lookAt(at, {
            display: this
          });
        }
      },
      "updateCanvas": function(params) {
        var at, canvas, cb, ctx, current, data, data_i, fn, i, mode, mode_i, otherCtx, prev, _len;
        params = params ? params : {};
        mode = params.mode;
        data = params.data;
        cb = params.cb ? params.cb : (function() {});
        prev = this.current;
        current = (this.current + 1) % 2;
        this.switchCanvas({
          prev: prev,
          current: current
        });
        canvas = this.canvas[current];
        ctx = this.ctx[current];
        otherCtx = this.ctx[prev];
        at = this.at;
        GEOM.lookAt(at, {
          display: this
        });
        for (i = 0, _len = data.length; i < _len; i++) {
          data_i = data[i];
          mode_i = mode ? mode : data_i.mode;
          switch (mode_i) {
            case "SKELETON":
              fn = function(data, params) {
                !data.r && realPaint.polyEdge(data, params);
                return data.r && realPaint.cirEdge(data, params);
              };
              break;
            case "ONLYFACE":
              fn = function(data, params) {
                !data.r && realPaint.polyFill(data, params);
                return data.r && realPaint.cirFill(data, params);
              };
              break;
            default:
              mode = "GENERAL";
              fn = function(data, params) {
                if (data.r) {
                  realPaint.cirFill(data, params);
                  realPaint.cirEdge(data, params);
                }
                data.f && realPaint.polyFill(data, params);
                return !data.r && realPaint.polyEdge(data, params);
              };
          }
          ctx.save();
          otherCtx.save();
          GEOM.unwrapMtx(data_i.mtxScript, {
            display: this,
            center: data_i["cp"]
          });
          fn(data_i, {
            display: this,
            mode: mode_i,
            style_edge: params.style_edge ? params.style_edge : null,
            style_fill: params.style_fill ? params.style_fill : null
          });
          ctx.restore();
          otherCtx.restore();
        }
        this.mode = mode;
        cb();
        return this;
      }
    });
    return DISPLAY;
  });

}).call(this);
