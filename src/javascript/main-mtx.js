(function() {

  require(["geom/mtx", "text!../tmpl/mtx.hbs"], function(MTX, MTXMPL) {
    var CLASS, ID, NAME, ROUTINES, VIEW;
    ID = {
      createMtxBtn: "createMtxBtn",
      mtx1in: "mtx1_in",
      mtx2in: "mtx2_in",
      numin: "num_in",
      mtx1out: "mtx1_out",
      mtx2out: "mtx2_out",
      render: "render",
      run: "run"
    };
    CLASS = {
      mtx2: "mtx2",
      mtxInf: "mtx-inf",
      mtxIn: "mtx-in",
      mtxOut: "mtx-out"
    };
    NAME = {
      op: "op"
    };
    ROUTINES = {
      opMap: {
        "add": {
          "sym": "+",
          "mtx2_type": "mtx"
        },
        "sub": {
          "sym": "-",
          "mtx2_type": "mtx"
        },
        "multiMtx": {
          "sym": "X",
          "mtx2_type": "mtx"
        },
        "multiNum": {
          "sym": "X",
          "mtx2_type": "num"
        },
        "transpose": {
          "sym": "T",
          "mtx2_type": "none"
        },
        "det": {
          "sym": "det",
          "mtx2_type": "none"
        },
        "invert": {
          "sym": "ivt",
          "mtx2_type": "none"
        },
        "adjustMtx": {
          "sym": "adj",
          "mtx2_type": "none"
        }
      },
      mtx2In: function(mtx) {
        var format;
        format = mtx.map(function(row) {
          var result;
          result = {};
          result.col = row.map(function(val) {
            return {
              val: val
            };
          });
          return result;
        });
        return format;
      },
      mtx2Out: function(mtx) {
        var format;
        format = {
          row: mtx.map(function(row) {
            return {
              val: row.join("    ")
            };
          })
        };
        return format;
      },
      arr2mtx: function(arr, mtxinf) {
        var col, mtx, row;
        row = mtxinf[0];
        col = mtxinf[1];
        mtx = MTX.loadZero({
          r: row,
          c: col
        });
        arr.map(function(val, idx) {
          var c, r;
          r = Math.floor(idx / col);
          c = idx % col;
          return mtx[r][c] = val;
        });
        return mtx;
      }
    };
    VIEW = Backbone.View.extend({
      "initialize": function(params) {
        var c, r;
        params = params ? params : {};
        r = params.r ? params.r : 2.;
        c = params.c ? params.c : 2.;
        this.m = [0, 1].map(function() {
          return MTX.loadIdentity({
            r: r,
            c: c
          });
        });
        this.num = 1;
        return this;
      },
      "events": {
        "click #run": "update",
        "click #createMtxBtn": "newPanel"
      },
      "newPanel": function() {
        var mtxinf;
        mtxinf = [0, 0];
        $("." + CLASS.mtxInf).each(function(idx) {
          return mtxinf[idx] = parseFloat($(this).attr("value"));
        });
        this.initialize({
          r: mtxinf[0],
          c: mtxinf[1]
        });
        $("." + CLASS.mtxIn).children().remove();
        this.renderIn();
        return this;
      },
      "renderIn": function() {
        var inData, num, opSymInf, opType, opVal, outData, tplin, tplnum;
        $("." + CLASS.mtxIn).children().remove();
        inData = this.m.map(function(mtx) {
          return {
            IN: {
              row: ROUTINES.mtx2In(mtx)
            }
          };
        });
        outData = this.m.map(function(mtx) {
          return ROUTINES.mtx2Out(mtx);
        });
        tplin = inData.map(function(val) {
          return Mustache.render(MTXMPL, val);
        });
        $("#" + ID.mtx1in).append(tplin[0]);
        opVal = $("select[name=op]").attr("value");
        opSymInf = ROUTINES.opMap[opVal];
        opType = opSymInf.mtx2_type;
        switch (opType) {
          case "mtx":
            $("#" + ID.mtx2in).append(tplin[1]);
            break;
          case "num":
            num = {
              IN: {
                num: {
                  val: this.num
                }
              }
            };
            tplnum = Mustache.render(MTXMPL, num);
            $("#" + ID.numin).append(tplnum);
        }
        return this;
      },
      "render": function() {
        var opSym, opSymInf, opVal, outData, outPara, para2, part2Data, resultData, resultVal, tplout;
        outData = this.m.map(function(mtx) {
          return ROUTINES.mtx2Out(mtx);
        });
        opVal = $("select[name=op]").attr("value");
        opSymInf = ROUTINES.opMap[opVal];
        opSym = opSymInf.sym;
        part2Data = false;
        para2 = false;
        switch (opSymInf.mtx2_type) {
          case "num":
            part2Data = {
              num: {
                val: this.num
              }
            };
            para2 = this.num;
            break;
          case "mtx":
            part2Data = outData[1];
            para2 = this.m[1];
        }
        resultVal = MTX[opVal](this.m[0], para2);
        console.log(resultVal);
        switch (true) {
          case typeof resultVal[0] === "number":
            resultData = {
              num: {
                val: resultVal[0]
              }
            };
            break;
          case resultVal === false:
            resultData = false;
            break;
          default:
            resultData = ROUTINES.mtx2Out(resultVal);
        }
        outPara = {
          OUT: {
            mtx1: outData[0],
            op: opSym,
            mtx2: part2Data,
            result: resultData
          }
        };
        tplout = Mustache.render(MTXMPL, outPara);
        $("#" + ID.render).append(tplout);
        return this;
      },
      "remove": function() {
        $("#" + ID.render).children().remove();
        return this;
      },
      "update": function(params) {
        var $inputs, inputVals, mtxinf, num_val, view;
        params = params ? params : {};
        view = this;
        $inputs = $("." + CLASS.mtxIn).children();
        if ($inputs.length) {
          mtxinf = [0, 0];
          $("." + CLASS.mtxInf).each(function(idx) {
            return mtxinf[idx] = parseFloat($(this).attr("value"));
          });
          inputVals = $inputs.each(function(idx, elm) {
            inputVals = (function() {
              var vals;
              vals = [];
              $(elm).children(":input").each(function() {
                return vals.push(parseFloat($(this).attr("value")));
              });
              return vals;
            })();
            return view.m[idx] = ROUTINES.arr2mtx(inputVals, mtxinf);
          });
          num_val = $("#" + ID.numin).find(":input").eq(0).attr("value");
          view.num = parseFloat(num_val);
        } else {
          this.renderIn();
        }
        this.remove();
        this.render();
        return this;
      }
    });
    new VIEW({
      el: "body"
    }).update();
    return console.log(MTX);
  });

}).call(this);
