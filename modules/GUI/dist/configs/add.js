(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, Popup, fn, models, type, view, views;

AddModel = require("./addModel.coffee");

AddView = require("./addView.coffee");

$ = require("jquery-plugins.coffee");

models = {
  image: require("image/ConfigsImageModel.coffee"),
  table: require("table/ConfigsTableModel.coffee"),
  file: require("file/ConfigsFileModel.coffee")
};

views = {
  image: require("image/ConfigsImageView.coffee"),
  table: require("table/ConfigsTableView.coffee"),
  file: require("file/ConfigsFileView.coffee")
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


},{"./addModel.coffee":2,"./addView.coffee":3,"file/ConfigsFileModel.coffee":4,"file/ConfigsFileView.coffee":5,"image/ConfigsImageModel.coffee":7,"image/ConfigsImageView.coffee":8,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","table/ConfigsTableModel.coffee":10,"table/ConfigsTableView.coffee":11}],2:[function(require,module,exports){
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

module.exports = Model("TypeFileModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(value) {
    return this.state.path = value;
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
var Render, View, configsFileModel;

View = require("view.coffee");

Render = require("render.coffee");

configsFileModel = require("file/configsFileModel.coffee");

module.exports = View("TypeFileView", {
  model: configsFileModel,
  initial: function() {
    this.configsFilePath = this.contain.find("@configs-file-path");
    this.configsFileSource = this.contain.find("@configs-file-source");
    this.configsFileWidth = this.contain.find("@configs-file-width");
    this.configsFileHeight = this.contain.find("@configs-file-height");
    this.configsFileIndex = this.contain.find("@configs-file-index");
    this.configsFileStorage = this.contain.find("@configs-file-storage");
    this.configsFileS3AccessKey = this.contain.find("@configs-file-s3-access-key");
    this.configsFileS3SecretKey = this.contain.find("@configs-file-s3-secret-key");
    this.configsFileS3Bucket = this.contain.find("@configs-file-s3-bucket");
    return this.configsFileS3Path = this.contain.find("@configs-file-s3-path");
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-file-storage": function(e) {
      return configsFileModel.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-file-path": function(e) {
      return configsFileModel.updatePath(e.target.value);
    },
    "change: @configs-file-width": function(e) {
      return configsFileModel.updateWidth(e.target.value);
    },
    "change: @configs-file-height": function(e) {
      return configsFileModel.updateHeight(e.target.value);
    },
    "change: @configs-file-source": function(e) {
      return configsFileModel.updateSource(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.unbind();
    },
    "change: @configs-file-s3-access-key": function(e) {
      return configsFileModel.updateS3AccessKey(e.target.value);
    },
    "change: @configs-file-s3-secret-key": function(e) {
      return configsFileModel.updateS3SecretKey(e.target.value);
    },
    "change: @configs-file-s3-bucket": function(e) {
      return configsFileModel.updateS3Bucket(e.target.value);
    },
    "change: @configs-file-s3-path": function(e) {
      return configsFileModel.updateS3Path(e.target.value);
    }
  },
  initialRender: function(state) {
    (this.configsFileStorage.filter("[data-value='" + state.storage + "']")).trigger("click");
    (this.contain.find("@configs-file-modal-storage-frame")).hide();
    (this.contain.find("@configs-file-modal-storage-" + state.storage)).show();
    this.configsFilePath.val(state.path);
    this.configsFileWidth.val(state.width);
    this.configsFileHeight.val(state.height);
    this.configsFileSource.val(state.source);
    this.configsFileS3AccessKey.val(state.s3AccessKey);
    this.configsFileS3SecretKey.val("");
    this.configsFileS3Bucket.val(state.s3Bucket);
    return this.configsFileS3Path.val(state.s3Path);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsFileModel.getState());
    this.unbind();
    return false;
  }
});


},{"file/configsFileModel.coffee":6,"render.coffee":"render.coffee","view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeFileModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(value) {
    return this.state.path = value;
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

module.exports = Model("TypeImageModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(path) {
    return this.state.path = path;
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


},{"model.coffee":"model.coffee"}],8:[function(require,module,exports){
var View, configsImageModel;

View = require("view.coffee");

configsImageModel = require("image/configsImageModel.coffee");

module.exports = View("TypeImageView", {
  model: configsImageModel,
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
    this.trigger("save-configs-modal", configsImageModel.getState());
    this.unbind();
    return false;
  }
});


},{"image/configsImageModel.coffee":9,"view.coffee":"view.coffee"}],9:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeImageModel", {
  updateStorage: function(value) {
    return this.state.storage = value;
  },
  updatePath: function(path) {
    return this.state.path = path;
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


},{"model.coffee":"model.coffee"}],10:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
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


},{"render.coffee":"render.coffee","table/configsTableModel.coffee":12,"view.coffee":"view.coffee"}],12:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvc2VjdGlvbnMvY29uZmlncy9hZGRNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ZpbGUvQ29uZmlnc0ZpbGVNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ZpbGUvQ29uZmlnc0ZpbGVWaWV3LmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvZmlsZS9jb25maWdzRmlsZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9pbWFnZS9Db25maWdzSW1hZ2VWaWV3LmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvY29uZmlnc0ltYWdlTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy90YWJsZS9Db25maWdzVGFibGVNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy90YWJsZS9jb25maWdzVGFibGVNb2RlbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLFFBQUEsR0FBVyxPQUFBLENBQVEsbUJBQVI7O0FBQ1gsT0FBQSxHQUFVLE9BQUEsQ0FBUSxrQkFBUjs7QUFDVixDQUFBLEdBQUksT0FBQSxDQUFRLHVCQUFSOztBQUVKLE1BQUEsR0FDRTtFQUFBLEtBQUEsRUFBTyxPQUFBLENBQVEsZ0NBQVIsQ0FBUDtFQUNBLEtBQUEsRUFBTyxPQUFBLENBQVEsZ0NBQVIsQ0FEUDtFQUVBLElBQUEsRUFBTSxPQUFBLENBQVEsOEJBQVIsQ0FGTjs7O0FBSUYsS0FBQSxHQUNFO0VBQUEsS0FBQSxFQUFPLE9BQUEsQ0FBUSwrQkFBUixDQUFQO0VBQ0EsS0FBQSxFQUFPLE9BQUEsQ0FBUSwrQkFBUixDQURQO0VBRUEsSUFBQSxFQUFNLE9BQUEsQ0FBUSw2QkFBUixDQUZOOzs7QUFJRixLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVI7O0FBRVIsT0FBTyxDQUFDLEVBQVIsQ0FBVyxvQkFBWCxFQUFpQyxTQUFDLEtBQUQsRUFBUSxLQUFSO0VBQy9CLEtBQUssQ0FBQyxJQUFOLENBQVcsV0FBQSxHQUFZLEtBQUssQ0FBQyxJQUE3QjtFQUNBLEtBQU0sQ0FBQSxLQUFLLENBQUMsSUFBTixDQUFXLENBQUMsSUFBbEIsQ0FBd0IsQ0FBQSxDQUFFLFdBQUEsR0FBWSxLQUFLLENBQUMsSUFBcEIsQ0FBeEI7RUFFQSxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQWYsR0FBdUI7U0FDdkIsTUFBTyxDQUFBLEtBQUssQ0FBQyxJQUFOLENBQVcsQ0FBQyxJQUFuQixDQUF3QixLQUFLLENBQUMsUUFBOUI7QUFMK0IsQ0FBakM7O0tBUUssU0FBQyxJQUFELEVBQU8sSUFBUDtTQUNELElBQUksQ0FBQyxFQUFMLENBQVEsb0JBQVIsRUFBOEIsU0FBQyxJQUFEO0lBQzVCLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixJQUExQjtXQUNBLEtBQUssQ0FBQyxLQUFOLENBQUE7RUFGNEIsQ0FBOUI7QUFEQztBQURMLEtBQUEsYUFBQTs7S0FDTSxNQUFNO0FBRFo7O0FBTUEsUUFBUSxDQUFDLEVBQVQsQ0FBWSxnQkFBWixFQUE4QixTQUFDLEtBQUQ7U0FDNUIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFoQixHQUF1QixlQUFBLEdBQWdCLEtBQWhCLEdBQXNCO0FBRGpCLENBQTlCOzs7O0FDN0JBLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztBQUNSLE9BQUEsR0FBVSxPQUFBLENBQVEsR0FBUjs7QUFDVixPQUFBLEdBQVUsQ0FBQyxPQUFBLENBQVEsYUFBUixDQUFELENBQXVCLENBQUM7O0FBQ2xDLFFBQUEsR0FBVyxDQUFDLE9BQUEsQ0FBUSxhQUFSLENBQUQsQ0FBdUIsQ0FBQzs7QUFFbkMsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBQSxDQUFNLGlCQUFOLEVBQ2Y7RUFBQSxZQUFBLEVBQWMsU0FBQTtXQUNaLE9BQUEsQ0FBVyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQWpCLEdBQTBCLFNBQXBDLENBQ0UsQ0FBQyxJQURILENBQ1EsU0FBQyxRQUFEO0FBQ0osVUFBQTtNQUFBLEtBQUEsR0FDRTtRQUFBLEtBQUEsRUFBTyxRQUFRLENBQUMsS0FBaEI7UUFDQSxLQUFBLEVBQU8sUUFBUSxDQUFDLEtBRGhCO1FBRUEsTUFBQSxFQUFRLFFBQVEsQ0FBQyxNQUZqQjtRQUdBLE1BQUEsRUFBUSxRQUFRLENBQUMsTUFIakI7UUFJQSxLQUFBLEVBQU8sUUFBUSxDQUFDLEtBSmhCOztNQUtGLElBQUcsUUFBUSxDQUFDLEVBQVo7UUFDRSxLQUFLLENBQUMsRUFBTixHQUFXLFFBQVEsQ0FBQyxHQUR0Qjs7TUFFQSxPQUFPLENBQUMsR0FBUixDQUFZLEtBQVo7YUFDQTtJQVZJLENBRFI7RUFEWSxDQUFkO0VBY0EsUUFBQSxFQUFVLFNBQUMsS0FBRDtXQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7TUFBQSxNQUFBLEVBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBZCxDQUFxQixDQUFDLEtBQUQsQ0FBckIsQ0FBUjtLQUFMO0VBRFEsQ0FkVjtFQWlCQSxhQUFBLEVBQWUsU0FBQTtXQUNiLElBQUMsQ0FBQSxHQUFELENBQUs7TUFBQSxNQUFBLEVBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBZCxDQUFxQjtRQUNoQztVQUFBLEtBQUEsRUFBTyxFQUFQO1VBQ0EsS0FBQSxFQUFPLEVBRFA7VUFFQSxJQUFBLEVBQU0sUUFGTjtTQURnQztPQUFyQixDQUFSO0tBQUw7RUFEYSxDQWpCZjtFQXdCQSxXQUFBLEVBQWEsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLEdBQWU7RUFBMUIsQ0F4QmI7RUF5QkEsV0FBQSxFQUFhLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsS0FBUCxHQUFlO0VBQTFCLENBekJiO0VBMEJBLFlBQUEsRUFBYyxTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0I7RUFBM0IsQ0ExQmQ7RUE0QkEsZ0JBQUEsRUFBa0IsU0FBQyxLQUFELEVBQVEsS0FBUjtXQUFrQixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU8sQ0FBQSxLQUFBLENBQU0sQ0FBQyxLQUFyQixHQUE2QjtFQUEvQyxDQTVCbEI7RUE2QkEsZ0JBQUEsRUFBa0IsU0FBQyxLQUFELEVBQVEsS0FBUjtXQUFrQixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU8sQ0FBQSxLQUFBLENBQU0sQ0FBQyxLQUFyQixHQUE2QjtFQUEvQyxDQTdCbEI7RUE4QkEsZUFBQSxFQUFpQixTQUFDLEtBQUQsRUFBUSxLQUFSO0lBQ2YsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFPLENBQUEsS0FBQSxDQUFNLENBQUMsSUFBckIsR0FBNEI7SUFDNUIsSUFBQyxDQUFBLGFBQUQsQ0FBZSxLQUFmO1dBQ0EsSUFBQyxDQUFBLEdBQUQsQ0FBSztNQUFBLE1BQUEsRUFBUSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQWY7S0FBTDtFQUhlLENBOUJqQjtFQW1DQSxhQUFBLEVBQWUsU0FBQyxLQUFEO0FBQ2IsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU8sQ0FBQSxLQUFBLENBQU0sQ0FBQztBQUM1QjtBQUFBO1NBQUEscUNBQUE7O01BQ0UsSUFBRyxRQUFRLENBQUMsS0FBVCxLQUFrQixJQUFyQjtxQkFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU8sQ0FBQSxLQUFBLENBQU0sQ0FBQyxRQUFyQixHQUFnQyxJQUFDLENBQUEsS0FBRCxDQUFPLFFBQVEsQ0FBQyxlQUFoQixHQURsQztPQUFBLE1BQUE7NkJBQUE7O0FBREY7O0VBRmEsQ0FuQ2Y7RUF5Q0EsV0FBQSxFQUFhLFNBQUMsS0FBRDtJQUNYLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQWQsQ0FBcUIsS0FBckIsRUFBNEIsQ0FBNUI7V0FDQSxJQUFDLENBQUEsR0FBRCxDQUFLO01BQUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBZjtLQUFMO0VBRlcsQ0F6Q2I7RUE2Q0EsZUFBQSxFQUFpQixTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBRCxDQUFPLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBTyxDQUFBLEtBQUEsQ0FBckI7RUFBWCxDQTdDakI7RUErQ0EsZ0JBQUEsRUFBa0IsU0FBQyxJQUFEO0FBQ2hCLFFBQUE7SUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDO0lBQ2IsT0FBTyxJQUFJLENBQUM7V0FDWixJQUFDLENBQUEsS0FBSyxDQUFDLE1BQU8sQ0FBQSxLQUFBLENBQU0sQ0FBQyxRQUFyQixHQUFnQztFQUhoQixDQS9DbEI7RUFvREEsSUFBQSxFQUFNLFNBQUE7V0FDSixRQUFBLENBQVMsMkJBQVQsRUFBc0MsSUFBQyxDQUFBLEtBQXZDLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7YUFBQSxTQUFDLFFBQUQ7UUFDSixJQUFHLHNCQUFIO1VBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLE1BQUEsRUFBUSxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQXpCO1dBQUw7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLEVBQUEsRUFBSSxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQXJCO1dBQUwsRUFGRjtTQUFBLE1BQUE7aUJBSUUsS0FBQyxDQUFBLE9BQUQsQ0FBUyxnQkFBVCxFQUEyQixLQUFDLENBQUEsS0FBSyxDQUFDLEtBQWxDLEVBSkY7O01BREk7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFIsQ0FPRSxDQUFDLE9BQUQsQ0FQRixDQU9TLFNBQUMsUUFBRDthQUNMLE9BQU8sQ0FBQyxLQUFSLENBQWMsUUFBUSxDQUFDLEtBQXZCO0lBREssQ0FQVDtFQURJLENBcEROO0NBRGU7Ozs7QUNMakIsSUFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLHVCQUFSOztBQUNKLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUjs7QUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0FBQ1QsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSOztBQUNSLFFBQUEsR0FBVyxPQUFBLENBQVEsbUJBQVI7O0FBRVgsTUFBTSxDQUFDLE9BQVAsR0FBaUIsSUFBQSxDQUFLLGdCQUFMLEVBQ2Y7RUFBQSxLQUFBLEVBQU8sS0FBUDtFQUNBLE9BQUEsRUFBUyxDQUFBLENBQUUsY0FBRixDQURUO0VBRUEsS0FBQSxFQUFPLFFBRlA7RUFHQSxNQUFBLEVBQ0U7SUFBQSwwQkFBQSxFQUE0QixTQUFDLENBQUQ7YUFBTyxRQUFRLENBQUMsV0FBVCxDQUFxQixJQUFDLENBQUEsV0FBRCxDQUFhLENBQWIsQ0FBckI7SUFBUCxDQUE1QjtJQUNBLHVCQUFBLEVBQXlCLFNBQUMsQ0FBRDthQUFPLFFBQVEsQ0FBQyxhQUFULENBQUE7SUFBUCxDQUR6QjtJQUVBLHNCQUFBLEVBQXdCLFNBQUMsQ0FBRDthQUFPLFFBQVEsQ0FBQyxnQkFBVCxDQUEyQixJQUFDLENBQUEsV0FBRCxDQUFhLENBQWIsQ0FBM0IsRUFBNEMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFyRDtJQUFQLENBRnhCO0lBR0Esc0JBQUEsRUFBd0IsU0FBQyxDQUFEO2FBQU8sUUFBUSxDQUFDLGdCQUFULENBQTJCLElBQUMsQ0FBQSxXQUFELENBQWEsQ0FBYixDQUEzQixFQUE0QyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQXJEO0lBQVAsQ0FIeEI7SUFJQSxxQkFBQSxFQUF1QixTQUFDLENBQUQ7YUFBTyxRQUFRLENBQUMsZUFBVCxDQUEwQixJQUFDLENBQUEsV0FBRCxDQUFhLENBQWIsQ0FBMUIsRUFBMkMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFwRDtJQUFQLENBSnZCO0lBS0EsNEJBQUEsRUFBOEIsU0FBQyxDQUFEO2FBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUE5QjtJQUFQLENBTDlCO0lBTUEsNEJBQUEsRUFBOEIsU0FBQyxDQUFEO2FBQU8sUUFBUSxDQUFDLFdBQVQsQ0FBcUIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUE5QjtJQUFQLENBTjlCO0lBT0EsNkJBQUEsRUFBK0IsU0FBQyxDQUFEO2FBQU8sUUFBUSxDQUFDLFlBQVQsQ0FBc0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUEvQjtJQUFQLENBUC9CO0lBUUEsMEJBQUEsRUFBNEIscUJBUjVCO0lBU0EsMkJBQUEsRUFBNkIsc0JBVDdCO0dBSkY7RUFlQSxPQUFBLEVBQVMsU0FBQTtXQUNQLElBQUMsQ0FBQSxZQUFELEdBQWdCLE1BQUEsQ0FBUSxDQUFBLENBQUUsc0JBQUYsQ0FBUixFQUFtQyxzQ0FBbkM7RUFEVCxDQWZUO0VBa0JBLFlBQUEsRUFBYyxTQUFDLEtBQUQ7SUFDWixJQUFDLENBQUEsWUFBWSxDQUFDLE1BQWQsQ0FBcUIsS0FBckI7V0FDQSxDQUFBLENBQUUsUUFBRixDQUFXLENBQUMsUUFBWixDQUFBO0VBRlksQ0FsQmQ7RUFzQkEsV0FBQSxFQUFhLFNBQUMsQ0FBRDtBQUNYLFFBQUE7SUFBQSxPQUFBLEdBQVUsQ0FBQyxDQUFBLENBQUUsQ0FBQyxDQUFDLE1BQUosQ0FBRCxDQUFZLENBQUMsT0FBYixDQUFxQixZQUFyQjtBQUNWLFdBQU8sT0FBTyxDQUFDLElBQVIsQ0FBYSxLQUFiO0VBRkksQ0F0QmI7RUEwQkEsbUJBQUEsRUFBcUIsU0FBQyxDQUFEO1dBQ25CLElBQUMsQ0FBQSxPQUFELENBQVMsb0JBQVQsRUFDRSxJQUFDLENBQUEsV0FBRCxDQUFhLENBQWIsQ0FERixFQUVFLFFBQVEsQ0FBQyxlQUFULENBQXlCLElBQUMsQ0FBQSxXQUFELENBQWEsQ0FBYixDQUF6QixDQUZGO0VBRG1CLENBMUJyQjtFQStCQSxvQkFBQSxFQUFzQixTQUFDLENBQUQ7SUFDcEIsUUFBUSxDQUFDLElBQVQsQ0FBQTtBQUNBLFdBQU87RUFGYSxDQS9CdEI7Q0FEZTs7OztBQ05qQixJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUjs7QUFFUixNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLENBQU0sZUFBTixFQUNmO0VBQUEsYUFBQSxFQUFlLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxHQUFpQjtFQUE1QixDQUFmO0VBQ0EsVUFBQSxFQUFZLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxHQUFjO0VBQXpCLENBRFo7RUFFQSxpQkFBQSxFQUFtQixTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVAsR0FBcUI7RUFBaEMsQ0FGbkI7RUFHQSxpQkFBQSxFQUFtQixTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVAsR0FBcUI7RUFBaEMsQ0FIbkI7RUFJQSxjQUFBLEVBQWdCLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsUUFBUCxHQUFrQjtFQUE3QixDQUpoQjtFQUtBLFlBQUEsRUFBYyxTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0I7RUFBM0IsQ0FMZDtFQU9BLFFBQUEsRUFBVSxTQUFBO1dBQUcsSUFBQyxDQUFBO0VBQUosQ0FQVjtDQURlOzs7O0FDRmpCLElBQUE7O0FBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxhQUFSOztBQUNQLE1BQUEsR0FBUyxPQUFBLENBQVEsZUFBUjs7QUFDVCxnQkFBQSxHQUFtQixPQUFBLENBQVEsOEJBQVI7O0FBRW5CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLElBQUEsQ0FBSyxjQUFMLEVBQ2Y7RUFBQSxLQUFBLEVBQU8sZ0JBQVA7RUFFQSxPQUFBLEVBQVMsU0FBQTtJQUNQLElBQUMsQ0FBQSxlQUFELEdBQW1CLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLG9CQUFkO0lBQ25CLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxzQkFBZDtJQUNyQixJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMscUJBQWQ7SUFDcEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHNCQUFkO0lBQ3JCLElBQUMsQ0FBQSxnQkFBRCxHQUFvQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxxQkFBZDtJQUNwQixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsdUJBQWQ7SUFDdEIsSUFBQyxDQUFBLHNCQUFELEdBQTBCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLDZCQUFkO0lBQzFCLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyw2QkFBZDtJQUMxQixJQUFDLENBQUEsbUJBQUQsR0FBdUIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMseUJBQWQ7V0FDdkIsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHVCQUFkO0VBVmQsQ0FGVDtFQWNBLE1BQUEsRUFDRTtJQUFBLHVCQUFBLEVBQXlCLG1CQUF6QjtJQUNBLCtCQUFBLEVBQWlDLFNBQUMsQ0FBRDthQUFPLGdCQUFnQixDQUFDLGFBQWpCLENBQStCLENBQUMsQ0FBQSxDQUFFLENBQUMsQ0FBQyxNQUFKLENBQUQsQ0FBWSxDQUFDLElBQWIsQ0FBa0IsT0FBbEIsQ0FBL0I7SUFBUCxDQURqQztJQUVBLDRCQUFBLEVBQThCLFNBQUMsQ0FBRDthQUFPLGdCQUFnQixDQUFDLFVBQWpCLENBQTRCLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBckM7SUFBUCxDQUY5QjtJQUdBLDZCQUFBLEVBQStCLFNBQUMsQ0FBRDthQUFPLGdCQUFnQixDQUFDLFdBQWpCLENBQTZCLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBdEM7SUFBUCxDQUgvQjtJQUlBLDhCQUFBLEVBQWdDLFNBQUMsQ0FBRDthQUFPLGdCQUFnQixDQUFDLFlBQWpCLENBQThCLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBdkM7SUFBUCxDQUpoQztJQUtBLDhCQUFBLEVBQWdDLFNBQUMsQ0FBRDthQUFPLGdCQUFnQixDQUFDLFlBQWpCLENBQThCLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBdkM7SUFBUCxDQUxoQztJQU1BLHNCQUFBLEVBQXdCLFNBQUMsQ0FBRDthQUFPLElBQUMsQ0FBQSxNQUFELENBQUE7SUFBUCxDQU54QjtJQU9BLHFDQUFBLEVBQXVDLFNBQUMsQ0FBRDthQUFPLGdCQUFnQixDQUFDLGlCQUFqQixDQUFtQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQTVDO0lBQVAsQ0FQdkM7SUFRQSxxQ0FBQSxFQUF1QyxTQUFDLENBQUQ7YUFBTyxnQkFBZ0IsQ0FBQyxpQkFBakIsQ0FBbUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUE1QztJQUFQLENBUnZDO0lBU0EsaUNBQUEsRUFBbUMsU0FBQyxDQUFEO2FBQU8sZ0JBQWdCLENBQUMsY0FBakIsQ0FBZ0MsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUF6QztJQUFQLENBVG5DO0lBVUEsK0JBQUEsRUFBaUMsU0FBQyxDQUFEO2FBQU8sZ0JBQWdCLENBQUMsWUFBakIsQ0FBOEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUF2QztJQUFQLENBVmpDO0dBZkY7RUEyQkEsYUFBQSxFQUFlLFNBQUMsS0FBRDtJQUNiLENBQUMsSUFBQyxDQUFBLGtCQUFrQixDQUFDLE1BQXBCLENBQTJCLGVBQUEsR0FBZ0IsS0FBSyxDQUFDLE9BQXRCLEdBQThCLElBQXpELENBQUQsQ0FBOEQsQ0FBQyxPQUEvRCxDQUF1RSxPQUF2RTtJQUNBLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsbUNBQWQsQ0FBRCxDQUFtRCxDQUFDLElBQXBELENBQUE7SUFDQSxDQUFDLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLDhCQUFBLEdBQStCLEtBQUssQ0FBQyxPQUFuRCxDQUFELENBQThELENBQUMsSUFBL0QsQ0FBQTtJQUNBLElBQUMsQ0FBQSxlQUFlLENBQUMsR0FBakIsQ0FBcUIsS0FBSyxDQUFDLElBQTNCO0lBQ0EsSUFBQyxDQUFBLGdCQUFnQixDQUFDLEdBQWxCLENBQXNCLEtBQUssQ0FBQyxLQUE1QjtJQUNBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxHQUFuQixDQUF1QixLQUFLLENBQUMsTUFBN0I7SUFDQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsR0FBbkIsQ0FBdUIsS0FBSyxDQUFDLE1BQTdCO0lBQ0EsSUFBQyxDQUFBLHNCQUFzQixDQUFDLEdBQXhCLENBQTRCLEtBQUssQ0FBQyxXQUFsQztJQUNBLElBQUMsQ0FBQSxzQkFBc0IsQ0FBQyxHQUF4QixDQUE0QixFQUE1QjtJQUNBLElBQUMsQ0FBQSxtQkFBbUIsQ0FBQyxHQUFyQixDQUF5QixLQUFLLENBQUMsUUFBL0I7V0FDQSxJQUFDLENBQUEsaUJBQWlCLENBQUMsR0FBbkIsQ0FBdUIsS0FBSyxDQUFDLE1BQTdCO0VBWGEsQ0EzQmY7RUF3Q0EsaUJBQUEsRUFBbUIsU0FBQyxDQUFEO0lBQ2pCLElBQUMsQ0FBQSxPQUFELENBQVMsb0JBQVQsRUFBK0IsZ0JBQWdCLENBQUMsUUFBakIsQ0FBQSxDQUEvQjtJQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7QUFDQSxXQUFPO0VBSFUsQ0F4Q25CO0NBRGU7Ozs7QUNKakIsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVI7O0FBRVIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsS0FBQSxDQUFNLGVBQU4sRUFDZjtFQUFBLGFBQUEsRUFBZSxTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsR0FBaUI7RUFBNUIsQ0FBZjtFQUNBLFVBQUEsRUFBWSxTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsR0FBYztFQUF6QixDQURaO0VBRUEsaUJBQUEsRUFBbUIsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFQLEdBQXFCO0VBQWhDLENBRm5CO0VBR0EsaUJBQUEsRUFBbUIsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFQLEdBQXFCO0VBQWhDLENBSG5CO0VBSUEsY0FBQSxFQUFnQixTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBa0I7RUFBN0IsQ0FKaEI7RUFLQSxZQUFBLEVBQWMsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEdBQWdCO0VBQTNCLENBTGQ7RUFPQSxRQUFBLEVBQVUsU0FBQTtXQUFHLElBQUMsQ0FBQTtFQUFKLENBUFY7Q0FEZTs7OztBQ0ZqQixJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUjs7QUFFUixNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLENBQU0sZ0JBQU4sRUFDZjtFQUFBLGFBQUEsRUFBZSxTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQVAsR0FBaUI7RUFBNUIsQ0FBZjtFQUVBLFVBQUEsRUFBWSxTQUFDLElBQUQ7V0FBVSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsR0FBYztFQUF4QixDQUZaO0VBR0EsVUFBQSxFQUFZLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxHQUFjO0VBQXpCLENBSFo7RUFJQSxXQUFBLEVBQWEsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxLQUFQLEdBQWU7RUFBMUIsQ0FKYjtFQUtBLFlBQUEsRUFBYyxTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0I7RUFBM0IsQ0FMZDtFQU1BLFlBQUEsRUFBYyxTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLE1BQVAsR0FBZ0I7RUFBM0IsQ0FOZDtFQVFBLGlCQUFBLEVBQW1CLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBUCxHQUFxQjtFQUFoQyxDQVJuQjtFQVNBLGlCQUFBLEVBQW1CLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBUCxHQUFxQjtFQUFoQyxDQVRuQjtFQVVBLGNBQUEsRUFBZ0IsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLEdBQWtCO0VBQTdCLENBVmhCO0VBV0EsWUFBQSxFQUFjLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxHQUFnQjtFQUEzQixDQVhkO0VBYUEsUUFBQSxFQUFVLFNBQUE7V0FBRyxJQUFDLENBQUE7RUFBSixDQWJWO0NBRGU7Ozs7QUNGakIsSUFBQTs7QUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBQ1AsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLGdDQUFSOztBQUVwQixNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFBLENBQUssZUFBTCxFQUNmO0VBQUEsS0FBQSxFQUFPLGlCQUFQO0VBRUEsT0FBQSxFQUFTLFNBQUE7SUFDUCxJQUFDLENBQUEsZ0JBQUQsR0FBb0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMscUJBQWQ7SUFDcEIsSUFBQyxDQUFBLGtCQUFELEdBQXNCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHVCQUFkO0lBQ3RCLElBQUMsQ0FBQSxpQkFBRCxHQUFxQixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxzQkFBZDtJQUNyQixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsdUJBQWQ7SUFDdEIsSUFBQyxDQUFBLGlCQUFELEdBQXFCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLHNCQUFkO0lBQ3JCLElBQUMsQ0FBQSxtQkFBRCxHQUF1QixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyx3QkFBZDtJQUN2QixJQUFDLENBQUEsdUJBQUQsR0FBMkIsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsOEJBQWQ7SUFDM0IsSUFBQyxDQUFBLHVCQUFELEdBQTJCLElBQUMsQ0FBQSxPQUFPLENBQUMsSUFBVCxDQUFjLDhCQUFkO0lBQzNCLElBQUMsQ0FBQSxvQkFBRCxHQUF3QixJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYywwQkFBZDtXQUN4QixJQUFDLENBQUEsa0JBQUQsR0FBc0IsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsd0JBQWQ7RUFWZixDQUZUO0VBY0EsTUFBQSxFQUNFO0lBQUEsdUJBQUEsRUFBeUIsbUJBQXpCO0lBQ0EsNkJBQUEsRUFBK0IsU0FBQyxDQUFEO2FBQU8saUJBQWlCLENBQUMsVUFBbEIsQ0FBNkIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUF0QztJQUFQLENBRC9CO0lBRUEsOEJBQUEsRUFBZ0MsU0FBQyxDQUFEO2FBQU8saUJBQWlCLENBQUMsV0FBbEIsQ0FBOEIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUF2QztJQUFQLENBRmhDO0lBR0EsK0JBQUEsRUFBaUMsU0FBQyxDQUFEO2FBQU8saUJBQWlCLENBQUMsWUFBbEIsQ0FBK0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUF4QztJQUFQLENBSGpDO0lBSUEsK0JBQUEsRUFBaUMsU0FBQyxDQUFEO2FBQU8saUJBQWlCLENBQUMsWUFBbEIsQ0FBK0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUF4QztJQUFQLENBSmpDO0lBS0Esc0JBQUEsRUFBd0IsU0FBQyxDQUFEO2FBQU8sSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUFQLENBTHhCO0lBTUEsZ0NBQUEsRUFBa0MsU0FBQyxDQUFEO2FBQU8saUJBQWlCLENBQUMsYUFBbEIsQ0FBZ0MsQ0FBQyxDQUFBLENBQUUsQ0FBQyxDQUFDLE1BQUosQ0FBRCxDQUFZLENBQUMsSUFBYixDQUFrQixPQUFsQixDQUFoQztJQUFQLENBTmxDO0lBT0Esc0NBQUEsRUFBd0MsU0FBQyxDQUFEO2FBQU8saUJBQWlCLENBQUMsaUJBQWxCLENBQW9DLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBN0M7SUFBUCxDQVB4QztJQVFBLHNDQUFBLEVBQXdDLFNBQUMsQ0FBRDthQUFPLGlCQUFpQixDQUFDLGlCQUFsQixDQUFvQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQTdDO0lBQVAsQ0FSeEM7SUFTQSxrQ0FBQSxFQUFvQyxTQUFDLENBQUQ7YUFBTyxpQkFBaUIsQ0FBQyxjQUFsQixDQUFpQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQTFDO0lBQVAsQ0FUcEM7SUFVQSxnQ0FBQSxFQUFrQyxTQUFDLENBQUQ7YUFBTyxpQkFBaUIsQ0FBQyxZQUFsQixDQUErQixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQXhDO0lBQVAsQ0FWbEM7R0FmRjtFQTJCQSxhQUFBLEVBQWUsU0FBQyxLQUFEO0lBQ2IsQ0FBQyxJQUFDLENBQUEsbUJBQW1CLENBQUMsTUFBckIsQ0FBNEIsZUFBQSxHQUFnQixLQUFLLENBQUMsT0FBdEIsR0FBOEIsSUFBMUQsQ0FBRCxDQUErRCxDQUFDLE9BQWhFLENBQXdFLE9BQXhFO0lBQ0EsQ0FBQyxJQUFDLENBQUEsT0FBTyxDQUFDLElBQVQsQ0FBYyxvQ0FBZCxDQUFELENBQW9ELENBQUMsSUFBckQsQ0FBQTtJQUNBLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsK0JBQUEsR0FBZ0MsS0FBSyxDQUFDLE9BQXBELENBQUQsQ0FBK0QsQ0FBQyxJQUFoRSxDQUFBO0lBQ0EsSUFBQyxDQUFBLGdCQUFnQixDQUFDLEdBQWxCLENBQXNCLEtBQUssQ0FBQyxJQUE1QjtJQUNBLElBQUMsQ0FBQSxpQkFBaUIsQ0FBQyxHQUFuQixDQUF1QixLQUFLLENBQUMsS0FBN0I7SUFDQSxJQUFDLENBQUEsa0JBQWtCLENBQUMsR0FBcEIsQ0FBd0IsS0FBSyxDQUFDLE1BQTlCO0lBQ0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEdBQXBCLENBQXdCLEtBQUssQ0FBQyxNQUE5QjtJQUNBLElBQUMsQ0FBQSx1QkFBdUIsQ0FBQyxHQUF6QixDQUE2QixLQUFLLENBQUMsV0FBbkM7SUFDQSxJQUFDLENBQUEsdUJBQXVCLENBQUMsR0FBekIsQ0FBNkIsRUFBN0I7SUFDQSxJQUFDLENBQUEsb0JBQW9CLENBQUMsR0FBdEIsQ0FBMEIsS0FBSyxDQUFDLFFBQWhDO1dBQ0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEdBQXBCLENBQXdCLEtBQUssQ0FBQyxNQUE5QjtFQVhhLENBM0JmO0VBd0NBLGlCQUFBLEVBQW1CLFNBQUMsQ0FBRDtJQUNqQixJQUFDLENBQUEsT0FBRCxDQUFTLG9CQUFULEVBQStCLGlCQUFpQixDQUFDLFFBQWxCLENBQUEsQ0FBL0I7SUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0FBQ0EsV0FBTztFQUhVLENBeENuQjtDQURlOzs7O0FDSGpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztBQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUEsQ0FBTSxnQkFBTixFQUNmO0VBQUEsYUFBQSxFQUFlLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxHQUFpQjtFQUE1QixDQUFmO0VBRUEsVUFBQSxFQUFZLFNBQUMsSUFBRDtXQUFVLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxHQUFjO0VBQXhCLENBRlo7RUFHQSxVQUFBLEVBQVksU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLEdBQWM7RUFBekIsQ0FIWjtFQUlBLFdBQUEsRUFBYSxTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLEtBQVAsR0FBZTtFQUExQixDQUpiO0VBS0EsWUFBQSxFQUFjLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxHQUFnQjtFQUEzQixDQUxkO0VBTUEsWUFBQSxFQUFjLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxLQUFLLENBQUMsTUFBUCxHQUFnQjtFQUEzQixDQU5kO0VBUUEsaUJBQUEsRUFBbUIsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFQLEdBQXFCO0VBQWhDLENBUm5CO0VBU0EsaUJBQUEsRUFBbUIsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFQLEdBQXFCO0VBQWhDLENBVG5CO0VBVUEsY0FBQSxFQUFnQixTQUFDLEtBQUQ7V0FBVyxJQUFDLENBQUEsS0FBSyxDQUFDLFFBQVAsR0FBa0I7RUFBN0IsQ0FWaEI7RUFXQSxZQUFBLEVBQWMsU0FBQyxLQUFEO1dBQVcsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLEdBQWdCO0VBQTNCLENBWGQ7RUFhQSxRQUFBLEVBQVUsU0FBQTtXQUFHLElBQUMsQ0FBQTtFQUFKLENBYlY7Q0FEZTs7OztBQ0ZqQixJQUFBOztBQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUjs7QUFFUixNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLENBQU0sZ0JBQU4sRUFFZjtFQUFBLFFBQUEsRUFBVSxTQUFBO1dBQUcsSUFBQyxDQUFBO0VBQUosQ0FBVjtFQUVBLGFBQUEsRUFBZSxTQUFDLEtBQUQ7QUFDYixRQUFBO0lBQUEsS0FBQSxHQUFRLFFBQUEsQ0FBUyxLQUFULEVBQWdCLEVBQWhCO0lBQ1IsSUFBRyxLQUFBLEdBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFsQjtBQUNFO0FBQUEsV0FBQSxxQ0FBQTs7QUFDRSxhQUFTLHVIQUFUO1VBQ0UsR0FBRyxDQUFDLElBQUosQ0FBUyxFQUFUO0FBREY7QUFERixPQURGO0tBQUEsTUFJSyxJQUFHLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQWxCO0FBQ0g7QUFBQSxXQUFBLHdDQUFBOztBQUNFLGFBQVMsdUhBQVQ7VUFDRSxHQUFHLENBQUMsR0FBSixDQUFBO0FBREY7QUFERixPQURHOztXQUlMLElBQUMsQ0FBQSxHQUFELENBQUs7TUFBQSxPQUFBLEVBQVMsS0FBVDtLQUFMO0VBVmEsQ0FGZjtFQWNBLFVBQUEsRUFBWSxTQUFDLEtBQUQ7QUFDVixRQUFBO0lBQUEsS0FBQSxHQUFRLFFBQUEsQ0FBUyxLQUFULEVBQWdCLEVBQWhCO0lBQ1IsSUFBRyxLQUFBLEdBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFsQjtBQUNFLFdBQVcscUhBQVg7UUFDRSxHQUFBLEdBQU07QUFDTixhQUFTLGtHQUFUO1VBQ0UsR0FBRyxDQUFDLElBQUosQ0FBUyxFQUFUO0FBREY7UUFFQSxJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFuQixDQUF3QixHQUF4QjtBQUpGLE9BREY7S0FBQSxNQU1LLElBQUcsS0FBQSxHQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBbEI7QUFDSCxXQUFXLHdIQUFYO1FBQ0UsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFXLENBQUMsR0FBbkIsQ0FBQTtBQURGLE9BREc7O1dBR0wsSUFBQyxDQUFBLEdBQUQsQ0FBSztNQUFBLElBQUEsRUFBTSxLQUFOO0tBQUw7RUFYVSxDQWRaO0VBMkJBLGNBQUEsRUFBZ0IsU0FBQyxHQUFELEVBQU0sTUFBTixFQUFjLEtBQWQ7V0FBd0IsSUFBQyxDQUFBLEtBQUssQ0FBQyxXQUFZLENBQUEsR0FBQSxDQUFLLENBQUEsTUFBQSxDQUF4QixHQUFrQztFQUExRCxDQTNCaEI7Q0FGZTs7OztBQ0ZqQixJQUFBOztBQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUjs7QUFDUCxNQUFBLEdBQVMsT0FBQSxDQUFRLGVBQVI7O0FBQ1QsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLGdDQUFSOztBQUVwQixNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFBLENBQUssZUFBTCxFQUNmO0VBQUEsS0FBQSxFQUFPLGlCQUFQO0VBRUEsTUFBQSxFQUNFO0lBQUEsdUJBQUEsRUFBeUIsbUJBQXpCO0lBQ0EsNkJBQUEsRUFBK0Isd0JBRC9CO0lBRUEsZ0NBQUEsRUFBa0MsMkJBRmxDO0lBR0EsNkJBQUEsRUFBK0IsU0FBQyxDQUFEO0FBQzdCLFVBQUE7TUFBQSxLQUFBLEdBQVEsQ0FBQSxDQUFFLENBQUMsQ0FBQyxNQUFKO2FBQ1IsaUJBQWlCLENBQUMsY0FBbEIsQ0FBa0MsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFYLENBQWxDLEVBQXNELEtBQUssQ0FBQyxJQUFOLENBQVcsUUFBWCxDQUF0RCxFQUE2RSxLQUFLLENBQUMsR0FBTixDQUFBLENBQTdFO0lBRjZCLENBSC9CO0lBT0EsOEJBQUEsRUFBZ0MsU0FBQyxDQUFEO01BQzlCLElBQUMsQ0FBQSxzQkFBRCxDQUF3QixDQUF4QjtNQUNBLElBQUcsQ0FBQyxDQUFDLE9BQUYsS0FBYSxFQUFoQjtlQUF3QixDQUFDLENBQUMsY0FBRixDQUFBLEVBQXhCOztJQUY4QixDQVBoQztJQVdBLGlDQUFBLEVBQW1DLFNBQUMsQ0FBRDtNQUNqQyxJQUFDLENBQUEseUJBQUQsQ0FBMkIsQ0FBM0I7TUFDQSxJQUFHLENBQUMsQ0FBQyxPQUFGLEtBQWEsRUFBaEI7ZUFBd0IsQ0FBQyxDQUFDLGNBQUYsQ0FBQSxFQUF4Qjs7SUFGaUMsQ0FYbkM7SUFlQSxzQkFBQSxFQUF3QixTQUFDLENBQUQ7YUFBTyxJQUFDLENBQUEsTUFBRCxDQUFBO0lBQVAsQ0FmeEI7R0FIRjtFQW9CQSxzQkFBQSxFQUF3QixTQUFDLENBQUQ7V0FBTyxpQkFBaUIsQ0FBQyxVQUFsQixDQUE2QixDQUFDLENBQUMsTUFBTSxDQUFDLEtBQXRDO0VBQVAsQ0FwQnhCO0VBcUJBLHlCQUFBLEVBQTJCLFNBQUMsQ0FBRDtXQUFPLGlCQUFpQixDQUFDLGFBQWxCLENBQWdDLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBekM7RUFBUCxDQXJCM0I7RUF1QkEsT0FBQSxFQUFTLFNBQUE7V0FDUCxJQUFDLENBQUEsWUFBRCxHQUFnQixNQUFBLENBQVEsQ0FBQSxDQUFFLHNCQUFGLENBQVIsRUFBbUMsbUJBQW5DO0VBRFQsQ0F2QlQ7RUEwQkEsYUFBQSxFQUFlLFNBQUMsS0FBRDtJQUNiLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsd0JBQWQsQ0FBRCxDQUF3QyxDQUFDLEdBQXpDLENBQTZDLEtBQUssQ0FBQyxPQUFuRDtJQUNBLENBQUMsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMscUJBQWQsQ0FBRCxDQUFxQyxDQUFDLEdBQXRDLENBQTBDLEtBQUssQ0FBQyxJQUFoRDtXQUNBLElBQUMsQ0FBQSxXQUFELENBQWEsS0FBYjtFQUhhLENBMUJmO0VBK0JBLGFBQUEsRUFBZSxhQS9CZjtFQWdDQSxVQUFBLEVBQVksYUFoQ1o7RUFrQ0EsV0FBQSxFQUFhLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxZQUFZLENBQUMsTUFBZCxDQUFxQjtNQUFBLElBQUEsRUFBTSxLQUFLLENBQUMsV0FBWjtLQUFyQjtFQUFYLENBbENiO0VBb0NBLGlCQUFBLEVBQW1CLFNBQUMsQ0FBRDtJQUNqQixJQUFDLENBQUEsT0FBRCxDQUFTLG9CQUFULEVBQStCLGlCQUFpQixDQUFDLFFBQWxCLENBQUEsQ0FBL0I7SUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0FBQ0EsV0FBTztFQUhVLENBcENuQjtDQURlOzs7O0FDSmpCLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztBQUVSLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLEtBQUEsQ0FBTSxnQkFBTixFQUVmO0VBQUEsUUFBQSxFQUFVLFNBQUE7V0FBRyxJQUFDLENBQUE7RUFBSixDQUFWO0VBRUEsYUFBQSxFQUFlLFNBQUMsS0FBRDtBQUNiLFFBQUE7SUFBQSxLQUFBLEdBQVEsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsRUFBaEI7SUFDUixJQUFHLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBSyxDQUFDLE9BQWxCO0FBQ0U7QUFBQSxXQUFBLHFDQUFBOztBQUNFLGFBQVMsdUhBQVQ7VUFDRSxHQUFHLENBQUMsSUFBSixDQUFTLEVBQVQ7QUFERjtBQURGLE9BREY7S0FBQSxNQUlLLElBQUcsS0FBQSxHQUFRLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBbEI7QUFDSDtBQUFBLFdBQUEsd0NBQUE7O0FBQ0UsYUFBUyx1SEFBVDtVQUNFLEdBQUcsQ0FBQyxHQUFKLENBQUE7QUFERjtBQURGLE9BREc7O1dBSUwsSUFBQyxDQUFBLEdBQUQsQ0FBSztNQUFBLE9BQUEsRUFBUyxLQUFUO0tBQUw7RUFWYSxDQUZmO0VBY0EsVUFBQSxFQUFZLFNBQUMsS0FBRDtBQUNWLFFBQUE7SUFBQSxLQUFBLEdBQVEsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsRUFBaEI7SUFDUixJQUFHLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQWxCO0FBQ0UsV0FBVyxxSEFBWDtRQUNFLEdBQUEsR0FBTTtBQUNOLGFBQVMsa0dBQVQ7VUFDRSxHQUFHLENBQUMsSUFBSixDQUFTLEVBQVQ7QUFERjtRQUVBLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBVyxDQUFDLElBQW5CLENBQXdCLEdBQXhCO0FBSkYsT0FERjtLQUFBLE1BTUssSUFBRyxLQUFBLEdBQVEsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFsQjtBQUNILFdBQVcsd0hBQVg7UUFDRSxJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVcsQ0FBQyxHQUFuQixDQUFBO0FBREYsT0FERzs7V0FHTCxJQUFDLENBQUEsR0FBRCxDQUFLO01BQUEsSUFBQSxFQUFNLEtBQU47S0FBTDtFQVhVLENBZFo7RUEyQkEsY0FBQSxFQUFnQixTQUFDLEdBQUQsRUFBTSxNQUFOLEVBQWMsS0FBZDtXQUF3QixJQUFDLENBQUEsS0FBSyxDQUFDLFdBQVksQ0FBQSxHQUFBLENBQUssQ0FBQSxNQUFBLENBQXhCLEdBQWtDO0VBQTFELENBM0JoQjtDQUZlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIkFkZE1vZGVsID0gcmVxdWlyZSBcIi4vYWRkTW9kZWwuY29mZmVlXCJcbkFkZFZpZXcgPSByZXF1aXJlIFwiLi9hZGRWaWV3LmNvZmZlZVwiXG4kID0gcmVxdWlyZSBcImpxdWVyeS1wbHVnaW5zLmNvZmZlZVwiXG5cbm1vZGVscyA9XG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvQ29uZmlnc0ltYWdlTW9kZWwuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9Db25maWdzVGFibGVNb2RlbC5jb2ZmZWVcIlxuICBmaWxlOiByZXF1aXJlIFwiZmlsZS9Db25maWdzRmlsZU1vZGVsLmNvZmZlZVwiXG5cbnZpZXdzID1cbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9Db25maWdzSW1hZ2VWaWV3LmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvQ29uZmlnc1RhYmxlVmlldy5jb2ZmZWVcIlxuICBmaWxlOiByZXF1aXJlIFwiZmlsZS9Db25maWdzRmlsZVZpZXcuY29mZmVlXCJcblxuUG9wdXAgPSByZXF1aXJlIFwicG9wdXBcIlxuXG5BZGRWaWV3Lm9uIFwib3Blbi1jb25maWdzLW1vZGFsXCIsIChpbmRleCwgZmllbGQpIC0+XG4gIFBvcHVwLm9wZW4gXCJAY29uZmlncy0je2ZpZWxkLnR5cGV9XCJcbiAgdmlld3NbZmllbGQudHlwZV0uYmluZCAoJCBcIkBjb25maWdzLSN7ZmllbGQudHlwZX1cIilcblxuICBmaWVsZC5zZXR0aW5ncy5pbmRleCA9IGluZGV4XG4gIG1vZGVsc1tmaWVsZC50eXBlXS5iaW5kIGZpZWxkLnNldHRpbmdzXG5cbmZvciB0eXBlLCB2aWV3IG9mIHZpZXdzXG4gIGRvICh0eXBlLCB2aWV3KSAtPlxuICAgIHZpZXcub24gXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgKGZvcm0pIC0+XG4gICAgICBBZGRNb2RlbC5zYXZlRmllbGRDb25maWdzIGZvcm1cbiAgICAgIFBvcHVwLmNsb3NlKClcblxuQWRkTW9kZWwub24gXCJvblNhdmVkU2VjdGlvblwiLCAoYWxpYXMpIC0+XG4gIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvY21zL2NvbmZpZ3MvI3thbGlhc30vXCJcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5Qcm9taXNlID0gcmVxdWlyZSBcInFcIlxuaHR0cEdldCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEdldFxuaHR0cFBvc3QgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBQb3N0XG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJDb25maWdzQWRkTW9kZWxcIixcbiAgaW5pdGlhbFN0YXRlOiAtPlxuICAgIGh0dHBHZXQgXCIje3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX1fX2pzb24vXCJcbiAgICAgIC50aGVuIChyZXNwb25zZSkgLT5cbiAgICAgICAgc3RhdGUgPVxuICAgICAgICAgIHRpdGxlOiByZXNwb25zZS50aXRsZVxuICAgICAgICAgIGFsaWFzOiByZXNwb25zZS5hbGlhc1xuICAgICAgICAgIG1vZHVsZTogcmVzcG9uc2UubW9kdWxlXG4gICAgICAgICAgZmllbGRzOiByZXNwb25zZS5maWVsZHNcbiAgICAgICAgICB0eXBlczogcmVzcG9uc2UudHlwZXNcbiAgICAgICAgaWYgcmVzcG9uc2UuaWRcbiAgICAgICAgICBzdGF0ZS5pZCA9IHJlc3BvbnNlLmlkXG4gICAgICAgIGNvbnNvbGUubG9nIHN0YXRlXG4gICAgICAgIHN0YXRlXG5cbiAgYWRkRmllbGQ6IChmaWVsZCkgLT5cbiAgICBAc2V0IGZpZWxkczogQHN0YXRlLmZpZWxkcy5jb25jYXQgW2ZpZWxkXVxuXG4gIGFkZEVtcHR5RmllbGQ6IC0+XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHMuY29uY2F0IFtcbiAgICAgIHRpdGxlOiBcIlwiXG4gICAgICBhbGlhczogXCJcIlxuICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgIF1cblxuICB1cGRhdGVUaXRsZTogKHZhbHVlKSAtPiBAc3RhdGUudGl0bGUgPSB2YWx1ZVxuICB1cGRhdGVBbGlhczogKHZhbHVlKSAtPiBAc3RhdGUuYWxpYXMgPSB2YWx1ZVxuICB1cGRhdGVNb2R1bGU6ICh2YWx1ZSkgLT4gQHN0YXRlLm1vZHVsZSA9IHZhbHVlXG5cbiAgdXBkYXRlRmllbGRUaXRsZTogKGluZGV4LCB2YWx1ZSkgLT4gQHN0YXRlLmZpZWxkc1tpbmRleF0udGl0bGUgPSB2YWx1ZVxuICB1cGRhdGVGaWVsZEFsaWFzOiAoaW5kZXgsIHZhbHVlKSAtPiBAc3RhdGUuZmllbGRzW2luZGV4XS5hbGlhcyA9IHZhbHVlXG4gIHVwZGF0ZUZpZWxkVHlwZTogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBAc3RhdGUuZmllbGRzW2luZGV4XS50eXBlID0gdmFsdWVcbiAgICBAcmVzZXRTZXR0aW5ncyBpbmRleFxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzXG5cbiAgcmVzZXRTZXR0aW5nczogKGluZGV4KSAtPlxuICAgIHR5cGUgPSBAc3RhdGUuZmllbGRzW2luZGV4XS50eXBlXG4gICAgZm9yIHR5cGVJdGVtIGluIEBzdGF0ZS50eXBlc1xuICAgICAgaWYgdHlwZUl0ZW0uYWxpYXMgPT0gdHlwZVxuICAgICAgICBAc3RhdGUuZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IEBjbG9uZSB0eXBlSXRlbS5kZWZhdWx0U2V0dGluZ3NcblxuICByZW1vdmVGaWVsZDogKGluZGV4KSAtPlxuICAgIEBzdGF0ZS5maWVsZHMuc3BsaWNlIGluZGV4LCAxXG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHNcblxuICBnZXRGaWVsZEJ5SW5kZXg6IChpbmRleCkgLT4gQGNsb25lIEBzdGF0ZS5maWVsZHNbaW5kZXhdXG5cbiAgc2F2ZUZpZWxkQ29uZmlnczogKGZvcm0pIC0+XG4gICAgaW5kZXggPSBmb3JtLmluZGV4XG4gICAgZGVsZXRlIGZvcm0uaW5kZXhcbiAgICBAc3RhdGUuZmllbGRzW2luZGV4XS5zZXR0aW5ncyA9IGZvcm1cblxuICBzYXZlOiAtPlxuICAgIGh0dHBQb3N0IFwiL2Ntcy9jb25maWdzL3NhdmUvX19qc29uL1wiLCBAc3RhdGVcbiAgICAgIC50aGVuIChyZXNwb25zZSkgPT5cbiAgICAgICAgaWYgQHN0YXRlLmlkP1xuICAgICAgICAgIEBzZXQgZmllbGRzOiByZXNwb25zZS5zZWN0aW9uLmZpZWxkc1xuICAgICAgICAgIEBzZXQgaWQ6IHJlc3BvbnNlLnNlY3Rpb24uaWRcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEB0cmlnZ2VyIFwib25TYXZlZFNlY3Rpb25cIiwgQHN0YXRlLmFsaWFzXG4gICAgICAuY2F0Y2ggKHJlc3BvbnNlKSAtPlxuICAgICAgICBjb25zb2xlLmVycm9yIHJlc3BvbnNlLmVycm9yXG4iLCIkID0gcmVxdWlyZSBcImpxdWVyeS1wbHVnaW5zLmNvZmZlZVwiXG5WaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXIuY29mZmVlXCJcblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcbkFkZE1vZGVsID0gcmVxdWlyZSBcIi4vYWRkTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiQ29uZmlnc0FkZFZpZXdcIixcbiAgZGVidWc6IGZhbHNlXG4gIGNvbnRhaW46ICQgXCJAY29uZmlncy1hZGRcIlxuICBtb2RlbDogQWRkTW9kZWxcbiAgZXZlbnRzOlxuICAgIFwiY2xpY2s6IEBidG4tcmVtb3ZlLWZpZWxkXCI6IChlKSAtPiBBZGRNb2RlbC5yZW1vdmVGaWVsZCBAZ2V0Um93SW5kZXggZVxuICAgIFwiY2xpY2s6IEBidG4tYWRkLWZpZWxkXCI6IChlKSAtPiBBZGRNb2RlbC5hZGRFbXB0eUZpZWxkKClcbiAgICBcImNoYW5nZTogQGZpZWxkLXRpdGxlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVGaWVsZFRpdGxlIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC1hbGlhc1wiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlRmllbGRBbGlhcyAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAZmllbGQtdHlwZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlRmllbGRUeXBlIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC10aXRsZVwiOiAoZSkgLT4gQWRkTW9kZWwudXBkYXRlVGl0bGUgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtYWRkLWFsaWFzXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVBbGlhcyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtbW9kdWxlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVNb2R1bGUgZS50YXJnZXQudmFsdWVcbiAgICBcImNsaWNrOiBAYnRuLWNvbmZpZy1maWVsZFwiOiBcImNsaWNrQnRuQ29uZmlnRmllbGRcIlxuICAgIFwic3VibWl0OiBAY29uZmlncy1hZGQtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NBZGRGb3JtXCJcblxuICBpbml0aWFsOiAtPlxuICAgIEB0Ym9keUNvbnRhaW4gPSBSZW5kZXIgKCQgXCJAdGJvZHktbW9kdWxlLWZpZWxkc1wiKSwgXCJzZWN0aW9uc19jb25maWdzX3RhYmxlLW1vZHVsZS1maWVsZHNcIlxuXG4gIHJlbmRlckZpZWxkczogKHN0YXRlKSAtPlxuICAgIEB0Ym9keUNvbnRhaW4ucmVuZGVyIHN0YXRlXG4gICAgJCgnc2VsZWN0Jykuc2VsZWN0ZXIoKVxuXG4gIGdldFJvd0luZGV4OiAoZSkgLT5cbiAgICAkcGFyZW50ID0gKCQgZS50YXJnZXQpLmNsb3Nlc3QgXCJbZGF0YS1rZXldXCJcbiAgICByZXR1cm4gJHBhcmVudC5kYXRhIFwia2V5XCJcblxuICBjbGlja0J0bkNvbmZpZ0ZpZWxkOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcIm9wZW4tY29uZmlncy1tb2RhbFwiLFxuICAgICAgQGdldFJvd0luZGV4IGVcbiAgICAgIEFkZE1vZGVsLmdldEZpZWxkQnlJbmRleCBAZ2V0Um93SW5kZXggZVxuXG4gIHN1Ym1pdENvbmZpZ3NBZGRGb3JtOiAoZSkgLT5cbiAgICBBZGRNb2RlbC5zYXZlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlRmlsZU1vZGVsXCIsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHN0YXRlLnN0b3JhZ2UgPSB2YWx1ZVxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5wYXRoID0gdmFsdWVcbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQWNjZXNzS2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzU2VjcmV0S2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQnVja2V0ID0gdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5zM1BhdGggPSB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlci5jb2ZmZWVcIlxuY29uZmlnc0ZpbGVNb2RlbCA9IHJlcXVpcmUgXCJmaWxlL2NvbmZpZ3NGaWxlTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiVHlwZUZpbGVWaWV3XCIsXG4gIG1vZGVsOiBjb25maWdzRmlsZU1vZGVsXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAY29uZmlnc0ZpbGVQYXRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtcGF0aFwiXG4gICAgQGNvbmZpZ3NGaWxlU291cmNlID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtc291cmNlXCJcbiAgICBAY29uZmlnc0ZpbGVXaWR0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLXdpZHRoXCJcbiAgICBAY29uZmlnc0ZpbGVIZWlnaHQgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1oZWlnaHRcIlxuICAgIEBjb25maWdzRmlsZUluZGV4ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtaW5kZXhcIlxuICAgIEBjb25maWdzRmlsZVN0b3JhZ2UgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1zdG9yYWdlXCJcbiAgICBAY29uZmlnc0ZpbGVTM0FjY2Vzc0tleSA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXlcIlxuICAgIEBjb25maWdzRmlsZVMzU2VjcmV0S2V5ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleVwiXG4gICAgQGNvbmZpZ3NGaWxlUzNCdWNrZXQgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1zMy1idWNrZXRcIlxuICAgIEBjb25maWdzRmlsZVMzUGF0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLXMzLXBhdGhcIlxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zdG9yYWdlXCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtcGF0aFwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtd2lkdGhcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlV2lkdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1oZWlnaHRcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlSGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtc291cmNlXCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVNvdXJjZSBlLnRhcmdldC52YWx1ZVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXlcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlUzNBY2Nlc3NLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zMy1zZWNyZXQta2V5XCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVMzU2VjcmV0S2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtYnVja2V0XCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVMzQnVja2V0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtcGF0aFwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVTM1BhdGggZS50YXJnZXQudmFsdWVcblxuICBpbml0aWFsUmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgKEBjb25maWdzRmlsZVN0b3JhZ2UuZmlsdGVyIFwiW2RhdGEtdmFsdWU9JyN7c3RhdGUuc3RvcmFnZX0nXVwiKS50cmlnZ2VyIFwiY2xpY2tcIlxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLWZyYW1lXCIpLmhpZGUoKVxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLSN7c3RhdGUuc3RvcmFnZX1cIikuc2hvdygpXG4gICAgQGNvbmZpZ3NGaWxlUGF0aC52YWwgc3RhdGUucGF0aFxuICAgIEBjb25maWdzRmlsZVdpZHRoLnZhbCBzdGF0ZS53aWR0aFxuICAgIEBjb25maWdzRmlsZUhlaWdodC52YWwgc3RhdGUuaGVpZ2h0XG4gICAgQGNvbmZpZ3NGaWxlU291cmNlLnZhbCBzdGF0ZS5zb3VyY2VcbiAgICBAY29uZmlnc0ZpbGVTM0FjY2Vzc0tleS52YWwgc3RhdGUuczNBY2Nlc3NLZXlcbiAgICBAY29uZmlnc0ZpbGVTM1NlY3JldEtleS52YWwgXCJcIlxuICAgIEBjb25maWdzRmlsZVMzQnVja2V0LnZhbCBzdGF0ZS5zM0J1Y2tldFxuICAgIEBjb25maWdzRmlsZVMzUGF0aC52YWwgc3RhdGUuczNQYXRoXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIGNvbmZpZ3NGaWxlTW9kZWwuZ2V0U3RhdGUoKVxuICAgIEB1bmJpbmQoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVGaWxlTW9kZWxcIixcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc3RhdGUuc3RvcmFnZSA9IHZhbHVlXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnBhdGggPSB2YWx1ZVxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc3RhdGUuczNBY2Nlc3NLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc3RhdGUuczNTZWNyZXRLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc3RhdGUuczNCdWNrZXQgPSB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzUGF0aCA9IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVJbWFnZU1vZGVsXCIsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHN0YXRlLnN0b3JhZ2UgPSB2YWx1ZVxuXG4gIHVwZGF0ZVBhdGg6IChwYXRoKSAtPiBAc3RhdGUucGF0aCA9IHBhdGhcbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUucGF0aCA9IHZhbHVlXG4gIHVwZGF0ZVdpZHRoOiAodmFsdWUpIC0+IEBzdGF0ZS53aWR0aCA9IHZhbHVlXG4gIHVwZGF0ZUhlaWdodDogKHZhbHVlKSAtPiBAc3RhdGUuaGVpZ2h0ID0gdmFsdWVcbiAgdXBkYXRlU291cmNlOiAodmFsdWUpIC0+IEBzdGF0ZS5zb3VyY2UgPSB2YWx1ZVxuXG4gIHVwZGF0ZVMzQWNjZXNzS2V5OiAodmFsdWUpIC0+IEBzdGF0ZS5zM0FjY2Vzc0tleSA9IHZhbHVlXG4gIHVwZGF0ZVMzU2VjcmV0S2V5OiAodmFsdWUpIC0+IEBzdGF0ZS5zM1NlY3JldEtleSA9IHZhbHVlXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzdGF0ZS5zM0J1Y2tldCA9IHZhbHVlXG4gIHVwZGF0ZVMzUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUuczNQYXRoID0gdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcbmNvbmZpZ3NJbWFnZU1vZGVsID0gcmVxdWlyZSBcImltYWdlL2NvbmZpZ3NJbWFnZU1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlldyBcIlR5cGVJbWFnZVZpZXdcIixcbiAgbW9kZWw6IGNvbmZpZ3NJbWFnZU1vZGVsXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAY29uZmlnc0ltYWdlUGF0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1wYXRoXCJcbiAgICBAY29uZmlnc0ltYWdlU291cmNlID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXNvdXJjZVwiXG4gICAgQGNvbmZpZ3NJbWFnZVdpZHRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXdpZHRoXCJcbiAgICBAY29uZmlnc0ltYWdlSGVpZ2h0ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLWhlaWdodFwiXG4gICAgQGNvbmZpZ3NJbWFnZUluZGV4ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLWluZGV4XCJcbiAgICBAY29uZmlnc0ltYWdlU3RvcmFnZSA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1zdG9yYWdlXCJcbiAgICBAY29uZmlnc0ltYWdlUzNBY2Nlc3NLZXkgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleVwiXG4gICAgQGNvbmZpZ3NJbWFnZVMzU2VjcmV0S2V5ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXlcIlxuICAgIEBjb25maWdzSW1hZ2VTM0J1Y2tldCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1zMy1idWNrZXRcIlxuICAgIEBjb25maWdzSW1hZ2VTM1BhdGggPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtczMtcGF0aFwiXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1wYXRoXCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXdpZHRoXCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1oZWlnaHRcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZUhlaWdodCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zb3VyY2VcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVNvdXJjZSBlLnRhcmdldC52YWx1ZVxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zdG9yYWdlXCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVTdG9yYWdlICgkIGUudGFyZ2V0KS5kYXRhIFwidmFsdWVcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5XCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVTM0FjY2Vzc0tleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5XCI6IChlKSAtPiBjb25maWdzSW1hZ2VNb2RlbC51cGRhdGVTM1NlY3JldEtleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1idWNrZXRcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzQnVja2V0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLXBhdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzUGF0aCBlLnRhcmdldC52YWx1ZVxuXG4gIGluaXRpYWxSZW5kZXI6IChzdGF0ZSkgLT5cbiAgICAoQGNvbmZpZ3NJbWFnZVN0b3JhZ2UuZmlsdGVyIFwiW2RhdGEtdmFsdWU9JyN7c3RhdGUuc3RvcmFnZX0nXVwiKS50cmlnZ2VyIFwiY2xpY2tcIlxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS1mcmFtZVwiKS5oaWRlKClcbiAgICAoQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UtI3tzdGF0ZS5zdG9yYWdlfVwiKS5zaG93KClcbiAgICBAY29uZmlnc0ltYWdlUGF0aC52YWwgc3RhdGUucGF0aFxuICAgIEBjb25maWdzSW1hZ2VXaWR0aC52YWwgc3RhdGUud2lkdGhcbiAgICBAY29uZmlnc0ltYWdlSGVpZ2h0LnZhbCBzdGF0ZS5oZWlnaHRcbiAgICBAY29uZmlnc0ltYWdlU291cmNlLnZhbCBzdGF0ZS5zb3VyY2VcbiAgICBAY29uZmlnc0ltYWdlUzNBY2Nlc3NLZXkudmFsIHN0YXRlLnMzQWNjZXNzS2V5XG4gICAgQGNvbmZpZ3NJbWFnZVMzU2VjcmV0S2V5LnZhbCBcIlwiXG4gICAgQGNvbmZpZ3NJbWFnZVMzQnVja2V0LnZhbCBzdGF0ZS5zM0J1Y2tldFxuICAgIEBjb25maWdzSW1hZ2VTM1BhdGgudmFsIHN0YXRlLnMzUGF0aFxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBjb25maWdzSW1hZ2VNb2RlbC5nZXRTdGF0ZSgpXG4gICAgQHVuYmluZCgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZUltYWdlTW9kZWxcIixcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc3RhdGUuc3RvcmFnZSA9IHZhbHVlXG5cbiAgdXBkYXRlUGF0aDogKHBhdGgpIC0+IEBzdGF0ZS5wYXRoID0gcGF0aFxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5wYXRoID0gdmFsdWVcbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLndpZHRoID0gdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzdGF0ZS5oZWlnaHQgPSB2YWx1ZVxuICB1cGRhdGVTb3VyY2U6ICh2YWx1ZSkgLT4gQHN0YXRlLnNvdXJjZSA9IHZhbHVlXG5cbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQWNjZXNzS2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzU2VjcmV0S2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQnVja2V0ID0gdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5zM1BhdGggPSB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlVGFibGVNb2RlbFwiLFxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVDb2x1bW5zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5jb2x1bW5zXG4gICAgICBmb3Igcm93IGluIEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgICAgICBmb3IgaSBpbiBbQHN0YXRlLmNvbHVtbnMgKyAxLi52YWx1ZV1cbiAgICAgICAgICByb3cucHVzaCBcIlwiXG4gICAgZWxzZSBpZiB2YWx1ZSA8IEBzdGF0ZS5jb2x1bW5zXG4gICAgICBmb3Igcm93IGluIEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUuY29sdW1uc11cbiAgICAgICAgICByb3cucG9wKClcbiAgICBAc2V0IGNvbHVtbnM6IHZhbHVlXG5cbiAgdXBkYXRlUm93czogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgaWYgdmFsdWUgPiBAc3RhdGUucm93c1xuICAgICAgZm9yIHJvdyBpbiBbQHN0YXRlLnJvd3MgKyAxLi52YWx1ZV1cbiAgICAgICAgcm93ID0gW11cbiAgICAgICAgZm9yIGkgaW4gWzEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgIHJvdy5wdXNoIFwiXCJcbiAgICAgICAgQHN0YXRlLmRlZmF1bHREYXRhLnB1c2ggcm93XG4gICAgZWxzZSBpZiB2YWx1ZSA8IEBzdGF0ZS5yb3dzXG4gICAgICBmb3Igcm93IGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5yb3dzXVxuICAgICAgICBAc3RhdGUuZGVmYXVsdERhdGEucG9wKClcbiAgICBAc2V0IHJvd3M6IHZhbHVlXG5cbiAgdXBkYXRlQ2VsbERhdGE6IChyb3csIGNvbHVtbiwgdmFsdWUpIC0+IEBzdGF0ZS5kZWZhdWx0RGF0YVtyb3ddW2NvbHVtbl0gPSB2YWx1ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyLmNvZmZlZVwiXG5jb25maWdzVGFibGVNb2RlbCA9IHJlcXVpcmUgXCJ0YWJsZS9jb25maWdzVGFibGVNb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJUeXBlVGFibGVWaWV3XCIsXG4gIG1vZGVsOiBjb25maWdzVGFibGVNb2RlbFxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtdGFibGUtcm93c1wiOiBcImNoYW5nZUNvbmZpZ3NUYWJsZVJvd3NcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy10YWJsZS1jb2x1bW5zXCI6IFwiY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1uc1wiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXRhYmxlLWNlbGxcIjogKGUpIC0+XG4gICAgICAkY2VsbCA9ICQgZS50YXJnZXRcbiAgICAgIGNvbmZpZ3NUYWJsZU1vZGVsLnVwZGF0ZUNlbGxEYXRhICgkY2VsbC5kYXRhIFwicm93XCIpLCAoJGNlbGwuZGF0YSBcImNvbHVtblwiKSwgKCRjZWxsLnZhbCgpKVxuXG4gICAgXCJrZXlkb3duOiBAY29uZmlncy10YWJsZS1yb3dzXCI6IChlKSAtPlxuICAgICAgQGNoYW5nZUNvbmZpZ3NUYWJsZVJvd3MgZVxuICAgICAgaWYgZS5rZXlDb2RlID09IDEzIHRoZW4gZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBcImtleWRvd246IEBjb25maWdzLXRhYmxlLWNvbHVtbnNcIjogKGUpIC0+XG4gICAgICBAY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1ucyBlXG4gICAgICBpZiBlLmtleUNvZGUgPT0gMTMgdGhlbiBlLnByZXZlbnREZWZhdWx0KClcblxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuXG4gIGNoYW5nZUNvbmZpZ3NUYWJsZVJvd3M6IChlKSAtPiBjb25maWdzVGFibGVNb2RlbC51cGRhdGVSb3dzIGUudGFyZ2V0LnZhbHVlXG4gIGNoYW5nZUNvbmZpZ3NUYWJsZUNvbHVtbnM6IChlKSAtPiBjb25maWdzVGFibGVNb2RlbC51cGRhdGVDb2x1bW5zIGUudGFyZ2V0LnZhbHVlXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAdGJvZHlDb250YWluID0gUmVuZGVyICgkIFwiQGNvbmZpZ3MtdGFibGUtdGJvZHlcIiksIFwidHlwZXNfdGFibGVfdGJvZHlcIlxuXG4gIGluaXRpYWxSZW5kZXI6IChzdGF0ZSkgLT5cbiAgICAoQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLXRhYmxlLWNvbHVtbnNcIikudmFsIHN0YXRlLmNvbHVtbnNcbiAgICAoQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLXRhYmxlLXJvd3NcIikudmFsIHN0YXRlLnJvd3NcbiAgICBAcmVuZGVyVGFibGUgc3RhdGVcblxuICByZW5kZXJDb2x1bW5zOiBcInJlbmRlclRhYmxlXCJcbiAgcmVuZGVyUm93czogXCJyZW5kZXJUYWJsZVwiXG5cbiAgcmVuZGVyVGFibGU6IChzdGF0ZSkgLT4gQHRib2R5Q29udGFpbi5yZW5kZXIgZGF0YTogc3RhdGUuZGVmYXVsdERhdGFcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgY29uZmlnc1RhYmxlTW9kZWwuZ2V0U3RhdGUoKVxuICAgIEB1bmJpbmQoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVUYWJsZU1vZGVsXCIsXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZUNvbHVtbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmIHZhbHVlID4gQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFtAc3RhdGUuY29sdW1ucyArIDEuLnZhbHVlXVxuICAgICAgICAgIHJvdy5wdXNoIFwiXCJcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLmNvbHVtbnNcbiAgICAgIGZvciByb3cgaW4gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgIHJvdy5wb3AoKVxuICAgIEBzZXQgY29sdW1uczogdmFsdWVcblxuICB1cGRhdGVSb3dzOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5yb3dzXG4gICAgICBmb3Igcm93IGluIFtAc3RhdGUucm93cyArIDEuLnZhbHVlXVxuICAgICAgICByb3cgPSBbXVxuICAgICAgICBmb3IgaSBpbiBbMS4uQHN0YXRlLmNvbHVtbnNdXG4gICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgICAgICBAc3RhdGUuZGVmYXVsdERhdGEucHVzaCByb3dcbiAgICBlbHNlIGlmIHZhbHVlIDwgQHN0YXRlLnJvd3NcbiAgICAgIGZvciByb3cgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLnJvd3NdXG4gICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wb3AoKVxuICAgIEBzZXQgcm93czogdmFsdWVcblxuICB1cGRhdGVDZWxsRGF0YTogKHJvdywgY29sdW1uLCB2YWx1ZSkgLT4gQHN0YXRlLmRlZmF1bHREYXRhW3Jvd11bY29sdW1uXSA9IHZhbHVlXG4iXX0=
