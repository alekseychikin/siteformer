(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, AddModel, AddView, addModel, addView, httpGet, models, views;

$ = require("jquery-plugins.coffee");

httpGet = (require("ajax.coffee")).httpGet;

AddModel = require("./addModel.coffee");

addModel = AddModel();

AddView = require("./addView.coffee");

addView = AddView($("@item-add-form"), addModel);

addView.on("save", function(fields) {
  return console.log(fields);
});

models = {
  string: require("string/addStringModel.coffee"),
  table: require("table/addTableModel.coffee"),
  checkbox: require("checkbox/addCheckboxModel.coffee"),
  radio: require("radio/addRadioModel.coffee")
};

views = {
  string: require("string/addStringView.coffee"),
  table: require("table/addTableView.coffee"),
  checkbox: require("checkbox/addCheckboxView.coffee"),
  radio: require("radio/addRadioView.coffee")
};

httpGet(window.location.href + "__json/").then(function(response) {
  var $rows, field, i, index, len, model, ref, results;
  $rows = $("@input-contain");
  index = 0;
  ref = response.fields;
  results = [];
  for (i = 0, len = ref.length; i < len; i++) {
    field = ref[i];
    if (models[field.type] != null) {
      model = models[field.type]();
      if (typeof model.setSettings === "function") {
        model.setSettings(field.settings);
      }
      views[field.type]($rows.eq(index), model);
      addModel.add(field.alias, model);
    }
    if ((field.settings.hide == null) || ((field.settings.hide != null) && !field.settings.hide)) {
      results.push(index++);
    } else {
      results.push(void 0);
    }
  }
  return results;
});


},{"./addModel.coffee":2,"./addView.coffee":3,"ajax.coffee":"ajax.coffee","checkbox/addCheckboxModel.coffee":4,"checkbox/addCheckboxView.coffee":5,"jquery-plugins.coffee":"jquery-plugins.coffee","radio/addRadioModel.coffee":6,"radio/addRadioView.coffee":7,"string/addStringModel.coffee":8,"string/addStringView.coffee":9,"table/addTableModel.coffee":10,"table/addTableView.coffee":11}],2:[function(require,module,exports){
var Model, httpGet;

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

module.exports = Model({
  initialState: function() {
    return {
      fields: []
    };
  },
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
  getFields: function() {
    var result;
    result = {};
    this.state.fields.map(function(item) {
      return result[item.name] = item.model.get();
    });
    return result;
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],3:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "submit: contain": function(e) {
      this.trigger("save", this.model.getFields());
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


},{"model.coffee":"model.coffee"}],7:[function(require,module,exports){
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


},{"view.coffee":"view.coffee"}],8:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],9:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @string": function(e) {
      return this.model.update(e.target.value);
    }
  }
});


},{"view.coffee":"view.coffee"}],10:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],11:[function(require,module,exports){
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


},{"view.coffee":"view.coffee"}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9pdGVtL2FkZC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9pdGVtL2FkZE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2l0ZW0vYWRkVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9jaGVja2JveC9hZGRDaGVja2JveE1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L2FkZENoZWNrYm94Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9yYWRpby9hZGRSYWRpb01vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3JhZGlvL2FkZFJhZGlvVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9zdHJpbmcvYWRkU3RyaW5nTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvc3RyaW5nL2FkZFN0cmluZ1ZpZXcuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvdGFibGUvYWRkVGFibGVNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy90YWJsZS9hZGRUYWJsZVZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLHVCQUFSOztBQUNKLE9BQUEsR0FBVSxDQUFDLE9BQUEsQ0FBUSxhQUFSLENBQUQsQ0FBdUIsQ0FBQzs7QUFFbEMsUUFBQSxHQUFXLE9BQUEsQ0FBUSxtQkFBUjs7QUFDWCxRQUFBLEdBQVcsUUFBQSxDQUFBOztBQUVYLE9BQUEsR0FBVSxPQUFBLENBQVEsa0JBQVI7O0FBRVYsT0FBQSxHQUFVLE9BQUEsQ0FBUyxDQUFBLENBQUUsZ0JBQUYsQ0FBVCxFQUE4QixRQUE5Qjs7QUFFVixPQUFPLENBQUMsRUFBUixDQUFX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QUFBLGVBQUEsRUFBaUIsU0FBQyxDQUFEO0FBQ2YsVUFBQTtNQUFBLE1BQUEsR0FBUyxDQUFBLENBQUUsQ0FBQyxDQUFDLE1BQUo7TUFDVCxRQUFBLEdBQVcsQ0FBRSxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQVo7TUFDYixXQUFBLEdBQWMsQ0FBRSxNQUFNLENBQUMsSUFBUCxDQUFZLFFBQVo7YUFDaEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxNQUFQLENBQWMsUUFBZCxFQUF3QixXQUF4QixFQUFxQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQTlDO0lBSmUsQ0FBakI7R0FERjtDQURlIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiQgPSByZXF1aXJlIFwianF1ZXJ5LXBsdWdpbnMuY29mZmVlXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcblxuQWRkTW9kZWwgPSByZXF1aXJlIFwiLi9hZGRNb2RlbC5jb2ZmZWVcIlxuYWRkTW9kZWwgPSBBZGRNb2RlbCgpXG5cbkFkZFZpZXcgPSByZXF1aXJlIFwiLi9hZGRWaWV3LmNvZmZlZVwiXG5cbmFkZFZpZXcgPSBBZGRWaWV3ICgkIFwiQGl0ZW0tYWRkLWZvcm1cIiksIGFkZE1vZGVsXG5cbmFkZFZpZXcub24gXCJzYXZlXCIsIChmaWVsZHMpIC0+XG4gIGNvbnNvbGUubG9nIGZpZWxkc1xuXG5tb2RlbHMgPVxuICBzdHJpbmc6IHJlcXVpcmUgXCJzdHJpbmcvYWRkU3RyaW5nTW9kZWwuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9hZGRUYWJsZU1vZGVsLmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvYWRkQ2hlY2tib3hNb2RlbC5jb2ZmZWVcIlxuICByYWRpbzogcmVxdWlyZSBcInJhZGlvL2FkZFJhZGlvTW9kZWwuY29mZmVlXCJcblxudmlld3MgPVxuICBzdHJpbmc6IHJlcXVpcmUgXCJzdHJpbmcvYWRkU3RyaW5nVmlldy5jb2ZmZWVcIlxuICB0YWJsZTogcmVxdWlyZSBcInRhYmxlL2FkZFRhYmxlVmlldy5jb2ZmZWVcIlxuICBjaGVja2JveDogcmVxdWlyZSBcImNoZWNrYm94L2FkZENoZWNrYm94Vmlldy5jb2ZmZWVcIlxuICByYWRpbzogcmVxdWlyZSBcInJhZGlvL2FkZFJhZGlvVmlldy5jb2ZmZWVcIlxuXG5odHRwR2V0IFwiI3t3aW5kb3cubG9jYXRpb24uaHJlZn1fX2pzb24vXCJcbi50aGVuIChyZXNwb25zZSkgLT5cbiAgJHJvd3MgPSAkIFwiQGlucHV0LWNvbnRhaW5cIlxuICBpbmRleCA9IDBcbiAgZm9yIGZpZWxkIGluIHJlc3BvbnNlLmZpZWxkc1xuICAgIGlmIG1vZGVsc1tmaWVsZC50eXBlXT9cbiAgICAgIG1vZGVsID0gbW9kZWxzW2ZpZWxkLnR5cGVdKClcbiAgICAgIG1vZGVsLnNldFNldHRpbmdzPyBmaWVsZC5zZXR0aW5nc1xuICAgICAgdmlld3NbZmllbGQudHlwZV0gJHJvd3MuZXEoaW5kZXgpLCBtb2RlbFxuICAgICAgYWRkTW9kZWwuYWRkIGZpZWxkLmFsaWFzLCBtb2RlbFxuICAgIGlmICFmaWVsZC5zZXR0aW5ncy5oaWRlPyB8fCAoZmllbGQuc2V0dGluZ3MuaGlkZT8gJiYgIWZpZWxkLnNldHRpbmdzLmhpZGUpXG4gICAgICBpbmRleCsrXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuaHR0cEdldCA9IChyZXF1aXJlIFwiYWpheC5jb2ZmZWVcIikuaHR0cEdldFxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIGluaXRpYWxTdGF0ZTogLT5cbiAgICBmaWVsZHM6IFtdXG5cbiAgYWRkOiAobmFtZSwgbW9kZWwpIC0+XG4gICAgZmllbGRzID0gQHN0YXRlLmZpZWxkcy5zbGljZSgpXG4gICAgZmllbGRzLnB1c2hcbiAgICAgIG1vZGVsOiBtb2RlbFxuICAgICAgbmFtZTogbmFtZVxuICAgIEBzZXQge2ZpZWxkc31cblxuICBnZXRGaWVsZHM6IC0+XG4gICAgcmVzdWx0ID0ge31cbiAgICBAc3RhdGUuZmllbGRzLm1hcCAoaXRlbSkgLT5cbiAgICAgIHJlc3VsdFtpdGVtLm5hbWVdID0gaXRlbS5tb2RlbC5nZXQoKVxuICAgIHJlc3VsdFxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJzdWJtaXQ6IGNvbnRhaW5cIjogKGUpIC0+XG4gICAgICBAdHJpZ2dlciBcInNhdmVcIiwgQG1vZGVsLmdldEZpZWxkcygpXG4gICAgICByZXR1cm4gZmFsc2VcbiIsIk1vZGVsID0gcmVxdWlyZSBcIm1vZGVsLmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gTW9kZWxcbiAgc2V0U2V0dGluZ3M6IChzZXR0aW5ncykgLT5cbiAgICBkYXRhID0gW11cbiAgICBkYXRhID0gc2V0dGluZ3MuZGVmYXVsdERhdGEuc2xpY2UoKVxuICAgIHNldHRpbmdzLmRlZmF1bHREYXRhLnNsaWNlKCkubWFwIChpdGVtLCBpbmRleCkgLT4gaWYgKHR5cGVvZiBpdGVtLmNoZWNrZWQpID09IFwic3RyaW5nXCIgdGhlbiBkYXRhW2luZGV4XSA9IGl0ZW0uY2hlY2tlZCA9PSBcInRydWVcIiBlbHNlIGRhdGFbaW5kZXhdID0gaXRlbS5jaGVja2VkXG4gICAgQHNldCB7ZGF0YX1cblxuICB1cGRhdGU6IChpbmRleCwgY2hlY2tlZCkgLT5cbiAgICBkYXRhID0gQHN0YXRlLmRhdGEuc2xpY2UoKVxuICAgIGRhdGFbaW5kZXhdID0gY2hlY2tlZFxuICAgIEBzZXQge2RhdGF9XG5cbiAgZ2V0OiAtPiBAc3RhdGUuZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBjaGVja2JveFwiOiAoZSkgLT5cbiAgICAgICRpbnB1dCA9ICQgZS50YXJnZXRcbiAgICAgIGluZGV4ID0gJGlucHV0LmRhdGEgXCJpbmRleFwiXG4gICAgICBAbW9kZWwudXBkYXRlIGluZGV4LCBlLnRhcmdldC5jaGVja2VkXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFNldHRpbmdzOiAoc2V0dGluZ3MpIC0+XG4gICAgQHNldCB2YWx1ZTogKyBzZXR0aW5ncy5kZWZhdWx0VmFsdWVcblxuICB1cGRhdGU6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHZhbHVlOiArIHZhbHVlXG5cbiAgZ2V0OiAtPiBAc3RhdGUudmFsdWVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAcmFkaW9cIjogKGUpIC0+XG4gICAgICAkaW5wdXQgPSAkIGUudGFyZ2V0XG4gICAgICBAbW9kZWwudXBkYXRlICRpbnB1dC5kYXRhIFwiaW5kZXhcIlxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRTZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgIEBzZXQgdmFsdWU6IHNldHRpbmdzLmRlZmF1bHRWYWx1ZVxuXG4gIHVwZGF0ZTogKHZhbHVlKSAtPlxuICAgIEBzZXQge3ZhbHVlfVxuXG4gIGdldDogLT4gQHN0YXRlLnZhbHVlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGV2ZW50czpcbiAgICBcImNoYW5nZTogQHN0cmluZ1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZSBlLnRhcmdldC52YWx1ZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRTZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgIEBzZXQgZGF0YTogc2V0dGluZ3MuZGVmYXVsdERhdGEuc2xpY2UoKVxuXG4gIHVwZGF0ZTogKHJvd0luZGV4LCBjb2x1bW5JbmRleCwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kYXRhLnNsaWNlKClcbiAgICBkYXRhW3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSB2YWx1ZVxuICAgIEBzZXQge2RhdGF9XG5cbiAgZ2V0OiAtPiBAc3RhdGUuZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBjZWxsXCI6IChlKSAtPlxuICAgICAgJGlucHV0ID0gJCBlLnRhcmdldFxuICAgICAgcm93SW5kZXggPSArICRpbnB1dC5kYXRhIFwicm93XCJcbiAgICAgIGNvbHVtbkluZGV4ID0gKyAkaW5wdXQuZGF0YSBcImNvbHVtblwiXG4gICAgICBAbW9kZWwudXBkYXRlIHJvd0luZGV4LCBjb2x1bW5JbmRleCwgZS50YXJnZXQudmFsdWVcbiJdfQ==
