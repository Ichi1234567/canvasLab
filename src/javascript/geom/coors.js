(function() {

  define(["mtx"], function(MTX) {
    var COORS;
    COORS = {
      local2global: function(l_coors, mtxinf) {},
      global2local: function(g_coors, mtxinf) {
        var inv_mtx;
        return inv_mtx = MTX.invert();
      }
    };
    return COORS;
  });

}).call(this);
