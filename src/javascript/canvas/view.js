(function() {

  define([], function() {
    var VIEW;
    VIEW = {
      "viewAt": function(params) {
        var at, canvas, center, ctx, dataObj, pos;
        params = params ? params : {};
        ctx = params.ctx;
        canvas = params.canvas;
        dataObj = params.data;
        at = params.pos;
        if (ctx && canvas && dataObj) {
          pos = dataObj["_cp"] ? dataObj["_cp"] : [0, 0];
          pos = at ? at : pos;
          center = [canvas.width / 2, canvas.height / 2];
          ctx.setTransform(1, 0, 0, 1, center[0] - parseFloat(pos[0]), center[1] - parseFloat(pos[1]));
        }
        return pos;
      },
      "scale": function(params) {
        var at, canvas, center, ctx, dataObj, min, origin_size, scale;
        params = params ? params : {};
        ctx = params.ctx;
        canvas = params.canvas;
        scale = params.scale;
        dataObj = params.data;
        if (ctx && canvas && dataObj) {
          origin_size = [dataObj.w, dataObj.h];
          at = params.at ? params.at : dataObj["_cp"];
          switch (scale) {
            case "auto":
              scale = [1, 1];
              center = [0, 0];
              if (origin_size) {
                min = Math.min(origin_size[0], origin_size[1]);
                min = Math.floor(Math.min(canvas.width, canvas.height) / min);
                scale = [min, min];
              }
          }
          ctx.transform(scale[0], 0, 0, scale[1], -at[0] * scale[0], -at[1] * scale[1]);
          return ctx.lineWidth = ctx.lineWidth / (scale[0] + scale[1]) / 2;
        }
      }
    };
    return VIEW;
  });

}).call(this);
