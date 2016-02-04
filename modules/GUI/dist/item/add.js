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
  text: require("text/addTextModel.coffee"),
  select: require("select/addSelectModel.coffee")
};

views = {
  string: require("string/addStringView.coffee"),
  table: require("table/addTableView.coffee"),
  checkbox: require("checkbox/addCheckboxView.coffee"),
  radio: require("radio/addRadioView.coffee"),
  image: require("image/addImageView.coffee"),
  text: require("text/addTextView.coffee"),
  select: require("select/addSelectView.coffee")
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


},{"./addModel.coffee":2,"./addView.coffee":3,"ajax.coffee":"ajax.coffee","checkbox/addCheckboxModel.coffee":4,"checkbox/addCheckboxView.coffee":5,"image/addImageModel.coffee":6,"image/addImageView.coffee":7,"jquery-plugins.coffee":"jquery-plugins.coffee","promise":"promise","radio/addRadioModel.coffee":8,"radio/addRadioView.coffee":9,"select/addSelectModel.coffee":10,"select/addSelectView.coffee":11,"string/addStringModel.coffee":12,"string/addStringView.coffee":13,"table/addTableModel.coffee":14,"table/addTableView.coffee":15,"text/addTextModel.coffee":16,"text/addTextView.coffee":17}],2:[function(require,module,exports){
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


},{"render":"render","types/image/item.tmpl.js":18,"view.coffee":"view.coffee"}],8:[function(require,module,exports){
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
    var defaultValue;
    defaultValue = +settings.defaultValue;
    if (defaultValue === -1) {
      return this.set({
        value: ""
      });
    } else {
      return this.set({
        value: settings.defaultValue
      });
    }
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


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @select": function(e) {
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


},{"model.coffee":"model.coffee"}],13:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @string": function(e) {
      return this.model.update(e.target.value);
    }
  }
});


},{"view.coffee":"view.coffee"}],14:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],15:[function(require,module,exports){
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


},{"view.coffee":"view.coffee"}],16:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],17:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @area": function(e) {
      return this.model.update(e.target.value);
    }
  }
});


},{"view.coffee":"view.coffee"}],18:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9pdGVtL2FkZC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9pdGVtL2FkZE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2l0ZW0vYWRkVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9hZGRDaGVja2JveE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L2FkZENoZWNrYm94Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9pbWFnZS9hZGRJbWFnZU1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL2FkZEltYWdlVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9hZGRSYWRpb01vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3JhZGlvL2FkZFJhZGlvVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9zZWxlY3QvYWRkU2VsZWN0TW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvc2VsZWN0L2FkZFNlbGVjdFZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvc3RyaW5nL2FkZFN0cmluZ01vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3N0cmluZy9hZGRTdHJpbmdWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL2FkZFRhYmxlTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvdGFibGUvYWRkVGFibGVWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RleHQvYWRkVGV4dE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RleHQvYWRkVGV4dFZpZXcuY29mZmVlIiwidGVtcC9tb2R1bGVzL0dVSS8u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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiQgPSByZXF1aXJlIFwianF1ZXJ5LXBsdWdpbnMuY29mZmVlXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcblByb21pc2UgPSByZXF1aXJlIFwicHJvbWlzZVwiXG5cbkFkZE1vZGVsID0gcmVxdWlyZSBcIi4vYWRkTW9kZWwuY29mZmVlXCJcblxuQWRkVmlldyA9IHJlcXVpcmUgXCIuL2FkZFZpZXcuY29mZmVlXCJcblxubW9kZWxzID1cbiAgc3RyaW5nOiByZXF1aXJlIFwic3RyaW5nL2FkZFN0cmluZ01vZGVsLmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvYWRkVGFibGVNb2RlbC5jb2ZmZWVcIlxuICBjaGVja2JveDogcmVxdWlyZSBcImNoZWNrYm94L2FkZENoZWNrYm94TW9kZWwuY29mZmVlXCJcbiAgcmFkaW86IHJlcXVpcmUgXCJyYWRpby9hZGRSYWRpb01vZGVsLmNvZmZlZVwiXG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvYWRkSW1hZ2VNb2RlbC5jb2ZmZWVcIlxuICB0ZXh0OiByZXF1aXJlIFwidGV4dC9hZGRUZXh0TW9kZWwuY29mZmVlXCJcbiAgc2VsZWN0OiByZXF1aXJlIFwic2VsZWN0L2FkZFNlbGVjdE1vZGVsLmNvZmZlZVwiXG5cbnZpZXdzID1cbiAgc3RyaW5nOiByZXF1aXJlIFwic3RyaW5nL2FkZFN0cmluZ1ZpZXcuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9hZGRUYWJsZVZpZXcuY29mZmVlXCJcbiAgY2hlY2tib3g6IHJlcXVpcmUgXCJjaGVja2JveC9hZGRDaGVja2JveFZpZXcuY29mZmVlXCJcbiAgcmFkaW86IHJlcXVpcmUgXCJyYWRpby9hZGRSYWRpb1ZpZXcuY29mZmVlXCJcbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9hZGRJbWFnZVZpZXcuY29mZmVlXCJcbiAgdGV4dDogcmVxdWlyZSBcInRleHQvYWRkVGV4dFZpZXcuY29mZmVlXCJcbiAgc2VsZWN0OiByZXF1aXJlIFwic2VsZWN0L2FkZFNlbGVjdFZpZXcuY29mZmVlXCJcblxuaHR0cEdldCBcIiN7d2luZG93LmxvY2F0aW9uLmhyZWZ9X19qc29uL1wiXG4udGhlbiAocmVzcG9uc2UpIC0+XG4gIGFkZE1vZGVsID0gQWRkTW9kZWxcbiAgICBzZWN0aW9uOiByZXNwb25zZS5zZWN0aW9uXG4gICAgZmllbGRzOiBbXVxuICBhZGRWaWV3ID0gQWRkVmlldyAoJCBcIkBpdGVtLWFkZC1mb3JtXCIpLCBhZGRNb2RlbFxuICAkcm93cyA9ICQgXCJAaW5wdXQtY29udGFpblwiXG4gIGluZGV4ID0gMFxuICBmb3IgZmllbGQgaW4gcmVzcG9uc2UuZmllbGRzXG4gICAgaWYgbW9kZWxzW2ZpZWxkLnR5cGVdP1xuICAgICAgbW9kZWwgPSBtb2RlbHNbZmllbGQudHlwZV0ge2ZpZWxkfVxuICAgICAgbW9kZWwuc2V0U2V0dGluZ3M/IGZpZWxkLnNldHRpbmdzXG4gICAgICBhZGRNb2RlbC5hZGQgZmllbGQuYWxpYXMsIG1vZGVsXG4gICAgaWYgIWZpZWxkLnNldHRpbmdzLmhpZGU/IHx8IChmaWVsZC5zZXR0aW5ncy5oaWRlPyAmJiAhZmllbGQuc2V0dGluZ3MuaGlkZSlcbiAgICAgIHZpZXdzW2ZpZWxkLnR5cGVdICRyb3dzLmVxKGluZGV4KSwgbW9kZWxcbiAgICAgIGluZGV4KytcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5odHRwUG9zdCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cFBvc3RcblByb21pc2UgPSByZXF1aXJlIFwicHJvbWlzZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgYWRkOiAobmFtZSwgbW9kZWwpIC0+XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgZmllbGRzLnB1c2hcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgICAgbmFtZTogbmFtZVxuICAgIEBzZXQge2ZpZWxkc31cblxuICBzYXZlOiAtPlxuICAgIHJlc3VsdCA9IHt9XG4gICAgcHJvbWlzZXMgPSBbXVxuICAgIEBzdGF0ZS5maWVsZHMubWFwIChpdGVtKSAtPlxuICAgICAgaXRlbU5hbWUgPSBpdGVtLm5hbWVcbiAgICAgIHRyeVxuICAgICAgICBpZiB0eXBlb2YgaXRlbS5tb2RlbC5nZXQgIT0gXCJmdW5jdGlvblwiXG4gICAgICAgICAgdGhyb3cgXCIje2l0ZW1OYW1lfSBoYXMgbm8gYGdldGAgbWV0aG9kXCJcbiAgICAgICAgdmFsdWUgPSBpdGVtLm1vZGVsLmdldCgpXG4gICAgICAgIHByb21pc2VzLnB1c2ggdmFsdWVcbiAgICAgICAgZG8gKGl0ZW1OYW1lLCB2YWx1ZSkgLT5cbiAgICAgICAgICBpZiB2YWx1ZSBpbnN0YW5jZW9mIFByb21pc2VcbiAgICAgICAgICAgIHZhbHVlXG4gICAgICAgICAgICAudGhlbiAodmFsdWUpIC0+XG4gICAgICAgICAgICAgIHJlc3VsdFtpdGVtTmFtZV0gPSB2YWx1ZVxuICAgICAgICAgICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvciBlcnJvclxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlc3VsdFtpdGVtTmFtZV0gPSB2YWx1ZVxuICAgICAgY2F0Y2ggZVxuICAgICAgICBjb25zb2xlLmVycm9yIGVcblxuICAgIFByb21pc2UuYWxsIHByb21pc2VzXG4gICAgLnRoZW4gPT5cbiAgICAgIGNvbnNvbGUubG9nIHJlc3VsdFxuICAgICAgaHR0cFBvc3QgXCIvY21zLyN7QHN0YXRlLnNlY3Rpb259L2FjdGlvbl9zYXZlL19fanNvbi9cIiwgZGF0YTogcmVzdWx0XG4gICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgY29uc29sZS5sb2cgcmVzcG9uc2VcbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgY29uc29sZS5lcnJvciBlcnJvci5lcnJvclxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IGNvbnRhaW5cIjogKGUpIC0+XG4gICAgICBAbW9kZWwuc2F2ZSgpXG4gICAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgc2V0U2V0dGluZ3M6IChzZXR0aW5ncykgLT5cbiAgICBkYXRhID0gW11cbiAgICBkYXRhID0gc2V0dGluZ3MuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIHNldHRpbmdzLmRlZmF1bHREYXRhLnNsaWNlKCkubWFwIChpdGVtLCBpbmRleCkgLT4gaWYgKHR5cGVvZiBpdGVtLmNoZWNrZWQpID09IFwic3RyaW5nXCIgdGhlbiBkYXRhW2luZGV4XSA9IGl0ZW0uY2hlY2tlZCA9PSBcInRydWVcIiBlbHNlIGRhdGFbaW5kZXhdID0gaXRlbS5jaGVja2VkXG4gICAgQHNldCB7ZGF0YX1cblxuICB1cGRhdGU6IChpbmRleCwgY2hlY2tlZCkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRhdGEuc2xpY2UoKVxuICAgIGRhdGFbaW5kZXhdID0gY2hlY2tlZFxuICAgIEBzZXQge2RhdGF9XG5cbiAgZ2V0OiAtPiBAc3RhdGUuZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBjaGVja2JveFwiOiAoZSkgLT5cbiAgICAgICRpbnB1dCA9ICQgZS50YXJnZXRcbiAgICAgIGluZGV4ID0gJGlucHV0LmRhdGEgXCJpbmRleFwiXG4gICAgICBAbW9kZWwudXBkYXRlIGluZGV4LCBlLnRhcmdldC5jaGVja2VkXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuUHJvbWlzZSA9IHJlcXVpcmUgXCJwcm9taXNlXCJcbmh0dHBGaWxlID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwRmlsZVxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFByZXZpZXc6IChpbnB1dCkgLT5cbiAgICBAc2V0IHJlYWR5VG9TYXZlOiBmYWxzZVxuICAgIEBpbnB1dCA9IGlucHV0XG4gICAgaWYgaW5wdXQuZmlsZXM/XG4gICAgICBAc2V0IGZpbGVuYW1lOiBpbnB1dC5maWxlc1swXS5uYW1lXG4gICAgZWxzZVxuICAgICAgZmlsZW5hbWUgPSBpbnB1dC52YWx1ZS5zcGxpdCAvW1xcL1xcXFxdL1xuICAgICAgQHNldCBmaWxlbmFtZTogZmlsZW5hbWUucG9wKClcblxuICBzZXRJbnB1dDogKGlucHV0KSAtPlxuICAgIEBpbnB1dCA9IGlucHV0XG5cbiAgcmVtb3ZlUHJldmlldzogLT5cbiAgICBAc2V0IGZpbGVuYW1lOiBmYWxzZVxuICAgIEBzZXQgcmVhZHlUb1NhdmU6IGZhbHNlXG5cbiAgZ2V0OiAtPlxuICAgIGlmIEBzdGF0ZS5yZWFkeVRvU2F2ZVxuICAgICAgQHN0YXRlLnVwbG9hZGVkUGF0aFxuICAgIGVsc2VcbiAgICAgIGlmIEBpbnB1dCAmJiBAc3RhdGUuZmlsZW5hbWVcbiAgICAgICAgaHR0cEZpbGUgXCIvY21zL3R5cGVzL2ltYWdlL3VwbG9hZGltYWdlL19fanNvbi9cIixcbiAgICAgICAgICBpbWFnZTogQGlucHV0XG4gICAgICAgIC50aGVuIChyZXNwb25zZSkgPT5cbiAgICAgICAgICBAc2V0IHJlYWR5VG9TYXZlOiB0cnVlXG4gICAgICAgICAgQHNldCB1cGxvYWRlZFBhdGg6IHJlc3BvbnNlLmZpbGVuYW1lXG4gICAgICAgICAgcmVzcG9uc2UuZmlsZW5hbWVcbiAgICAgIGVsc2VcbiAgICAgICAgZmFsc2VcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxudGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvaW1hZ2UvaXRlbS50bXBsLmpzXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZGVidWc6IHRydWVcblxuICBpbml0aWFsOiAtPlxuICAgIEB0ZW1wbGF0ZSA9IFJlbmRlciB0ZW1wbGF0ZSwgQGNvbnRhaW5bMF1cbiAgICBAbW9kZWwuc2V0SW5wdXQgQGNvbnRhaW4uZmluZChcIkBpbWFnZVwiKVswXVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIGlmICFzdGF0ZS5maWVsZC5zZXR0aW5ncy5oaWRlXG4gICAgICBAdGVtcGxhdGUgc3RhdGVcblxuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBpbWFnZVwiOiAoZSkgLT4gQG1vZGVsLnNldFByZXZpZXcgZS50YXJnZXRcbiAgICBcImNsaWNrOiBAcmVtb3ZlXCI6IChlKSAtPiBAbW9kZWwucmVtb3ZlUHJldmlldygpXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFNldHRpbmdzOiAoc2V0dGluZ3MpIC0+XG4gICAgQHNldCB2YWx1ZTogKyBzZXR0aW5ncy5kZWZhdWx0VmFsdWVcblxuICB1cGRhdGU6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHZhbHVlOiArIHZhbHVlXG5cbiAgZ2V0OiAtPiBAc3RhdGUudmFsdWVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAcmFkaW9cIjogKGUpIC0+XG4gICAgICAkaW5wdXQgPSAkIGUudGFyZ2V0XG4gICAgICBAbW9kZWwudXBkYXRlICRpbnB1dC5kYXRhIFwiaW5kZXhcIlxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRTZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgIGRlZmF1bHRWYWx1ZSA9ICsgc2V0dGluZ3MuZGVmYXVsdFZhbHVlXG4gICAgaWYgZGVmYXVsdFZhbHVlID09IC0xXG4gICAgICBAc2V0IHZhbHVlOiBcIlwiXG4gICAgZWxzZVxuICAgICAgQHNldCB2YWx1ZTogc2V0dGluZ3MuZGVmYXVsdFZhbHVlXG5cbiAgdXBkYXRlOiAodmFsdWUpIC0+IEBzZXQgdmFsdWU6ICsgdmFsdWVcblxuICBnZXQ6IC0+IEBzdGF0ZS52YWx1ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBzZWxlY3RcIjogKGUpIC0+IEBtb2RlbC51cGRhdGUgZS50YXJnZXQudmFsdWVcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgc2V0U2V0dGluZ3M6IChzZXR0aW5ncykgLT5cbiAgICBAc2V0IHZhbHVlOiBzZXR0aW5ncy5kZWZhdWx0VmFsdWVcblxuICB1cGRhdGU6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHt2YWx1ZX1cblxuICBnZXQ6IC0+IEBzdGF0ZS52YWx1ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBzdHJpbmdcIjogKGUpIC0+IEBtb2RlbC51cGRhdGUgZS50YXJnZXQudmFsdWVcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgc2V0U2V0dGluZ3M6IChzZXR0aW5ncykgLT5cbiAgICBAc2V0IGRhdGE6IHNldHRpbmdzLmRlZmF1bHREYXRhLnNsaWNlKClcblxuICB1cGRhdGU6IChyb3dJbmRleCwgY29sdW1uSW5kZXgsIHZhbHVlKSAtPlxuICAgIGRhdGEgPSBAc3RhdGUuZGF0YS5zbGljZSgpXG4gICAgZGF0YVtyb3dJbmRleF1bY29sdW1uSW5kZXhdID0gdmFsdWVcbiAgICBAc2V0IHtkYXRhfVxuXG4gIGdldDogLT4gQHN0YXRlLmRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAY2VsbFwiOiAoZSkgLT5cbiAgICAgICRpbnB1dCA9ICQgZS50YXJnZXRcbiAgICAgIHJvd0luZGV4ID0gKyAkaW5wdXQuZGF0YSBcInJvd1wiXG4gICAgICBjb2x1bW5JbmRleCA9ICsgJGlucHV0LmRhdGEgXCJjb2x1bW5cIlxuICAgICAgQG1vZGVsLnVwZGF0ZSByb3dJbmRleCwgY29sdW1uSW5kZXgsIGUudGFyZ2V0LnZhbHVlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFNldHRpbmdzOiAoc2V0dGluZ3MpIC0+XG4gICAgQHNldCB2YWx1ZTogXCJcIlxuXG4gIHVwZGF0ZTogKHZhbHVlKSAtPiBAc2V0IHt2YWx1ZX1cblxuICBnZXQ6IC0+IEBzdGF0ZS52YWx1ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBhcmVhXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlIGUudGFyZ2V0LnZhbHVlXG4iLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG57XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gIH1cbiAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cuaXRlbSA9IGZhY3RvcnkoKTtcbiAgfVxufSkoZnVuY3Rpb24gKClcbntcbiAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgfTtcbiAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gIHtcbiAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gIH07XG4gIGZ1bmN0aW9uIGNvdW50KGFycilcbiAge1xuICAgIHJldHVybiBhcnIubGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGxlbmd0aChzdHIpXG4gIHtcbiAgICByZXR1cm4gc3RyLmxlbmd0aDtcbiAgfVxuICB2YXIgY2xvbmVFbGVtZW50cyA9IFtdO1xuICBmdW5jdGlvbiBjbG9uZShvYmopXG4gIHtcbiAgICBjbG9uZUVsZW1lbnRzID0gW107XG4gICAgdmFyIGNvcHkgPSBudWxsO1xuICAgIHZhciBlbGVtO1xuICAgIHZhciBhdHRyO1xuICAgIHZhciBpO1xuXG4gICAgaWYgKG51bGwgPT0gb2JqIHx8IFwib2JqZWN0XCIgIT0gdHlwZW9mIG9iaikge1xuICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG5cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgY29weSA9IG5ldyBEYXRlKCk7XG4gICAgICBjb3B5LnNldFRpbWUob2JqLmdldFRpbWUoKSk7XG4gICAgICByZXR1cm4gY29weTtcbiAgICB9XG4gICAgaWYgKGNsb25lRWxlbWVudHMuaW5kZXhPZihvYmopID09IC0xKSB7XG4gICAgICBjbG9uZUVsZW1lbnRzLnB1c2gob2JqKTtcbiAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICBjb3B5ID0gW107XG4gICAgICAgIGZvciAoaSBpbiBvYmopIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChvYmosIGkpKSB7XG4gICAgICAgICAgICBlbGVtID0gb2JqW2ldO1xuICAgICAgICAgICAgY29weVtpXSA9IGNsb25lKGVsZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICAgIH1cbiAgICAgIGlmIChvYmogaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgY29weSA9IHt9O1xuICAgICAgICBmb3IgKGkgaW4gb2JqKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwob2JqLCBpKSkge1xuICAgICAgICAgICAgYXR0ciA9IG9ialtpXTtcbiAgICAgICAgICAgIGNvcHlbaV0gPSBjbG9uZShhdHRyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gIHtcbiAgICB2YXIgaW5kZXhBdHRyO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICB9XG4gICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICB2YXIgbm9kZTtcbiAgICAgIHZhciBhdHRyO1xuICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICBpZiAodHlwZW9mIHdpbmRvdy5fX2NhY2hlZFRlbXBsYXRlcyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB3aW5kb3cuX19jYWNoZWRUZW1wbGF0ZXMgPSB7fTtcbiAgfVxuICBmdW5jdGlvbiBjYWNoZVJlcXVpcmVUZW1wbGF0ZShwYXRoLCByZXF1aXJlZClcbiAge1xuICAgIHdpbmRvdy5fX2NhY2hlZFRlbXBsYXRlc1twYXRoXSA9IHJlcXVpcmVkO1xuICB9XG4gIGZ1bmN0aW9uIHJlcXVpcmVUZW1wbGF0ZShwYXRoLCBvYmopXG4gIHtcbiAgICByZXR1cm4gd2luZG93Ll9fY2FjaGVkVGVtcGxhdGVzW3BhdGhdKG9iaik7XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gIHtcbiAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAge1xuICAgICAgd2l0aCAob2JqKSB7XG4gICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICBhdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgIGF0dHIgKz0gJ2lucHV0LWNvbnRhaW4nO1xuICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2ZpbGUtd3JhcCc7XG4gICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCAhKCEoICh0eXBlb2YgZmlsZW5hbWUgIT09ICd1bmRlZmluZWQnID8gZmlsZW5hbWUgOiAnJykgKSkpIHtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fZmlsZS1jbG9zZSc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAncmVtb3ZlJztcbiAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fZmlsZSc7XG4gICAgICAgICAgICAgICAgICAgIGlmICggISghKCAodHlwZW9mIGZpbGVuYW1lICE9PSAndW5kZWZpbmVkJyA/IGZpbGVuYW1lIDogJycpICkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnIGZvcm1fX2ZpbGUtLWNob29zZW4nO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCAhKCEoICh0eXBlb2YgZmlsZW5hbWUgIT09ICd1bmRlZmluZWQnID8gZmlsZW5hbWUgOiAnJykgKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmb3JtX19maWxlLWZpbGVuYW1lJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGNyZWF0ZSgnc3BhbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoaWxkcy5wdXNoKGZpbGVuYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHJzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9ICdmaWxlJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGZpZWxkWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ25hbWUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gZmllbGRbJ2FsaWFzJ107XG4gICAgICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0ciArPSAnaW1hZ2UnO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KTsiXX0=
