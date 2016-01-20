(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, Promise, httpGet, models, views;

$ = require("jquery-plugins.coffee");

httpGet = (require("ajax.coffee")).httpGet;

Promise = require("promise");

AddModel = require("./addModel.coffee");

AddView = require("./addView.coffee");

models = {
  string: require("string/addStringModel.coffee"),
  table: require("table/addTableModel.coffee"),
  checkbox: require("checkbox/addCheckboxModel.coffee"),
  radio: require("radio/addRadioModel.coffee"),
  image: require("image/addImageModel.coffee"),
  text: require("text/addTextModel.coffee")
};

views = {
  string: require("string/addStringView.coffee"),
  table: require("table/addTableView.coffee"),
  checkbox: require("checkbox/addCheckboxView.coffee"),
  radio: require("radio/addRadioView.coffee"),
  image: require("image/addImageView.coffee"),
  text: require("text/addTextView.coffee")
};

httpGet(window.location.href + "__json/").then(function(response) {
  var $rows, addModel, addView, field, i, index, len, model, ref, results;
  addModel = AddModel({
    section: response.section,
    fields: []
  });
  addView = AddView($("@item-add-form"), addModel);
  $rows = $("@input-contain");
  index = 0;
  ref = response.fields;
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    field = ref[i];
    if (models[field.type] != null) {
      model = models[field.type]({
        field: field
      });
      if (typeof model.setSettings === "function") {
        model.setSettings(field.settings);
      }
      addModel.add(field.alias, model);
    }
    if ((field.settings.hide == null) || ((field.settings.hide != null) && !field.settings.hide)) {
      views[field.type]($rows.eq(index), model);
      results.push(index++);
    } else {
      results.push(void 0);
    }
  }
  return results;
});


},{"./addModel.coffee":2,"./addView.coffee":3,"ajax.coffee":"ajax.coffee","checkbox/addCheckboxModel.coffee":4,"checkbox/addCheckboxView.coffee":5,"image/addImageModel.coffee":6,"image/addImageView.coffee":7,"jquery-plugins.coffee":"jquery-plugins.coffee","promise":"promise","radio/addRadioModel.coffee":8,"radio/addRadioView.coffee":9,"string/addStringModel.coffee":10,"string/addStringView.coffee":11,"table/addTableModel.coffee":12,"table/addTableView.coffee":13,"text/addTextModel.coffee":14,"text/addTextView.coffee":15}],2:[function(require,module,exports){
var Model, Promise, httpGet, httpPost;

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

Promise = require("promise");

module.exports = Model({
  add: function(name, model) {
    var fields;
    fields = this.state.fields.slice();
    fields.push({
      model: model,
      name: name
    });
    return this.set({
      fields: fields
    });
  },
  save: function() {
    var promises, result;
    result = {};
    promises = [];
    this.state.fields.map(function(item) {
      var e, error1, itemName, value;
      itemName = item.name;
      try {
        if (typeof item.model.get !== "function") {
          throw itemName + " has no `get` method";
        }
        value = item.model.get();
        promises.push(value);
        return (function(itemName, value) {
          if (value instanceof Promise) {
            return value.then(function(value) {
              return result[itemName] = value;
            })["catch"](function(error) {
              return console.error(error);
            });
          } else {
            return result[itemName] = value;
          }
        })(itemName, value);
      } catch (error1) {
        e = error1;
        return console.error(e);
      }
    });
    return Promise.all(promises).then((function(_this) {
      return function() {
        console.log(result);
        return httpPost("/cms/" + _this.state.section + "/action_save/__json/", {
          data: result
        });
      };
    })(this)).then(function(response) {
      return console.log(response);
    })["catch"](function(error) {
      return console.error(error.error);
    });
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee","promise":"promise"}],3:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "submit: contain": function(e) {
      this.model.save();
      return false;
    }
  }
});


},{"view.coffee":"view.coffee"}],4:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setSettings: function(settings) {
    var data;
    data = [];
    data = settings.defaultData.slice();
    settings.defaultData.slice().map(function(item, index) {
      if ((typeof item.checked) === "string") {
        return data[index] = item.checked === "true";
      } else {
        return data[index] = item.checked;
      }
    });
    return this.set({
      data: data
    });
  },
  update: function(index, checked) {
    var data;
    data = this.state.data.slice();
    data[index] = checked;
    return this.set({
      data: data
    });
  },
  get: function() {
    return this.state.data;
  }
});


},{"model.coffee":"model.coffee"}],5:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @checkbox": function(e) {
      var $input, index;
      $input = $(e.target);
      index = $input.data("index");
      return this.model.update(index, e.target.checked);
    }
  }
});


},{"view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Model, Promise, httpFile;

Model = require("model.coffee");

Promise = require("promise");

httpFile = (require("ajax.coffee")).httpFile;

module.exports = Model({
  setPreview: function(input) {
    var filename;
    this.set({
      readyToSave: false
    });
    this.input = input;
    if (input.files != null) {
      return this.set({
        filename: input.files[0].name
      });
    } else {
      filename = input.value.split(/[\/\\]/);
      return this.set({
        filename: filename.pop()
      });
    }
  },
  setInput: function(input) {
    return this.input = input;
  },
  removePreview: function() {
    this.set({
      filename: false
    });
    return this.set({
      readyToSave: false
    });
  },
  get: function() {
    if (this.state.readyToSave) {
      return this.state.uploadedPath;
    } else {
      if (this.input && this.state.filename) {
        return httpFile("/cms/types/image/uploadimage/__json/", {
          image: this.input
        }).then((function(_this) {
          return function(response) {
            _this.set({
              readyToSave: true
            });
            _this.set({
              uploadedPath: response.filename
            });
            return response.filename;
          };
        })(this));
      } else {
        return false;
      }
    }
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee","promise":"promise"}],7:[function(require,module,exports){
var Render, View, template;

View = require("view.coffee");

template = require("types/image/item.tmpl.js");

Render = require("render");

module.exports = View({
  debug: true,
  initial: function() {
    this.template = Render(template, this.contain[0]);
    return this.model.setInput(this.contain.find("@image")[0]);
  },
  render: function(state) {
    if (!state.field.settings.hide) {
      return this.template(state);
    }
  },
  events: {
    "change: @image": function(e) {
      return this.model.setPreview(e.target);
    },
    "click: @remove": function(e) {
      return this.model.removePreview();
    }
  }
});


},{"render":"render","types/image/item.tmpl.js":16,"view.coffee":"view.coffee"}],8:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setSettings: function(settings) {
    return this.set({
      value: +settings.defaultValue
    });
  },
  update: function(value) {
    return this.set({
      value: +value
    });
  },
  get: function() {
    return this.state.value;
  }
});


},{"model.coffee":"model.coffee"}],9:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @radio": function(e) {
      var $input;
      $input = $(e.target);
      return this.model.update($input.data("index"));
    }
  }
});


},{"view.coffee":"view.coffee"}],10:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setSettings: function(settings) {
    return this.set({
      value: settings.defaultValue
    });
  },
  update: function(value) {
    return this.set({
      value: value
    });
  },
  get: function() {
    return this.state.value;
  }
});


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @string": function(e) {
      return this.model.update(e.target.value);
    }
  }
});


},{"view.coffee":"view.coffee"}],12:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setSettings: function(settings) {
    return this.set({
      data: settings.defaultData.slice()
    });
  },
  update: function(rowIndex, columnIndex, value) {
    var data;
    data = this.state.data.slice();
    data[rowIndex][columnIndex] = value;
    return this.set({
      data: data
    });
  },
  get: function() {
    return this.state.data;
  }
});


},{"model.coffee":"model.coffee"}],13:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @cell": function(e) {
      var $input, columnIndex, rowIndex;
      $input = $(e.target);
      rowIndex = +$input.data("row");
      columnIndex = +$input.data("column");
      return this.model.update(rowIndex, columnIndex, e.target.value);
    }
  }
});


},{"view.coffee":"view.coffee"}],14:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setSettings: function(settings) {
    return this.set({
      value: ""
    });
  },
  update: function(value) {
    return this.set({
      value: value
    });
  },
  get: function() {
    return this.state.value;
  }
});


},{"model.coffee":"model.coffee"}],15:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @area": function(e) {
      return this.model.update(e.target.value);
    }
  }
});


},{"view.coffee":"view.coffee"}],16:[function(require,module,exports){
(function (factory)
{
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  }
  else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define('first-try', [], factory());
  }
  else {
    window.item = factory();
  }
})(function ()
{
  var _hasProp = Object.prototype.hasOwnProperty;
  var _crEl = function (node)
  {
    return {type: 'node', name: node, attrs: [], childs: []};
  };
  var _crTN = function (node)
  {
    return {type: 'text', text: node};
  };
  function count(arr)
  {
    return arr.length;
  }
  function length(str)
  {
    return str.length;
  }
  var cloneElements = [];
  function clone(obj)
  {
    cloneElements = [];
    var copy = null;
    var elem;
    var attr;
    var i;

    if (null == obj || "object" != typeof obj) {
      return obj;
    }

    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    if (cloneElements.indexOf(obj) == -1) {
      cloneElements.push(obj);
      if (obj instanceof Array) {
        copy = [];
        for (i in obj) {
          if (_hasProp.call(obj, i)) {
            elem = obj[i];
            copy[i] = clone(elem);
          }
        }
        return copy;
      }
      if (obj instanceof Object) {
        copy = {};
        for (i in obj) {
          if (_hasProp.call(obj, i)) {
            attr = obj[i];
            copy[i] = clone(attr);
          }
        }
        return copy;
      }
    }
  }
  function create()
  {
    var indexAttr;

    if (arguments.length === 1) {
      var rootNodes = [];
      arguments[0](rootNodes);
      if (rootNodes.length) {
        for (indexAttr in rootNodes) {
          if (_hasProp.call(rootNodes, indexAttr)) {
            if (typeof rootNodes[indexAttr] === 'string' || typeof rootNodes[indexAttr] === 'boolean' || typeof rootNodes[indexAttr] === 'number') {
              rootNodes[indexAttr] = _crTN(rootNodes[indexAttr]);
            }
          }
        }
      }
      return rootNodes;
    }
    else if (arguments.length === 3) {
      var nodes = [];
      var parentNode;
      var indexNode;
      var node;
      var attr;
      var attrs = arguments[1];
      arguments[2](nodes);
      parentNode = _crEl(arguments[0]);
      if (attrs.length) {
        for (indexAttr in attrs) {
          if (_hasProp.call(attrs, indexAttr)) {
            attr = attrs[indexAttr];
            parentNode.attrs.push({
              name: attr[0],
              value: attr[1]
            });
          }
        }
      }
      for (indexNode in nodes) {
        if (_hasProp.call(nodes, indexNode)) {
          node = nodes[indexNode];
          if (typeof node === 'string' || typeof node === 'boolean' || typeof node === 'number') {
            parentNode.childs.push(_crTN(node));
          }
          else {
            parentNode.childs.push(node);
          }
        }
      }
      return parentNode;
    }
  }
  if (typeof window.__cachedTemplates === 'undefined') {
    window.__cachedTemplates = {};
  }
  function cacheRequireTemplate(path, required)
  {
    window.__cachedTemplates[path] = required;
  }
  function requireTemplate(path, obj)
  {
    return window.__cachedTemplates[path](obj);
  }
  return function (obj)
  {
    return create(function (childs)
    {
      with (obj) {
        (function () {
          var attrs = [];
          (function () {
            var attr = '';
            attr += 'form__inp-contain';
            attrs.push(['class', attr]);
          })();
          (function () {
            var attr = '';
            attr += 'input-contain';
            attrs.push(['role', attr]);
          })();
          childs.push(create('div', attrs, function (childs) {
            (function () {
              var attrs = [];
              (function () {
                var attr = '';
                attr += 'form__file-wrap';
                attrs.push(['class', attr]);
              })();
              childs.push(create('div', attrs, function (childs) {
                if ( !(!( (typeof filename !== 'undefined' ? filename : '') ))) {
                  (function () {
                    var attrs = [];
                    (function () {
                      var attr = '';
                      attr += 'form__file-close';
                      attrs.push(['class', attr]);
                    })();
                    (function () {
                      var attr = '';
                      attr += 'remove';
                      attrs.push(['role', attr]);
                    })();
                    childs.push(create('span', attrs, function (childs) {
                    }));
                  })();
                }
                (function () {
                  var attrs = [];
                  (function () {
                    var attr = '';
                    attr += 'form__file';
                    if ( !(!( (typeof filename !== 'undefined' ? filename : '') ))) {
                      attr += ' form__file--choosen';
                    }
                    attrs.push(['class', attr]);
                  })();
                  childs.push(create('label', attrs, function (childs) {
                    if ( !(!( (typeof filename !== 'undefined' ? filename : '') ))) {
                      (function () {
                        var attrs = [];
                        (function () {
                          var attr = '';
                          attr += 'form__file-filename';
                          attrs.push(['class', attr]);
                        })();
                        childs.push(create('span', attrs, function (childs) {
                          childs.push(filename);
                        }));
                      })();
                    }
                    (function () {
                      var attrs = [];
                      (function () {
                        var attr = '';
                        attr += 'file';
                        attrs.push(['type', attr]);
                      })();
                      (function () {
                        var attr = '';
                        attr += field['alias'];
                        attrs.push(['name', attr]);
                      })();
                      (function () {
                        var attr = '';
                        attr += field['alias'];
                        attrs.push(['id', attr]);
                      })();
                      (function () {
                        var attr = '';
                        attrs.push(['value', attr]);
                      })();
                      (function () {
                        var attr = '';
                        attr += 'image';
                        attrs.push(['role', attr]);
                      })();
                      childs.push(create('input', attrs, function (childs) {
                      }));
                    })();
                  }));
                })();
              }));
            })();
          }));
        })();
      }
    });
  };
});
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9pdGVtL2FkZC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9pdGVtL2FkZE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2l0ZW0vYWRkVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9hZGRDaGVja2JveE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L2FkZENoZWNrYm94Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9pbWFnZS9hZGRJbWFnZU1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL2FkZEltYWdlVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9hZGRSYWRpb01vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3JhZGlvL2FkZFJhZGlvVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9zdHJpbmcvYWRkU3RyaW5nTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvc3RyaW5nL2FkZFN0cmluZ1ZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvdGFibGUvYWRkVGFibGVNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy90YWJsZS9hZGRUYWJsZVZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvdGV4dC9hZGRUZXh0TW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvdGV4dC9hZGRUZXh0Vmlldy5jb2ZmZWUiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy9pbWFnZS9pdGVtLnRtcGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsdUJBQVI7O0FBQ0osT0FBQSxHQUFVLENBQUMsT0FBQSxDQUFRLGFBQVIsQ0FBRCxDQUF1QixDQUFDOztBQUNsQyxPQUFBLEdBQVUsT0FBQSxDQUFRLFNBQVI7O0FBRVYsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUjs7QUFFWCxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSOztBQUVWLE1BQUEsR0FDRTtFQUFBLE1BQUEsRUFBUSxPQUFBLENBQVEsOEJBQVIsQ0FBUjtFQUNBLEtBQUEsRUFBTyxPQUFBLENBQVEsNEJBQVIsQ0FEUDtFQUVBLFFBQUEsRUFBVSxPQUFBLENBQVEsa0NBQVIsQ0FGVjtFQUdBLEtBQUEsRUFBTyxPQUFBLENBQVEsNEJBQVIsQ0FIUDtFQUlBLEtBQUEsRUFBTyxPQUFBLENBQVEsNEJBQVIsQ0FKUDtFQUtBLElBQUEsRUFBTSxPQUFBLENBQVEsMEJBQVIsQ0FMTjs7O0FBT0YsS0FBQSxHQUNFO0VBQUEsTUFBQSxFQUFRLE9BQUEsQ0FBUSw2QkFBUixDQUFSO0VBQ0EsS0FBQSxFQUFPLE9BQUEsQ0FBUSwyQkFBUixDQURQO0VBRUEsUUFBQSxFQUFVLE9BQUEsQ0FBUSxpQ0FBUixDQUZWO0VBR0EsS0FBQSxFQUFPLE9BQUEsQ0FBUSwyQkFBUixDQUhQO0VBSUEsS0FBQSxFQUFPLE9BQUEsQ0FBUSwyQkFBUixDQUpQO0VBS0EsSUFBQSxFQUFNLE9BQUEsQ0FBUSx5QkFBUixDQUxOOzs7QUFPRixPQUFBLENBQVcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFqQixHQUFzQixTQUFoQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsUUFBRDtBQUNKLE1BQUE7RUFBQSxRQUFBLEdBQVcsUUFBQSxDQUNUO0lBQUEsT0FBQSxFQUFTLFFBQVEsQ0FBQyxPQUFsQjtJQUNBLE1BQUEsRUFBUSxFQURSO0dBRFM7RUFHWCxPQUFBLEdBQVUsT0FBQSxDQUFTLENBQUEsQ0FBRSxnQkFBRixDQUFULEVBQThCLFFBQTlCO0VBQ1YsS0FBQSxHQUFRLENBQUEsQ0FBRSxnQkFBRjtFQUNSLEtBQUEsR0FBUTtBQUNSO0FBQUE7T0FBQSxxQ0FBQTs7SUFDRSxJQUFHLDBCQUFIO01BQ0UsS0FBQSxHQUFRLE1BQU8sQ0FBQSxLQUFLLENBQUMsSUFBTixDQUFQLENBQW1CO1FBQUMsT0FBQSxLQUFEO09BQW5COztRQUNSLEtBQUssQ0FBQyxZQUFhLEtBQUssQ0FBQzs7TUFDekIsUUFBUSxDQUFDLEdBQVQsQ0FBYSxLQUFLLENBQUMsS0FBbkIsRUFBMEIsS0FBMUIsRUFIRjs7SUFJQSxJQUFJLDZCQUFELElBQXlCLENBQUMsNkJBQUEsSUFBd0IsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQXpDLENBQTVCO01BQ0UsS0FBTSxDQUFBLEtBQUssQ0FBQyxJQUFOLENBQU4sQ0FBa0IsS0FBSyxDQUFDLEVBQU4sQ0FBUyxLQUFULENBQWxCLEVBQW1DLEtBQW5DO21CQUNBLEtBQUEsSUFGRjtLQUFBLE1BQUE7MkJBQUE7O0FBTEY7O0FBUEksQ0FETjs7OztBQ3hCQSxJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUjs7QUFDUixPQUFBLEdBQVUsQ0FBQyxPQUFBLENBQVEsYUFBUixDQUFELENBQXVCLENBQUM7O0FBQ2xDLFFBQUEsR0FBVyxDQUFDLE9BQUEsQ0FBUSxhQUFSLENBQUQsQ0FBdUIsQ0FBQzs7QUFDbkMsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSOztBQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUEsQ0FDZjtFQUFBLEdBQUEsRUFBSyxTQUFDLElBQUQsRUFBTyxLQUFQO0FBQ0gsUUFBQTtJQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFkLENBQUE7SUFDVCxNQUFNLENBQUMsSUFBUCxDQUNFO01BQUEsS0FBQSxFQUFPLEtBQVA7TUFDQSxJQUFBLEVBQU0sSUFETjtLQURGO1dBR0EsSUFBQyxDQUFBLEdBQUQsQ0FBSztNQUFDLFFBQUEsTUFBRDtLQUFMO0VBTEcsQ0FBTDtFQU9BLElBQUEsRUFBTSxTQUFBO0FBQ0osUUFBQTtJQUFBLE1BQUEsR0FBUztJQUNULFFBQUEsR0FBVztJQUNYLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQWQsQ0FBa0IsU0FBQyxJQUFEO0FBQ2hCLFVBQUE7TUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDO0FBQ2hCO1FBQ0UsSUFBRyxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBbEIsS0FBeUIsVUFBNUI7QUFDRSxnQkFBUyxRQUFELEdBQVUsdUJBRHBCOztRQUVBLEtBQUEsR0FBUSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQVgsQ0FBQTtRQUNSLFFBQVEsQ0FBQyxJQUFULENBQWMsS0FBZDtlQUNHLENBQUEsU0FBQyxRQUFELEVBQVcsS0FBWDtVQUNELElBQUcsS0FBQSxZQUFpQixPQUFwQjttQkFDRSxLQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsS0FBRDtxQkFDSixNQUFPLENBQUEsUUFBQSxDQUFQLEdBQW1CO1lBRGYsQ0FETixDQUdBLENBQUMsT0FBRCxDQUhBLENBR08sU0FBQyxLQUFEO3FCQUNMLE9BQU8sQ0FBQyxLQUFSLENBQWMsS0FBZDtZQURLLENBSFAsRUFERjtXQUFBLE1BQUE7bUJBT0UsTUFBTyxDQUFBLFFBQUEsQ0FBUCxHQUFtQixNQVByQjs7UUFEQyxDQUFBLENBQUgsQ0FBSSxRQUFKLEVBQWMsS0FBZCxFQUxGO09BQUEsY0FBQTtRQWNNO2VBQ0osT0FBTyxDQUFDLEtBQVIsQ0FBYyxDQUFkLEVBZkY7O0lBRmdCLENBQWxCO1dBbUJBLE9BQU8sQ0FBQyxHQUFSLENBQVksUUFBWixDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQTtRQUNKLE9BQU8sQ0FBQyxHQUFSLENBQVksTUFBWjtlQUNBLFFBQUEsQ0FBUyxPQUFBLEdBQVEsS0FBQyxDQUFBLEtBQUssQ0FBQyxPQUFmLEdBQXVCLHNCQUFoQyxFQUF1RDtVQUFBLElBQUEsRUFBTSxNQUFOO1NBQXZEO01BRkk7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sQ0FJQSxDQUFDLElBSkQsQ0FJTSxTQUFDLFFBQUQ7YUFDSixPQUFPLENBQUMsR0FBUixDQUFZLFFBQVo7SUFESSxDQUpOLENBTUEsQ0FBQyxPQUFELENBTkEsQ0FNTyxTQUFDLEtBQUQ7YUFDTCxPQUFPLENBQUMsS0FBUixDQUFjLEtBQUssQ0FBQyxLQUFwQjtJQURLLENBTlA7RUF0QkksQ0FQTjtDQURlOzs7O0FDTGpCLElBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSOztBQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUEsQ0FDZjtFQUFBLE1BQUEsRUFDRTtJQUFBLGlCQUFBLEVBQW1CLFNBQUMsQ0FBRDtNQUNqQixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtBQUNBLGFBQU87SUFGVSxDQUFuQjtHQURGO0NBRGU7Ozs7QUNGakIsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVI7O0FBRVIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBQSxDQUNmO0VBQUEsV0FBQSxFQUFhLFNBQUMsUUFBRDtBQUNYLFFBQUE7SUFBQSxJQUFBLEdBQU87SUFDUCxJQUFBLEdBQU8sUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFyQixDQUFBO0lBQ1AsUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFyQixDQUFBLENBQTRCLENBQUMsR0FBN0IsQ0FBaUMsU0FBQyxJQUFELEVBQU8sS0FBUDtNQUFpQixJQUFHLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBYixDQUFBLEtBQXlCLFFBQTVCO2VBQTBDLElBQUssQ0FBQSxLQUFBLENBQUwsR0FBYyxJQUFJLENBQUMsT0FBTCxLQUFnQixPQUF4RTtPQUFBLE1BQUE7ZUFBb0YsSUFBSyxDQUFBLEtBQUEsQ0FBTCxHQUFjLElBQUksQ0FBQyxRQUF2Rzs7SUFBakIsQ0FBakM7V0FDQSxJQUFDLENBQUEsR0FBRCxDQUFLO01BQUMsTUFBQSxJQUFEO0tBQUw7RUFKVyxDQUFiO0VBTUEsTUFBQSxFQUFRLFNBQUMsS0FBRCxFQUFRLE9BQVI7QUFDTixRQUFBO0lBQUEsSUFBQSxHQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQVosQ0FBQTtJQUNQLElBQUssQ0FBQSxLQUFBLENBQUwsR0FBYztXQUNkLElBQUMsQ0FBQSxHQUFELENBQUs7TUFBQyxNQUFBLElBQUQ7S0FBTDtFQUhNLENBTlI7RUFXQSxHQUFBLEVBQUssU0FBQTtXQUFHLElBQUMsQ0FBQSxLQUFLLENBQUM7RUFBVixDQVhMO0NBRGU7Ozs7QUNGakIsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBRVAsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFBQSxDQUNmO0VBQUEsTUFBQSxFQUNFO0lBQUEsbUJBQUEsRUFBcUIsU0FBQyxDQUFEO0FBQ25CLFVBQUE7TUFBQSxNQUFBLEdBQVMsQ0FBQSxDQUFFLENBQUMsQ0FBQyxNQUFKO01BQ1QsS0FBQSxHQUFRLE1BQU0sQ0FBQyxJQUFQLENBQVksT0FBWjthQUNSLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLEtBQWQsRUFBcUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUE5QjtJQUhtQixDQUFyQjtHQURGO0NBRGU7Ozs7QUNGakIsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVI7O0FBQ1IsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSOztBQUNWLFFBQUEsR0FBVyxDQUFDLE9BQUEsQ0FBUSxhQUFSLENBQUQsQ0FBdUIsQ0FBQzs7QUFFbkMsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBQSxDQUNmO0VBQUEsVUFBQSxFQUFZLFNBQUMsS0FBRDtBQUNWLFFBQUE7SUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLO01BQUEsV0FBQSxFQUFhLEtBQWI7S0FBTDtJQUNBLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFHLG1CQUFIO2FBQ0UsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLFFBQUEsRUFBVSxLQUFLLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLElBQXpCO09BQUwsRUFERjtLQUFBLE1BQUE7TUFHRSxRQUFBLEdBQVcsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFaLENBQWtCLFFBQWxCO2FBQ1gsSUFBQyxDQUFBLEdBQUQsQ0FBSztRQUFBLFFBQUEsRUFBVSxRQUFRLENBQUMsR0FBVCxDQUFBLENBQVY7T0FBTCxFQUpGOztFQUhVLENBQVo7RUFTQSxRQUFBLEVBQVUsU0FBQyxLQUFEO1dBQ1IsSUFBQyxDQUFBLEtBQUQsR0FBUztFQURELENBVFY7RUFZQSxhQUFBLEVBQWUsU0FBQTtJQUNiLElBQUMsQ0FBQSxHQUFELENBQUs7TUFBQSxRQUFBLEVBQVUsS0FBVjtLQUFMO1dBQ0EsSUFBQyxDQUFBLEdBQUQsQ0FBSztNQUFBLFdBQUEsRUFBYSxLQUFiO0tBQUw7RUFGYSxDQVpmO0VBZ0JBLEdBQUEsRUFBSyxTQUFBO0lBQ0gsSUFBRyxJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVY7YUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLGFBRFQ7S0FBQSxNQUFBO01BR0UsSUFBRyxJQUFDLENBQUEsS0FBRCxJQUFVLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBcEI7ZUFDRSxRQUFBLENBQVMsc0NBQVQsRUFDRTtVQUFBLEtBQUEsRUFBTyxJQUFDLENBQUEsS0FBUjtTQURGLENBRUEsQ0FBQyxJQUZELENBRU0sQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxRQUFEO1lBQ0osS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLFdBQUEsRUFBYSxJQUFiO2FBQUw7WUFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsWUFBQSxFQUFjLFFBQVEsQ0FBQyxRQUF2QjthQUFMO21CQUNBLFFBQVEsQ0FBQztVQUhMO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUZOLEVBREY7T0FBQSxNQUFBO2VBUUUsTUFSRjtPQUhGOztFQURHLENBaEJMO0NBRGU7Ozs7QUNKakIsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBQ1AsUUFBQSxHQUFXLE9BQUEsQ0FBUSwwQkFBUjs7QUFDWCxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVI7O0FBRVQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFBQSxDQUNmO0VBQUEsS0FBQSxFQUFPLElBQVA7RUFFQSxPQUFBLEVBQVMsU0FBQTtJQUNQLElBQUMsQ0FBQSxRQUFELEdBQVksTUFBQSxDQUFPLFFBQVAsRUFBaUIsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBLENBQTFCO1dBQ1osSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLENBQWdCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLFFBQWQsQ0FBd0IsQ0FBQSxDQUFBLENBQXhDO0VBRk8sQ0FGVDtFQU1BLE1BQUEsRUFBUSxTQUFDLEtBQUQ7SUFDTixJQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBekI7YUFDRSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVYsRUFERjs7RUFETSxDQU5SO0VBVUEsTUFBQSxFQUNFO0lBQUEsZ0JBQUEsRUFBa0IsU0FBQyxDQUFEO2FBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxVQUFQLENBQWtCLENBQUMsQ0FBQyxNQUFwQjtJQUFQLENBQWxCO0lBQ0EsZ0JBQUEsRUFBa0IsU0FBQyxDQUFEO2FBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxhQUFQLENBQUE7SUFBUCxDQURsQjtHQVhGO0NBRGU7Ozs7QUNKakIsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVI7O0FBRVIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBQSxDQUNmO0VBQUEsV0FBQSxFQUFhLFNBQUMsUUFBRDtXQUNYLElBQUMsQ0FBQSxHQUFELENBQUs7TUFBQSxLQUFBLEVBQU8sQ0FBRSxRQUFRLENBQUMsWUFBbEI7S0FBTDtFQURXLENBQWI7RUFHQSxNQUFBLEVBQVEsU0FBQyxLQUFEO1dBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSztNQUFBLEtBQUEsRUFBTyxDQUFFLEtBQVQ7S0FBTDtFQURNLENBSFI7RUFNQSxHQUFBLEVBQUssU0FBQTtXQUFHLElBQUMsQ0FBQSxLQUFLLENBQUM7RUFBVixDQU5MO0NBRGU7Ozs7QUNGakIsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBRVAsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFBQSxDQUNmO0VBQUEsTUFBQSxFQUNFO0lBQUEsZ0JBQUEsRUFBa0IsU0FBQyxDQUFEO0FBQ2hCLFVBQUE7TUFBQSxNQUFBLEdBQVMsQ0FBQSxDQUFFLENBQUMsQ0FBQyxNQUFKO2FBQ1QsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsTUFBTSxDQUFDLElBQVAsQ0FBWSxPQUFaLENBQWQ7SUFGZ0IsQ0FBbEI7R0FERjtDQURlOzs7O0FDRmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztBQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUEsQ0FDZjtFQUFBLFdBQUEsRUFBYSxTQUFDLFFBQUQ7V0FDWCxJQUFDLENBQUEsR0FBRCxDQUFLO01BQUEsS0FBQSxFQUFPLFFBQVEsQ0FBQyxZQUFoQjtLQUFMO0VBRFcsQ0FBYjtFQUdBLE1BQUEsRUFBUSxTQUFDLEtBQUQ7V0FDTixJQUFDLENBQUEsR0FBRCxDQUFLO01BQUMsT0FBQSxLQUFEO0tBQUw7RUFETSxDQUhSO0VBTUEsR0FBQSxFQUFLLFNBQUE7V0FBRyxJQUFDLENBQUEsS0FBSyxDQUFDO0VBQVYsQ0FOTDtDQURlOzs7O0FDRmpCLElBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSOztBQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUEsQ0FDZjtFQUFBLE1BQUEsRUFDRTtJQUFBLGlCQUFBLEVBQW1CLFNBQUMsQ0FBRDthQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBdkI7SUFBUCxDQUFuQjtHQURGO0NBRGU7Ozs7QUNGakIsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVI7O0FBRVIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBQSxDQUNmO0VBQUEsV0FBQSxFQUFhLFNBQUMsUUFBRDtXQUNYLElBQUMsQ0FBQSxHQUFELENBQUs7TUFBQSxJQUFBLEVBQU0sUUFBUSxDQUFDLFdBQVcsQ0FBQyxLQUFyQixDQUFBLENBQU47S0FBTDtFQURXLENBQWI7RUFHQSxNQUFBLEVBQVEsU0FBQyxRQUFELEVBQVcsV0FBWCxFQUF3QixLQUF4QjtBQUNOLFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBWixDQUFBO0lBQ1AsSUFBSyxDQUFBLFFBQUEsQ0FBVSxDQUFBLFdBQUEsQ0FBZixHQUE4QjtXQUM5QixJQUFDLENBQUEsR0FBRCxDQUFLO01BQUMsTUFBQSxJQUFEO0tBQUw7RUFITSxDQUhSO0VBUUEsR0FBQSxFQUFLLFNBQUE7V0FBRyxJQUFDLENBQUEsS0FBSyxDQUFDO0VBQVYsQ0FSTDtDQURlOzs7O0FDRmpCLElBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSOztBQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUEsQ0FDZjtFQUFBLE1BQUEsRUFDRTtJQUFBLGVBQUEsRUFBaUIsU0FBQyxDQUFEO0FBQ2YsVUFBQTtNQUFBLE1BQUEsR0FBUyxDQUFBLENBQUUsQ0FBQyxDQUFDLE1BQUo7TUFDVCxRQUFBLEdBQVcsQ0FBRSxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVo7TUFDYixXQUFBLEdBQWMsQ0FBRSxNQUFNLENBQUMsSUFBUCxDQUFZLFFBQVo7YUFDaEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsUUFBZCxFQUF3QixXQUF4QixFQUFxQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQTlDO0lBSmUsQ0FBakI7R0FERjtDQURlOzs7O0FDRmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztBQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUEsQ0FDZjtFQUFBLFdBQUEsRUFBYSxTQUFDLFFBQUQ7V0FDWCxJQUFDLENBQUEsR0FBRCxDQUFLO01BQUEsS0FBQSxFQUFPLEVBQVA7S0FBTDtFQURXLENBQWI7RUFHQSxNQUFBLEVBQVEsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEdBQUQsQ0FBSztNQUFDLE9BQUEsS0FBRDtLQUFMO0VBQVgsQ0FIUjtFQUtBLEdBQUEsRUFBSyxTQUFBO1dBQUcsSUFBQyxDQUFBLEtBQUssQ0FBQztFQUFWLENBTEw7Q0FEZTs7OztBQ0ZqQixJQUFBOztBQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUjs7QUFFUCxNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFBLENBQ2Y7RUFBQSxNQUFBLEVBQ0U7SUFBQSxlQUFBLEVBQWlCLFNBQUMsQ0FBRDthQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxDQUFjLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBdkI7SUFBUCxDQUFqQjtHQURGO0NBRGU7Ozs7QUNGakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuaHR0cEdldCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEdldFxuUHJvbWlzZSA9IHJlcXVpcmUgXCJwcm9taXNlXCJcblxuQWRkTW9kZWwgPSByZXF1aXJlIFwiLi9hZGRNb2RlbC5jb2ZmZWVcIlxuXG5BZGRWaWV3ID0gcmVxdWlyZSBcIi4vYWRkVmlldy5jb2ZmZWVcIlxuXG5tb2RlbHMgPVxuICBzdHJpbmc6IHJlcXVpcmUgXCJzdHJpbmcvYWRkU3RyaW5nTW9kZWwuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9hZGRUYWJsZU1vZGVsLmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvYWRkQ2hlY2tib3hNb2RlbC5jb2ZmZWVcIlxuICByYWRpbzogcmVxdWlyZSBcInJhZGlvL2FkZFJhZGlvTW9kZWwuY29mZmVlXCJcbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9hZGRJbWFnZU1vZGVsLmNvZmZlZVwiXG4gIHRleHQ6IHJlcXVpcmUgXCJ0ZXh0L2FkZFRleHRNb2RlbC5jb2ZmZWVcIlxuXG52aWV3cyA9XG4gIHN0cmluZzogcmVxdWlyZSBcInN0cmluZy9hZGRTdHJpbmdWaWV3LmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvYWRkVGFibGVWaWV3LmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvYWRkQ2hlY2tib3hWaWV3LmNvZmZlZVwiXG4gIHJhZGlvOiByZXF1aXJlIFwicmFkaW8vYWRkUmFkaW9WaWV3LmNvZmZlZVwiXG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvYWRkSW1hZ2VWaWV3LmNvZmZlZVwiXG4gIHRleHQ6IHJlcXVpcmUgXCJ0ZXh0L2FkZFRleHRWaWV3LmNvZmZlZVwiXG5cbmh0dHBHZXQgXCIje3dpbmRvdy5sb2NhdGlvbi5ocmVmfV9fanNvbi9cIlxuLnRoZW4gKHJlc3BvbnNlKSAtPlxuICBhZGRNb2RlbCA9IEFkZE1vZGVsXG4gICAgc2VjdGlvbjogcmVzcG9uc2Uuc2VjdGlvblxuICAgIGZpZWxkczogW11cbiAgYWRkVmlldyA9IEFkZFZpZXcgKCQgXCJAaXRlbS1hZGQtZm9ybVwiKSwgYWRkTW9kZWxcbiAgJHJvd3MgPSAkIFwiQGlucHV0LWNvbnRhaW5cIlxuICBpbmRleCA9IDBcbiAgZm9yIGZpZWxkIGluIHJlc3BvbnNlLmZpZWxkc1xuICAgIGlmIG1vZGVsc1tmaWVsZC50eXBlXT9cbiAgICAgIG1vZGVsID0gbW9kZWxzW2ZpZWxkLnR5cGVdIHtmaWVsZH1cbiAgICAgIG1vZGVsLnNldFNldHRpbmdzPyBmaWVsZC5zZXR0aW5nc1xuICAgICAgYWRkTW9kZWwuYWRkIGZpZWxkLmFsaWFzLCBtb2RlbFxuICAgIGlmICFmaWVsZC5zZXR0aW5ncy5oaWRlPyB8fCAoZmllbGQuc2V0dGluZ3MuaGlkZT8gJiYgIWZpZWxkLnNldHRpbmdzLmhpZGUpXG4gICAgICB2aWV3c1tmaWVsZC50eXBlXSAkcm93cy5lcShpbmRleCksIG1vZGVsXG4gICAgICBpbmRleCsrXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuaHR0cEdldCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEdldFxuaHR0cFBvc3QgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBQb3N0XG5Qcm9taXNlID0gcmVxdWlyZSBcInByb21pc2VcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIGFkZDogKG5hbWUsIG1vZGVsKSAtPlxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIGZpZWxkcy5wdXNoXG4gICAgICBtb2RlbDogbW9kZWxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgc2F2ZTogLT5cbiAgICByZXN1bHQgPSB7fVxuICAgIHByb21pc2VzID0gW11cbiAgICBAc3RhdGUuZmllbGRzLm1hcCAoaXRlbSkgLT5cbiAgICAgIGl0ZW1OYW1lID0gaXRlbS5uYW1lXG4gICAgICB0cnlcbiAgICAgICAgaWYgdHlwZW9mIGl0ZW0ubW9kZWwuZ2V0ICE9IFwiZnVuY3Rpb25cIlxuICAgICAgICAgIHRocm93IFwiI3tpdGVtTmFtZX0gaGFzIG5vIGBnZXRgIG1ldGhvZFwiXG4gICAgICAgIHZhbHVlID0gaXRlbS5tb2RlbC5nZXQoKVxuICAgICAgICBwcm9taXNlcy5wdXNoIHZhbHVlXG4gICAgICAgIGRvIChpdGVtTmFtZSwgdmFsdWUpIC0+XG4gICAgICAgICAgaWYgdmFsdWUgaW5zdGFuY2VvZiBQcm9taXNlXG4gICAgICAgICAgICB2YWx1ZVxuICAgICAgICAgICAgLnRoZW4gKHZhbHVlKSAtPlxuICAgICAgICAgICAgICByZXN1bHRbaXRlbU5hbWVdID0gdmFsdWVcbiAgICAgICAgICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IgZXJyb3JcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZXN1bHRbaXRlbU5hbWVdID0gdmFsdWVcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgY29uc29sZS5lcnJvciBlXG5cbiAgICBQcm9taXNlLmFsbCBwcm9taXNlc1xuICAgIC50aGVuID0+XG4gICAgICBjb25zb2xlLmxvZyByZXN1bHRcbiAgICAgIGh0dHBQb3N0IFwiL2Ntcy8je0BzdGF0ZS5zZWN0aW9ufS9hY3Rpb25fc2F2ZS9fX2pzb24vXCIsIGRhdGE6IHJlc3VsdFxuICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgIGNvbnNvbGUubG9nIHJlc3BvbnNlXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUuZXJyb3IgZXJyb3IuZXJyb3JcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBjb250YWluXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLnNhdmUoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFNldHRpbmdzOiAoc2V0dGluZ3MpIC0+XG4gICAgZGF0YSA9IFtdXG4gICAgZGF0YSA9IHNldHRpbmdzLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBzZXR0aW5ncy5kZWZhdWx0RGF0YS5zbGljZSgpLm1hcCAoaXRlbSwgaW5kZXgpIC0+IGlmICh0eXBlb2YgaXRlbS5jaGVja2VkKSA9PSBcInN0cmluZ1wiIHRoZW4gZGF0YVtpbmRleF0gPSBpdGVtLmNoZWNrZWQgPT0gXCJ0cnVlXCIgZWxzZSBkYXRhW2luZGV4XSA9IGl0ZW0uY2hlY2tlZFxuICAgIEBzZXQge2RhdGF9XG5cbiAgdXBkYXRlOiAoaW5kZXgsIGNoZWNrZWQpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XSA9IGNoZWNrZWRcbiAgICBAc2V0IHtkYXRhfVxuXG4gIGdldDogLT4gQHN0YXRlLmRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAY2hlY2tib3hcIjogKGUpIC0+XG4gICAgICAkaW5wdXQgPSAkIGUudGFyZ2V0XG4gICAgICBpbmRleCA9ICRpbnB1dC5kYXRhIFwiaW5kZXhcIlxuICAgICAgQG1vZGVsLnVwZGF0ZSBpbmRleCwgZS50YXJnZXQuY2hlY2tlZFxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblByb21pc2UgPSByZXF1aXJlIFwicHJvbWlzZVwiXG5odHRwRmlsZSA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEZpbGVcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRQcmV2aWV3OiAoaW5wdXQpIC0+XG4gICAgQHNldCByZWFkeVRvU2F2ZTogZmFsc2VcbiAgICBAaW5wdXQgPSBpbnB1dFxuICAgIGlmIGlucHV0LmZpbGVzP1xuICAgICAgQHNldCBmaWxlbmFtZTogaW5wdXQuZmlsZXNbMF0ubmFtZVxuICAgIGVsc2VcbiAgICAgIGZpbGVuYW1lID0gaW5wdXQudmFsdWUuc3BsaXQgL1tcXC9cXFxcXS9cbiAgICAgIEBzZXQgZmlsZW5hbWU6IGZpbGVuYW1lLnBvcCgpXG5cbiAgc2V0SW5wdXQ6IChpbnB1dCkgLT5cbiAgICBAaW5wdXQgPSBpbnB1dFxuXG4gIHJlbW92ZVByZXZpZXc6IC0+XG4gICAgQHNldCBmaWxlbmFtZTogZmFsc2VcbiAgICBAc2V0IHJlYWR5VG9TYXZlOiBmYWxzZVxuXG4gIGdldDogLT5cbiAgICBpZiBAc3RhdGUucmVhZHlUb1NhdmVcbiAgICAgIEBzdGF0ZS51cGxvYWRlZFBhdGhcbiAgICBlbHNlXG4gICAgICBpZiBAaW5wdXQgJiYgQHN0YXRlLmZpbGVuYW1lXG4gICAgICAgIGh0dHBGaWxlIFwiL2Ntcy90eXBlcy9pbWFnZS91cGxvYWRpbWFnZS9fX2pzb24vXCIsXG4gICAgICAgICAgaW1hZ2U6IEBpbnB1dFxuICAgICAgICAudGhlbiAocmVzcG9uc2UpID0+XG4gICAgICAgICAgQHNldCByZWFkeVRvU2F2ZTogdHJ1ZVxuICAgICAgICAgIEBzZXQgdXBsb2FkZWRQYXRoOiByZXNwb25zZS5maWxlbmFtZVxuICAgICAgICAgIHJlc3BvbnNlLmZpbGVuYW1lXG4gICAgICBlbHNlXG4gICAgICAgIGZhbHNlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcbnRlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL2ltYWdlL2l0ZW0udG1wbC5qc1wiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGRlYnVnOiB0cnVlXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAdGVtcGxhdGUgPSBSZW5kZXIgdGVtcGxhdGUsIEBjb250YWluWzBdXG4gICAgQG1vZGVsLnNldElucHV0IEBjb250YWluLmZpbmQoXCJAaW1hZ2VcIilbMF1cblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBpZiAhc3RhdGUuZmllbGQuc2V0dGluZ3MuaGlkZVxuICAgICAgQHRlbXBsYXRlIHN0YXRlXG5cbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAaW1hZ2VcIjogKGUpIC0+IEBtb2RlbC5zZXRQcmV2aWV3IGUudGFyZ2V0XG4gICAgXCJjbGljazogQHJlbW92ZVwiOiAoZSkgLT4gQG1vZGVsLnJlbW92ZVByZXZpZXcoKVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRTZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgIEBzZXQgdmFsdWU6ICsgc2V0dGluZ3MuZGVmYXVsdFZhbHVlXG5cbiAgdXBkYXRlOiAodmFsdWUpIC0+XG4gICAgQHNldCB2YWx1ZTogKyB2YWx1ZVxuXG4gIGdldDogLT4gQHN0YXRlLnZhbHVlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGV2ZW50czpcbiAgICBcImNoYW5nZTogQHJhZGlvXCI6IChlKSAtPlxuICAgICAgJGlucHV0ID0gJCBlLnRhcmdldFxuICAgICAgQG1vZGVsLnVwZGF0ZSAkaW5wdXQuZGF0YSBcImluZGV4XCJcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgc2V0U2V0dGluZ3M6IChzZXR0aW5ncykgLT5cbiAgICBAc2V0IHZhbHVlOiBzZXR0aW5ncy5kZWZhdWx0VmFsdWVcblxuICB1cGRhdGU6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHt2YWx1ZX1cblxuICBnZXQ6IC0+IEBzdGF0ZS52YWx1ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBzdHJpbmdcIjogKGUpIC0+IEBtb2RlbC51cGRhdGUgZS50YXJnZXQudmFsdWVcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgc2V0U2V0dGluZ3M6IChzZXR0aW5ncykgLT5cbiAgICBAc2V0IGRhdGE6IHNldHRpbmdzLmRlZmF1bHREYXRhLnNsaWNlKClcblxuICB1cGRhdGU6IChyb3dJbmRleCwgY29sdW1uSW5kZXgsIHZhbHVlKSAtPlxuICAgIGRhdGEgPSBAc3RhdGUuZGF0YS5zbGljZSgpXG4gICAgZGF0YVtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gdmFsdWVcbiAgICBAc2V0IHtkYXRhfVxuXG4gIGdldDogLT4gQHN0YXRlLmRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAY2VsbFwiOiAoZSkgLT5cbiAgICAgICRpbnB1dCA9ICQgZS50YXJnZXRcbiAgICAgIHJvd0luZGV4ID0gKyAkaW5wdXQuZGF0YSBcInJvd1wiXG4gICAgICBjb2x1bW5JbmRleCA9ICsgJGlucHV0LmRhdGEgXCJjb2x1bW5cIlxuICAgICAgQG1vZGVsLnVwZGF0ZSByb3dJbmRleCwgY29sdW1uSW5kZXgsIGUudGFyZ2V0LnZhbHVlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFNldHRpbmdzOiAoc2V0dGluZ3MpIC0+XG4gICAgQHNldCB2YWx1ZTogXCJcIlxuXG4gIHVwZGF0ZTogKHZhbHVlKSAtPiBAc2V0IHt2YWx1ZX1cblxuICBnZXQ6IC0+IEBzdGF0ZS52YWx1ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBhcmVhXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlIGUudGFyZ2V0LnZhbHVlXG4iLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG57XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cuaXRlbSA9IGZhY3RvcnkoKTtcbiAgfVxufSkoZnVuY3Rpb24gKClcbntcbiAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgfTtcbiAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gIH07XG4gIGZ1bmN0aW9uIGNvdW50KGFycilcbiAge1xuICAgIHJldHVybiBhcnIubGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGxlbmd0aChzdHIpXG4gIHtcbiAgICByZXR1cm4gc3RyLmxlbmd0aDtcbiAgfVxuICB2YXIgY2xvbmVFbGVtZW50cyA9IFtdO1xuICBmdW5jdGlvbiBjbG9uZShvYmopXG4gIHtcbiAgICBjbG9uZUVsZW1lbnRzID0gW107XG4gICAgdmFyIGNvcHkgPSBudWxsO1xuICAgIHZhciBlbGVtO1xuICAgIHZhciBhdHRyO1xuICAgIHZhciBpO1xuXG4gICAgaWYgKG51bGwgPT0gb2JqIHx8IFwib2JqZWN0XCIgIT0gdHlwZW9mIG9iaikge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgY29weSA9IG5ldyBEYXRlKCk7XG4gICAgICBjb3B5LnNldFRpbWUob2JqLmdldFRpbWUoKSk7XG4gICAgICByZXR1cm4gY29weTtcbiAgICB9XG4gICAgaWYgKGNsb25lRWxlbWVudHMuaW5kZXhPZihvYmopID09IC0xKSB7XG4gICAgICBjbG9uZUVsZW1lbnRzLnB1c2gob2JqKTtcbiAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBjb3B5ID0gW107XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChvYmosIGkpKSB7XG4gICAgICAgICAgICBlbGVtID0gb2JqW2ldO1xuICAgICAgICAgICAgY29weVtpXSA9IGNsb25lKGVsZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgY29weSA9IHt9O1xuICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwob2JqLCBpKSkge1xuICAgICAgICAgICAgYXR0ciA9IG9ialtpXTtcbiAgICAgICAgICAgIGNvcHlbaV0gPSBjbG9uZShhdHRyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gIHtcbiAgICB2YXIgaW5kZXhBdHRyO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBhdHRyO1xuICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIHdpbmRvdy5fX2NhY2hlZFRlbXBsYXRlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB3aW5kb3cuX19jYWNoZWRUZW1wbGF0ZXMgPSB7fTtcbiAgfVxuICBmdW5jdGlvbiBjYWNoZVJlcXVpcmVUZW1wbGF0ZShwYXRoLCByZXF1aXJlZClcbiAge1xuICAgIHdpbmRvdy5fX2NhY2hlZFRlbXBsYXRlc1twYXRoXSA9IHJlcXVpcmVkO1xuICB9XG4gIGZ1bmN0aW9uIHJlcXVpcmVUZW1wbGF0ZShwYXRoLCBvYmopXG4gIHtcbiAgICByZXR1cm4gd2luZG93Ll9fY2FjaGVkVGVtcGxhdGVzW3BhdGhdKG9iaik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gIHtcbiAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAge1xuICAgICAgd2l0aCAob2JqKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgIGF0dHIgKz0gJ2lucHV0LWNvbnRhaW4nO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2ZpbGUtd3JhcCc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCAhKCEoICh0eXBlb2YgZmlsZW5hbWUgIT09ICd1bmRlZmluZWQnID8gZmlsZW5hbWUgOiAnJykgKSkpIHtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fZmlsZS1jbG9zZSc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAncmVtb3ZlJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fZmlsZSc7XG4gICAgICAgICAgICAgICAgICAgIGlmICggISghKCAodHlwZW9mIGZpbGVuYW1lICE9PSAndW5kZWZpbmVkJyA/IGZpbGVuYW1lIDogJycpICkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnIGZvcm1fX2ZpbGUtLWNob29zZW4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhKCEoICh0eXBlb2YgZmlsZW5hbWUgIT09ICd1bmRlZmluZWQnID8gZmlsZW5hbWUgOiAnJykgKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19maWxlLWZpbGVuYW1lJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnc3BhbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmaWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGZpZWxkWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ25hbWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gZmllbGRbJ2FsaWFzJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnaW1hZ2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KTsiXX0=
