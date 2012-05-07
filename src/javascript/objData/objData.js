(function() {

  define([], function() {
    var OBJDATA, parse;
    console.log("---objData---");
    parse = function(txt) {
      var lines, objData, sumv;
      objData = {
        v: [],
        f: []
      };
      lines = txt.split("\n");
      sumv = [0, 0];
      lines.forEach(function(line) {
        var key, val, vals;
        if (line.length) {
          vals = line.split(" ");
          key = vals[0].replace("_", "");
          switch (true) {
            case /^v/g.test(line):
            case /_cp/g.test(line):
              val = vals.slice(1);
              !objData[key] && (objData[key] = []);
              if (key !== "cp") {
                sumv.forEach(function(data, idx) {
                  val[idx] = parseFloat(val[idx]);
                  sumv[idx] += val[idx];
                  if (!objData["min"]) {
                    objData["min"] = [];
                    objData["max"] = [];
                  }
                  if (typeof objData["min"][idx] !== "number") {
                    objData["min"][idx] = val[idx];
                    objData["max"][idx] = val[idx];
                  }
                  objData["min"][idx] = Math.min(objData["min"][idx], val[idx]);
                  return objData["max"][idx] = Math.max(objData["max"][idx], val[idx]);
                });
                return objData[key].push(val);
              } else {
                return val.forEach(function(data) {
                  return objData[key].push(parseFloat(data));
                });
              }
              break;
            case /^f/g.test(line):
              val = vals.slice(1);
              return objData[key].push(val);
            case /^_g/g.test(line):
            case /^_v/g.test(line):
            case /^_f/g.test(line):
            case /^r/g.test(line):
              val = vals[1];
              (key === "f" || key === "v") && (key += "num");
              (key !== "g") && (val = parseFloat(val));
              return objData[key] = val;
            default:
              val = vals.slice(1);
              return objData[key] = val;
          }
        }
      });
      !objData["g"] && (objData["g"] = "");
      !objData["vnum"] && (objData["vnum"] = objData["v"].length);
      !objData["fnum"] && (objData["fnum"] = objData["f"].length);
      !objData["cp"] && (objData["cp"] = [sumv[0] / objData["vnum"], sumv[1] / objData["vnum"]]);
      if (objData["r"]) {
        objData["size"] = [];
        objData["size"] = [2 * objData["r"], 2 * objData["r"]];
        objData["cp"].forEach(function(data, idx) {
          var r;
          r = objData["r"];
          objData["min"][idx] = data - r;
          objData["max"][idx] = data + r;
          return objData["size"][idx] = 2 * r;
        });
      } else {
        objData["size"] = [];
        objData["min"].forEach(function(data, idx) {
          return objData["size"][idx] = objData["max"][idx] - objData["min"][idx];
        });
      }
      return objData;
    };
    OBJDATA = Backbone.Model.extend({
      "initialize": function(params) {
        if (params[1] === "success") {
          this.data = parse(params[0]);
          this.data["mtxScript"] = [];
          this.data["mode"] = "GENERAL";
        }
        return this;
      },
      "reset": function(params) {
        this.data["mtxScript"] = [];
        return this;
      },
      "pushMtx": function(key, mtx, params) {
        this.data["mtxScript"].push([key, mtx, params]);
        return this;
      },
      "mergeMtx": function() {
        return this;
      }
    });
    return OBJDATA;
  });

}).call(this);
