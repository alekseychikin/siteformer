(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, Popup, fn, models, type, view, views;

AddModel = require("./addModel.coffee");

AddView = require("./addView.coffee");

$ = require("jquery-plugins.coffee");

models = {
  image: require("image/ConfigsImageModel.coffee"),
  table: require("table/ConfigsTableModel.coffee")
};

views = {
  image: require("image/ConfigsImageView.coffee"),
  table: require("table/ConfigsTableView.coffee")
};

Popup = require("popup");

AddView.on("open-configs-modal", function(index, field) {
  Popup.open("@configs-" + field.type);
  views[field.type].bind($("@configs-" + field.type));
  field.settings.index = index;
  return models[field.type].bind(field.settings);
});

fn = function(type, view) {
  return view.on("save-configs-modal", function(form) {
    AddModel.saveFieldConfigs(form);
    return Popup.close();
  });
};
for (type in views) {
  view = views[type];
  fn(type, view);
}

AddModel.on("onSavedSection", function(alias) {
  return window.location.href = "/cms/configs/" + alias + "/";
});


},{"./addModel.coffee":2,"./addView.coffee":3,"image/ConfigsImageModel.coffee":4,"image/ConfigsImageView.coffee":5,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","table/ConfigsTableModel.coffee":7,"table/ConfigsTableView.coffee":8}],2:[function(require,module,exports){
var Model, Promise, httpGet, httpPost;

Model = require("model.coffee");

Promise = require("q");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model("ConfigsAddModel", {
  initialState: function() {
    return httpGet(window.location.pathname + "__json/").then(function(response) {
      var state;
      state = {
        title: response.title,
        alias: response.alias,
        module: response.module,
        fields: response.fields,
        types: response.types
      };
      if (response.id) {
        state.id = response.id;
      }
      console.log(state);
      return state;
    });
  },
  addField: function(field) {
    return this.set({
      fields: this.state.fields.concat([field])
    });
  },
  addEmptyField: function() {
    return this.set({
      fields: this.state.fields.concat([
        {
          title: "",
          alias: "",
          type: "string"
        }
      ])
    });
  },
  updateTitle: function(value) {
    return this.state.title = value;
  },
  updateAlias: function(value) {
    return this.state.alias = value;
  },
  updateModule: function(value) {
    return this.state.module = value;
  },
  updateFieldTitle: function(index, value) {
    return this.state.fields[index].title = value;
  },
  updateFieldAlias: function(index, value) {
    return this.state.fields[index].alias = value;
  },
  updateFieldType: function(index, value) {
    this.state.fields[index].type = value;
    this.resetSettings(index);
    return this.set({
      fields: this.state.fields
    });
  },
  resetSettings: function(index) {
    var i, len, ref, results, type, typeItem;
    type = this.state.fields[index].type;
    ref = this.state.types;
    results = [];
    for (i = 0, len = ref.length; i < len; i++) {
      typeItem = ref[i];
      if (typeItem.alias === type) {
        results.push(this.state.fields[index].settings = this.clone(typeItem.defaultSettings));
      } else {
        results.push(void 0);
      }
    }
    return results;
  },
  removeField: function(index) {
    this.state.fields.splice(index, 1);
    return this.set({
      fields: this.state.fields
    });
  },
  getFieldByIndex: function(index) {
    return this.clone(this.state.fields[index]);
  },
  saveFieldConfigs: function(form) {
    var index;
    index = form.index;
    delete form.index;
    return this.state.fields[index].settings = form;
  },
  save: function() {
    return httpPost("/cms/configs/save/__json/", this.state).then((function(_this) {
      return function(response) {
        if (_this.state.id != null) {
          _this.set({
            fields: response.section.fields
          });
          return _this.set({
            id: response.section.id
          });
        } else {
          return _this.trigger("onSavedSection", _this.state.alias);
        }
      };
    })(this))["catch"](function(response) {
      return console.error(response.error);
    });
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee","q":"q"}],3:[function(require,module,exports){
var $, AddModel, Popup, Render, View;

$ = require("jquery-plugins.coffee");

View = require("view.coffee");

Render = require("render.coffee");

Popup = require("popup");

AddModel = require("./addModel.coffee");

module.exports = View("ConfigsAddView", {
  debug: false,
  contain: $("@configs-add"),
  model: AddModel,
  events: {
    "click: @btn-remove-field": function(e) {
      return AddModel.removeField(this.getRowIndex(e));
    },
    "click: @btn-add-field": function(e) {
      return AddModel.addEmptyField();
    },
    "change: @field-title": function(e) {
      return AddModel.updateFieldTitle(this.getRowIndex(e), e.target.value);
    },
    "change: @field-alias": function(e) {
      return AddModel.updateFieldAlias(this.getRowIndex(e), e.target.value);
    },
    "change: @field-type": function(e) {
      return AddModel.updateFieldType(this.getRowIndex(e), e.target.value);
    },
    "change: @configs-add-title": function(e) {
      return AddModel.updateTitle(e.target.value);
    },
    "change: @configs-add-alias": function(e) {
      return AddModel.updateAlias(e.target.value);
    },
    "change: @configs-add-module": function(e) {
      return AddModel.updateModule(e.target.value);
    },
    "click: @btn-config-field": "clickBtnConfigField",
    "submit: @configs-add-form": "submitConfigsAddForm"
  },
  initial: function() {
    return this.tbodyContain = Render($("@tbody-module-fields"), "sections_configs_table-module-fields");
  },
  renderFields: function(state) {
    this.tbodyContain.render(state);
    return $('select').selecter();
  },
  getRowIndex: function(e) {
    var $parent;
    $parent = ($(e.target)).closest("[data-key]");
    return $parent.data("key");
  },
  clickBtnConfigField: function(e) {
    return this.trigger("open-configs-modal", this.getRowIndex(e), AddModel.getFieldByIndex(this.getRowIndex(e)));
  },
  submitConfigsAddForm: function(e) {
    AddModel.save();
    return false;
  }
});


},{"./addModel.coffee":2,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","render.coffee":"render.coffee","view.coffee":"view.coffee"}],4:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeImageModel", {
  changePath: function(path) {
    return this.state.path = path;
  },
  changeSizeWidth: function(width) {
    return this.state.width = width;
  },
  changeSizeHeight: function(height) {
    return this.state.height = height;
  },
  changeSource: function(source) {
    return this.state.source = source;
  },
  updatePath: function(value) {
    return this.state.path = value;
  },
  updateWidth: function(value) {
    return this.state.width = value;
  },
  updateHeight: function(value) {
    return this.state.height = value;
  },
  updateSource: function(value) {
    return this.state.source = value;
  },
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updateS3AccessKey: function(value) {
    return this.state.s3AccessKey = value;
  },
  updateS3SecretKey: function(value) {
    return this.state.s3SecretKey = value;
  },
  updateS3Bucket: function(value) {
    return this.state.s3Bucket = value;
  },
  updateS3Path: function(value) {
    return this.state.s3Path = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],5:[function(require,module,exports){
var View, configsImageModel;

View = require("view.coffee");

configsImageModel = require("image/configsImageModel.coffee");

module.exports = View("TypeImageView", {
  model: configsImageModel,
  debug: false,
  initial: function() {
    this.configsImagePath = this.contain.find("@configs-image-path");
    this.configsImageSource = this.contain.find("@configs-image-source");
    this.configsImageWidth = this.contain.find("@configs-image-width");
    this.configsImageHeight = this.contain.find("@configs-image-height");
    this.configsImageIndex = this.contain.find("@configs-image-index");
    this.configsImageStorage = this.contain.find("@configs-image-storage");
    this.configsImageS3AccessKey = this.contain.find("@configs-image-s3-access-key");
    this.configsImageS3SecretKey = this.contain.find("@configs-image-s3-secret-key");
    this.configsImageS3Bucket = this.contain.find("@configs-image-s3-bucket");
    return this.configsImageS3Path = this.contain.find("@configs-image-s3-path");
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-image-path": function(e) {
      return configsImageModel.updatePath(e.target.value);
    },
    "change: @configs-image-width": function(e) {
      return configsImageModel.updateWidth(e.target.value);
    },
    "change: @configs-image-height": function(e) {
      return configsImageModel.updateHeight(e.target.value);
    },
    "change: @configs-image-source": function(e) {
      return configsImageModel.updateSource(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    },
    "change: @configs-image-storage": function(e) {
      return configsImageModel.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-image-s3-access-key": function(e) {
      return configsImageModel.updateS3AccessKey(e.target.value);
    },
    "change: @configs-image-s3-secret-key": function(e) {
      return configsImageModel.updateS3SecretKey(e.target.value);
    },
    "change: @configs-image-s3-bucket": function(e) {
      return configsImageModel.updateS3Bucket(e.target.value);
    },
    "change: @configs-image-s3-path": function(e) {
      return configsImageModel.updateS3Path(e.target.value);
    }
  },
  initialRender: function(state) {
    (this.configsImageStorage.filter("[data-value='" + state.storage + "']")).trigger("click");
    (this.contain.find("@configs-image-modal-storage-frame")).hide();
    (this.contain.find("@configs-image-modal-storage-" + state.storage)).show();
    this.configsImagePath.val(state.path);
    this.configsImageWidth.val(state.width);
    this.configsImageHeight.val(state.height);
    this.configsImageSource.val(state.source);
    this.configsImageS3AccessKey.val(state.s3AccessKey);
    this.configsImageS3SecretKey.val("");
    this.configsImageS3Bucket.val(state.s3Bucket);
    return this.configsImageS3Path.val(state.s3Path);
  },
  submitConfigsForm: function(e) {
    console.log(configsImageModel.getState());
    this.trigger("save-configs-modal", configsImageModel.getState());
    this.unbind();
    return false;
  }
});


},{"image/configsImageModel.coffee":6,"view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeImageModel", {
  changePath: function(path) {
    return this.state.path = path;
  },
  changeSizeWidth: function(width) {
    return this.state.width = width;
  },
  changeSizeHeight: function(height) {
    return this.state.height = height;
  },
  changeSource: function(source) {
    return this.state.source = source;
  },
  updatePath: function(value) {
    return this.state.path = value;
  },
  updateWidth: function(value) {
    return this.state.width = value;
  },
  updateHeight: function(value) {
    return this.state.height = value;
  },
  updateSource: function(value) {
    return this.state.source = value;
  },
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updateS3AccessKey: function(value) {
    return this.state.s3AccessKey = value;
  },
  updateS3SecretKey: function(value) {
    return this.state.s3SecretKey = value;
  },
  updateS3Bucket: function(value) {
    return this.state.s3Bucket = value;
  },
  updateS3Path: function(value) {
    return this.state.s3Path = value;
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],7:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeTableModel", {
  getState: function() {
    return this.state;
  },
  updateColumns: function(value) {
    var i, j, k, l, len, len1, m, ref, ref1, ref2, ref3, ref4, ref5, row;
    value = parseInt(value, 10);
    if (value > this.state.columns) {
      ref = this.state.defaultData;
      for (j = 0, len = ref.length; j < len; j++) {
        row = ref[j];
        for (i = k = ref1 = this.state.columns + 1, ref2 = value; ref1 <= ref2 ? k <= ref2 : k >= ref2; i = ref1 <= ref2 ? ++k : --k) {
          row.push("");
        }
      }
    } else if (value < this.state.columns) {
      ref3 = this.state.defaultData;
      for (l = 0, len1 = ref3.length; l < len1; l++) {
        row = ref3[l];
        for (i = m = ref4 = value + 1, ref5 = this.state.columns; ref4 <= ref5 ? m <= ref5 : m >= ref5; i = ref4 <= ref5 ? ++m : --m) {
          row.pop();
        }
      }
    }
    return this.set({
      columns: value
    });
  },
  updateRows: function(value) {
    var i, j, k, l, ref, ref1, ref2, ref3, ref4, row;
    value = parseInt(value, 10);
    if (value > this.state.rows) {
      for (row = j = ref = this.state.rows + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; row = ref <= ref1 ? ++j : --j) {
        row = [];
        for (i = k = 1, ref2 = this.state.columns; 1 <= ref2 ? k <= ref2 : k >= ref2; i = 1 <= ref2 ? ++k : --k) {
          row.push("");
        }
        this.state.defaultData.push(row);
      }
    } else if (value < this.state.rows) {
      for (row = l = ref3 = value + 1, ref4 = this.state.rows; ref3 <= ref4 ? l <= ref4 : l >= ref4; row = ref3 <= ref4 ? ++l : --l) {
        this.state.defaultData.pop();
      }
    }
    return this.set({
      rows: value
    });
  },
  updateCellData: function(row, column, value) {
    return this.state.defaultData[row][column] = value;
  }
});


},{"model.coffee":"model.coffee"}],8:[function(require,module,exports){
var Render, View, configsTableModel;

View = require("view.coffee");

Render = require("render.coffee");

configsTableModel = require("table/configsTableModel.coffee");

module.exports = View("TypeTableView", {
  model: configsTableModel,
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-table-rows": "changeConfigsTableRows",
    "change: @configs-table-columns": "changeConfigsTableColumns",
    "change: @configs-table-cell": function(e) {
      var $cell;
      $cell = $(e.target);
      return configsTableModel.updateCellData($cell.data("row"), $cell.data("column"), $cell.val());
    },
    "keydown: @configs-table-rows": function(e) {
      this.changeConfigsTableRows(e);
      if (e.keyCode === 13) {
        return e.preventDefault();
      }
    },
    "keydown: @configs-table-columns": function(e) {
      this.changeConfigsTableColumns(e);
      if (e.keyCode === 13) {
        return e.preventDefault();
      }
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    }
  },
  changeConfigsTableRows: function(e) {
    return configsTableModel.updateRows(e.target.value);
  },
  changeConfigsTableColumns: function(e) {
    return configsTableModel.updateColumns(e.target.value);
  },
  initial: function() {
    return this.tbodyContain = Render($("@configs-table-tbody"), "types_table_tbody");
  },
  initialRender: function(state) {
    (this.contain.find("@configs-table-columns")).val(state.columns);
    (this.contain.find("@configs-table-rows")).val(state.rows);
    return this.renderTable(state);
  },
  renderColumns: "renderTable",
  renderRows: "renderTable",
  renderTable: function(state) {
    return this.tbodyContain.render({
      data: state.defaultData
    });
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsTableModel.getState());
    this.unbind();
    return false;
  }
});


},{"render.coffee":"render.coffee","table/configsTableModel.coffee":9,"view.coffee":"view.coffee"}],9:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeTableModel", {
  getState: function() {
    return this.state;
  },
  updateColumns: function(value) {
    var i, j, k, l, len, len1, m, ref, ref1, ref2, ref3, ref4, ref5, row;
    value = parseInt(value, 10);
    if (value > this.state.columns) {
      ref = this.state.defaultData;
      for (j = 0, len = ref.length; j < len; j++) {
        row = ref[j];
        for (i = k = ref1 = this.state.columns + 1, ref2 = value; ref1 <= ref2 ? k <= ref2 : k >= ref2; i = ref1 <= ref2 ? ++k : --k) {
          row.push("");
        }
      }
    } else if (value < this.state.columns) {
      ref3 = this.state.defaultData;
      for (l = 0, len1 = ref3.length; l < len1; l++) {
        row = ref3[l];
        for (i = m = ref4 = value + 1, ref5 = this.state.columns; ref4 <= ref5 ? m <= ref5 : m >= ref5; i = ref4 <= ref5 ? ++m : --m) {
          row.pop();
        }
      }
    }
    return this.set({
      columns: value
    });
  },
  updateRows: function(value) {
    var i, j, k, l, ref, ref1, ref2, ref3, ref4, row;
    value = parseInt(value, 10);
    if (value > this.state.rows) {
      for (row = j = ref = this.state.rows + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; row = ref <= ref1 ? ++j : --j) {
        row = [];
        for (i = k = 1, ref2 = this.state.columns; 1 <= ref2 ? k <= ref2 : k >= ref2; i = 1 <= ref2 ? ++k : --k) {
          row.push("");
        }
        this.state.defaultData.push(row);
      }
    } else if (value < this.state.rows) {
      for (row = l = ref3 = value + 1, ref4 = this.state.rows; ref3 <= ref4 ? l <= ref4 : l >= ref4; row = ref3 <= ref4 ? ++l : --l) {
        this.state.defaultData.pop();
      }
    }
    return this.set({
      rows: value
    });
  },
  updateCellData: function(row, column, value) {
    return this.state.defaultData[row][column] = value;
  }
});


},{"model.coffee":"model.coffee"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvc2VjdGlvbnMvY29uZmlncy9hZGRNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL0NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL2NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvdGFibGUvQ29uZmlnc1RhYmxlTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy90YWJsZS9Db25maWdzVGFibGVWaWV3LmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvdGFibGUvY29uZmlnc1RhYmxlTW9kZWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSOztBQUNYLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVI7O0FBQ1YsQ0FBQSxHQUFJLE9BQUEsQ0FBUSx1QkFBUjs7QUFFSixNQUFBLEdBQ0U7RUFBQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBQVA7RUFDQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBRFA7OztBQUdGLEtBQUEsR0FDRTtFQUFBLEtBQUEsRUFBTyxPQUFBLENBQVEsK0JBQVIsQ0FBUDtFQUNBLEtBQUEsRUFBTyxPQUFBLENBQVEsK0JBQVIsQ0FEUDs7O0FBR0YsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUVSLE9BQU8sQ0FBQyxFQUFSLENBQVcsb0JBQVgsRUFBaUMsU0FBQyxLQUFELEVBQVEsS0FBUjtFQUMvQixLQUFLLENBQUMsSUFBTixDQUFXLFdBQUEsR0FBWSxLQUFLLENBQUMsSUFBN0I7RUFDQSxLQUFNLENBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxDQUFDLElBQWxCLENBQXdCLENBQUEsQ0FBRSxXQUFBLEdBQVksS0FBSyxDQUFDLElBQXBCLENBQXhCO0VBRUEsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFmLEdBQXVCO1NBQ3ZCLE1BQU8sQ0FBQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQUMsSUFBbkIsQ0FBd0IsS0FBSyxDQUFDLFFBQTlCO0FBTCtCLENBQWpDOztLQVFLLFNBQUMsSUFBRCxFQUFPLElBQVA7U0FDRCxJQUFJLENBQUMsRUFBTCxDQUFRLG9CQUFSLEVBQThCLFNBQUMsSUFBRDtJQUM1QixRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsSUFBMUI7V0FDQSxLQUFLLENBQUMsS0FBTixDQUFB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QUFBO0FBREYsT0FERzs7V0FHTCxJQUFDLENBQUEsR0FBRCxDQUFLO01BQUEsSUFBQSxFQUFNLEtBQU47S0FBTDtFQVhVLENBZFo7RUEyQkEsY0FBQSxFQUFnQixTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsS0FBZDtXQUF3QixJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVksQ0FBQSxHQUFBLENBQUssQ0FBQSxNQUFBLENBQXhCLEdBQWtDO0VBQTFELENBM0JoQjtDQUZlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkFkZE1vZGVsID0gcmVxdWlyZSBcIi4vYWRkTW9kZWwuY29mZmVlXCJcbkFkZFZpZXcgPSByZXF1aXJlIFwiLi9hZGRWaWV3LmNvZmZlZVwiXG4kID0gcmVxdWlyZSBcImpxdWVyeS1wbHVnaW5zLmNvZmZlZVwiXG5cbm1vZGVscyA9XG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvQ29uZmlnc0ltYWdlTW9kZWwuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9Db25maWdzVGFibGVNb2RlbC5jb2ZmZWVcIlxuXG52aWV3cyA9XG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWVcIlxuICB0YWJsZTogcmVxdWlyZSBcInRhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlXCJcblxuUG9wdXAgPSByZXF1aXJlIFwicG9wdXBcIlxuXG5BZGRWaWV3Lm9uIFwib3Blbi1jb25maWdzLW1vZGFsXCIsIChpbmRleCwgZmllbGQpIC0+XG4gIFBvcHVwLm9wZW4gXCJAY29uZmlncy0je2ZpZWxkLnR5cGV9XCJcbiAgdmlld3NbZmllbGQudHlwZV0uYmluZCAoJCBcIkBjb25maWdzLSN7ZmllbGQudHlwZX1cIilcblxuICBmaWVsZC5zZXR0aW5ncy5pbmRleCA9IGluZGV4XG4gIG1vZGVsc1tmaWVsZC50eXBlXS5iaW5kIGZpZWxkLnNldHRpbmdzXG5cbmZvciB0eXBlLCB2aWV3IG9mIHZpZXdzXG4gIGRvICh0eXBlLCB2aWV3KSAtPlxuICAgIHZpZXcub24gXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgKGZvcm0pIC0+XG4gICAgICBBZGRNb2RlbC5zYXZlRmllbGRDb25maWdzIGZvcm1cbiAgICAgIFBvcHVwLmNsb3NlKClcblxuQWRkTW9kZWwub24gXCJvblNhdmVkU2VjdGlvblwiLCAoYWxpYXMpIC0+XG4gIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvY21zL2NvbmZpZ3MvI3thbGlhc30vXCJcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5Qcm9taXNlID0gcmVxdWlyZSBcInFcIlxuaHR0cEdldCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEdldFxuaHR0cFBvc3QgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBQb3N0XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJDb25maWdzQWRkTW9kZWxcIixcbiAgaW5pdGlhbFN0YXRlOiAtPlxuICAgIGh0dHBHZXQgXCIje3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX1fX2pzb24vXCJcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgc3RhdGUgPVxuICAgICAgICAgIHRpdGxlOiByZXNwb25zZS50aXRsZVxuICAgICAgICAgIGFsaWFzOiByZXNwb25zZS5hbGlhc1xuICAgICAgICAgIG1vZHVsZTogcmVzcG9uc2UubW9kdWxlXG4gICAgICAgICAgZmllbGRzOiByZXNwb25zZS5maWVsZHNcbiAgICAgICAgICB0eXBlczogcmVzcG9uc2UudHlwZXNcbiAgICAgICAgaWYgcmVzcG9uc2UuaWRcbiAgICAgICAgICBzdGF0ZS5pZCA9IHJlc3BvbnNlLmlkXG4gICAgICAgIGNvbnNvbGUubG9nIHN0YXRlXG4gICAgICAgIHN0YXRlXG5cbiAgYWRkRmllbGQ6IChmaWVsZCkgLT5cbiAgICBAc2V0IGZpZWxkczogQHN0YXRlLmZpZWxkcy5jb25jYXQgW2ZpZWxkXVxuXG4gIGFkZEVtcHR5RmllbGQ6IC0+XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHMuY29uY2F0IFtcbiAgICAgIHRpdGxlOiBcIlwiXG4gICAgICBhbGlhczogXCJcIlxuICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIF1cblxuICB1cGRhdGVUaXRsZTogKHZhbHVlKSAtPiBAc3RhdGUudGl0bGUgPSB2YWx1ZVxuICB1cGRhdGVBbGlhczogKHZhbHVlKSAtPiBAc3RhdGUuYWxpYXMgPSB2YWx1ZVxuICB1cGRhdGVNb2R1bGU6ICh2YWx1ZSkgLT4gQHN0YXRlLm1vZHVsZSA9IHZhbHVlXG5cbiAgdXBkYXRlRmllbGRUaXRsZTogKGluZGV4LCB2YWx1ZSkgLT4gQHN0YXRlLmZpZWxkc1tpbmRleF0udGl0bGUgPSB2YWx1ZVxuICB1cGRhdGVGaWVsZEFsaWFzOiAoaW5kZXgsIHZhbHVlKSAtPiBAc3RhdGUuZmllbGRzW2luZGV4XS5hbGlhcyA9IHZhbHVlXG4gIHVwZGF0ZUZpZWxkVHlwZTogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBAc3RhdGUuZmllbGRzW2luZGV4XS50eXBlID0gdmFsdWVcbiAgICBAcmVzZXRTZXR0aW5ncyBpbmRleFxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzXG5cbiAgcmVzZXRTZXR0aW5nczogKGluZGV4KSAtPlxuICAgIHR5cGUgPSBAc3RhdGUuZmllbGRzW2luZGV4XS50eXBlXG4gICAgZm9yIHR5cGVJdGVtIGluIEBzdGF0ZS50eXBlc1xuICAgICAgaWYgdHlwZUl0ZW0uYWxpYXMgPT0gdHlwZVxuICAgICAgICBAc3RhdGUuZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IEBjbG9uZSB0eXBlSXRlbS5kZWZhdWx0U2V0dGluZ3NcblxuICByZW1vdmVGaWVsZDogKGluZGV4KSAtPlxuICAgIEBzdGF0ZS5maWVsZHMuc3BsaWNlIGluZGV4LCAxXG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHNcblxuICBnZXRGaWVsZEJ5SW5kZXg6IChpbmRleCkgLT4gQGNsb25lIEBzdGF0ZS5maWVsZHNbaW5kZXhdXG5cbiAgc2F2ZUZpZWxkQ29uZmlnczogKGZvcm0pIC0+XG4gICAgaW5kZXggPSBmb3JtLmluZGV4XG4gICAgZGVsZXRlIGZvcm0uaW5kZXhcbiAgICBAc3RhdGUuZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IGZvcm1cblxuICBzYXZlOiAtPlxuICAgIGh0dHBQb3N0IFwiL2Ntcy9jb25maWdzL3NhdmUvX19qc29uL1wiLCBAc3RhdGVcbiAgICAgIC50aGVuIChyZXNwb25zZSkgPT5cbiAgICAgICAgaWYgQHN0YXRlLmlkP1xuICAgICAgICAgIEBzZXQgZmllbGRzOiByZXNwb25zZS5zZWN0aW9uLmZpZWxkc1xuICAgICAgICAgIEBzZXQgaWQ6IHJlc3BvbnNlLnNlY3Rpb24uaWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEB0cmlnZ2VyIFwib25TYXZlZFNlY3Rpb25cIiwgQHN0YXRlLmFsaWFzXG4gICAgICAuY2F0Y2ggKHJlc3BvbnNlKSAtPlxuICAgICAgICBjb25zb2xlLmVycm9yIHJlc3BvbnNlLmVycm9yXG4iLCIkID0gcmVxdWlyZSBcImpxdWVyeS1wbHVnaW5zLmNvZmZlZVwiXG5WaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXIuY29mZmVlXCJcblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcbkFkZE1vZGVsID0gcmVxdWlyZSBcIi4vYWRkTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiQ29uZmlnc0FkZFZpZXdcIixcbiAgZGVidWc6IGZhbHNlXG4gIGNvbnRhaW46ICQgXCJAY29uZmlncy1hZGRcIlxuICBtb2RlbDogQWRkTW9kZWxcbiAgZXZlbnRzOlxuICAgIFwiY2xpY2s6IEBidG4tcmVtb3ZlLWZpZWxkXCI6IChlKSAtPiBBZGRNb2RlbC5yZW1vdmVGaWVsZCBAZ2V0Um93SW5kZXggZVxuICAgIFwiY2xpY2s6IEBidG4tYWRkLWZpZWxkXCI6IChlKSAtPiBBZGRNb2RlbC5hZGRFbXB0eUZpZWxkKClcbiAgICBcImNoYW5nZTogQGZpZWxkLXRpdGxlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVGaWVsZFRpdGxlIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC1hbGlhc1wiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlRmllbGRBbGlhcyAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAZmllbGQtdHlwZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlRmllbGRUeXBlIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC10aXRsZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlVGl0bGUgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtYWRkLWFsaWFzXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVBbGlhcyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtbW9kdWxlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVNb2R1bGUgZS50YXJnZXQudmFsdWVcbiAgICBcImNsaWNrOiBAYnRuLWNvbmZpZy1maWVsZFwiOiBcImNsaWNrQnRuQ29uZmlnRmllbGRcIlxuICAgIFwic3VibWl0OiBAY29uZmlncy1hZGQtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NBZGRGb3JtXCJcblxuICBpbml0aWFsOiAtPlxuICAgIEB0Ym9keUNvbnRhaW4gPSBSZW5kZXIgKCQgXCJAdGJvZHktbW9kdWxlLWZpZWxkc1wiKSwgXCJzZWN0aW9uc19jb25maWdzX3RhYmxlLW1vZHVsZS1maWVsZHNcIlxuXG4gIHJlbmRlckZpZWxkczogKHN0YXRlKSAtPlxuICAgIEB0Ym9keUNvbnRhaW4ucmVuZGVyIHN0YXRlXG4gICAgJCgnc2VsZWN0Jykuc2VsZWN0ZXIoKVxuXG4gIGdldFJvd0luZGV4OiAoZSkgLT5cbiAgICAkcGFyZW50ID0gKCQgZS50YXJnZXQpLmNsb3Nlc3QgXCJbZGF0YS1rZXldXCJcbiAgICByZXR1cm4gJHBhcmVudC5kYXRhIFwia2V5XCJcblxuICBjbGlja0J0bkNvbmZpZ0ZpZWxkOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcIm9wZW4tY29uZmlncy1tb2RhbFwiLFxuICAgICAgQGdldFJvd0luZGV4IGVcbiAgICAgIEFkZE1vZGVsLmdldEZpZWxkQnlJbmRleCBAZ2V0Um93SW5kZXggZVxuXG4gIHN1Ym1pdENvbmZpZ3NBZGRGb3JtOiAoZSkgLT5cbiAgICBBZGRNb2RlbC5zYXZlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlSW1hZ2VNb2RlbFwiLFxuICBjaGFuZ2VQYXRoOiAocGF0aCkgLT4gQHN0YXRlLnBhdGggPSBwYXRoXG5cbiAgY2hhbmdlU2l6ZVdpZHRoOiAod2lkdGgpIC0+IEBzdGF0ZS53aWR0aCA9IHdpZHRoXG4gIGNoYW5nZVNpemVIZWlnaHQ6IChoZWlnaHQpIC0+IEBzdGF0ZS5oZWlnaHQgPSBoZWlnaHRcblxuICBjaGFuZ2VTb3VyY2U6IChzb3VyY2UpIC0+IEBzdGF0ZS5zb3VyY2UgPSBzb3VyY2VcbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUucGF0aCA9IHZhbHVlXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzdGF0ZS53aWR0aCA9IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc3RhdGUuaGVpZ2h0ID0gdmFsdWVcbiAgdXBkYXRlU291cmNlOiAodmFsdWUpIC0+IEBzdGF0ZS5zb3VyY2UgPSB2YWx1ZVxuICB1cGRhdGVTdG9yYWdlOiAodmFsdWUpIC0+IEBzdGF0ZS5zdG9yYWdlID0gdmFsdWVcblxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc3RhdGUuczNBY2Nlc3NLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc3RhdGUuczNTZWNyZXRLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc3RhdGUuczNCdWNrZXQgPSB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzUGF0aCA9IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5jb25maWdzSW1hZ2VNb2RlbCA9IHJlcXVpcmUgXCJpbWFnZS9jb25maWdzSW1hZ2VNb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJUeXBlSW1hZ2VWaWV3XCIsXG4gIG1vZGVsOiBjb25maWdzSW1hZ2VNb2RlbFxuICBkZWJ1ZzogZmFsc2VcblxuICBpbml0aWFsOiAtPlxuICAgIEBjb25maWdzSW1hZ2VQYXRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXBhdGhcIlxuICAgIEBjb25maWdzSW1hZ2VTb3VyY2UgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2Utc291cmNlXCJcbiAgICBAY29uZmlnc0ltYWdlV2lkdGggPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2Utd2lkdGhcIlxuICAgIEBjb25maWdzSW1hZ2VIZWlnaHQgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtaGVpZ2h0XCJcbiAgICBAY29uZmlnc0ltYWdlSW5kZXggPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtaW5kZXhcIlxuICAgIEBjb25maWdzSW1hZ2VTdG9yYWdlID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXN0b3JhZ2VcIlxuICAgIEBjb25maWdzSW1hZ2VTM0FjY2Vzc0tleSA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5XCJcbiAgICBAY29uZmlnc0ltYWdlUzNTZWNyZXRLZXkgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtczMtc2VjcmV0LWtleVwiXG4gICAgQGNvbmZpZ3NJbWFnZVMzQnVja2V0ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXMzLWJ1Y2tldFwiXG4gICAgQGNvbmZpZ3NJbWFnZVMzUGF0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1zMy1wYXRoXCJcblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXBhdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utd2lkdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVdpZHRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLWhlaWdodFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlSGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXNvdXJjZVwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQHVuYmluZCgpXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXN0b3JhZ2VcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLWFjY2Vzcy1rZXlcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzQWNjZXNzS2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXlcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzU2VjcmV0S2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLWJ1Y2tldFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtczMtcGF0aFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlUzNQYXRoIGUudGFyZ2V0LnZhbHVlXG5cbiAgaW5pdGlhbFJlbmRlcjogKHN0YXRlKSAtPlxuICAgIChAY29uZmlnc0ltYWdlU3RvcmFnZS5maWx0ZXIgXCJbZGF0YS12YWx1ZT0nI3tzdGF0ZS5zdG9yYWdlfSddXCIpLnRyaWdnZXIgXCJjbGlja1wiXG4gICAgKEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWZyYW1lXCIpLmhpZGUoKVxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS0je3N0YXRlLnN0b3JhZ2V9XCIpLnNob3coKVxuICAgIEBjb25maWdzSW1hZ2VQYXRoLnZhbCBzdGF0ZS5wYXRoXG4gICAgQGNvbmZpZ3NJbWFnZVdpZHRoLnZhbCBzdGF0ZS53aWR0aFxuICAgIEBjb25maWdzSW1hZ2VIZWlnaHQudmFsIHN0YXRlLmhlaWdodFxuICAgIEBjb25maWdzSW1hZ2VTb3VyY2UudmFsIHN0YXRlLnNvdXJjZVxuICAgIEBjb25maWdzSW1hZ2VTM0FjY2Vzc0tleS52YWwgc3RhdGUuczNBY2Nlc3NLZXlcbiAgICBAY29uZmlnc0ltYWdlUzNTZWNyZXRLZXkudmFsIFwiXCJcbiAgICBAY29uZmlnc0ltYWdlUzNCdWNrZXQudmFsIHN0YXRlLnMzQnVja2V0XG4gICAgQGNvbmZpZ3NJbWFnZVMzUGF0aC52YWwgc3RhdGUuczNQYXRoXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIGNvbnNvbGUubG9nIGNvbmZpZ3NJbWFnZU1vZGVsLmdldFN0YXRlKClcbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBjb25maWdzSW1hZ2VNb2RlbC5nZXRTdGF0ZSgpXG4gICAgQHVuYmluZCgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZUltYWdlTW9kZWxcIixcbiAgY2hhbmdlUGF0aDogKHBhdGgpIC0+IEBzdGF0ZS5wYXRoID0gcGF0aFxuXG4gIGNoYW5nZVNpemVXaWR0aDogKHdpZHRoKSAtPiBAc3RhdGUud2lkdGggPSB3aWR0aFxuICBjaGFuZ2VTaXplSGVpZ2h0OiAoaGVpZ2h0KSAtPiBAc3RhdGUuaGVpZ2h0ID0gaGVpZ2h0XG5cbiAgY2hhbmdlU291cmNlOiAoc291cmNlKSAtPiBAc3RhdGUuc291cmNlID0gc291cmNlXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnBhdGggPSB2YWx1ZVxuICB1cGRhdGVXaWR0aDogKHZhbHVlKSAtPiBAc3RhdGUud2lkdGggPSB2YWx1ZVxuICB1cGRhdGVIZWlnaHQ6ICh2YWx1ZSkgLT4gQHN0YXRlLmhlaWdodCA9IHZhbHVlXG4gIHVwZGF0ZVNvdXJjZTogKHZhbHVlKSAtPiBAc3RhdGUuc291cmNlID0gdmFsdWVcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc3RhdGUuc3RvcmFnZSA9IHZhbHVlXG5cbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQWNjZXNzS2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzU2VjcmV0S2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQnVja2V0ID0gdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5zM1BhdGggPSB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlVGFibGVNb2RlbFwiLFxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVDb2x1bW5zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5jb2x1bW5zXG4gICAgICBmb3Igcm93IGluIEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgICAgICBmb3IgaSBpbiBbQHN0YXRlLmNvbHVtbnMgKyAxLi52YWx1ZV1cbiAgICAgICAgICByb3cucHVzaCBcIlwiXG4gICAgZWxzZSBpZiB2YWx1ZSA8IEBzdGF0ZS5jb2x1bW5zXG4gICAgICBmb3Igcm93IGluIEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUuY29sdW1uc11cbiAgICAgICAgICByb3cucG9wKClcbiAgICBAc2V0IGNvbHVtbnM6IHZhbHVlXG5cbiAgdXBkYXRlUm93czogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgaWYgdmFsdWUgPiBAc3RhdGUucm93c1xuICAgICAgZm9yIHJvdyBpbiBbQHN0YXRlLnJvd3MgKyAxLi52YWx1ZV1cbiAgICAgICAgcm93ID0gW11cbiAgICAgICAgZm9yIGkgaW4gWzEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgIHJvdy5wdXNoIFwiXCJcbiAgICAgICAgQHN0YXRlLmRlZmF1bHREYXRhLnB1c2ggcm93XG4gICAgZWxzZSBpZiB2YWx1ZSA8IEBzdGF0ZS5yb3dzXG4gICAgICBmb3Igcm93IGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5yb3dzXVxuICAgICAgICBAc3RhdGUuZGVmYXVsdERhdGEucG9wKClcbiAgICBAc2V0IHJvd3M6IHZhbHVlXG5cbiAgdXBkYXRlQ2VsbERhdGE6IChyb3csIGNvbHVtbiwgdmFsdWUpIC0+IEBzdGF0ZS5kZWZhdWx0RGF0YVtyb3ddW2NvbHVtbl0gPSB2YWx1ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyLmNvZmZlZVwiXG5jb25maWdzVGFibGVNb2RlbCA9IHJlcXVpcmUgXCJ0YWJsZS9jb25maWdzVGFibGVNb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJUeXBlVGFibGVWaWV3XCIsXG4gIG1vZGVsOiBjb25maWdzVGFibGVNb2RlbFxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtdGFibGUtcm93c1wiOiBcImNoYW5nZUNvbmZpZ3NUYWJsZVJvd3NcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy10YWJsZS1jb2x1bW5zXCI6IFwiY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1uc1wiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXRhYmxlLWNlbGxcIjogKGUpIC0+XG4gICAgICAkY2VsbCA9ICQgZS50YXJnZXRcbiAgICAgIGNvbmZpZ3NUYWJsZU1vZGVsLnVwZGF0ZUNlbGxEYXRhICgkY2VsbC5kYXRhIFwicm93XCIpLCAoJGNlbGwuZGF0YSBcImNvbHVtblwiKSwgKCRjZWxsLnZhbCgpKVxuXG4gICAgXCJrZXlkb3duOiBAY29uZmlncy10YWJsZS1yb3dzXCI6IChlKSAtPlxuICAgICAgQGNoYW5nZUNvbmZpZ3NUYWJsZVJvd3MgZVxuICAgICAgaWYgZS5rZXlDb2RlID09IDEzIHRoZW4gZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBcImtleWRvd246IEBjb25maWdzLXRhYmxlLWNvbHVtbnNcIjogKGUpIC0+XG4gICAgICBAY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1ucyBlXG4gICAgICBpZiBlLmtleUNvZGUgPT0gMTMgdGhlbiBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuXG4gIGNoYW5nZUNvbmZpZ3NUYWJsZVJvd3M6IChlKSAtPiBjb25maWdzVGFibGVNb2RlbC51cGRhdGVSb3dzIGUudGFyZ2V0LnZhbHVlXG4gIGNoYW5nZUNvbmZpZ3NUYWJsZUNvbHVtbnM6IChlKSAtPiBjb25maWdzVGFibGVNb2RlbC51cGRhdGVDb2x1bW5zIGUudGFyZ2V0LnZhbHVlXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAdGJvZHlDb250YWluID0gUmVuZGVyICgkIFwiQGNvbmZpZ3MtdGFibGUtdGJvZHlcIiksIFwidHlwZXNfdGFibGVfdGJvZHlcIlxuXG4gIGluaXRpYWxSZW5kZXI6IChzdGF0ZSkgLT5cbiAgICAoQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLXRhYmxlLWNvbHVtbnNcIikudmFsIHN0YXRlLmNvbHVtbnNcbiAgICAoQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLXRhYmxlLXJvd3NcIikudmFsIHN0YXRlLnJvd3NcbiAgICBAcmVuZGVyVGFibGUgc3RhdGVcblxuICByZW5kZXJDb2x1bW5zOiBcInJlbmRlclRhYmxlXCJcbiAgcmVuZGVyUm93czogXCJyZW5kZXJUYWJsZVwiXG5cbiAgcmVuZGVyVGFibGU6IChzdGF0ZSkgLT4gQHRib2R5Q29udGFpbi5yZW5kZXIgZGF0YTogc3RhdGUuZGVmYXVsdERhdGFcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgY29uZmlnc1RhYmxlTW9kZWwuZ2V0U3RhdGUoKVxuICAgIEB1bmJpbmQoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVUYWJsZU1vZGVsXCIsXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZUNvbHVtbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmIHZhbHVlID4gQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFtAc3RhdGUuY29sdW1ucyArIDEuLnZhbHVlXVxuICAgICAgICAgIHJvdy5wdXNoIFwiXCJcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgIHJvdy5wb3AoKVxuICAgIEBzZXQgY29sdW1uczogdmFsdWVcblxuICB1cGRhdGVSb3dzOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5yb3dzXG4gICAgICBmb3Igcm93IGluIFtAc3RhdGUucm93cyArIDEuLnZhbHVlXVxuICAgICAgICByb3cgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMS4uQHN0YXRlLmNvbHVtbnNdXG4gICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgICAgICBAc3RhdGUuZGVmYXVsdERhdGEucHVzaCByb3dcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLnJvd3NcbiAgICAgIGZvciByb3cgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLnJvd3NdXG4gICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wb3AoKVxuICAgIEBzZXQgcm93czogdmFsdWVcblxuICB1cGRhdGVDZWxsRGF0YTogKHJvdywgY29sdW1uLCB2YWx1ZSkgLT4gQHN0YXRlLmRlZmF1bHREYXRhW3Jvd11bY29sdW1uXSA9IHZhbHVlXG4iXX0=
