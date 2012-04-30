(function() {

  define([], function() {
    var VIEW;
    VIEW = {
      "viewAt": function(params) {
        var canvas, center, ctx, pos;
        params = params ? params : {};
        ctx = params.ctx;
        canvas = params.canvas;
        if (ctx && canvas) {
          pos = params.pos ? params.pos : [0, 0];
          center = [canvas.width / 2, canvas.height / 2];
          return ctx.transform(1, 0, 0, 1, center[0] - parseFloat(pos[0]), center[1] - parseFloat(pos[1]));
        }
      }
    };
    return VIEW;
  });

}).call(this);
