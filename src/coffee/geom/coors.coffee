define([
    "mtx"
], (MTX) ->
    #             mtx
    # local   -----------> global
    #         <-----------
    #          invert(mtx)
    #
    COORS = {
        local2global: (l_coors, mtxinf) ->

        global2local: (g_coors, mtxinf) ->
            inv_mtx = MTX.invert()
    }
    COORS
)
