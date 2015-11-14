(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, Popup, fn, models, type, view, views;

AddModel = require("./addModel.coffee");

AddView = require("./addView.coffee");

$ = require("jquery-plugins.coffee");

models = {
  image: require("image/ConfigsImageModel.coffee"),
  table: require("table/ConfigsTableModel.coffee"),
  file: require("file/ConfigsFileModel.coffee"),
  radio: require("radio/ConfigsRadioModel.coffee")
};

views = {
  image: require("image/ConfigsImageView.coffee"),
  table: require("table/ConfigsTableView.coffee"),
  file: require("file/ConfigsFileView.coffee"),
  radio: require("radio/ConfigsRadioView.coffee")
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


},{"./addModel.coffee":2,"./addView.coffee":3,"file/ConfigsFileModel.coffee":4,"file/ConfigsFileView.coffee":5,"image/ConfigsImageModel.coffee":7,"image/ConfigsImageView.coffee":8,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","radio/ConfigsRadioModel.coffee":10,"radio/ConfigsRadioView.coffee":11,"table/ConfigsTableModel.coffee":13,"table/ConfigsTableView.coffee":14}],2:[function(require,module,exports){
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

module.exports = Model("TypeRadioModel", {
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, i, j, k, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    defaultData = this.state.defaultData;
    if (value > this.state.numOptions) {
      for (i = j = ref = this.state.numOptions + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push("");
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = this.state.numOptions; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
      if (this.state.defaultValue >= value) {
        this.set({
          defaultValue: -1
        });
      }
    }
    this.state.numOptions = value;
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultValue: function(value) {
    return this.state.defaultValue = parseInt(value, 10);
  },
  updateDefaultDataOption: function(index, value) {
    return this.state.defaultData[index] = value;
  }
});


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
var Render, View, configsRadioModel;

View = require("view.coffee");

Render = require("render.coffee");

configsRadioModel = require("radio/configsRadioModel.coffee");

module.exports = View("TypeRadioView", {
  model: configsRadioModel,
  initial: function() {
    this.optionsContain = Render($("@configs-radio-options-contain"), "types_radio_options");
    return this.configsRadioNumOptions = this.contain.find("@configs-radio-num-options");
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "popup-close: contain": function(e) {
      return this.unbind();
    },
    "change: @configs-radio-num-options": function(e) {
      return configsRadioModel.updateNumOptions(e.target.value);
    },
    "change: @configs-radio-option": function(e) {
      return configsRadioModel.updateDefaultValue(e.target.value);
    },
    "change: @configs-radio-option-label": function(e) {
      return configsRadioModel.updateDefaultDataOption(this.getIndexByEvent(e), e.target.value);
    }
  },
  getIndexByEvent: function(e) {
    var $item;
    $item = $(e.target);
    return $item.data("index");
  },
  initialRender: function(state) {
    this.configsRadioNumOptions.val(state.numOptions);
    this.renderDefaultValue(state);
    return this.renderDefaultData(state);
  },
  renderDefaultData: function(state) {
    return this.optionsContain.render({
      options: state.defaultData,
      currentValue: state.defaultValue
    });
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", configsRadioModel.getState());
    this.unbind();
    return false;
  },
  renderDefaultValue: function(state) {
    return this.contain.find("@configs-radio-option").filter("[value=" + state.defaultValue + "]").prop("checked", true);
  }
});


},{"radio/configsRadioModel.coffee":12,"render.coffee":"render.coffee","view.coffee":"view.coffee"}],12:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model("TypeRadioModel", {
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, i, j, k, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    defaultData = this.state.defaultData;
    if (value > this.state.numOptions) {
      for (i = j = ref = this.state.numOptions + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push("");
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = this.state.numOptions; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
      if (this.state.defaultValue >= value) {
        this.set({
          defaultValue: -1
        });
      }
    }
    this.state.numOptions = value;
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultValue: function(value) {
    return this.state.defaultValue = parseInt(value, 10);
  },
  updateDefaultDataOption: function(index, value) {
    return this.state.defaultData[index] = value;
  }
});


},{"model.coffee":"model.coffee"}],13:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],14:[function(require,module,exports){
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


},{"render.coffee":"render.coffee","table/configsTableModel.coffee":15,"view.coffee":"view.coffee"}],15:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvc2VjdGlvbnMvY29uZmlncy9hZGRNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ZpbGUvQ29uZmlnc0ZpbGVNb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL2ZpbGUvQ29uZmlnc0ZpbGVWaWV3LmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvZmlsZS9jb25maWdzRmlsZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9pbWFnZS9Db25maWdzSW1hZ2VWaWV3LmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvY29uZmlnc0ltYWdlTW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9yYWRpby9Db25maWdzUmFkaW9Nb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL3JhZGlvL0NvbmZpZ3NSYWRpb1ZpZXcuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS90eXBlcy9yYWRpby9jb25maWdzUmFkaW9Nb2RlbC5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZU1vZGVsLmNvZmZlZSIsIi9Vc2Vycy9tYWtpbmdvZmYvUHJvamVjdHMvc2FyYW5za3RvZGF5LW5ldy9zZi1lbmdpbmUvbW9kdWxlcy9HVUkvdHlwZXMvdGFibGUvQ29uZmlnc1RhYmxlVmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL2NvbmZpZ3NUYWJsZU1vZGVsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUE7O0FBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUjs7QUFDWCxPQUFBLEdBQVUsT0FBQSxDQUFRLGtCQUFSOztBQUNWLENBQUEsR0FBSSxPQUFBLENBQVEsdUJBQVI7O0FBRUosTUFBQSxHQUNFO0VBQUEsS0FBQSxFQUFPLE9BQUEsQ0FBUSxnQ0FB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Q0FBd0IsR0FBeEI7QUFKRixPQURGO0tBQUEsTUFNSyxJQUFHLEtBQUEsR0FBUSxJQUFDLENBQUEsS0FBSyxDQUFDLElBQWxCO0FBQ0gsV0FBVyx3SEFBWDtRQUNFLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQW5CLENBQUE7QUFERixPQURHOztXQUdMLElBQUMsQ0FBQSxHQUFELENBQUs7TUFBQSxJQUFBLEVBQU0sS0FBTjtLQUFMO0VBWFUsQ0FkWjtFQTJCQSxjQUFBLEVBQWdCLFNBQUMsR0FBRCxFQUFNLE1BQU4sRUFBYyxLQUFkO1dBQXdCLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBWSxDQUFBLEdBQUEsQ0FBSyxDQUFBLE1BQUEsQ0FBeEIsR0FBa0M7RUFBMUQsQ0EzQmhCO0NBRmUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiQWRkTW9kZWwgPSByZXF1aXJlIFwiLi9hZGRNb2RlbC5jb2ZmZWVcIlxuQWRkVmlldyA9IHJlcXVpcmUgXCIuL2FkZFZpZXcuY29mZmVlXCJcbiQgPSByZXF1aXJlIFwianF1ZXJ5LXBsdWdpbnMuY29mZmVlXCJcblxubW9kZWxzID1cbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9Db25maWdzSW1hZ2VNb2RlbC5jb2ZmZWVcIlxuICB0YWJsZTogcmVxdWlyZSBcInRhYmxlL0NvbmZpZ3NUYWJsZU1vZGVsLmNvZmZlZVwiXG4gIGZpbGU6IHJlcXVpcmUgXCJmaWxlL0NvbmZpZ3NGaWxlTW9kZWwuY29mZmVlXCJcbiAgcmFkaW86IHJlcXVpcmUgXCJyYWRpby9Db25maWdzUmFkaW9Nb2RlbC5jb2ZmZWVcIlxuXG52aWV3cyA9XG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWVcIlxuICB0YWJsZTogcmVxdWlyZSBcInRhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlXCJcbiAgZmlsZTogcmVxdWlyZSBcImZpbGUvQ29uZmlnc0ZpbGVWaWV3LmNvZmZlZVwiXG4gIHJhZGlvOiByZXF1aXJlIFwicmFkaW8vQ29uZmlnc1JhZGlvVmlldy5jb2ZmZWVcIlxuXG5Qb3B1cCA9IHJlcXVpcmUgXCJwb3B1cFwiXG5cbkFkZFZpZXcub24gXCJvcGVuLWNvbmZpZ3MtbW9kYWxcIiwgKGluZGV4LCBmaWVsZCkgLT5cbiAgUG9wdXAub3BlbiBcIkBjb25maWdzLSN7ZmllbGQudHlwZX1cIlxuICB2aWV3c1tmaWVsZC50eXBlXS5iaW5kICgkIFwiQGNvbmZpZ3MtI3tmaWVsZC50eXBlfVwiKVxuXG4gIGZpZWxkLnNldHRpbmdzLmluZGV4ID0gaW5kZXhcbiAgbW9kZWxzW2ZpZWxkLnR5cGVdLmJpbmQgZmllbGQuc2V0dGluZ3NcblxuZm9yIHR5cGUsIHZpZXcgb2Ygdmlld3NcbiAgZG8gKHR5cGUsIHZpZXcpIC0+XG4gICAgdmlldy5vbiBcInNhdmUtY29uZmlncy1tb2RhbFwiLCAoZm9ybSkgLT5cbiAgICAgIEFkZE1vZGVsLnNhdmVGaWVsZENvbmZpZ3MgZm9ybVxuICAgICAgUG9wdXAuY2xvc2UoKVxuXG5BZGRNb2RlbC5vbiBcIm9uU2F2ZWRTZWN0aW9uXCIsIChhbGlhcykgLT5cbiAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9jbXMvY29uZmlncy8je2FsaWFzfS9cIlxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblByb21pc2UgPSByZXF1aXJlIFwicVwiXG5odHRwR2V0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwR2V0XG5odHRwUG9zdCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cFBvc3RcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIkNvbmZpZ3NBZGRNb2RlbFwiLFxuICBpbml0aWFsU3RhdGU6IC0+XG4gICAgaHR0cEdldCBcIiN7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfV9fanNvbi9cIlxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSAtPlxuICAgICAgICBzdGF0ZSA9XG4gICAgICAgICAgdGl0bGU6IHJlc3BvbnNlLnRpdGxlXG4gICAgICAgICAgYWxpYXM6IHJlc3BvbnNlLmFsaWFzXG4gICAgICAgICAgbW9kdWxlOiByZXNwb25zZS5tb2R1bGVcbiAgICAgICAgICBmaWVsZHM6IHJlc3BvbnNlLmZpZWxkc1xuICAgICAgICAgIHR5cGVzOiByZXNwb25zZS50eXBlc1xuICAgICAgICBpZiByZXNwb25zZS5pZFxuICAgICAgICAgIHN0YXRlLmlkID0gcmVzcG9uc2UuaWRcbiAgICAgICAgY29uc29sZS5sb2cgc3RhdGVcbiAgICAgICAgc3RhdGVcblxuICBhZGRGaWVsZDogKGZpZWxkKSAtPlxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzLmNvbmNhdCBbZmllbGRdXG5cbiAgYWRkRW1wdHlGaWVsZDogLT5cbiAgICBAc2V0IGZpZWxkczogQHN0YXRlLmZpZWxkcy5jb25jYXQgW1xuICAgICAgdGl0bGU6IFwiXCJcbiAgICAgIGFsaWFzOiBcIlwiXG4gICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgXVxuXG4gIHVwZGF0ZVRpdGxlOiAodmFsdWUpIC0+IEBzdGF0ZS50aXRsZSA9IHZhbHVlXG4gIHVwZGF0ZUFsaWFzOiAodmFsdWUpIC0+IEBzdGF0ZS5hbGlhcyA9IHZhbHVlXG4gIHVwZGF0ZU1vZHVsZTogKHZhbHVlKSAtPiBAc3RhdGUubW9kdWxlID0gdmFsdWVcblxuICB1cGRhdGVGaWVsZFRpdGxlOiAoaW5kZXgsIHZhbHVlKSAtPiBAc3RhdGUuZmllbGRzW2luZGV4XS50aXRsZSA9IHZhbHVlXG4gIHVwZGF0ZUZpZWxkQWxpYXM6IChpbmRleCwgdmFsdWUpIC0+IEBzdGF0ZS5maWVsZHNbaW5kZXhdLmFsaWFzID0gdmFsdWVcbiAgdXBkYXRlRmllbGRUeXBlOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIEBzdGF0ZS5maWVsZHNbaW5kZXhdLnR5cGUgPSB2YWx1ZVxuICAgIEByZXNldFNldHRpbmdzIGluZGV4XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHNcblxuICByZXNldFNldHRpbmdzOiAoaW5kZXgpIC0+XG4gICAgdHlwZSA9IEBzdGF0ZS5maWVsZHNbaW5kZXhdLnR5cGVcbiAgICBmb3IgdHlwZUl0ZW0gaW4gQHN0YXRlLnR5cGVzXG4gICAgICBpZiB0eXBlSXRlbS5hbGlhcyA9PSB0eXBlXG4gICAgICAgIEBzdGF0ZS5maWVsZHNbaW5kZXhdLnNldHRpbmdzID0gQGNsb25lIHR5cGVJdGVtLmRlZmF1bHRTZXR0aW5nc1xuXG4gIHJlbW92ZUZpZWxkOiAoaW5kZXgpIC0+XG4gICAgQHN0YXRlLmZpZWxkcy5zcGxpY2UgaW5kZXgsIDFcbiAgICBAc2V0IGZpZWxkczogQHN0YXRlLmZpZWxkc1xuXG4gIGdldEZpZWxkQnlJbmRleDogKGluZGV4KSAtPiBAY2xvbmUgQHN0YXRlLmZpZWxkc1tpbmRleF1cblxuICBzYXZlRmllbGRDb25maWdzOiAoZm9ybSkgLT5cbiAgICBpbmRleCA9IGZvcm0uaW5kZXhcbiAgICBkZWxldGUgZm9ybS5pbmRleFxuICAgIEBzdGF0ZS5maWVsZHNbaW5kZXhdLnNldHRpbmdzID0gZm9ybVxuXG4gIHNhdmU6IC0+XG4gICAgaHR0cFBvc3QgXCIvY21zL2NvbmZpZ3Mvc2F2ZS9fX2pzb24vXCIsIEBzdGF0ZVxuICAgICAgLnRoZW4gKHJlc3BvbnNlKSA9PlxuICAgICAgICBpZiBAc3RhdGUuaWQ/XG4gICAgICAgICAgQHNldCBmaWVsZHM6IHJlc3BvbnNlLnNlY3Rpb24uZmllbGRzXG4gICAgICAgICAgQHNldCBpZDogcmVzcG9uc2Uuc2VjdGlvbi5pZFxuICAgICAgICBlbHNlXG4gICAgICAgICAgQHRyaWdnZXIgXCJvblNhdmVkU2VjdGlvblwiLCBAc3RhdGUuYWxpYXNcbiAgICAgIC5jYXRjaCAocmVzcG9uc2UpIC0+XG4gICAgICAgIGNvbnNvbGUuZXJyb3IgcmVzcG9uc2UuZXJyb3JcbiIsIiQgPSByZXF1aXJlIFwianF1ZXJ5LXBsdWdpbnMuY29mZmVlXCJcblZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlci5jb2ZmZWVcIlxuUG9wdXAgPSByZXF1aXJlIFwicG9wdXBcIlxuQWRkTW9kZWwgPSByZXF1aXJlIFwiLi9hZGRNb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJDb25maWdzQWRkVmlld1wiLFxuICBkZWJ1ZzogZmFsc2VcbiAgY29udGFpbjogJCBcIkBjb25maWdzLWFkZFwiXG4gIG1vZGVsOiBBZGRNb2RlbFxuICBldmVudHM6XG4gICAgXCJjbGljazogQGJ0bi1yZW1vdmUtZmllbGRcIjogKGUpIC0+IEFkZE1vZGVsLnJlbW92ZUZpZWxkIEBnZXRSb3dJbmRleCBlXG4gICAgXCJjbGljazogQGJ0bi1hZGQtZmllbGRcIjogKGUpIC0+IEFkZE1vZGVsLmFkZEVtcHR5RmllbGQoKVxuICAgIFwiY2hhbmdlOiBAZmllbGQtdGl0bGVcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZUZpZWxkVGl0bGUgKEBnZXRSb3dJbmRleCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGZpZWxkLWFsaWFzXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVGaWVsZEFsaWFzIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC10eXBlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVGaWVsZFR5cGUgKEBnZXRSb3dJbmRleCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtYWRkLXRpdGxlXCI6IChlKSAtPiBBZGRNb2RlbC51cGRhdGVUaXRsZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1hZGQtYWxpYXNcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZUFsaWFzIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC1tb2R1bGVcIjogKGUpIC0+IEFkZE1vZGVsLnVwZGF0ZU1vZHVsZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2xpY2s6IEBidG4tY29uZmlnLWZpZWxkXCI6IFwiY2xpY2tCdG5Db25maWdGaWVsZFwiXG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWFkZC1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0FkZEZvcm1cIlxuXG4gIGluaXRpYWw6IC0+XG4gICAgQHRib2R5Q29udGFpbiA9IFJlbmRlciAoJCBcIkB0Ym9keS1tb2R1bGUtZmllbGRzXCIpLCBcInNlY3Rpb25zX2NvbmZpZ3NfdGFibGUtbW9kdWxlLWZpZWxkc1wiXG5cbiAgcmVuZGVyRmllbGRzOiAoc3RhdGUpIC0+XG4gICAgQHRib2R5Q29udGFpbi5yZW5kZXIgc3RhdGVcbiAgICAkKCdzZWxlY3QnKS5zZWxlY3RlcigpXG5cbiAgZ2V0Um93SW5kZXg6IChlKSAtPlxuICAgICRwYXJlbnQgPSAoJCBlLnRhcmdldCkuY2xvc2VzdCBcIltkYXRhLWtleV1cIlxuICAgIHJldHVybiAkcGFyZW50LmRhdGEgXCJrZXlcIlxuXG4gIGNsaWNrQnRuQ29uZmlnRmllbGQ6IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwib3Blbi1jb25maWdzLW1vZGFsXCIsXG4gICAgICBAZ2V0Um93SW5kZXggZVxuICAgICAgQWRkTW9kZWwuZ2V0RmllbGRCeUluZGV4IEBnZXRSb3dJbmRleCBlXG5cbiAgc3VibWl0Q29uZmlnc0FkZEZvcm06IChlKSAtPlxuICAgIEFkZE1vZGVsLnNhdmUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVGaWxlTW9kZWxcIixcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc3RhdGUuc3RvcmFnZSA9IHZhbHVlXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnBhdGggPSB2YWx1ZVxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc3RhdGUuczNBY2Nlc3NLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc3RhdGUuczNTZWNyZXRLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc3RhdGUuczNCdWNrZXQgPSB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzUGF0aCA9IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyLmNvZmZlZVwiXG5jb25maWdzRmlsZU1vZGVsID0gcmVxdWlyZSBcImZpbGUvY29uZmlnc0ZpbGVNb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJUeXBlRmlsZVZpZXdcIixcbiAgbW9kZWw6IGNvbmZpZ3NGaWxlTW9kZWxcblxuICBpbml0aWFsOiAtPlxuICAgIEBjb25maWdzRmlsZVBhdGggPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1wYXRoXCJcbiAgICBAY29uZmlnc0ZpbGVTb3VyY2UgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1zb3VyY2VcIlxuICAgIEBjb25maWdzRmlsZVdpZHRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtd2lkdGhcIlxuICAgIEBjb25maWdzRmlsZUhlaWdodCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLWhlaWdodFwiXG4gICAgQGNvbmZpZ3NGaWxlSW5kZXggPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1pbmRleFwiXG4gICAgQGNvbmZpZ3NGaWxlU3RvcmFnZSA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLXN0b3JhZ2VcIlxuICAgIEBjb25maWdzRmlsZVMzQWNjZXNzS2V5ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleVwiXG4gICAgQGNvbmZpZ3NGaWxlUzNTZWNyZXRLZXkgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtZmlsZS1zMy1zZWNyZXQta2V5XCJcbiAgICBAY29uZmlnc0ZpbGVTM0J1Y2tldCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLXMzLWJ1Y2tldFwiXG4gICAgQGNvbmZpZ3NGaWxlUzNQYXRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWZpbGUtczMtcGF0aFwiXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXN0b3JhZ2VcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlU3RvcmFnZSAoJCBlLnRhcmdldCkuZGF0YSBcInZhbHVlXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1wYXRoXCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS13aWR0aFwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLWhlaWdodFwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zb3VyY2VcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQHVuYmluZCgpXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleVwiOiAoZSkgLT4gY29uZmlnc0ZpbGVNb2RlbC51cGRhdGVTM0FjY2Vzc0tleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1maWxlLXMzLXNlY3JldC1rZXlcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlUzNTZWNyZXRLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zMy1idWNrZXRcIjogKGUpIC0+IGNvbmZpZ3NGaWxlTW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zMy1wYXRoXCI6IChlKSAtPiBjb25maWdzRmlsZU1vZGVsLnVwZGF0ZVMzUGF0aCBlLnRhcmdldC52YWx1ZVxuXG4gIGluaXRpYWxSZW5kZXI6IChzdGF0ZSkgLT5cbiAgICAoQGNvbmZpZ3NGaWxlU3RvcmFnZS5maWx0ZXIgXCJbZGF0YS12YWx1ZT0nI3tzdGF0ZS5zdG9yYWdlfSddXCIpLnRyaWdnZXIgXCJjbGlja1wiXG4gICAgKEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtZnJhbWVcIikuaGlkZSgpXG4gICAgKEBjb250YWluLmZpbmQgXCJAY29uZmlncy1maWxlLW1vZGFsLXN0b3JhZ2UtI3tzdGF0ZS5zdG9yYWdlfVwiKS5zaG93KClcbiAgICBAY29uZmlnc0ZpbGVQYXRoLnZhbCBzdGF0ZS5wYXRoXG4gICAgQGNvbmZpZ3NGaWxlV2lkdGgudmFsIHN0YXRlLndpZHRoXG4gICAgQGNvbmZpZ3NGaWxlSGVpZ2h0LnZhbCBzdGF0ZS5oZWlnaHRcbiAgICBAY29uZmlnc0ZpbGVTb3VyY2UudmFsIHN0YXRlLnNvdXJjZVxuICAgIEBjb25maWdzRmlsZVMzQWNjZXNzS2V5LnZhbCBzdGF0ZS5zM0FjY2Vzc0tleVxuICAgIEBjb25maWdzRmlsZVMzU2VjcmV0S2V5LnZhbCBcIlwiXG4gICAgQGNvbmZpZ3NGaWxlUzNCdWNrZXQudmFsIHN0YXRlLnMzQnVja2V0XG4gICAgQGNvbmZpZ3NGaWxlUzNQYXRoLnZhbCBzdGF0ZS5zM1BhdGhcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgY29uZmlnc0ZpbGVNb2RlbC5nZXRTdGF0ZSgpXG4gICAgQHVuYmluZCgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZUZpbGVNb2RlbFwiLFxuICB1cGRhdGVTdG9yYWdlOiAodmFsdWUpIC0+IEBzdGF0ZS5zdG9yYWdlID0gdmFsdWVcbiAgdXBkYXRlUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUucGF0aCA9IHZhbHVlXG4gIHVwZGF0ZVMzQWNjZXNzS2V5OiAodmFsdWUpIC0+IEBzdGF0ZS5zM0FjY2Vzc0tleSA9IHZhbHVlXG4gIHVwZGF0ZVMzU2VjcmV0S2V5OiAodmFsdWUpIC0+IEBzdGF0ZS5zM1NlY3JldEtleSA9IHZhbHVlXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzdGF0ZS5zM0J1Y2tldCA9IHZhbHVlXG4gIHVwZGF0ZVMzUGF0aDogKHZhbHVlKSAtPiBAc3RhdGUuczNQYXRoID0gdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZUltYWdlTW9kZWxcIixcbiAgdXBkYXRlU3RvcmFnZTogKHZhbHVlKSAtPiBAc3RhdGUuc3RvcmFnZSA9IHZhbHVlXG5cbiAgdXBkYXRlUGF0aDogKHBhdGgpIC0+IEBzdGF0ZS5wYXRoID0gcGF0aFxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5wYXRoID0gdmFsdWVcbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLndpZHRoID0gdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzdGF0ZS5oZWlnaHQgPSB2YWx1ZVxuICB1cGRhdGVTb3VyY2U6ICh2YWx1ZSkgLT4gQHN0YXRlLnNvdXJjZSA9IHZhbHVlXG5cbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQWNjZXNzS2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzU2VjcmV0S2V5ID0gdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzQnVja2V0ID0gdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzdGF0ZS5zM1BhdGggPSB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuY29uZmlnc0ltYWdlTW9kZWwgPSByZXF1aXJlIFwiaW1hZ2UvY29uZmlnc0ltYWdlTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiVHlwZUltYWdlVmlld1wiLFxuICBtb2RlbDogY29uZmlnc0ltYWdlTW9kZWxcblxuICBpbml0aWFsOiAtPlxuICAgIEBjb25maWdzSW1hZ2VQYXRoID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXBhdGhcIlxuICAgIEBjb25maWdzSW1hZ2VTb3VyY2UgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2Utc291cmNlXCJcbiAgICBAY29uZmlnc0ltYWdlV2lkdGggPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2Utd2lkdGhcIlxuICAgIEBjb25maWdzSW1hZ2VIZWlnaHQgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtaGVpZ2h0XCJcbiAgICBAY29uZmlnc0ltYWdlSW5kZXggPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtaW5kZXhcIlxuICAgIEBjb25maWdzSW1hZ2VTdG9yYWdlID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXN0b3JhZ2VcIlxuICAgIEBjb25maWdzSW1hZ2VTM0FjY2Vzc0tleSA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5XCJcbiAgICBAY29uZmlnc0ltYWdlUzNTZWNyZXRLZXkgPSBAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtczMtc2VjcmV0LWtleVwiXG4gICAgQGNvbmZpZ3NJbWFnZVMzQnVja2V0ID0gQGNvbnRhaW4uZmluZCBcIkBjb25maWdzLWltYWdlLXMzLWJ1Y2tldFwiXG4gICAgQGNvbmZpZ3NJbWFnZVMzUGF0aCA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1zMy1wYXRoXCJcblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXBhdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utd2lkdGhcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVdpZHRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLWhlaWdodFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlSGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXNvdXJjZVwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQHVuYmluZCgpXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXN0b3JhZ2VcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLWFjY2Vzcy1rZXlcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzQWNjZXNzS2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXlcIjogKGUpIC0+IGNvbmZpZ3NJbWFnZU1vZGVsLnVwZGF0ZVMzU2VjcmV0S2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLWJ1Y2tldFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtczMtcGF0aFwiOiAoZSkgLT4gY29uZmlnc0ltYWdlTW9kZWwudXBkYXRlUzNQYXRoIGUudGFyZ2V0LnZhbHVlXG5cbiAgaW5pdGlhbFJlbmRlcjogKHN0YXRlKSAtPlxuICAgIChAY29uZmlnc0ltYWdlU3RvcmFnZS5maWx0ZXIgXCJbZGF0YS12YWx1ZT0nI3tzdGF0ZS5zdG9yYWdlfSddXCIpLnRyaWdnZXIgXCJjbGlja1wiXG4gICAgKEBjb250YWluLmZpbmQgXCJAY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWZyYW1lXCIpLmhpZGUoKVxuICAgIChAY29udGFpbi5maW5kIFwiQGNvbmZpZ3MtaW1hZ2UtbW9kYWwtc3RvcmFnZS0je3N0YXRlLnN0b3JhZ2V9XCIpLnNob3coKVxuICAgIEBjb25maWdzSW1hZ2VQYXRoLnZhbCBzdGF0ZS5wYXRoXG4gICAgQGNvbmZpZ3NJbWFnZVdpZHRoLnZhbCBzdGF0ZS53aWR0aFxuICAgIEBjb25maWdzSW1hZ2VIZWlnaHQudmFsIHN0YXRlLmhlaWdodFxuICAgIEBjb25maWdzSW1hZ2VTb3VyY2UudmFsIHN0YXRlLnNvdXJjZVxuICAgIEBjb25maWdzSW1hZ2VTM0FjY2Vzc0tleS52YWwgc3RhdGUuczNBY2Nlc3NLZXlcbiAgICBAY29uZmlnc0ltYWdlUzNTZWNyZXRLZXkudmFsIFwiXCJcbiAgICBAY29uZmlnc0ltYWdlUzNCdWNrZXQudmFsIHN0YXRlLnMzQnVja2V0XG4gICAgQGNvbmZpZ3NJbWFnZVMzUGF0aC52YWwgc3RhdGUuczNQYXRoXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIGNvbmZpZ3NJbWFnZU1vZGVsLmdldFN0YXRlKClcbiAgICBAdW5iaW5kKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlSW1hZ2VNb2RlbFwiLFxuICB1cGRhdGVTdG9yYWdlOiAodmFsdWUpIC0+IEBzdGF0ZS5zdG9yYWdlID0gdmFsdWVcblxuICB1cGRhdGVQYXRoOiAocGF0aCkgLT4gQHN0YXRlLnBhdGggPSBwYXRoXG4gIHVwZGF0ZVBhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnBhdGggPSB2YWx1ZVxuICB1cGRhdGVXaWR0aDogKHZhbHVlKSAtPiBAc3RhdGUud2lkdGggPSB2YWx1ZVxuICB1cGRhdGVIZWlnaHQ6ICh2YWx1ZSkgLT4gQHN0YXRlLmhlaWdodCA9IHZhbHVlXG4gIHVwZGF0ZVNvdXJjZTogKHZhbHVlKSAtPiBAc3RhdGUuc291cmNlID0gdmFsdWVcblxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc3RhdGUuczNBY2Nlc3NLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc3RhdGUuczNTZWNyZXRLZXkgPSB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc3RhdGUuczNCdWNrZXQgPSB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHN0YXRlLnMzUGF0aCA9IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbCBcIlR5cGVSYWRpb01vZGVsXCIsXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZU51bU9wdGlvbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGRlZmF1bHREYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhXG4gICAgaWYgdmFsdWUgPiBAc3RhdGUubnVtT3B0aW9uc1xuICAgICAgZm9yIGkgaW4gW0BzdGF0ZS5udW1PcHRpb25zICsgMS4udmFsdWVdXG4gICAgICAgIGRlZmF1bHREYXRhLnB1c2ggXCJcIlxuICAgIGVsc2VcbiAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5udW1PcHRpb25zXVxuICAgICAgICBkZWZhdWx0RGF0YS5wb3AoKVxuICAgICAgaWYgQHN0YXRlLmRlZmF1bHRWYWx1ZSA+PSB2YWx1ZVxuICAgICAgICBAc2V0IGRlZmF1bHRWYWx1ZTogLTFcbiAgICBAc3RhdGUubnVtT3B0aW9ucyA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGVmYXVsdERhdGFcblxuICB1cGRhdGVEZWZhdWx0VmFsdWU6ICh2YWx1ZSkgLT4gQHN0YXRlLmRlZmF1bHRWYWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuXG4gIHVwZGF0ZURlZmF1bHREYXRhT3B0aW9uOiAoaW5kZXgsIHZhbHVlKSAtPiBAc3RhdGUuZGVmYXVsdERhdGFbaW5kZXhdID0gdmFsdWVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlci5jb2ZmZWVcIlxuY29uZmlnc1JhZGlvTW9kZWwgPSByZXF1aXJlIFwicmFkaW8vY29uZmlnc1JhZGlvTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiVHlwZVJhZGlvVmlld1wiLFxuICBtb2RlbDogY29uZmlnc1JhZGlvTW9kZWxcblxuICBpbml0aWFsOiAtPlxuICAgIEBvcHRpb25zQ29udGFpbiA9IFJlbmRlciAoJCBcIkBjb25maWdzLXJhZGlvLW9wdGlvbnMtY29udGFpblwiKSwgXCJ0eXBlc19yYWRpb19vcHRpb25zXCJcbiAgICBAY29uZmlnc1JhZGlvTnVtT3B0aW9ucyA9IEBjb250YWluLmZpbmQgXCJAY29uZmlncy1yYWRpby1udW0tb3B0aW9uc1wiXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwicG9wdXAtY2xvc2U6IGNvbnRhaW5cIjogKGUpIC0+IEB1bmJpbmQoKVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1yYWRpby1udW0tb3B0aW9uc1wiOiAoZSkgLT4gY29uZmlnc1JhZGlvTW9kZWwudXBkYXRlTnVtT3B0aW9ucyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1yYWRpby1vcHRpb25cIjogKGUpIC0+IGNvbmZpZ3NSYWRpb01vZGVsLnVwZGF0ZURlZmF1bHRWYWx1ZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1yYWRpby1vcHRpb24tbGFiZWxcIjogKGUpIC0+IGNvbmZpZ3NSYWRpb01vZGVsLnVwZGF0ZURlZmF1bHREYXRhT3B0aW9uIChAZ2V0SW5kZXhCeUV2ZW50IGUpLCBlLnRhcmdldC52YWx1ZVxuXG4gIGdldEluZGV4QnlFdmVudDogKGUpIC0+XG4gICAgJGl0ZW0gPSAkIGUudGFyZ2V0XG4gICAgJGl0ZW0uZGF0YSBcImluZGV4XCJcblxuICBpbml0aWFsUmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQGNvbmZpZ3NSYWRpb051bU9wdGlvbnMudmFsIHN0YXRlLm51bU9wdGlvbnNcbiAgICBAcmVuZGVyRGVmYXVsdFZhbHVlIHN0YXRlXG4gICAgQHJlbmRlckRlZmF1bHREYXRhIHN0YXRlXG5cbiAgcmVuZGVyRGVmYXVsdERhdGE6IChzdGF0ZSkgLT4gQG9wdGlvbnNDb250YWluLnJlbmRlciBvcHRpb25zOiBzdGF0ZS5kZWZhdWx0RGF0YSwgY3VycmVudFZhbHVlOiBzdGF0ZS5kZWZhdWx0VmFsdWVcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgY29uZmlnc1JhZGlvTW9kZWwuZ2V0U3RhdGUoKVxuICAgIEB1bmJpbmQoKVxuICAgIHJldHVybiBmYWxzZVxuXG4gIHJlbmRlckRlZmF1bHRWYWx1ZTogKHN0YXRlKSAtPlxuICAgIEBjb250YWluLmZpbmQgXCJAY29uZmlncy1yYWRpby1vcHRpb25cIlxuICAgIC5maWx0ZXIgXCJbdmFsdWU9I3tzdGF0ZS5kZWZhdWx0VmFsdWV9XVwiXG4gICAgLnByb3AgXCJjaGVja2VkXCIsIHRydWVcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlUmFkaW9Nb2RlbFwiLFxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVOdW1PcHRpb25zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBkZWZhdWx0RGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgIGlmIHZhbHVlID4gQHN0YXRlLm51bU9wdGlvbnNcbiAgICAgIGZvciBpIGluIFtAc3RhdGUubnVtT3B0aW9ucyArIDEuLnZhbHVlXVxuICAgICAgICBkZWZhdWx0RGF0YS5wdXNoIFwiXCJcbiAgICBlbHNlXG4gICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUubnVtT3B0aW9uc11cbiAgICAgICAgZGVmYXVsdERhdGEucG9wKClcbiAgICAgIGlmIEBzdGF0ZS5kZWZhdWx0VmFsdWUgPj0gdmFsdWVcbiAgICAgICAgQHNldCBkZWZhdWx0VmFsdWU6IC0xXG4gICAgQHN0YXRlLm51bU9wdGlvbnMgPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRlZmF1bHREYXRhXG5cbiAgdXBkYXRlRGVmYXVsdFZhbHVlOiAodmFsdWUpIC0+IEBzdGF0ZS5kZWZhdWx0VmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbjogKGluZGV4LCB2YWx1ZSkgLT4gQHN0YXRlLmRlZmF1bHREYXRhW2luZGV4XSA9IHZhbHVlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiVHlwZVRhYmxlTW9kZWxcIixcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlQ29sdW1uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgaWYgdmFsdWUgPiBAc3RhdGUuY29sdW1uc1xuICAgICAgZm9yIHJvdyBpbiBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICAgICAgZm9yIGkgaW4gW0BzdGF0ZS5jb2x1bW5zICsgMS4udmFsdWVdXG4gICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgIGVsc2UgaWYgdmFsdWUgPCBAc3RhdGUuY29sdW1uc1xuICAgICAgZm9yIHJvdyBpbiBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLmNvbHVtbnNdXG4gICAgICAgICAgcm93LnBvcCgpXG4gICAgQHNldCBjb2x1bW5zOiB2YWx1ZVxuXG4gIHVwZGF0ZVJvd3M6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmIHZhbHVlID4gQHN0YXRlLnJvd3NcbiAgICAgIGZvciByb3cgaW4gW0BzdGF0ZS5yb3dzICsgMS4udmFsdWVdXG4gICAgICAgIHJvdyA9IFtdXG4gICAgICAgIGZvciBpIGluIFsxLi5Ac3RhdGUuY29sdW1uc11cbiAgICAgICAgICByb3cucHVzaCBcIlwiXG4gICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wdXNoIHJvd1xuICAgIGVsc2UgaWYgdmFsdWUgPCBAc3RhdGUucm93c1xuICAgICAgZm9yIHJvdyBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUucm93c11cbiAgICAgICAgQHN0YXRlLmRlZmF1bHREYXRhLnBvcCgpXG4gICAgQHNldCByb3dzOiB2YWx1ZVxuXG4gIHVwZGF0ZUNlbGxEYXRhOiAocm93LCBjb2x1bW4sIHZhbHVlKSAtPiBAc3RhdGUuZGVmYXVsdERhdGFbcm93XVtjb2x1bW5dID0gdmFsdWVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlci5jb2ZmZWVcIlxuY29uZmlnc1RhYmxlTW9kZWwgPSByZXF1aXJlIFwidGFibGUvY29uZmlnc1RhYmxlTW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiVHlwZVRhYmxlVmlld1wiLFxuICBtb2RlbDogY29uZmlnc1RhYmxlTW9kZWxcblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXRhYmxlLXJvd3NcIjogXCJjaGFuZ2VDb25maWdzVGFibGVSb3dzXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtdGFibGUtY29sdW1uc1wiOiBcImNoYW5nZUNvbmZpZ3NUYWJsZUNvbHVtbnNcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy10YWJsZS1jZWxsXCI6IChlKSAtPlxuICAgICAgJGNlbGwgPSAkIGUudGFyZ2V0XG4gICAgICBjb25maWdzVGFibGVNb2RlbC51cGRhdGVDZWxsRGF0YSAoJGNlbGwuZGF0YSBcInJvd1wiKSwgKCRjZWxsLmRhdGEgXCJjb2x1bW5cIiksICgkY2VsbC52YWwoKSlcblxuICAgIFwia2V5ZG93bjogQGNvbmZpZ3MtdGFibGUtcm93c1wiOiAoZSkgLT5cbiAgICAgIEBjaGFuZ2VDb25maWdzVGFibGVSb3dzIGVcbiAgICAgIGlmIGUua2V5Q29kZSA9PSAxMyB0aGVuIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgXCJrZXlkb3duOiBAY29uZmlncy10YWJsZS1jb2x1bW5zXCI6IChlKSAtPlxuICAgICAgQGNoYW5nZUNvbmZpZ3NUYWJsZUNvbHVtbnMgZVxuICAgICAgaWYgZS5rZXlDb2RlID09IDEzIHRoZW4gZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAdW5iaW5kKClcblxuICBjaGFuZ2VDb25maWdzVGFibGVSb3dzOiAoZSkgLT4gY29uZmlnc1RhYmxlTW9kZWwudXBkYXRlUm93cyBlLnRhcmdldC52YWx1ZVxuICBjaGFuZ2VDb25maWdzVGFibGVDb2x1bW5zOiAoZSkgLT4gY29uZmlnc1RhYmxlTW9kZWwudXBkYXRlQ29sdW1ucyBlLnRhcmdldC52YWx1ZVxuXG4gIGluaXRpYWw6IC0+XG4gICAgQHRib2R5Q29udGFpbiA9IFJlbmRlciAoJCBcIkBjb25maWdzLXRhYmxlLXRib2R5XCIpLCBcInR5cGVzX3RhYmxlX3Rib2R5XCJcblxuICBpbml0aWFsUmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgKEBjb250YWluLmZpbmQgXCJAY29uZmlncy10YWJsZS1jb2x1bW5zXCIpLnZhbCBzdGF0ZS5jb2x1bW5zXG4gICAgKEBjb250YWluLmZpbmQgXCJAY29uZmlncy10YWJsZS1yb3dzXCIpLnZhbCBzdGF0ZS5yb3dzXG4gICAgQHJlbmRlclRhYmxlIHN0YXRlXG5cbiAgcmVuZGVyQ29sdW1uczogXCJyZW5kZXJUYWJsZVwiXG4gIHJlbmRlclJvd3M6IFwicmVuZGVyVGFibGVcIlxuXG4gIHJlbmRlclRhYmxlOiAoc3RhdGUpIC0+IEB0Ym9keUNvbnRhaW4ucmVuZGVyIGRhdGE6IHN0YXRlLmRlZmF1bHREYXRhXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIGNvbmZpZ3NUYWJsZU1vZGVsLmdldFN0YXRlKClcbiAgICBAdW5iaW5kKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWwgXCJUeXBlVGFibGVNb2RlbFwiLFxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVDb2x1bW5zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBpZiB2YWx1ZSA+IEBzdGF0ZS5jb2x1bW5zXG4gICAgICBmb3Igcm93IGluIEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgICAgICBmb3IgaSBpbiBbQHN0YXRlLmNvbHVtbnMgKyAxLi52YWx1ZV1cbiAgICAgICAgICByb3cucHVzaCBcIlwiXG4gICAgZWxzZSBpZiB2YWx1ZSA8IEBzdGF0ZS5jb2x1bW5zXG4gICAgICBmb3Igcm93IGluIEBzdGF0ZS5kZWZhdWx0RGF0YVxuICAgICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUuY29sdW1uc11cbiAgICAgICAgICByb3cucG9wKClcbiAgICBAc2V0IGNvbHVtbnM6IHZhbHVlXG5cbiAgdXBkYXRlUm93czogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgaWYgdmFsdWUgPiBAc3RhdGUucm93c1xuICAgICAgZm9yIHJvdyBpbiBbQHN0YXRlLnJvd3MgKyAxLi52YWx1ZV1cbiAgICAgICAgcm93ID0gW11cbiAgICAgICAgZm9yIGkgaW4gWzEuLkBzdGF0ZS5jb2x1bW5zXVxuICAgICAgICAgIHJvdy5wdXNoIFwiXCJcbiAgICAgICAgQHN0YXRlLmRlZmF1bHREYXRhLnB1c2ggcm93XG4gICAgZWxzZSBpZiB2YWx1ZSA8IEBzdGF0ZS5yb3dzXG4gICAgICBmb3Igcm93IGluIFt2YWx1ZSArIDEuLkBzdGF0ZS5yb3dzXVxuICAgICAgICBAc3RhdGUuZGVmYXVsdERhdGEucG9wKClcbiAgICBAc2V0IHJvd3M6IHZhbHVlXG5cbiAgdXBkYXRlQ2VsbERhdGE6IChyb3csIGNvbHVtbiwgdmFsdWUpIC0+IEBzdGF0ZS5kZWZhdWx0RGF0YVtyb3ddW2NvbHVtbl0gPSB2YWx1ZVxuIl19
