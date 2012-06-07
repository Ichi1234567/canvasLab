(function() {

  define([], function() {
    var polyDraw, realPaint;
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
        var ctx, mode, style_edge;
        ctx = params.ctx;
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
        var ctx, style_fill;
        ctx = params.ctx;
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
        var ctx, mode, r, style_edge, v;
        ctx = params.ctx;
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
        var ctx, r, style_fill, v;
        ctx = params.ctx;
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
    return realPaint;
  });

}).call(this);
