(function() {

  define([], function() {
    var CANVAS_UTIL;
    console.log("canvas util");
    CANVAS_UTIL = {
      "show": function(params) {
        var canvas;
        params = params ? params : {};
        if (params.canvas) {
          canvas = params.canvas;
          params.hide = typeof params.hide === "boolean" ? params.hide : false;
          canvas.style.display = "block";
          params.hide && (canvas.style.display = "none");
        }
        return CANVAS_UTIL;
      },
      "clear": function(params) {
        var canvas, h, w, x, y;
        params = params ? params : {};
        if (params.canvas && params.ctx) {
          canvas = params.canvas;
          params = params ? params : {};
          x = params.x ? params.x : (canvas.style.left ? parseInt(canvas.style.left) : 0.);
          y = params.y ? params.y : (canvas.style.top ? parseInt(canvas.style.top) : 0.);
          w = params.w ? params.w : canvas.width;
          h = params.h ? params.h : canvas.height;
          params.ctx.clearRect(x, y, w, h);
          params.ctx.clearRect(0, 0, w, h);
        }
        return CANVAS_UTIL;
      },
      "setStyle": function(params) {
        var ctx, i, val;
        params = params ? params : {};
        ctx = params.ctx;
        if (ctx) {
          for (val in params) {
            i = params[val];
            ctx[i] = val;
          }
        }
        return CANVAS_UTIL;
      }
    };
    CANVAS_UTIL.initLine = CANVAS_UTIL.setStyle;
    CANVAS_UTIL.initFill = CANVAS_UTIL.setStyle;
    return CANVAS_UTIL;
  });

}).call(this);
