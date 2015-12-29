(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, Popup, addModel, addView, models, views;

AddModel = require("./addModel.coffee");

AddView = require("./addView.coffee");

$ = require("jquery-plugins.coffee");

addModel = AddModel();

addView = AddView($("@configs-add"), addModel);

models = {
  image: require("image/ConfigsImageModel.coffee"),
  table: require("table/ConfigsTableModel.coffee"),
  file: require("file/ConfigsFileModel.coffee"),
  radio: require("radio/ConfigsRadioModel.coffee"),
  checkbox: require("checkbox/ConfigsCheckboxModel.coffee"),
  gallery: require("gallery/ConfigsGalleryModel.coffee")
};

views = {
  image: require("image/ConfigsImageView.coffee"),
  table: require("table/ConfigsTableView.coffee"),
  file: require("file/ConfigsFileView.coffee"),
  radio: require("radio/ConfigsRadioView.coffee"),
  checkbox: require("checkbox/ConfigsCheckboxView.coffee"),
  gallery: require("gallery/ConfigsGalleryView.coffee")
};

Popup = require("popup");

addView.on("open-configs-modal", function(index, field, fields) {
  var model, view;
  Popup.open("@configs-popup");
  field.settings.index = index;
  model = models[field.type](field.settings);
  if (model.setFields != null) {
    model.setFields(fields);
  }
  view = views[field.type]($("@configs-popup"), model);
  return view.on("save-configs-modal", function(form) {
    addModel.saveFieldConfigs(form);
    Popup.close();
    return view.destroy();
  });
});

addModel.on("onSavedSection", function(alias) {
  return window.location.href = "/cms/configs/" + alias + "/";
});


},{"./addModel.coffee":2,"./addView.coffee":3,"checkbox/ConfigsCheckboxModel.coffee":4,"checkbox/ConfigsCheckboxView.coffee":5,"file/ConfigsFileModel.coffee":6,"file/ConfigsFileView.coffee":7,"gallery/ConfigsGalleryModel.coffee":8,"gallery/ConfigsGalleryView.coffee":9,"image/ConfigsImageModel.coffee":10,"image/ConfigsImageView.coffee":11,"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","radio/ConfigsRadioModel.coffee":12,"radio/ConfigsRadioView.coffee":13,"table/ConfigsTableModel.coffee":14,"table/ConfigsTableView.coffee":15}],2:[function(require,module,exports){
var Model, Promise, httpGet, httpPost;

Model = require("model.coffee");

Promise = require("q");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model({
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
    return this.set({
      title: value
    });
  },
  updateAlias: function(value) {
    return this.set({
      alias: value
    });
  },
  updateModule: function(value) {
    return this.set({
      module: value
    });
  },
  updateFieldTitle: function(index, value) {
    var fields;
    fields = this.state.fields.slice();
    fields[index].title = value;
    return this.set({
      fields: fields
    });
  },
  updateFieldAlias: function(index, value) {
    var fields;
    fields = this.state.fields.slice();
    fields[index].alias = value;
    return this.set({
      fields: fields
    });
  },
  updateFieldType: function(index, value) {
    var fields;
    fields = this.state.fields.slice();
    fields[index].type = value;
    this.resetSettings(index);
    return this.set({
      fields: fields
    });
  },
  resetSettings: function(index) {
    var fields, i, len, ref, type, typeItem;
    fields = this.state.fields.slice();
    type = fields[index].type;
    ref = this.state.types;
    for (i = 0, len = ref.length; i < len; i++) {
      typeItem = ref[i];
      if (typeItem.alias === type) {
        fields[index].settings = this.clone(typeItem.defaultSettings);
      }
    }
    return this.set({
      fields: fields
    });
  },
  removeField: function(index) {
    var fields;
    fields = this.state.fields.slice();
    fields.splice(index, 1);
    return this.set({
      fields: fields
    });
  },
  getFieldByIndex: function(index) {
    return this.clone(this.state.fields[index]);
  },
  getFields: function() {
    return this.state.fields.slice();
  },
  saveFieldConfigs: function(form) {
    var fields, index;
    index = form.index;
    delete form.index;
    fields = this.state.fields.slice();
    fields[index].settings = form;
    return this.set({
      fields: fields
    });
  },
  save: function() {
    console.log(this.state);
    return httpPost("/cms/configs/action_save/__json/", this.state).then((function(_this) {
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
var $, Popup, Render, View, tableModuleFields;

$ = require("jquery-plugins.coffee");

View = require("view.coffee");

Render = require("render");

Popup = require("popup");

tableModuleFields = require("sections/configs/table-module-fields.tmpl.js");

module.exports = View({
  events: {
    "click: @btn-remove-field": function(e) {
      return this.model.removeField(this.getRowIndex(e));
    },
    "click: @btn-add-field": function(e) {
      return this.model.addEmptyField();
    },
    "change: @field-title": function(e) {
      return this.model.updateFieldTitle(this.getRowIndex(e), e.target.value);
    },
    "change: @field-alias": function(e) {
      return this.model.updateFieldAlias(this.getRowIndex(e), e.target.value);
    },
    "change: @field-type": function(e) {
      return this.model.updateFieldType(this.getRowIndex(e), e.target.value);
    },
    "change: @configs-add-title": function(e) {
      return this.model.updateTitle(e.target.value);
    },
    "change: @configs-add-alias": function(e) {
      return this.model.updateAlias(e.target.value);
    },
    "change: @configs-add-module": function(e) {
      return this.model.updateModule(e.target.value);
    },
    "click: @btn-config-field": "clickBtnConfigField",
    "submit: @configs-add-form": "submitConfigsAddForm"
  },
  initial: function() {
    return this.tbodyContain = Render(tableModuleFields, ($("@tbody-module-fields"))[0]);
  },
  render: function(state) {
    return this.tbodyContain(state);
  },
  getRowIndex: function(e) {
    var $parent;
    $parent = ($(e.target)).closest("[data-key]");
    return $parent.data("key");
  },
  clickBtnConfigField: function(e) {
    return this.trigger("open-configs-modal", this.getRowIndex(e), this.model.getFieldByIndex(this.getRowIndex(e)), this.model.getFields());
  },
  submitConfigsAddForm: function(e) {
    this.model.save();
    return false;
  }
});


},{"jquery-plugins.coffee":"jquery-plugins.coffee","popup":"popup","render":"render","sections/configs/table-module-fields.tmpl.js":16,"view.coffee":"view.coffee"}],4:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, i, j, k, numOpts, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    numOpts = parseInt(this.state.numOptions, 10);
    defaultData = this.state.defaultData.slice();
    if (value > numOpts) {
      for (i = j = ref = numOpts + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push({
          label: "",
          checked: false
        });
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = numOpts; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
    }
    this.set({
      numOptions: value
    });
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultDataOptionChecked: function(index, value) {
    var data;
    data = this.state.defaultData.slice();
    data[index].checked = value;
    return this.set({
      defaultData: data
    });
  },
  updateDefaultDataOption: function(index, value) {
    var data;
    data = this.state.defaultData.slice();
    data[index].label = value;
    return this.set({
      defaultData: data
    });
  }
});


},{"model.coffee":"model.coffee"}],5:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/checkbox/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-checkbox-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "change: @configs-checkbox-option": function(e) {
      return this.model.updateDefaultDataOptionChecked(this.getIndexByEvent(e), e.target.checked);
    },
    "change: @configs-checkbox-option-label": function(e) {
      return this.model.updateDefaultDataOption(this.getIndexByEvent(e), e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  getIndexByEvent: function(e) {
    var $item;
    $item = $(e.target);
    return $item.data("index");
  },
  render: function(state) {
    return this.modalContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/checkbox/modal.tmpl.js":17,"view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  updateStorage: function(value) {
    return this.set({
      storage: value
    });
  },
  updatePath: function(value) {
    return this.set({
      path: value
    });
  },
  updateS3AccessKey: function(value) {
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    return this.set({
      s3Path: value
    });
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],7:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/file/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-file-storage": function(e) {
      return this.model.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-file-path": function(e) {
      return this.model.updatePath(e.target.value);
    },
    "change: @configs-file-width": function(e) {
      return this.model.updateWidth(e.target.value);
    },
    "change: @configs-file-height": function(e) {
      return this.model.updateHeight(e.target.value);
    },
    "change: @configs-file-source": function(e) {
      return this.model.updateSource(e.target.value);
    },
    "change: @configs-file-s3-access-key": function(e) {
      return this.model.updateS3AccessKey(e.target.value);
    },
    "change: @configs-file-s3-secret-key": function(e) {
      return this.model.updateS3SecretKey(e.target.value);
    },
    "change: @configs-file-s3-bucket": function(e) {
      return this.model.updateS3Bucket(e.target.value);
    },
    "change: @configs-file-s3-path": function(e) {
      return this.model.updateS3Path(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  render: function(state) {
    this.modalContain(state);
    return ($("@tabs")).tabs();
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/file/modal.tmpl.js":18,"view.coffee":"view.coffee"}],8:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  updateStorage: function(value) {
    return this.set({
      storage: value
    });
  },
  updatePath: function(value) {
    return this.set({
      path: value
    });
  },
  updateWidth: function(value) {
    return this.set({
      width: value
    });
  },
  updateHeight: function(value) {
    return this.set({
      height: value
    });
  },
  updatePreviewWidth: function(value) {
    return this.set({
      previewWidth: value
    });
  },
  updatePreviewHeight: function(value) {
    return this.set({
      previewHeight: value
    });
  },
  updateS3AccessKey: function(value) {
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    return this.set({
      s3Path: value
    });
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],9:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/gallery/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-gallery-path": function(e) {
      return this.model.updatePath(e.target.value);
    },
    "change: @configs-gallery-width": function(e) {
      return this.model.updateWidth(e.target.value);
    },
    "change: @configs-gallery-height": function(e) {
      return this.model.updateHeight(e.target.value);
    },
    "change: @configs-gallery-preview-width": function(e) {
      return this.model.updatePreviewWidth(e.target.value);
    },
    "change: @configs-gallery-preview-height": function(e) {
      return this.model.updatePreviewHeight(e.target.value);
    },
    "change: @configs-gallery-storage": function(e) {
      return this.model.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-gallery-s3-access-key": function(e) {
      return this.model.updateS3AccessKey(e.target.value);
    },
    "change: @configs-gallery-s3-secret-key": function(e) {
      return this.model.updateS3SecretKey(e.target.value);
    },
    "change: @configs-gallery-s3-bucket": function(e) {
      return this.model.updateS3Bucket(e.target.value);
    },
    "change: @configs-gallery-s3-path": function(e) {
      return this.model.updateS3Path(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  render: function(state) {
    this.modalContain(state);
    return ($("@tabs")).tabs();
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/gallery/modal.tmpl.js":19,"view.coffee":"view.coffee"}],10:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setFields: function(fields) {
    var field, i, index, len, sources;
    sources = [];
    for (index = i = 0, len = fields.length; i < len; index = ++i) {
      field = fields[index];
      if (field.type === "image" && index !== this.state.index && field.alias.length) {
        sources.push({
          alias: field.alias,
          label: field.title
        });
      }
    }
    return this.set({
      sources: sources
    });
  },
  updateStorage: function(value) {
    return this.set({
      storage: value
    });
  },
  updatePath: function(value) {
    return this.set({
      path: value
    });
  },
  updateS3AccessKey: function(value) {
    return this.set({
      s3AccessKey: value
    });
  },
  updateS3SecretKey: function(value) {
    return this.set({
      s3SecretKey: value
    });
  },
  updateS3Bucket: function(value) {
    return this.set({
      s3Bucket: value
    });
  },
  updateS3Path: function(value) {
    return this.set({
      s3Path: value
    });
  },
  updateWidth: function(value) {
    return this.set({
      width: value
    });
  },
  updateHeight: function(value) {
    return this.set({
      height: value
    });
  },
  updateSource: function(value) {
    return this.set({
      source: value
    });
  },
  getState: function() {
    return this.state;
  }
});


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/image/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-image-storage": function(e) {
      return this.model.updateStorage(($(e.target)).data("value"));
    },
    "change: @configs-image-path": function(e) {
      return this.model.updatePath(e.target.value);
    },
    "change: @configs-image-s3-access-key": function(e) {
      return this.model.updateS3AccessKey(e.target.value);
    },
    "change: @configs-image-s3-secret-key": function(e) {
      return this.model.updateS3SecretKey(e.target.value);
    },
    "change: @configs-image-s3-bucket": function(e) {
      return this.model.updateS3Bucket(e.target.value);
    },
    "change: @configs-image-s3-path": function(e) {
      return this.model.updateS3Path(e.target.value);
    },
    "change: @configs-image-width": function(e) {
      return this.model.updateWidth(e.target.value);
    },
    "change: @configs-image-height": function(e) {
      return this.model.updateHeight(e.target.value);
    },
    "change: @configs-image-source": function(e) {
      return this.model.updateSource(e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  render: function(state) {
    this.modalContain(state);
    return ($("@tabs")).tabs();
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/image/modal.tmpl.js":20,"view.coffee":"view.coffee"}],12:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  getState: function() {
    return this.state;
  },
  updateNumOptions: function(value) {
    var defaultData, defaultValue, i, j, k, numOpts, ref, ref1, ref2, ref3;
    value = parseInt(value, 10);
    numOpts = parseInt(this.state.numOptions, 10);
    defaultValue = parseInt(this.state.defaultValue, 10);
    defaultData = this.state.defaultData.slice();
    if (value > numOpts) {
      for (i = j = ref = numOpts + 1, ref1 = value; ref <= ref1 ? j <= ref1 : j >= ref1; i = ref <= ref1 ? ++j : --j) {
        defaultData.push("");
      }
    } else {
      for (i = k = ref2 = value + 1, ref3 = numOpts; ref2 <= ref3 ? k <= ref3 : k >= ref3; i = ref2 <= ref3 ? ++k : --k) {
        defaultData.pop();
      }
      if (defaultValue >= value) {
        this.set({
          defaultValue: defaultValue
        });
      }
    }
    this.set({
      numOptions: value
    });
    return this.set({
      defaultData: defaultData
    });
  },
  updateDefaultValue: function(value) {
    return this.set({
      defaultValue: parseInt(value, 10)
    });
  },
  updateDefaultDataOption: function(index, value) {
    var data;
    data = this.state.defaultData.slice();
    data[index] = value;
    return this.set({
      defaultData: data
    });
  }
});


},{"model.coffee":"model.coffee"}],13:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/radio/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.optionsContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-radio-num-options": function(e) {
      return this.model.updateNumOptions(e.target.value);
    },
    "change: @configs-radio-option": function(e) {
      return this.model.updateDefaultValue(e.target.value);
    },
    "change: @configs-radio-option-label": function(e) {
      return this.model.updateDefaultDataOption(this.getIndexByEvent(e), e.target.value);
    },
    "popup-close: contain": function(e) {
      return this.destroy();
    }
  },
  getIndexByEvent: function(e) {
    var $item;
    $item = $(e.target);
    return $item.data("index");
  },
  render: function(state) {
    return this.optionsContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/radio/modal.tmpl.js":21,"view.coffee":"view.coffee"}],14:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
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
    var data;
    data = this.state.defaultData.slice();
    data[row][column] = value;
    return this.set({
      defaultData: data
    });
  }
});


},{"model.coffee":"model.coffee"}],15:[function(require,module,exports){
var Render, View, modalWindowTemplate;

View = require("view.coffee");

Render = require("render");

modalWindowTemplate = require("types/table/modal.tmpl.js");

module.exports = View({
  initial: function() {
    return this.modalContain = Render(modalWindowTemplate, this.contain[0]);
  },
  events: {
    "submit: @configs-form": "submitConfigsForm",
    "change: @configs-table-rows": "changeConfigsTableRows",
    "change: @configs-table-columns": "changeConfigsTableColumns",
    "change: @configs-table-cell": function(e) {
      var $cell;
      $cell = $(e.target);
      return this.model.updateCellData($cell.data("row"), $cell.data("column"), $cell.val());
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
      return this.destroy();
    }
  },
  changeConfigsTableRows: function(e) {
    return this.model.updateRows(e.target.value);
  },
  changeConfigsTableColumns: function(e) {
    return this.model.updateColumns(e.target.value);
  },
  render: function(state) {
    return this.modalContain(state);
  },
  submitConfigsForm: function(e) {
    this.trigger("save-configs-modal", this.model.getState());
    return false;
  }
});


},{"render":"render","types/table/modal.tmpl.js":22,"view.coffee":"view.coffee"}],16:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.tableModuleFields = factory();
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
      function create()
      {
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
          var indexAttr;
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {var arr2 = fields; for (index in arr2) if (_hasProp.call(arr2, index)) {
field = arr2[index];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__row';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += index;
attrs.push(['data-key', attr]);
})();
childs.push(create('tr', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += field['title'];
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'field-title';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += field['alias'];
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'field-alias';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'select';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__select';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'field-type';
attrs.push(['role', attr]);
})();
childs.push(create('select', attrs, function (childs) {
hasSettings = false;var arr3 = types; for (type in arr3) if (_hasProp.call(arr3, type)) {
type = arr3[type];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += type['alias'];
attrs.push(['value', attr]);
})();
if ( field['type'] == type['alias']) {
(function () {
var attr = '';
attrs.push(['selected', attr]);
})();
}
childs.push(create('option', attrs, function (childs) {
childs.push(type['name'])
}));
})();
if ( field['type'] == type['alias']) {
if ( type['hasSettings']) {
hasSettings = true;}
}
}}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
if ( hasSettings) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'btn-config-field';
attrs.push(['role', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Н');
}));
})();
}
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form-table__cell';
attrs.push(['class', attr]);
})();
childs.push(create('td', attrs, function (childs) {
if ( count(fields) > 1) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'btn-remove-field';
attrs.push(['role', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('X');
}));
})();
}
}));
})();
}));
})();
}}})};
    });
},{}],17:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      function create()
      {
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
          var indexAttr;
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки флажков');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-checkbox-num-options';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Количество вариантов ответа');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += numOptions;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-num-options';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-num-options';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Варианты ответов:');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-checkbox-options-contain';
attrs.push(['role', attr]);
})();
childs.push(create('div', attrs, function (childs) {
var arr5 = defaultData; for (i in arr5) if (_hasProp.call(arr5, i)) {
option = arr5[i];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__row-option';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'checkbox';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__checkbox';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-option';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['data-index', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-option-';
attr += i;
attrs.push(['id', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-option';
attrs.push(['name', attr]);
})();
if ( option['checked'] == true || option['checked'] == "true") {
(function () {
var attr = '';
attrs.push(['checked', attr]);
})();
}
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--half-width';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += option['label'];
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-checkbox-option-label';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['data-index', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],18:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      function create()
      {
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
          var indexAttr;
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки файла');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Хранилище');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'tabs';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "local") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-file-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 'local';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-modal-storage-local';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Локальное');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "s3") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-file-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 's3';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-modal-storage-s3';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('S3');
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-modal-storage-local configs-file-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "local") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-path';
attrs.push(['id', attr]);
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
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-modal-storage-s3 configs-file-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "s3") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-s3-access-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Access key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3AccessKey;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-access-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-access-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-s3-secret-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Secret key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'password';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-secret-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-secret-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-s3-bucket';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Bucket');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3Bucket;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-bucket';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-bucket';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-file-s3-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3Path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-file-s3-path';
attrs.push(['id', attr]);
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
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],19:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      function create()
      {
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
          var indexAttr;
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки галереи');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Хранилище');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'tabs';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "local") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-gallery-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 'local';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage-local';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Локальное');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "s3") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-gallery-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 's3';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage-s3';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('S3');
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage-local configs-gallery-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "local") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-path';
attrs.push(['id', attr]);
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
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-modal-storage-s3 configs-gallery-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "s3") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-s3-access-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Access key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3AccessKey;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-access-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-access-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-s3-secret-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Secret key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'password';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-secret-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-secret-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-s3-bucket';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Bucket');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3Bucket;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-bucket';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-bucket';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-s3-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += s3Path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-s3-path';
attrs.push(['id', attr]);
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
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Уменьшить оригинал до размера');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += width;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__between-inp';
attrs.push(['class', attr]);
})();
childs.push(create('span', attrs, function (childs) {
childs.push('×');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += height;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-height';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__hint';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Если не задать значение, оно будет вычислено пропорционально');
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Размер превью');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += previewWidth;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-preview-width';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-width';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__between-inp';
attrs.push(['class', attr]);
})();
childs.push(create('span', attrs, function (childs) {
childs.push('×');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += previewHeight;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-gallery-preview-height';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__hint';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Если не задать значение, оно будет вычислено пропорционально');
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],20:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      function create()
      {
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
          var indexAttr;
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки изображения');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Хранилище');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'tabs';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "local") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-image-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 'local';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-modal-storage-local';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Локальное');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'tabs__item';
if ( storage == "s3") {
attr += ' tabs__item--active';
}
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'tabs configs-image-storage';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-modal-storage';
attrs.push(['data-group', attr]);
})();
(function () {
var attr = '';
attr += 's3';
attrs.push(['data-value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-modal-storage-s3';
attrs.push(['data-frame', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('S3');
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-modal-storage-local configs-image-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "local") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += path;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-path';
attrs.push(['id', attr]);
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
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-modal-storage-s3 configs-image-modal-storage-frame';
attrs.push(['role', attr]);
})();
if ( storage != "s3") {
(function () {
var attr = '';
attr += 'display: none';
attrs.push(['style', attr]);
})();
}
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-s3-access-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Access key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof s3AccessKey !== 'undefined' ? s3AccessKey : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-access-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-access-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-s3-secret-key';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Secret key');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'password';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-secret-key';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-secret-key';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-s3-bucket';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Bucket');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof s3Bucket !== 'undefined' ? s3Bucket : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-bucket';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-bucket';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-s3-path';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Путь');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof s3Path !== 'undefined' ? s3Path : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-path';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-s3-path';
attrs.push(['id', attr]);
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
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-width';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Уменьшить до размера');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof width !== 'undefined' ? width : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-width';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-width';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__between-inp';
attrs.push(['class', attr]);
})();
childs.push(create('span', attrs, function (childs) {
childs.push('×');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr +=  typeof height !== 'undefined' ? height : '' ;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-height';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__hint';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Если не задать значение, оно будет вычислено пропорционально');
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-source';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Источник');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'select';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-image-source';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-image-source';
attrs.push(['id', attr]);
})();
childs.push(create('select', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'upload';
attrs.push(['value', attr]);
})();
if ( source == "upload") {
(function () {
var attr = '';
attrs.push(['selected', attr]);
})();
}
childs.push(create('option', attrs, function (childs) {
childs.push('Загрузить изображение');
}));
})();
if (  typeof sources !== 'undefined' ? sources : '' ) {
var arr0 = sources; for (sourceItem in arr0) if (_hasProp.call(arr0, sourceItem)) {
sourceItem = arr0[sourceItem];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += sourceItem['alias'];
attrs.push(['value', attr]);
})();
if ( source == sourceItem['alias']) {
(function () {
var attr = '';
attrs.push(['selected', attr]);
})();
}
childs.push(create('option', attrs, function (childs) {
childs.push(sourceItem['label'])
}));
})();
}}
}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],21:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      function create()
      {
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
          var indexAttr;
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки переключателей');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-radio-num-options';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Количество вариантов ответа');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += numOptions;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-num-options';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-num-options';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Варианты ответов:');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__row-option';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'radio';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__checkbox';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += '-1';
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option--1';
attrs.push(['id', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option';
attrs.push(['name', attr]);
})();
if ( defaultValue == -1 || defaultValue == -1) {
(function () {
var attr = '';
attrs.push(['checked', attr]);
})();
}
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-radio-option--1';
attrs.push(['for', attr]);
})();
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
childs.push(create('i', attrs, function (childs) {
childs.push('Ничего не выбрано по умолчанию');
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-radio-options-contain';
attrs.push(['role', attr]);
})();
childs.push(create('div', attrs, function (childs) {
var arr6 = defaultData; for (i in arr6) if (_hasProp.call(arr6, i)) {
option = arr6[i];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__row-option';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'radio';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__checkbox';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option-';
attr += i;
attrs.push(['id', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option';
attrs.push(['name', attr]);
})();
if ( defaultValue == i) {
(function () {
var attr = '';
attrs.push(['checked', attr]);
})();
}
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
childs.push(create('label', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--half-width';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += option;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-radio-option-label';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['data-index', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
}}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}],22:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.modal = factory();
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
      function create()
      {
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
          var indexAttr;
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
      return function (obj)
      {
        return create(function (childs)
        {with (obj) {(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'popup__head';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
childs.push('Настройки таблицы');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'form';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'configs-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-table-columns';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Колонок по умолчанию');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += columns;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-columns';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-columns';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-table-rows';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Строк по умолчанию');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += rows;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-rows';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-rows';
attrs.push(['id', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__item';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-table-rows';
attrs.push(['for', attr]);
})();
(function () {
var attr = '';
attr += 'form__label';
attrs.push(['class', attr]);
})();
childs.push(create('label', attrs, function (childs) {
childs.push('Шаблон по умолчанию');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__inp-contain form__inp-contain--full-width form__inp-contain--scroll-wrap';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'table table--straight-sides table--responsive';
attrs.push(['class', attr]);
})();
childs.push(create('table', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'configs-table-tbody';
attrs.push(['role', attr]);
})();
childs.push(create('tbody', attrs, function (childs) {
var arr8 = defaultData; for (rowIndex in arr8) if (_hasProp.call(arr8, rowIndex)) {
row = arr8[rowIndex];
(function () {
var attrs = [];
childs.push(create('tr', attrs, function (childs) {
var arr9 = row; for (columnIndex in arr9) if (_hasProp.call(arr9, columnIndex)) {
column = arr9[columnIndex];
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'text';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__inp form__inp--very-short';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += column;
attrs.push(['value', attr]);
})();
(function () {
var attr = '';
attr += 'configs-table-cell';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += rowIndex;
attrs.push(['data-row', attr]);
})();
(function () {
var attr = '';
attr += columnIndex;
attrs.push(['data-column', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
}));
})();
}}));
})();
}}));
})();
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__submit';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn form__btn--submit';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Сохранить');
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'button';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn popup__cancel';
attrs.push(['class', attr]);
})();
childs.push(create('button', attrs, function (childs) {
childs.push('Отменить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2FkZC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2FkZE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvYWRkVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9Db25maWdzQ2hlY2tib3hNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9Db25maWdzQ2hlY2tib3hWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2ZpbGUvQ29uZmlnc0ZpbGVNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9maWxlL0NvbmZpZ3NGaWxlVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9nYWxsZXJ5L0NvbmZpZ3NHYWxsZXJ5TW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvZ2FsbGVyeS9Db25maWdzR2FsbGVyeVZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvQ29uZmlnc0ltYWdlVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9Db25maWdzUmFkaW9Nb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9Db25maWdzUmFkaW9WaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZU1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL0NvbmZpZ3NUYWJsZVZpZXcuY29mZmVlIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvc2VjdGlvbnMvY29uZmlncy90YWJsZS1tb2R1bGUtZmllbGRzLnRtcGwuanMiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy9jaGVja2JveC9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvZmlsZS9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvZ2FsbGVyeS9tb2RhbC50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvdHlwZXMvaW1hZ2UvbW9kYWwudG1wbC5qcyIsInRlbXAvbW9kdWxlcy9HVUkvLmNvbXBpbGVfdGVtcGxhdGVzL3R5cGVzL3JhZGlvL21vZGFsLnRtcGwuanMiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy90YWJsZS9tb2RhbC50bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxRQUFBLEdBQVcsT0FBQSxDQUFRLG1CQUFSOztBQUNYLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVI7O0FBQ1YsQ0FBQSxHQUFJLE9BQUEsQ0FBUSx1QkFBUjs7QUFFSixRQUFBLEdBQVcsUUFBQSxDQUFBOztBQUNYLE9BQUEsR0FBVSxPQUFBLENBQVMsQ0FBQSxDQUFFLGNBQUYsQ0FBVCxFQUE0QixRQUE1Qjs7QUFHVixNQUFBLEdBQ0U7RUFBQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBQVA7RUFDQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBRFA7RUFFQSxJQUFBLEVBQU0sT0FBQSxDQUFRLDhCQUFSLENBRk47RUFHQSxLQUFBLEVBQU8sT0FBQSxDQUFRLGdDQUFSLENBSFA7RUFJQSxRQUFBLEVBQVUsT0FBQSxDQUFRLHNDQUFSLENBSlY7RUFLQSxPQUFBLEVBQVMsT0FBQSxDQUFRLG9DQUFSLENBTFQ7OztBQU9GLEtBQUEsR0FDRTtFQUFBLEtBQUEsRUFBTyxP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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6VkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcDFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3QwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJBZGRNb2RlbCA9IHJlcXVpcmUgXCIuL2FkZE1vZGVsLmNvZmZlZVwiXG5BZGRWaWV3ID0gcmVxdWlyZSBcIi4vYWRkVmlldy5jb2ZmZWVcIlxuJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuXG5hZGRNb2RlbCA9IEFkZE1vZGVsKClcbmFkZFZpZXcgPSBBZGRWaWV3ICgkIFwiQGNvbmZpZ3MtYWRkXCIpLCBhZGRNb2RlbFxuXG5cbm1vZGVscyA9XG4gIGltYWdlOiByZXF1aXJlIFwiaW1hZ2UvQ29uZmlnc0ltYWdlTW9kZWwuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9Db25maWdzVGFibGVNb2RlbC5jb2ZmZWVcIlxuICBmaWxlOiByZXF1aXJlIFwiZmlsZS9Db25maWdzRmlsZU1vZGVsLmNvZmZlZVwiXG4gIHJhZGlvOiByZXF1aXJlIFwicmFkaW8vQ29uZmlnc1JhZGlvTW9kZWwuY29mZmVlXCJcbiAgY2hlY2tib3g6IHJlcXVpcmUgXCJjaGVja2JveC9Db25maWdzQ2hlY2tib3hNb2RlbC5jb2ZmZWVcIlxuICBnYWxsZXJ5OiByZXF1aXJlIFwiZ2FsbGVyeS9Db25maWdzR2FsbGVyeU1vZGVsLmNvZmZlZVwiXG5cbnZpZXdzID1cbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9Db25maWdzSW1hZ2VWaWV3LmNvZmZlZVwiXG4gIHRhYmxlOiByZXF1aXJlIFwidGFibGUvQ29uZmlnc1RhYmxlVmlldy5jb2ZmZWVcIlxuICBmaWxlOiByZXF1aXJlIFwiZmlsZS9Db25maWdzRmlsZVZpZXcuY29mZmVlXCJcbiAgcmFkaW86IHJlcXVpcmUgXCJyYWRpby9Db25maWdzUmFkaW9WaWV3LmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvQ29uZmlnc0NoZWNrYm94Vmlldy5jb2ZmZWVcIlxuICBnYWxsZXJ5OiByZXF1aXJlIFwiZ2FsbGVyeS9Db25maWdzR2FsbGVyeVZpZXcuY29mZmVlXCJcblxuUG9wdXAgPSByZXF1aXJlIFwicG9wdXBcIlxuXG5hZGRWaWV3Lm9uIFwib3Blbi1jb25maWdzLW1vZGFsXCIsIChpbmRleCwgZmllbGQsIGZpZWxkcykgLT5cbiAgUG9wdXAub3BlbiBcIkBjb25maWdzLXBvcHVwXCJcbiAgZmllbGQuc2V0dGluZ3MuaW5kZXggPSBpbmRleFxuXG4gIG1vZGVsID0gbW9kZWxzW2ZpZWxkLnR5cGVdIGZpZWxkLnNldHRpbmdzXG4gIG1vZGVsLnNldEZpZWxkcyBmaWVsZHMgaWYgbW9kZWwuc2V0RmllbGRzP1xuXG4gIHZpZXcgPSB2aWV3c1tmaWVsZC50eXBlXSAoJCBcIkBjb25maWdzLXBvcHVwXCIpLCBtb2RlbFxuICB2aWV3Lm9uIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIChmb3JtKSAtPlxuICAgIGFkZE1vZGVsLnNhdmVGaWVsZENvbmZpZ3MgZm9ybVxuICAgIFBvcHVwLmNsb3NlKClcbiAgICB2aWV3LmRlc3Ryb3koKVxuXG5hZGRNb2RlbC5vbiBcIm9uU2F2ZWRTZWN0aW9uXCIsIChhbGlhcykgLT5cbiAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9jbXMvY29uZmlncy8je2FsaWFzfS9cIlxuXG4jIHNldFRpbWVvdXQgPT5cbiMgICAoJCBcIkBmaWVsZC10eXBlXCIpXG4jICAgLmVxKDEpXG4jICAgLnZhbCBcInRhYmxlXCJcbiMgICAudHJpZ2dlciBcImNoYW5nZVwiXG4jICAgc2V0VGltZW91dCA9PlxuIyAgICAgKCQgXCJAYnRuLWNvbmZpZy1maWVsZFwiKS50cmlnZ2VyIFwiY2xpY2tcIlxuIyAgICAgIyBzZXRUaW1lb3V0ID0+XG4jICAgICAjICAgKCQgXCJAY29uZmlncy1pbWFnZS1zdG9yYWdlXCIpLmVxKDEpLnRyaWdnZXIgXCJjbGlja1wiXG4jICAgICAjICwgNDBcbiMgICAsIDQwXG4jICwgNTAwXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuUHJvbWlzZSA9IHJlcXVpcmUgXCJxXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcbmh0dHBQb3N0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwUG9zdFxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIGluaXRpYWxTdGF0ZTogLT5cbiAgICBodHRwR2V0IFwiI3t3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9X19qc29uL1wiXG4gICAgICAudGhlbiAocmVzcG9uc2UpIC0+XG4gICAgICAgIHN0YXRlID1cbiAgICAgICAgICB0aXRsZTogcmVzcG9uc2UudGl0bGVcbiAgICAgICAgICBhbGlhczogcmVzcG9uc2UuYWxpYXNcbiAgICAgICAgICBtb2R1bGU6IHJlc3BvbnNlLm1vZHVsZVxuICAgICAgICAgIGZpZWxkczogcmVzcG9uc2UuZmllbGRzXG4gICAgICAgICAgdHlwZXM6IHJlc3BvbnNlLnR5cGVzXG4gICAgICAgIGlmIHJlc3BvbnNlLmlkXG4gICAgICAgICAgc3RhdGUuaWQgPSByZXNwb25zZS5pZFxuICAgICAgICBjb25zb2xlLmxvZyBzdGF0ZVxuICAgICAgICBzdGF0ZVxuXG4gIGFkZEZpZWxkOiAoZmllbGQpIC0+XG4gICAgQHNldCBmaWVsZHM6IEBzdGF0ZS5maWVsZHMuY29uY2F0IFtmaWVsZF1cblxuICBhZGRFbXB0eUZpZWxkOiAtPlxuICAgIEBzZXQgZmllbGRzOiBAc3RhdGUuZmllbGRzLmNvbmNhdCBbXG4gICAgICB0aXRsZTogXCJcIlxuICAgICAgYWxpYXM6IFwiXCJcbiAgICAgIHR5cGU6IFwic3RyaW5nXCJcbiAgICBdXG5cbiAgdXBkYXRlVGl0bGU6ICh2YWx1ZSkgLT4gQHNldCB0aXRsZTogdmFsdWVcbiAgdXBkYXRlQWxpYXM6ICh2YWx1ZSkgLT4gQHNldCBhbGlhczogdmFsdWVcbiAgdXBkYXRlTW9kdWxlOiAodmFsdWUpIC0+IEBzZXQgbW9kdWxlOiB2YWx1ZVxuXG4gIHVwZGF0ZUZpZWxkVGl0bGU6IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgZmllbGRzW2luZGV4XS50aXRsZSA9IHZhbHVlXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIHVwZGF0ZUZpZWxkQWxpYXM6IChpbmRleCwgdmFsdWUpIC0+XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgZmllbGRzW2luZGV4XS5hbGlhcyA9IHZhbHVlXG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIHVwZGF0ZUZpZWxkVHlwZTogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHNbaW5kZXhdLnR5cGUgPSB2YWx1ZVxuICAgIEByZXNldFNldHRpbmdzIGluZGV4XG4gICAgQHNldCB7ZmllbGRzfVxuXG4gIHJlc2V0U2V0dGluZ3M6IChpbmRleCkgLT5cbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICB0eXBlID0gZmllbGRzW2luZGV4XS50eXBlXG4gICAgZm9yIHR5cGVJdGVtIGluIEBzdGF0ZS50eXBlc1xuICAgICAgaWYgdHlwZUl0ZW0uYWxpYXMgPT0gdHlwZVxuICAgICAgICBmaWVsZHNbaW5kZXhdLnNldHRpbmdzID0gQGNsb25lIHR5cGVJdGVtLmRlZmF1bHRTZXR0aW5nc1xuICAgIEBzZXQge2ZpZWxkc31cblxuICByZW1vdmVGaWVsZDogKGluZGV4KSAtPlxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIGZpZWxkcy5zcGxpY2UgaW5kZXgsIDFcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgZ2V0RmllbGRCeUluZGV4OiAoaW5kZXgpIC0+IEBjbG9uZSBAc3RhdGUuZmllbGRzW2luZGV4XVxuXG4gIGdldEZpZWxkczogLT4gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG5cbiAgc2F2ZUZpZWxkQ29uZmlnczogKGZvcm0pIC0+XG4gICAgaW5kZXggPSBmb3JtLmluZGV4XG4gICAgZGVsZXRlIGZvcm0uaW5kZXhcbiAgICBmaWVsZHMgPSBAc3RhdGUuZmllbGRzLnNsaWNlKClcbiAgICBmaWVsZHNbaW5kZXhdLnNldHRpbmdzID0gZm9ybVxuICAgIEBzZXQge2ZpZWxkc31cblxuICBzYXZlOiAtPlxuICAgIGNvbnNvbGUubG9nIEBzdGF0ZVxuICAgIGh0dHBQb3N0IFwiL2Ntcy9jb25maWdzL2FjdGlvbl9zYXZlL19fanNvbi9cIiwgQHN0YXRlXG4gICAgICAudGhlbiAocmVzcG9uc2UpID0+XG4gICAgICAgIGlmIEBzdGF0ZS5pZD9cbiAgICAgICAgICBAc2V0IGZpZWxkczogcmVzcG9uc2Uuc2VjdGlvbi5maWVsZHNcbiAgICAgICAgICBAc2V0IGlkOiByZXNwb25zZS5zZWN0aW9uLmlkXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBAdHJpZ2dlciBcIm9uU2F2ZWRTZWN0aW9uXCIsIEBzdGF0ZS5hbGlhc1xuICAgICAgLmNhdGNoIChyZXNwb25zZSkgLT5cbiAgICAgICAgY29uc29sZS5lcnJvciByZXNwb25zZS5lcnJvclxuIiwiJCA9IHJlcXVpcmUgXCJqcXVlcnktcGx1Z2lucy5jb2ZmZWVcIlxuVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcblBvcHVwID0gcmVxdWlyZSBcInBvcHVwXCJcbnRhYmxlTW9kdWxlRmllbGRzID0gcmVxdWlyZSBcInNlY3Rpb25zL2NvbmZpZ3MvdGFibGUtbW9kdWxlLWZpZWxkcy50bXBsLmpzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGV2ZW50czpcbiAgICBcImNsaWNrOiBAYnRuLXJlbW92ZS1maWVsZFwiOiAoZSkgLT4gQG1vZGVsLnJlbW92ZUZpZWxkIEBnZXRSb3dJbmRleCBlXG4gICAgXCJjbGljazogQGJ0bi1hZGQtZmllbGRcIjogKGUpIC0+IEBtb2RlbC5hZGRFbXB0eUZpZWxkKClcbiAgICBcImNoYW5nZTogQGZpZWxkLXRpdGxlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRmllbGRUaXRsZSAoQGdldFJvd0luZGV4IGUpLCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAZmllbGQtYWxpYXNcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVGaWVsZEFsaWFzIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBmaWVsZC10eXBlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRmllbGRUeXBlIChAZ2V0Um93SW5kZXggZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC10aXRsZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVRpdGxlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC1hbGlhc1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUFsaWFzIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWFkZC1tb2R1bGVcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVNb2R1bGUgZS50YXJnZXQudmFsdWVcbiAgICBcImNsaWNrOiBAYnRuLWNvbmZpZy1maWVsZFwiOiBcImNsaWNrQnRuQ29uZmlnRmllbGRcIlxuICAgIFwic3VibWl0OiBAY29uZmlncy1hZGQtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NBZGRGb3JtXCJcblxuICBpbml0aWFsOiAtPlxuICAgIEB0Ym9keUNvbnRhaW4gPSBSZW5kZXIgdGFibGVNb2R1bGVGaWVsZHMsICgkIFwiQHRib2R5LW1vZHVsZS1maWVsZHNcIilbMF1cblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAdGJvZHlDb250YWluIHN0YXRlXG5cbiAgZ2V0Um93SW5kZXg6IChlKSAtPlxuICAgICRwYXJlbnQgPSAoJCBlLnRhcmdldCkuY2xvc2VzdCBcIltkYXRhLWtleV1cIlxuICAgIHJldHVybiAkcGFyZW50LmRhdGEgXCJrZXlcIlxuXG4gIGNsaWNrQnRuQ29uZmlnRmllbGQ6IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwib3Blbi1jb25maWdzLW1vZGFsXCIsXG4gICAgICBAZ2V0Um93SW5kZXggZVxuICAgICAgQG1vZGVsLmdldEZpZWxkQnlJbmRleCBAZ2V0Um93SW5kZXggZVxuICAgICAgQG1vZGVsLmdldEZpZWxkcygpXG5cbiAgc3VibWl0Q29uZmlnc0FkZEZvcm06IChlKSAtPlxuICAgIEBtb2RlbC5zYXZlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuXG4gIHVwZGF0ZU51bU9wdGlvbnM6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIG51bU9wdHMgPSBwYXJzZUludCBAc3RhdGUubnVtT3B0aW9ucywgMTBcbiAgICBkZWZhdWx0RGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgaWYgdmFsdWUgPiBudW1PcHRzXG4gICAgICBmb3IgaSBpbiBbbnVtT3B0cyArIDEuLnZhbHVlXVxuICAgICAgICBkZWZhdWx0RGF0YS5wdXNoXG4gICAgICAgICAgbGFiZWw6IFwiXCJcbiAgICAgICAgICBjaGVja2VkOiBmYWxzZVxuICAgIGVsc2VcbiAgICAgIGZvciBpIGluIFt2YWx1ZSArIDEuLm51bU9wdHNdXG4gICAgICAgIGRlZmF1bHREYXRhLnBvcCgpXG4gICAgQHNldCBudW1PcHRpb25zOiB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRlZmF1bHREYXRhXG5cbiAgdXBkYXRlRGVmYXVsdERhdGFPcHRpb25DaGVja2VkOiAoaW5kZXgsIHZhbHVlKSAtPlxuICAgIGRhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGRhdGFbaW5kZXhdLmNoZWNrZWQgPSB2YWx1ZVxuICAgIEBzZXQgZGVmYXVsdERhdGE6IGRhdGFcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbjogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XS5sYWJlbCA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcbm1vZGFsV2luZG93VGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvY2hlY2tib3gvbW9kYWwudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBpbml0aWFsOiAtPlxuICAgIEBtb2RhbENvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWNoZWNrYm94LW51bS1vcHRpb25zXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlTnVtT3B0aW9ucyBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1jaGVja2JveC1vcHRpb25cIjogKGUpIC0+IEBtb2RlbC51cGRhdGVEZWZhdWx0RGF0YU9wdGlvbkNoZWNrZWQgKEBnZXRJbmRleEJ5RXZlbnQgZSksIGUudGFyZ2V0LmNoZWNrZWRcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtY2hlY2tib3gtb3B0aW9uLWxhYmVsXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlRGVmYXVsdERhdGFPcHRpb24gKEBnZXRJbmRleEJ5RXZlbnQgZSksIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuXG4gIGdldEluZGV4QnlFdmVudDogKGUpIC0+XG4gICAgJGl0ZW0gPSAkIGUudGFyZ2V0XG4gICAgJGl0ZW0uZGF0YSBcImluZGV4XCJcblxuICByZW5kZXI6IChzdGF0ZSkgLT5cbiAgICBAbW9kYWxDb250YWluIHN0YXRlXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIEBtb2RlbC5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHVwZGF0ZVN0b3JhZ2U6ICh2YWx1ZSkgLT4gQHNldCBzdG9yYWdlOiB2YWx1ZVxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzZXQgcGF0aDogdmFsdWVcbiAgdXBkYXRlUzNBY2Nlc3NLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM0FjY2Vzc0tleTogdmFsdWVcbiAgdXBkYXRlUzNTZWNyZXRLZXk6ICh2YWx1ZSkgLT4gQHNldCBzM1NlY3JldEtleTogdmFsdWVcbiAgdXBkYXRlUzNCdWNrZXQ6ICh2YWx1ZSkgLT4gQHNldCBzM0J1Y2tldDogdmFsdWVcbiAgdXBkYXRlUzNQYXRoOiAodmFsdWUpIC0+IEBzZXQgczNQYXRoOiB2YWx1ZVxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5tb2RhbFdpbmRvd1RlbXBsYXRlID0gcmVxdWlyZSBcInR5cGVzL2ZpbGUvbW9kYWwudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBpbml0aWFsOiAtPlxuICAgIEBtb2RhbENvbnRhaW4gPSBSZW5kZXIgbW9kYWxXaW5kb3dUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IEBjb25maWdzLWZvcm1cIjogXCJzdWJtaXRDb25maWdzRm9ybVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtc3RvcmFnZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtcGF0aFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVBhdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS13aWR0aFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVdpZHRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtaGVpZ2h0XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlSGVpZ2h0IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtc291cmNlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlU291cmNlIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzQWNjZXNzS2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzU2VjcmV0S2V5IGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWZpbGUtczMtYnVja2V0XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZmlsZS1zMy1wYXRoXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBtb2RhbENvbnRhaW4gc3RhdGVcbiAgICAoJCBcIkB0YWJzXCIpLnRhYnMoKVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICB1cGRhdGVTdG9yYWdlOiAodmFsdWUpIC0+IEBzZXQgc3RvcmFnZTogdmFsdWVcblxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzZXQgcGF0aDogdmFsdWVcbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHNldCB3aWR0aDogdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzZXQgaGVpZ2h0OiB2YWx1ZVxuICB1cGRhdGVQcmV2aWV3V2lkdGg6ICh2YWx1ZSkgLT4gQHNldCBwcmV2aWV3V2lkdGg6IHZhbHVlXG4gIHVwZGF0ZVByZXZpZXdIZWlnaHQ6ICh2YWx1ZSkgLT4gQHNldCBwcmV2aWV3SGVpZ2h0OiB2YWx1ZVxuXG4gIHVwZGF0ZVMzQWNjZXNzS2V5OiAodmFsdWUpIC0+IEBzZXQgczNBY2Nlc3NLZXk6IHZhbHVlXG4gIHVwZGF0ZVMzU2VjcmV0S2V5OiAodmFsdWUpIC0+IEBzZXQgczNTZWNyZXRLZXk6IHZhbHVlXG4gIHVwZGF0ZVMzQnVja2V0OiAodmFsdWUpIC0+IEBzZXQgczNCdWNrZXQ6IHZhbHVlXG4gIHVwZGF0ZVMzUGF0aDogKHZhbHVlKSAtPiBAc2V0IHMzUGF0aDogdmFsdWVcblxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9nYWxsZXJ5L21vZGFsLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAbW9kYWxDb250YWluID0gUmVuZGVyIG1vZGFsV2luZG93VGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBAY29uZmlncy1mb3JtXCI6IFwic3VibWl0Q29uZmlnc0Zvcm1cIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXBhdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWdhbGxlcnktd2lkdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVXaWR0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LWhlaWdodFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUhlaWdodCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXByZXZpZXctd2lkdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVQcmV2aWV3V2lkdGggZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LWhlaWdodFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVByZXZpZXdIZWlnaHQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zdG9yYWdlXCI6IChlKSAtPiBAbW9kZWwudXBkYXRlU3RvcmFnZSAoJCBlLnRhcmdldCkuZGF0YSBcInZhbHVlXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1hY2Nlc3Mta2V5XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNBY2Nlc3NLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1zZWNyZXQta2V5XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNTZWNyZXRLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtZ2FsbGVyeS1zMy1idWNrZXRcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM0J1Y2tldCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1nYWxsZXJ5LXMzLXBhdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM1BhdGggZS50YXJnZXQudmFsdWVcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+XG4gICAgQG1vZGFsQ29udGFpbiBzdGF0ZVxuICAgICgkIFwiQHRhYnNcIikudGFicygpXG5cbiAgc3VibWl0Q29uZmlnc0Zvcm06IChlKSAtPlxuICAgIEB0cmlnZ2VyIFwic2F2ZS1jb25maWdzLW1vZGFsXCIsIEBtb2RlbC5nZXRTdGF0ZSgpXG4gICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldEZpZWxkczogKGZpZWxkcykgLT5cbiAgICBzb3VyY2VzID0gW11cbiAgICBmb3IgZmllbGQsIGluZGV4IGluICBmaWVsZHNcbiAgICAgIGlmIGZpZWxkLnR5cGUgPT0gXCJpbWFnZVwiICYmIGluZGV4ICE9IEBzdGF0ZS5pbmRleCAmJiBmaWVsZC5hbGlhcy5sZW5ndGhcbiAgICAgICAgc291cmNlcy5wdXNoIGFsaWFzOiBmaWVsZC5hbGlhcywgbGFiZWw6IGZpZWxkLnRpdGxlXG4gICAgQHNldCB7c291cmNlc31cblxuICB1cGRhdGVTdG9yYWdlOiAodmFsdWUpIC0+IEBzZXQgc3RvcmFnZTogdmFsdWVcblxuICB1cGRhdGVQYXRoOiAodmFsdWUpIC0+IEBzZXQgcGF0aDogdmFsdWVcblxuICB1cGRhdGVTM0FjY2Vzc0tleTogKHZhbHVlKSAtPiBAc2V0IHMzQWNjZXNzS2V5OiB2YWx1ZVxuICB1cGRhdGVTM1NlY3JldEtleTogKHZhbHVlKSAtPiBAc2V0IHMzU2VjcmV0S2V5OiB2YWx1ZVxuICB1cGRhdGVTM0J1Y2tldDogKHZhbHVlKSAtPiBAc2V0IHMzQnVja2V0OiB2YWx1ZVxuICB1cGRhdGVTM1BhdGg6ICh2YWx1ZSkgLT4gQHNldCBzM1BhdGg6IHZhbHVlXG5cbiAgdXBkYXRlV2lkdGg6ICh2YWx1ZSkgLT4gQHNldCB3aWR0aDogdmFsdWVcbiAgdXBkYXRlSGVpZ2h0OiAodmFsdWUpIC0+IEBzZXQgaGVpZ2h0OiB2YWx1ZVxuICB1cGRhdGVTb3VyY2U6ICh2YWx1ZSkgLT4gQHNldCBzb3VyY2U6IHZhbHVlXG5cbiAgZ2V0U3RhdGU6IC0+IEBzdGF0ZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcbm1vZGFsV2luZG93VGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvaW1hZ2UvbW9kYWwudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuXG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2Utc3RvcmFnZVwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVN0b3JhZ2UgKCQgZS50YXJnZXQpLmRhdGEgXCJ2YWx1ZVwiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXBhdGhcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVQYXRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLXMzLWFjY2Vzcy1rZXlcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTM0FjY2Vzc0tleSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zMy1zZWNyZXQta2V5XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNTZWNyZXRLZXkgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtczMtYnVja2V0XCI6IChlKSAtPiBAbW9kZWwudXBkYXRlUzNCdWNrZXQgZS50YXJnZXQudmFsdWVcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtaW1hZ2UtczMtcGF0aFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVMzUGF0aCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS13aWR0aFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZVdpZHRoIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLWltYWdlLWhlaWdodFwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZUhlaWdodCBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1pbWFnZS1zb3VyY2VcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVTb3VyY2UgZS50YXJnZXQudmFsdWVcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG4gICAgXCJwb3B1cC1jbG9zZTogY29udGFpblwiOiAoZSkgLT4gQGRlc3Ryb3koKVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBtb2RhbENvbnRhaW4gc3RhdGVcbiAgICAoJCBcIkB0YWJzXCIpLnRhYnMoKVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuXG4gIGdldFN0YXRlOiAtPiBAc3RhdGVcblxuICB1cGRhdGVOdW1PcHRpb25zOiAodmFsdWUpIC0+XG4gICAgdmFsdWUgPSBwYXJzZUludCB2YWx1ZSwgMTBcbiAgICBudW1PcHRzID0gcGFyc2VJbnQgQHN0YXRlLm51bU9wdGlvbnMsIDEwXG4gICAgZGVmYXVsdFZhbHVlID0gcGFyc2VJbnQgQHN0YXRlLmRlZmF1bHRWYWx1ZSwgMTBcbiAgICBkZWZhdWx0RGF0YSA9IEBzdGF0ZS5kZWZhdWx0RGF0YS5zbGljZSgpXG4gICAgaWYgdmFsdWUgPiBudW1PcHRzXG4gICAgICBmb3IgaSBpbiBbbnVtT3B0cyArIDEuLnZhbHVlXVxuICAgICAgICBkZWZhdWx0RGF0YS5wdXNoIFwiXCJcbiAgICBlbHNlXG4gICAgICBmb3IgaSBpbiBbdmFsdWUgKyAxLi5udW1PcHRzXVxuICAgICAgICBkZWZhdWx0RGF0YS5wb3AoKVxuICAgICAgaWYgZGVmYXVsdFZhbHVlID49IHZhbHVlXG4gICAgICAgIEBzZXQge2RlZmF1bHRWYWx1ZX1cbiAgICBAc2V0IG51bU9wdGlvbnM6IHZhbHVlXG4gICAgQHNldCB7ZGVmYXVsdERhdGF9XG5cbiAgdXBkYXRlRGVmYXVsdFZhbHVlOiAodmFsdWUpIC0+IEBzZXQgZGVmYXVsdFZhbHVlOiBwYXJzZUludCB2YWx1ZSwgMTBcblxuICB1cGRhdGVEZWZhdWx0RGF0YU9wdGlvbjogKGluZGV4LCB2YWx1ZSkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XSA9IHZhbHVlXG4gICAgQHNldCBkZWZhdWx0RGF0YTogZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcbm1vZGFsV2luZG93VGVtcGxhdGUgPSByZXF1aXJlIFwidHlwZXMvcmFkaW8vbW9kYWwudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBpbml0aWFsOiAtPlxuICAgIEBvcHRpb25zQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtcmFkaW8tbnVtLW9wdGlvbnNcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVOdW1PcHRpb25zIGUudGFyZ2V0LnZhbHVlXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXJhZGlvLW9wdGlvblwiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZURlZmF1bHRWYWx1ZSBlLnRhcmdldC52YWx1ZVxuICAgIFwiY2hhbmdlOiBAY29uZmlncy1yYWRpby1vcHRpb24tbGFiZWxcIjogKGUpIC0+IEBtb2RlbC51cGRhdGVEZWZhdWx0RGF0YU9wdGlvbiAoQGdldEluZGV4QnlFdmVudCBlKSwgZS50YXJnZXQudmFsdWVcbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG5cbiAgZ2V0SW5kZXhCeUV2ZW50OiAoZSkgLT5cbiAgICAkaXRlbSA9ICQgZS50YXJnZXRcbiAgICAkaXRlbS5kYXRhIFwiaW5kZXhcIlxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBvcHRpb25zQ29udGFpbiBzdGF0ZVxuXG4gIHN1Ym1pdENvbmZpZ3NGb3JtOiAoZSkgLT5cbiAgICBAdHJpZ2dlciBcInNhdmUtY29uZmlncy1tb2RhbFwiLCBAbW9kZWwuZ2V0U3RhdGUoKVxuICAgIHJldHVybiBmYWxzZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBnZXRTdGF0ZTogLT4gQHN0YXRlXG5cbiAgdXBkYXRlQ29sdW1uczogKHZhbHVlKSAtPlxuICAgIHZhbHVlID0gcGFyc2VJbnQgdmFsdWUsIDEwXG4gICAgaWYgdmFsdWUgPiBAc3RhdGUuY29sdW1uc1xuICAgICAgZm9yIHJvdyBpbiBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICAgICAgZm9yIGkgaW4gW0BzdGF0ZS5jb2x1bW5zICsgMS4udmFsdWVdXG4gICAgICAgICAgcm93LnB1c2ggXCJcIlxuICAgIGVsc2UgaWYgdmFsdWUgPCBAc3RhdGUuY29sdW1uc1xuICAgICAgZm9yIHJvdyBpbiBAc3RhdGUuZGVmYXVsdERhdGFcbiAgICAgICAgZm9yIGkgaW4gW3ZhbHVlICsgMS4uQHN0YXRlLmNvbHVtbnNdXG4gICAgICAgICAgcm93LnBvcCgpXG4gICAgQHNldCBjb2x1bW5zOiB2YWx1ZVxuXG4gIHVwZGF0ZVJvd3M6ICh2YWx1ZSkgLT5cbiAgICB2YWx1ZSA9IHBhcnNlSW50IHZhbHVlLCAxMFxuICAgIGlmIHZhbHVlID4gQHN0YXRlLnJvd3NcbiAgICAgIGZvciByb3cgaW4gW0BzdGF0ZS5yb3dzICsgMS4udmFsdWVdXG4gICAgICAgIHJvdyA9IFtdXG4gICAgICAgIGZvciBpIGluIFsxLi5Ac3RhdGUuY29sdW1uc11cbiAgICAgICAgICByb3cucHVzaCBcIlwiXG4gICAgICAgIEBzdGF0ZS5kZWZhdWx0RGF0YS5wdXNoIHJvd1xuICAgIGVsc2UgaWYgdmFsdWUgPCBAc3RhdGUucm93c1xuICAgICAgZm9yIHJvdyBpbiBbdmFsdWUgKyAxLi5Ac3RhdGUucm93c11cbiAgICAgICAgQHN0YXRlLmRlZmF1bHREYXRhLnBvcCgpXG4gICAgQHNldCByb3dzOiB2YWx1ZVxuXG4gIHVwZGF0ZUNlbGxEYXRhOiAocm93LCBjb2x1bW4sIHZhbHVlKSAtPlxuICAgIGRhdGEgPSBAc3RhdGUuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIGRhdGFbcm93XVtjb2x1bW5dID0gdmFsdWVcbiAgICBAc2V0IGRlZmF1bHREYXRhOiBkYXRhXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxubW9kYWxXaW5kb3dUZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy90YWJsZS9tb2RhbC50bXBsLmpzXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+XG4gICAgQG1vZGFsQ29udGFpbiA9IFJlbmRlciBtb2RhbFdpbmRvd1RlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIGV2ZW50czpcbiAgICBcInN1Ym1pdDogQGNvbmZpZ3MtZm9ybVwiOiBcInN1Ym1pdENvbmZpZ3NGb3JtXCJcbiAgICBcImNoYW5nZTogQGNvbmZpZ3MtdGFibGUtcm93c1wiOiBcImNoYW5nZUNvbmZpZ3NUYWJsZVJvd3NcIlxuICAgIFwiY2hhbmdlOiBAY29uZmlncy10YWJsZS1jb2x1bW5zXCI6IFwiY2hhbmdlQ29uZmlnc1RhYmxlQ29sdW1uc1wiXG4gICAgXCJjaGFuZ2U6IEBjb25maWdzLXRhYmxlLWNlbGxcIjogKGUpIC0+XG4gICAgICAkY2VsbCA9ICQgZS50YXJnZXRcbiAgICAgIEBtb2RlbC51cGRhdGVDZWxsRGF0YSAoJGNlbGwuZGF0YSBcInJvd1wiKSwgKCRjZWxsLmRhdGEgXCJjb2x1bW5cIiksICgkY2VsbC52YWwoKSlcblxuICAgIFwia2V5ZG93bjogQGNvbmZpZ3MtdGFibGUtcm93c1wiOiAoZSkgLT5cbiAgICAgIEBjaGFuZ2VDb25maWdzVGFibGVSb3dzIGVcbiAgICAgIGlmIGUua2V5Q29kZSA9PSAxMyB0aGVuIGUucHJldmVudERlZmF1bHQoKVxuXG4gICAgXCJrZXlkb3duOiBAY29uZmlncy10YWJsZS1jb2x1bW5zXCI6IChlKSAtPlxuICAgICAgQGNoYW5nZUNvbmZpZ3NUYWJsZUNvbHVtbnMgZVxuICAgICAgaWYgZS5rZXlDb2RlID09IDEzIHRoZW4gZS5wcmV2ZW50RGVmYXVsdCgpXG5cbiAgICBcInBvcHVwLWNsb3NlOiBjb250YWluXCI6IChlKSAtPiBAZGVzdHJveSgpXG5cbiAgY2hhbmdlQ29uZmlnc1RhYmxlUm93czogKGUpIC0+IEBtb2RlbC51cGRhdGVSb3dzIGUudGFyZ2V0LnZhbHVlXG4gIGNoYW5nZUNvbmZpZ3NUYWJsZUNvbHVtbnM6IChlKSAtPiBAbW9kZWwudXBkYXRlQ29sdW1ucyBlLnRhcmdldC52YWx1ZVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEBtb2RhbENvbnRhaW4gc3RhdGVcblxuICBzdWJtaXRDb25maWdzRm9ybTogKGUpIC0+XG4gICAgQHRyaWdnZXIgXCJzYXZlLWNvbmZpZ3MtbW9kYWxcIiwgQG1vZGVsLmdldFN0YXRlKClcbiAgICByZXR1cm4gZmFsc2VcbiIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbiAgICB7XG4gICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy50YWJsZU1vZHVsZUZpZWxkcyA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICB9KShmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gICAgICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gICAgICB9O1xuICAgICAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBjcmVhdGUoKVxuICAgICAge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgICAgIHZhciBub2RlO1xuICAgICAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gICAgICB7XG4gICAgICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICAgICAge3dpdGggKG9iaikge3ZhciBhcnIyID0gZmllbGRzOyBmb3IgKGluZGV4IGluIGFycjIpIGlmIChfaGFzUHJvcC5jYWxsKGFycjIsIGluZGV4KSkge1xuZmllbGQgPSBhcnIyW2luZGV4XTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybS10YWJsZV9fcm93JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gaW5kZXg7XG5hdHRycy5wdXNoKFsnZGF0YS1rZXknLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0cicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gZmllbGRbJ3RpdGxlJ107XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmaWVsZC10aXRsZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtLXRhYmxlX19jZWxsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGZpZWxkWydhbGlhcyddO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZmllbGQtYWxpYXMnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybS10YWJsZV9fY2VsbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3NlbGVjdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3NlbGVjdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmaWVsZC10eXBlJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnc2VsZWN0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmhhc1NldHRpbmdzID0gZmFsc2U7dmFyIGFycjMgPSB0eXBlczsgZm9yICh0eXBlIGluIGFycjMpIGlmIChfaGFzUHJvcC5jYWxsKGFycjMsIHR5cGUpKSB7XG50eXBlID0gYXJyM1t0eXBlXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSB0eXBlWydhbGlhcyddO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbmlmICggZmllbGRbJ3R5cGUnXSA9PSB0eXBlWydhbGlhcyddKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydzZWxlY3RlZCcsIGF0dHJdKTtcbn0pKCk7XG59XG5jaGlsZHMucHVzaChjcmVhdGUoJ29wdGlvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCh0eXBlWyduYW1lJ10pXG59KSk7XG59KSgpO1xuaWYgKCBmaWVsZFsndHlwZSddID09IHR5cGVbJ2FsaWFzJ10pIHtcbmlmICggdHlwZVsnaGFzU2V0dGluZ3MnXSkge1xuaGFzU2V0dGluZ3MgPSB0cnVlO31cbn1cbn19KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm0tdGFibGVfX2NlbGwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuaWYgKCBoYXNTZXR0aW5ncykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnRuLWNvbmZpZy1maWVsZCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J0nKTtcbn0pKTtcbn0pKCk7XG59XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtLXRhYmxlX19jZWxsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmlmICggY291bnQoZmllbGRzKSA+IDEpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J0bi1yZW1vdmUtZmllbGQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ1gnKTtcbn0pKTtcbn0pKCk7XG59XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19fSl9O1xuICAgIH0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbiAgICB7XG4gICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5tb2RhbCA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICB9KShmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gICAgICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gICAgICB9O1xuICAgICAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBjcmVhdGUoKVxuICAgICAge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgICAgIHZhciBub2RlO1xuICAgICAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gICAgICB7XG4gICAgICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICAgICAge3dpdGggKG9iaikgeyhmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncG9wdXBfX2hlYWQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQndCw0YHRgtGA0L7QudC60Lgg0YTQu9Cw0LbQutC+0LInKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydhY3Rpb24nLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtbnVtLW9wdGlvbnMnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQmtC+0LvQuNGH0LXRgdGC0LLQviDQstCw0YDQuNCw0L3RgtC+0LIg0L7RgtCy0LXRgtCwJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IG51bU9wdGlvbnM7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW51bS1vcHRpb25zJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1udW0tb3B0aW9ucyc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9CS0LDRgNC40LDQvdGC0Ysg0L7RgtCy0LXRgtC+0LI6Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW9wdGlvbnMtY29udGFpbic7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG52YXIgYXJyNSA9IGRlZmF1bHREYXRhOyBmb3IgKGkgaW4gYXJyNSkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyNSwgaSkpIHtcbm9wdGlvbiA9IGFycjVbaV07XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3Jvdy1vcHRpb24nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY2hlY2tib3gnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19jaGVja2JveCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW9wdGlvbic7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gaTtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gaTtcbmF0dHJzLnB1c2goWydkYXRhLWluZGV4JywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1jaGVja2JveC1vcHRpb24tJztcbmF0dHIgKz0gaTtcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtY2hlY2tib3gtb3B0aW9uJztcbmF0dHJzLnB1c2goWyduYW1lJywgYXR0cl0pO1xufSkoKTtcbmlmICggb3B0aW9uWydjaGVja2VkJ10gPT0gdHJ1ZSB8fCBvcHRpb25bJ2NoZWNrZWQnXSA9PSBcInRydWVcIikge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnY2hlY2tlZCcsIGF0dHJdKTtcbn0pKCk7XG59XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLWhhbGYtd2lkdGgnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBvcHRpb25bJ2xhYmVsJ107XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWNoZWNrYm94LW9wdGlvbi1sYWJlbCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gaTtcbmF0dHJzLnB1c2goWydkYXRhLWluZGV4JywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ch0L7RhdGA0LDQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQntGC0LzQtdC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59fSl9O1xuICAgIH0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbiAgICB7XG4gICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5tb2RhbCA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICB9KShmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gICAgICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gICAgICB9O1xuICAgICAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBjcmVhdGUoKVxuICAgICAge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgICAgIHZhciBub2RlO1xuICAgICAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gICAgICB7XG4gICAgICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICAgICAge3dpdGggKG9iaikgeyhmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncG9wdXBfX2hlYWQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQndCw0YHRgtGA0L7QudC60Lgg0YTQsNC50LvQsCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1mb3JtJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cl0YDQsNC90LjQu9C40YnQtScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFicyc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzX19pdGVtJztcbmlmICggc3RvcmFnZSA9PSBcImxvY2FsXCIpIHtcbmF0dHIgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xufVxuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFicyBjb25maWdzLWZpbGUtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnbG9jYWwnO1xuYXR0cnMucHVzaChbJ2RhdGEtdmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1sb2NhbCc7XG5hdHRycy5wdXNoKFsnZGF0YS1mcmFtZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JvQvtC60LDQu9GM0L3QvtC1Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdidXR0b24nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzX19pdGVtJztcbmlmICggc3RvcmFnZSA9PSBcInMzXCIpIHtcbmF0dHIgKz0gJyB0YWJzX19pdGVtLS1hY3RpdmUnO1xufVxuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFicyBjb25maWdzLWZpbGUtc3RvcmFnZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnczMnO1xuYXR0cnMucHVzaChbJ2RhdGEtdmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1zMyc7XG5hdHRycy5wdXNoKFsnZGF0YS1mcmFtZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnUzMnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLWxvY2FsIGNvbmZpZ3MtZmlsZS1tb2RhbC1zdG9yYWdlLWZyYW1lJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc3RvcmFnZSAhPSBcImxvY2FsXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZGlzcGxheTogbm9uZSc7XG5hdHRycy5wdXNoKFsnc3R5bGUnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1wYXRoJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J/Rg9GC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBwYXRoO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXBhdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtcGF0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1zMyBjb25maWdzLWZpbGUtbW9kYWwtc3RvcmFnZS1mcmFtZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIHN0b3JhZ2UgIT0gXCJzM1wiKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Rpc3BsYXk6IG5vbmUnO1xuYXR0cnMucHVzaChbJ3N0eWxlJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ0FjY2VzcyBrZXknKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzM0FjY2Vzc0tleTtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnU2VjcmV0IGtleScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncGFzc3dvcmQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtc2VjcmV0LWtleSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ0J1Y2tldCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHMzQnVja2V0O1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1maWxlLXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J/Rg9GC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBzM1BhdGg7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZpbGUtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZmlsZS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQodC+0YXRgNCw0L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J7RgtC80LXQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pfTtcbiAgICB9KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHsoZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3BvcHVwX19oZWFkJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INCz0LDQu9C10YDQtdC4Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZvcm0nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KXRgNCw0L3QuNC70LjRidC1Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuaWYgKCBzdG9yYWdlID09IFwibG9jYWxcIikge1xuYXR0ciArPSAnIHRhYnNfX2l0ZW0tLWFjdGl2ZSc7XG59XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzIGNvbmZpZ3MtZ2FsbGVyeS1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ2RhdGEtZ3JvdXAnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdsb2NhbCc7XG5hdHRycy5wdXNoKFsnZGF0YS12YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLWxvY2FsJztcbmF0dHJzLnB1c2goWydkYXRhLWZyYW1lJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQm9C+0LrQsNC70YzQvdC+0LUnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnNfX2l0ZW0nO1xuaWYgKCBzdG9yYWdlID09IFwiczNcIikge1xuYXR0ciArPSAnIHRhYnNfX2l0ZW0tLWFjdGl2ZSc7XG59XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJzIGNvbmZpZ3MtZ2FsbGVyeS1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UnO1xuYXR0cnMucHVzaChbJ2RhdGEtZ3JvdXAnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdzMyc7XG5hdHRycy5wdXNoKFsnZGF0YS12YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLXMzJztcbmF0dHJzLnB1c2goWydkYXRhLWZyYW1lJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdTMycpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtbG9jYWwgY29uZmlncy1nYWxsZXJ5LW1vZGFsLXN0b3JhZ2UtZnJhbWUnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuaWYgKCBzdG9yYWdlICE9IFwibG9jYWxcIikge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdkaXNwbGF5OiBub25lJztcbmF0dHJzLnB1c2goWydzdHlsZScsIGF0dHJdKTtcbn0pKCk7XG59XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXBhdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQn9GD0YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHBhdGg7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktcGF0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wYXRoJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLXMzIGNvbmZpZ3MtZ2FsbGVyeS1tb2RhbC1zdG9yYWdlLWZyYW1lJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc3RvcmFnZSAhPSBcInMzXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZGlzcGxheTogbm9uZSc7XG5hdHRycy5wdXNoKFsnc3R5bGUnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnQWNjZXNzIGtleScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHMzQWNjZXNzS2V5O1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWFjY2Vzcy1rZXknO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdTZWNyZXQga2V5Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdwYXNzd29yZCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtc2VjcmV0LWtleSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1zZWNyZXQta2V5JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnQnVja2V0Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gczNCdWNrZXQ7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLWJ1Y2tldCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXBhdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQn9GD0YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHMzUGF0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXMzLXBhdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktd2lkdGgnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQo9C80LXQvdGM0YjQuNGC0Ywg0L7RgNC40LPQuNC90LDQuyDQtNC+INGA0LDQt9C80LXRgNCwJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHdpZHRoO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXdpZHRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXdpZHRoJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2JldHdlZW4taW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3NwYW4nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ8OXJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGhlaWdodDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1oZWlnaHQnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19oaW50JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JXRgdC70Lgg0L3QtSDQt9Cw0LTQsNGC0Ywg0LfQvdCw0YfQtdC90LjQtSwg0L7QvdC+INCx0YPQtNC10YIg0LLRi9GH0LjRgdC70LXQvdC+INC/0YDQvtC/0L7RgNGG0LjQvtC90LDQu9GM0L3QvicpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS13aWR0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cg0LDQt9C80LXRgCDQv9GA0LXQstGM0Y4nKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluIGZvcm1fX2lucC1jb250YWluLS1mdWxsLXdpZHRoJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gcHJldmlld1dpZHRoO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1nYWxsZXJ5LXByZXZpZXctd2lkdGgnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWdhbGxlcnktd2lkdGgnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYmV0d2Vlbi1pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnc3BhbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnw5cnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gcHJldmlld0hlaWdodDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZ2FsbGVyeS1wcmV2aWV3LWhlaWdodCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2hpbnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQldGB0LvQuCDQvdC1INC30LDQtNCw0YLRjCDQt9C90LDRh9C10L3QuNC1LCDQvtC90L4g0LHRg9C00LXRgiDQstGL0YfQuNGB0LvQtdC90L4g0L/RgNC+0L/QvtGA0YbQuNC+0L3QsNC70YzQvdC+Jyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQodC+0YXRgNCw0L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J7RgtC80LXQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pfTtcbiAgICB9KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHsoZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3BvcHVwX19oZWFkJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INC40LfQvtCx0YDQsNC20LXQvdC40Y8nKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydhY3Rpb24nLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtZm9ybSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQpdGA0LDQvdC40LvQuNGJ0LUnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFic19faXRlbSc7XG5pZiAoIHN0b3JhZ2UgPT0gXCJsb2NhbFwiKSB7XG5hdHRyICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMgY29uZmlncy1pbWFnZS1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnbG9jYWwnO1xuYXR0cnMucHVzaChbJ2RhdGEtdmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UtbG9jYWwnO1xuYXR0cnMucHVzaChbJ2RhdGEtZnJhbWUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cb0L7QutCw0LvRjNC90L7QtScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFic19faXRlbSc7XG5pZiAoIHN0b3JhZ2UgPT0gXCJzM1wiKSB7XG5hdHRyICs9ICcgdGFic19faXRlbS0tYWN0aXZlJztcbn1cbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYnMgY29uZmlncy1pbWFnZS1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlJztcbmF0dHJzLnB1c2goWydkYXRhLWdyb3VwJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnczMnO1xuYXR0cnMucHVzaChbJ2RhdGEtdmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UtczMnO1xuYXR0cnMucHVzaChbJ2RhdGEtZnJhbWUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ1MzJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UtbG9jYWwgY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWZyYW1lJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc3RvcmFnZSAhPSBcImxvY2FsXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZGlzcGxheTogbm9uZSc7XG5hdHRycy5wdXNoKFsnc3R5bGUnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtcGF0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cf0YPRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gcGF0aDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtcGF0aCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtcGF0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLW1vZGFsLXN0b3JhZ2UtczMgY29uZmlncy1pbWFnZS1tb2RhbC1zdG9yYWdlLWZyYW1lJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmlmICggc3RvcmFnZSAhPSBcInMzXCIpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZGlzcGxheTogbm9uZSc7XG5hdHRycy5wdXNoKFsnc3R5bGUnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYWNjZXNzLWtleSc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ0FjY2VzcyBrZXknKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAgdHlwZW9mIHMzQWNjZXNzS2V5ICE9PSAndW5kZWZpbmVkJyA/IHMzQWNjZXNzS2V5IDogJycgO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1hY2Nlc3Mta2V5JztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCdTZWNyZXQga2V5Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdwYXNzd29yZCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXMzLXNlY3JldC1rZXknO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgnQnVja2V0Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gIHR5cGVvZiBzM0J1Y2tldCAhPT0gJ3VuZGVmaW5lZCcgPyBzM0J1Y2tldCA6ICcnIDtcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtYnVja2V0JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1idWNrZXQnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2UtczMtcGF0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cf0YPRgtGMJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gIHR5cGVvZiBzM1BhdGggIT09ICd1bmRlZmluZWQnID8gczNQYXRoIDogJycgO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zMy1wYXRoJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS13aWR0aCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cj0LzQtdC90YzRiNC40YLRjCDQtNC+INGA0LDQt9C80LXRgNCwJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbiBmb3JtX19pbnAtY29udGFpbi0tZnVsbC13aWR0aCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICB0eXBlb2Ygd2lkdGggIT09ICd1bmRlZmluZWQnID8gd2lkdGggOiAnJyA7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXdpZHRoJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS13aWR0aCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19iZXR3ZWVuLWlucCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfDlycpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAgdHlwZW9mIGhlaWdodCAhPT0gJ3VuZGVmaW5lZCcgPyBoZWlnaHQgOiAnJyA7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLWhlaWdodCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2hpbnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQldGB0LvQuCDQvdC1INC30LDQtNCw0YLRjCDQt9C90LDRh9C10L3QuNC1LCDQvtC90L4g0LHRg9C00LXRgiDQstGL0YfQuNGB0LvQtdC90L4g0L/RgNC+0L/QvtGA0YbQuNC+0L3QsNC70YzQvdC+Jyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1pbWFnZS1zb3VyY2UnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQmNGB0YLQvtGH0L3QuNC6Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdzZWxlY3QnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWltYWdlLXNvdXJjZSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtaW1hZ2Utc291cmNlJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3NlbGVjdCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3VwbG9hZCc7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuaWYgKCBzb3VyY2UgPT0gXCJ1cGxvYWRcIikge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnc2VsZWN0ZWQnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdvcHRpb24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9CX0LDQs9GA0YPQt9C40YLRjCDQuNC30L7QsdGA0LDQttC10L3QuNC1Jyk7XG59KSk7XG59KSgpO1xuaWYgKCAgdHlwZW9mIHNvdXJjZXMgIT09ICd1bmRlZmluZWQnID8gc291cmNlcyA6ICcnICkge1xudmFyIGFycjAgPSBzb3VyY2VzOyBmb3IgKHNvdXJjZUl0ZW0gaW4gYXJyMCkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyMCwgc291cmNlSXRlbSkpIHtcbnNvdXJjZUl0ZW0gPSBhcnIwW3NvdXJjZUl0ZW1dO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHNvdXJjZUl0ZW1bJ2FsaWFzJ107XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuaWYgKCBzb3VyY2UgPT0gc291cmNlSXRlbVsnYWxpYXMnXSkge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnc2VsZWN0ZWQnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdvcHRpb24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goc291cmNlSXRlbVsnbGFiZWwnXSlcbn0pKTtcbn0pKCk7XG59fVxufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ch0L7RhdGA0LDQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQntGC0LzQtdC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59fSl9O1xuICAgIH0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbiAgICB7XG4gICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5tb2RhbCA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICB9KShmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gICAgICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gICAgICB9O1xuICAgICAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBjcmVhdGUoKVxuICAgICAge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgICAgIHZhciBub2RlO1xuICAgICAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gICAgICB7XG4gICAgICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICAgICAge3dpdGggKG9iaikgeyhmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncG9wdXBfX2hlYWQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQndCw0YHRgtGA0L7QudC60Lgg0L/QtdGA0LXQutC70Y7Rh9Cw0YLQtdC70LXQuScpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2FjdGlvbicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1mb3JtJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2l0ZW0nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1yYWRpby1udW0tb3B0aW9ucyc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ca0L7Qu9C40YfQtdGB0YLQstC+INCy0LDRgNC40LDQvdGC0L7QsiDQvtGC0LLQtdGC0LAnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS12ZXJ5LXNob3J0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gbnVtT3B0aW9ucztcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tbnVtLW9wdGlvbnMnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXJhZGlvLW51bS1vcHRpb25zJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19sYWJlbCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JLQsNGA0LjQsNC90YLRiyDQvtGC0LLQtdGC0L7QsjonKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucC1jb250YWluIGZvcm1fX2lucC1jb250YWluLS1mdWxsLXdpZHRoJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3Jvdy1vcHRpb24nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAncmFkaW8nO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19jaGVja2JveCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXJhZGlvLW9wdGlvbic7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJy0xJztcbmF0dHJzLnB1c2goWyd2YWx1ZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLS0xJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uJztcbmF0dHJzLnB1c2goWyduYW1lJywgYXR0cl0pO1xufSkoKTtcbmlmICggZGVmYXVsdFZhbHVlID09IC0xIHx8IGRlZmF1bHRWYWx1ZSA9PSAtMSkge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnY2hlY2tlZCcsIGF0dHJdKTtcbn0pKCk7XG59XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uLS0xJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ2knLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cd0LjRh9C10LPQviDQvdC1INCy0YvQsdGA0LDQvdC+INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9ucy1jb250YWluJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbnZhciBhcnI2ID0gZGVmYXVsdERhdGE7IGZvciAoaSBpbiBhcnI2KSBpZiAoX2hhc1Byb3AuY2FsbChhcnI2LCBpKSkge1xub3B0aW9uID0gYXJyNltpXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fcm93LW9wdGlvbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdyYWRpbyc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2NoZWNrYm94JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBpO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1yYWRpby1vcHRpb24tJztcbmF0dHIgKz0gaTtcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtcmFkaW8tb3B0aW9uJztcbmF0dHJzLnB1c2goWyduYW1lJywgYXR0cl0pO1xufSkoKTtcbmlmICggZGVmYXVsdFZhbHVlID09IGkpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2NoZWNrZWQnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RleHQnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAgZm9ybV9faW5wLS1oYWxmLXdpZHRoJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gb3B0aW9uO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy1yYWRpby1vcHRpb24tbGFiZWwnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGk7XG5hdHRycy5wdXNoKFsnZGF0YS1pbmRleCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX3N1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4gZm9ybV9fYnRuLS1zdWJtaXQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQodC+0YXRgNCw0L3QuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2J1dHRvbic7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBwb3B1cF9fY2FuY2VsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J7RgtC80LXQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pfTtcbiAgICB9KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubW9kYWwgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHsoZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3BvcHVwX19oZWFkJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0J3QsNGB0YLRgNC+0LnQutC4INGC0LDQsdC70LjRhtGLJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLWZvcm0nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLWNvbHVtbnMnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQmtC+0LvQvtC90L7QuiDQv9C+INGD0LzQvtC70YfQsNC90LjRjicpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBjb2x1bW5zO1xuYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1jb2x1bW5zJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY29uZmlncy10YWJsZS1jb2x1bW5zJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faXRlbSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLXJvd3MnO1xuYXR0cnMucHVzaChbJ2ZvcicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2xhYmVsJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xhYmVsJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQodGC0YDQvtC6INC/0L4g0YPQvNC+0LvRh9Cw0L3QuNGOJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pbnAtY29udGFpbic7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0ZXh0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wIGZvcm1fX2lucC0tdmVyeS1zaG9ydCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHJvd3M7XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLXJvd3MnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLXJvd3MnO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtcm93cyc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fbGFiZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Co0LDQsdC70L7QvSDQv9C+INGD0LzQvtC70YfQsNC90LjRjicpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9faW5wLWNvbnRhaW4gZm9ybV9faW5wLWNvbnRhaW4tLWZ1bGwtd2lkdGggZm9ybV9faW5wLWNvbnRhaW4tLXNjcm9sbC13cmFwJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3RhYmxlIHRhYmxlLS1zdHJhaWdodC1zaWRlcyB0YWJsZS0tcmVzcG9uc2l2ZSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0YWJsZScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NvbmZpZ3MtdGFibGUtdGJvZHknO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0Ym9keScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG52YXIgYXJyOCA9IGRlZmF1bHREYXRhOyBmb3IgKHJvd0luZGV4IGluIGFycjgpIGlmIChfaGFzUHJvcC5jYWxsKGFycjgsIHJvd0luZGV4KSkge1xucm93ID0gYXJyOFtyb3dJbmRleF07XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RyJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbnZhciBhcnI5ID0gcm93OyBmb3IgKGNvbHVtbkluZGV4IGluIGFycjkpIGlmIChfaGFzUHJvcC5jYWxsKGFycjksIGNvbHVtbkluZGV4KSkge1xuY29sdW1uID0gYXJyOVtjb2x1bW5JbmRleF07XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGV4dCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2lucCBmb3JtX19pbnAtLXZlcnktc2hvcnQnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBjb2x1bW47XG5hdHRycy5wdXNoKFsndmFsdWUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjb25maWdzLXRhYmxlLWNlbGwnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IHJvd0luZGV4O1xuYXR0cnMucHVzaChbJ2RhdGEtcm93JywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSBjb2x1bW5JbmRleDtcbmF0dHJzLnB1c2goWydkYXRhLWNvbHVtbicsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pKTtcbn0pKCk7XG59fSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fc3VibWl0JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2Zvcm1fX2J0biBmb3JtX19idG4tLXN1Ym1pdCc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Ch0L7RhdGA0LDQvdC40YLRjCcpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYnV0dG9uJztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuIHBvcHVwX19jYW5jZWwnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQntGC0LzQtdC90LjRgtGMJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59fSl9O1xuICAgIH0pOyJdfQ==
