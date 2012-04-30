(function() {

  define(["canvas/canvas_intro", "canvas/polydraw"], function(CANVAS_UTIL, POLYDRAW) {
    var realPaint;
    console.log("canvas_paint");
    realPaint = {
      "polyEdge": function(params) {
        var canvas, ctx, data, mode, style_edge;
        canvas = params.canvas;
        ctx = params.ctx;
        data = params.data;
        mode = params.mode;
        style_edge = params.style_edge;
        if (mode === "SKELETON") {
          /*
                          # if mode is SKELETON, the canvas doesnt have graph info.
                          # we must run the process for draw
          */
          data.f && POLYDRAW.hasFace({
            "data": data,
            "ctx": ctx,
            "cb": (function() {
              !!style_edge && CANVAS_UTIL.initLine(style_edge);
              return ctx.stroke();
            })
          });
          return !data.f && POLYDRAW.noFace({
            "data": data,
            "ctx": ctx,
            "cb": (function() {
              !!style_edge && CANVAS_UTIL.initLine(style_edge);
              return ctx.stroke();
            })
          });
        }
      },
      "polyFill": function(params) {
        var canvas, ctx, data, style_fill;
        canvas = params.canvas;
        ctx = params.ctx;
        data = params.data;
        style_fill = params.style_fill;
        return POLYDRAW.hasFace({
          "data": data,
          "ctx": ctx,
          "type": "fill",
          "cb": (function() {
            !!style_fill && CANVAS_UTIL.initFill(style_fill);
            return ctx.fill();
          })
        });
      },
      "cirEdge": function(params) {
        var canvas, ctx, data, mode, r, style_edge, v;
        canvas = params.canvas;
        ctx = params.ctx;
        data = params.data;
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
        !!style_edge && CANVAS_UTIL.initLine(style_edge);
        return ctx.stroke();
      },
      "cirFill": function(params) {
        var canvas, ctx, data, r, style_fill, v;
        canvas = params.canvas;
        ctx = params.ctx;
        data = params.data;
        style_fill = params.style_fill;
        /*
                    # draw start
        */
        v = data.v;
        r = data.r;
        ctx.beginPath();
        ctx.arc(v[0][0], v[0][1], r, 0, Math.PI * 2, false);
        ctx.closePath();
        /*
                    # draw end
        */
        !!style_fill && CANVAS_UTIL.initFill(style_fill);
        return ctx.fill();
      }
    };
    CANVAS_UTIL.draw = function(params) {
      var canvas, ctx, data, mode;
      params = params ? params : {};
      data = params.data;
      canvas = params.canvas;
      ctx = params.ctx;
      if (data && canvas && ctx) {
        mode = params.mode;
        /*
                    # draw start, draw mode check
        */
        switch (mode) {
          case "SKELETON":
            !data.r && realPaint.polyEdge(params);
            data.r && realPaint.cirEdge(params);
            break;
          case "ONLYFACE":
            data.f && realPaint.polyFill(params);
            data.r && realPaint.cirFill(params);
            break;
          default:
            params.mode = "GENERAL";
            data.r && (realPaint.cirFill(params), realPaint.cirEdge(params));
            data.f && realPaint.polyFill(params);
            !data.r && realPaint.polyEdge(params);
        }
      }
      return CANVAS_UTIL;
    };
    return CANVAS_UTIL;
  });

}).call(this);
