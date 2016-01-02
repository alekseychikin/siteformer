(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (factory)
{
  window.count = function (arr)
  {
    return arr.length;
  };
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory;
  }
  else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define('render', [], factory);
  }
  else {
    window.render = factory;
  }
})(function (handleFn, node)
{
  var _hasProp = Object.prototype.hasOwnProperty;
  var nodeObjects = [];

  function cloneObject(obj, cachedElements)
  {
    var attr, copy, elem, i, j, len;
    if (typeof cachedElements === 'undefined') {
      cachedElements = [];
    }
    copy = null;
    if (null === obj || "object" !== typeof obj) {
      return obj;
    }
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }
    if ((cachedElements.indexOf(obj)) === -1) {
      cachedElements.push(obj);
      if (obj instanceof Array) {
        copy = [];
        for (i = j = 0, len = obj.length; j < len; i = ++j) {
          elem = obj[i];
          copy[i] = cloneObject(elem, cachedElements);
        }
        return copy;
      }
      if (obj instanceof Object) {
        copy = {};
        for (i in obj) {
          attr = obj[i];
          copy[i] = cloneObject(attr, cachedElements);
        }
        return copy;
      }
    }
    else {
      return obj;
    }
  }

  function isEqualArrays(sourceA, sourceB)
  {
    // each fields of source array and check them at dest array
    // if it not exists or not equals then return false
    if (!isEqualArraysForeach(sourceA, sourceB)) return false;

    // do the same thing with dest array
    // if dest field not exists in source array
    // or not empty then return false
    if (!isEqualArraysForeach(sourceB, sourceA)) return false;

    // if everything fine return true
    // arrays are equals
    return true;
  }

  function isEqualArraysForeach(sourceA, sourceB)
  {
    var key, value;
    for (key in sourceA) {
      if (_hasProp.call(sourceA, key)) {
        if (key === 'childs') continue;
        if (typeof sourceB[key] === 'undefined') return false;
        value = sourceA[key];
        if (['string', 'boolean', 'number'].indexOf(typeof value) !== -1) {
          if (value !== sourceB[key]) return false;
        }
        else {
          var diffResult = isEqualArrays(value, sourceB[key]);
          if (!diffResult) return false;
        }
      }
    }
    return true;
  }

  var arrDifference = (function ()
  {
    var res;
    var indexA;
    var indexB;
    var buffer;
    var _hasProp = Object.prototype.hasOwnProperty;
    var i;

    function putElementInResWithMark(res, element, mark, origin)
    {
      element = {
        mark: mark,
        element: element
      };
      if (typeof origin !== 'undefined') {
        element.origin = origin;
      }
      res.push(element);
    }

    function putBufferElementsInRes(buffer, res, index, source)
    {
      if (index < 0) {
        index = -index - 1;
        for (i = 0; i < index; i++) {
          putElementInResWithMark(res, buffer.elements[i], 'edit', source[buffer.indexesB[i]]);
        }
        for (i = index; i < buffer.indexesA.length; i++) {
          putElementInResWithMark(res, source[buffer.indexesA[i]], 'delete');
        }
      }
      else {
        for (i = 0; i < index; i++) {
          putElementInResWithMark(res, buffer.elements[i], 'edit', source[buffer.indexesA[i]]);
        }
        for (i = index; i < buffer.elements.length; i++) {
          putElementInResWithMark(res, buffer.elements[i], 'add');
        }
        for (i = buffer.elements.length; i < buffer.indexesA.length; i++) {
          putElementInResWithMark(res, source[buffer.indexesA[i]], 'delete');
        }
      }
      buffer.indexesA.splice(0);
      buffer.indexesB.splice(0);
      buffer.elements.splice(0);
    }

    function findSourceIndexInBuffer(indexes, elements, srcElement)
    {
      for (i = 0; i < indexes.length; i++) {
        if (isEqualArrays(elements[indexes[i]], srcElement)) {
          return i;
        }
      }
      return false;
    }

    return function (source, dest)
    {
      dest || (dest = []);
      res = [];
      indexA = 0;
      indexB = 0;
      buffer = {
        indexesA: [],
        indexesB: [],
        elements: []
      };
      if (!source.length) {
        for (indexB = 0; indexB < dest.length; indexB++) {
          putElementInResWithMark(res, dest[indexB], 'add');
        }
      }
      for (indexA = 0; indexA < source.length; indexA++) {
        if (typeof dest[indexB] === 'undefined') {
          // it seems that size array of source is bigger than size array of dest
          // so mark current source item as delete
          if (buffer.indexesA.length) {
            findedIndexB = findSourceIndexInBuffer(buffer.indexesB, dest, source[indexA]);
            if (findedIndexB !== false) {
              indexB = buffer.indexesB[findedIndexB];
              putBufferElementsInRes(buffer, res, -findedIndexB - 1, source);
              putElementInResWithMark(res, dest[indexB], 'skip', source[indexA]);
            }
            else {
              buffer.indexesA.push(indexA);
            }
          }
          else {
            putElementInResWithMark(res, source[indexA], 'delete');
          }
        }
        else {
          // elements are not equal
          if (!isEqualArrays(source[indexA], dest[indexB])) {
            // and buffer is empty
            if (!buffer.indexesA.length) {
              // create buffer with index and element of dest
              buffer.indexesA.splice(0);
              buffer.indexesB.splice(0);
              buffer.elements.splice(0);
              buffer.indexesA.push(indexA);
              buffer.indexesB.push(indexB);
              buffer.elements.push(dest[indexB]);
            }
            // buffer is not empty
            else {
              // if element of dest is equal already skiped element of source
              // find index and mark the number of elements like edit
              // and mark other elements like add
              findedIndexA = findSourceIndexInBuffer(buffer.indexesA, source, dest[indexB]);
              findedIndexB = findSourceIndexInBuffer(buffer.indexesB, dest, source[indexA]);
              if (findedIndexA !== false) {
                indexA = buffer.indexesA[findedIndexA];
                putBufferElementsInRes(buffer, res, findedIndexA, source);
                putElementInResWithMark(res, dest[indexB], 'skip', source[indexA]);
              }
              else if (findedIndexB !== false) {
                indexB = buffer.indexesB[findedIndexB];
                indexA = indexA;
                putBufferElementsInRes(buffer, res, -findedIndexB - 1, source);
                putElementInResWithMark(res, dest[indexB], 'skip', source[indexA]);
              }
              // if index not found
              // add dest element to buffer element
              else {
                buffer.indexesA.push(indexA);
                buffer.indexesB.push(indexB);
                buffer.elements.push(dest[indexB]);
              }
            }
          }
          // elements are equal
          // check buffer and do something with it
          else {
            // buffer is not empty and equal elements gets
            // mark buffer elements as edit
            if (buffer.indexesA.length) {
              putBufferElementsInRes(buffer, res, buffer.indexesA.length, source);
            }
            putElementInResWithMark(res, dest[indexB], 'skip', source[indexA]);
          }
        }
        indexB++;
        if (indexA === source.length - 1) {
          // elements of source are fetched
          // but elements of dest still exists
          // because size array of dest is bigger than size array of source
          findedIndexA = false;
          if (indexB < dest.length) {
            // create empty buffer
            if (!buffer.elements.length) {
              buffer.indexesA.splice(0);
              buffer.indexesB.splice(0);
              buffer.elements.splice(0);
            }
            // append rest of elements of dest to buffer
            for (; indexB < dest.length; indexB++) {
              findedIndexA = findSourceIndexInBuffer(buffer.indexesA, source, dest[indexB]);
              if (findedIndexA !== false) {
                break;
              }
              else {
                buffer.elements.push(dest[indexB]);
              }
            }
          }
          // append buffer elements to res
          // if not found equal element at sources
          if (buffer.elements.length) {
            // if equal element found in sources
            if (findedIndexA !== false) {
              // do this loop one more time
              indexA = buffer.indexesA[findedIndexA] - 1;
              putBufferElementsInRes(buffer, res, findedIndexA, source);
            }
            else {
              putBufferElementsInRes(buffer, res, buffer.indexesB.length, source);
            }
          }
        }
      }
      return res;
    };
  })();

  function getNodeByObject(obj)
  {
    var i, len;
    for (i = 0, len = nodeObjects.length; i < len; i++) {
      if (nodeObjects[i].obj === obj) return nodeObjects[i].node;
    }
    return false;
  }

  function rememberNodeByObject(obj, node)
  {
    if (!getNodeByObject(obj)) {
      nodeObjects.push({
        obj: obj,
        node: node
      });
    }
    else {
      for (i = 0, len = nodeObjects.length; i < len; i++) {
        if (nodeObjects[i].obj === obj) {
          nodeObjects[i].node = node;
          return true;
        }
      }
    }
    return true;
  }

  function getAttributes(node)
  {
    var attrs = [];
    var attrName;
    for (attrName in node.attributes) if (_hasProp.call(node.attributes, attrName)) {
      attrName = node.attributes[attrName].name;
      attrs.push({
        name: attrName,
        value: node.getAttribute(attrName)
      });
    }
    return attrs;
  }

  function generateObjectByNode(node)
  {
    var obj = [];
    var nodeObj;
    var childs = node.childNodes;
    var value;
    var child;
    for (child in childs) if (_hasProp.call(childs, child)) {
      child = childs[child];
      switch (child.nodeType) {
        case 3: // text node
          value = child.nodeValue;
          if (!value.trim().length) {
            continue;
          }
          nodeObj = {
            type: 'text',
            text: value
          };
          obj.push(nodeObj);
          rememberNodeByObject(nodeObj, child);
          break;
        case 1: // tag
          nodeObj = {
            attrs: getAttributes(child),
            name: child.nodeName.toLowerCase(),
            childs: generateObjectByNode(child),
            type: 'node'
          };
          obj.push(nodeObj);
          rememberNodeByObject(nodeObj, child);
      }
    }
    return obj;
  }

  var cacheObj = generateObjectByNode(node);

  var genObj;

  var singleTags = ['hr', 'br', 'base', 'col', 'embed', 'img', 'area', 'source', 'track', 'input', '!DOCTYPE', 'link', 'meta'];

  function handleChilds(genObj, cacheObj, parentNode)
  {
    var diffResult = arrDifference(cacheObj, genObj);
    var prevNode;
    var currNode;
    var newNode;
    var diffAttrs;
    var index = 0;
    var childs;
    var attrs;
    diffResult.forEach(function (item)
    {
      switch (item.mark) {
        case 'add':
          // console.log('add');
          newNode = createNode(item.element);
          cacheObj.splice(index, 0, cloneObject(item.element));
          rememberNodeByObject(cacheObj[index], newNode);
          if (item.element.type === 'node') {
            if (!cacheObj[index].attrs) cacheObj[index].attrs = [];
            cacheObj[index].attrs.splice(0);
            handleAttrs(item.element.attrs, cacheObj[index].attrs, newNode);
          }
          if (prevNode) {
            if (prevNode.nextSibling) {
              parentNode.insertBefore(newNode, prevNode.nextSibling);
            }
            else {
              parentNode.appendChild(newNode);
            }
          }
          else {
            if (parentNode.firstChild) {
              parentNode.insertBefore(newNode, parentNode.firstChild);
            }
            else {
              parentNode.appendChild(newNode);
            }
          }
          prevNode = newNode;
          if (item.element.type === 'node') {
            cacheObj[index].childs = [];
            handleChilds(item.element.childs, cacheObj[index].childs, newNode);
          }
          break;
        case 'skip':
          // console.log('skip');
          prevNode = getNodeByObject(item.origin);
          if (item.element.type === 'node') {
            handleChilds(item.element.childs, cacheObj[index].childs, prevNode);
          }
          break;
        case 'edit':
          // console.log('edit');
          currNode = getNodeByObject(item.origin);
          if (
            item.origin.type !== item.element.type ||
            item.origin.name !== item.element.name ||
            (item.origin.type === 'text' && item.origin.type === item.element.type)
          ) {
            // create a new node
            newNode = createNode(item.element);

            // move all childs to new node
            if (item.origin.type === 'node' && item.element.type === 'node') {
              moveChilds(currNode, newNode);
            }

            // add to DOM a new Node
            parentNode.insertBefore(newNode, currNode);

            // remove an old Node
            parentNode.removeChild(currNode);
            currNode = newNode;

            childs = cacheObj[index].childs;
            cacheObj[index] = cloneObject(item.element);
            cacheObj[index].childs = childs;

            // save link to node from object
            rememberNodeByObject(cacheObj[index], currNode);

            attrs = cacheObj[index].attrs || [];
            attrs.splice(0);
            if (item.element.type === 'node'){
              if (!item.element.attrs) item.element.attrs = [];
              handleAttrs(item.element.attrs, attrs, currNode);
            }

            if (typeof cacheObj[index].childs === 'undefined') {
              cacheObj[index].childs = [];
            }
            handleChilds(item.element.childs, cacheObj[index].childs, currNode);

            newNode = null;
          }
          else

          // change attrs at curr node
          if (item.element.type === 'node') {
            attrs = cacheObj[index].attrs || [];
            handleAttrs(item.element.attrs, attrs, currNode);

            childs = cacheObj[index].childs || [];
            handleChilds(item.element.childs, childs, currNode);
          }

          prevNode = currNode;
          break;
        case 'delete':
          // console.log('delete');
          currNode = getNodeByObject(item.element);
          parentNode.removeChild(currNode);
          cacheObj.splice(index, 1);
          index--;
          break;
      }
      index++;
    });
  }

  function moveChilds(sourceNode, destNode)
  {
    var childs = sourceNode.childNodes;
    var child;
    while (childs.length)  {
      for (child in childs) if (_hasProp.call(childs, child)) {
        destNode.appendChild(childs[child]);
        break;
      }
    }
    child = null;
    childs = null;
  }

  function createNode(item)
  {
    switch (item.type) {
      case 'node':
        return document.createElement(item.name);
      case 'text':
        return document.createTextNode(item.text);
    }
  }

  function sortAttrs(a, b)
  {
    return a.name > b.name;
  }

  function handleAttrsPrepare(attrs)
  {
    var obj = {};
    attrs.forEach(function (item)
    {
      obj[item.name] = item.value;
    });
    return obj;
  }

  var logicAttrs = ['readonly', 'selected', 'checked', 'disabled', 'autofocus', 'required', 'multiple', 'autoplay', 'controls', 'loop', 'muted'];

  function handleAttrs(elementAttrs, originAttrs, currNode)
  {
    var destAttrs = handleAttrsPrepare(elementAttrs);
    var sourceAttrs = handleAttrsPrepare(originAttrs);
    originAttrs.splice(0);
    var attr;
    for (attr in destAttrs) {
      if (_hasProp.call(destAttrs, attr)) {
        if (logicAttrs.indexOf(attr) !== -1) {
          currNode[attr] = true;
        }
        else if (attr === 'value') {
          if (currNode.nodeName.toLowerCase() === 'option') {
            currNode.setAttribute('value', destAttrs[attr]);
          }
          else if (currNode.value != destAttrs[attr]) {
            currNode.value = destAttrs[attr];
          }
        }
        else {
          currNode.setAttribute(attr, destAttrs[attr]);
        }
        originAttrs.push({
          name: attr,
          value: destAttrs[attr]
        });
      }
    }
    for (attr in sourceAttrs) {
      if (_hasProp.call(sourceAttrs, attr)) {
        if (!destAttrs[attr]) {
          if (logicAttrs.indexOf(attr) !== -1) {
            currNode[attr] = false;
          }
          else if (attr === 'value') {
            currNode.value = '';
          }
          else {
            currNode.removeAttribute(attr);
          }
        }
      }
    }
    destAttrs = null;
    sourceAttrs = null;
  }

  return function (obj)
  {
    genObj = handleFn(obj);
    handleChilds(genObj, cacheObj, node);
  };
});

},{}],2:[function(require,module,exports){
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
  radio: require("radio/addRadioModel.coffee"),
  image: require("image/addImageModel.coffee")
};

views = {
  string: require("string/addStringView.coffee"),
  table: require("table/addTableView.coffee"),
  checkbox: require("checkbox/addCheckboxView.coffee"),
  radio: require("radio/addRadioView.coffee"),
  image: require("image/addImageView.coffee")
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
      model = models[field.type]({
        field: field
      });
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


},{"./addModel.coffee":3,"./addView.coffee":4,"ajax.coffee":"ajax.coffee","checkbox/addCheckboxModel.coffee":5,"checkbox/addCheckboxView.coffee":6,"image/addImageModel.coffee":7,"image/addImageView.coffee":8,"jquery-plugins.coffee":"jquery-plugins.coffee","radio/addRadioModel.coffee":9,"radio/addRadioView.coffee":10,"string/addStringModel.coffee":11,"string/addStringView.coffee":12,"table/addTableModel.coffee":13,"table/addTableView.coffee":14}],3:[function(require,module,exports){
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


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],4:[function(require,module,exports){
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


},{"view.coffee":"view.coffee"}],5:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],6:[function(require,module,exports){
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


},{"view.coffee":"view.coffee"}],7:[function(require,module,exports){
var Model;

Model = require("model.coffee");

module.exports = Model({
  setPreview: function(input) {
    return this.set({
      filename: input.files[0].name
    });
  },
  removePreview: function() {
    return this.set({
      filename: false
    });
  }
});


},{"model.coffee":"model.coffee"}],8:[function(require,module,exports){
var Render, View, template;

View = require("view.coffee");

template = require("types/image/item.tmpl.js");

Render = require("render.js");

module.exports = View({
  debug: true,
  initial: function() {
    return this.template = Render(template, this.contain[0]);
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


},{"render.js":1,"types/image/item.tmpl.js":15,"view.coffee":"view.coffee"}],9:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],10:[function(require,module,exports){
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


},{"view.coffee":"view.coffee"}],11:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],12:[function(require,module,exports){
var View;

View = require("view.coffee");

module.exports = View({
  events: {
    "change: @string": function(e) {
      return this.model.update(e.target.value);
    }
  }
});


},{"view.coffee":"view.coffee"}],13:[function(require,module,exports){
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


},{"model.coffee":"model.coffee"}],14:[function(require,module,exports){
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


},{"view.coffee":"view.coffee"}],15:[function(require,module,exports){
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
  var cachedTemplates = {};
  function cacheRequireTemplate(path, required)
  {
    cachedTemplates[path] = required;
  }
  function requireTemplate(path, obj)
  {
    return cachedTemplates[path](obj);
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
            attr += 'form__file-wrap';
            attrs.push(['class', attr]);
          })();
          childs.push(create('div', attrs, function (childs) {
            if ( !(!( typeof filename !== 'undefined' ? filename : '' ))) {
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
                if ( !(!( typeof filename !== 'undefined' ? filename : '' ))) {
                  attr += ' form__file--choosen';
                }
                attrs.push(['class', attr]);
              })();
              childs.push(create('label', attrs, function (childs) {
                if ( !(!( typeof filename !== 'undefined' ? filename : '' ))) {
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
      }
    });
  };
});
},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9saWJzL3JlbmRlci5qcyIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2l0ZW0vYWRkLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2l0ZW0vYWRkTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvc2VjdGlvbnMvaXRlbS9hZGRWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2NoZWNrYm94L2FkZENoZWNrYm94TW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvY2hlY2tib3gvYWRkQ2hlY2tib3hWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL2ltYWdlL2FkZEltYWdlTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvaW1hZ2UvYWRkSW1hZ2VWaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3JhZGlvL2FkZFJhZGlvTW9kZWwuY29mZmVlIiwibW9kdWxlcy9HVUkvdHlwZXMvcmFkaW8vYWRkUmFkaW9WaWV3LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3N0cmluZy9hZGRTdHJpbmdNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy9zdHJpbmcvYWRkU3RyaW5nVmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS90eXBlcy90YWJsZS9hZGRUYWJsZU1vZGVsLmNvZmZlZSIsIm1vZHVsZXMvR1VJL3R5cGVzL3RhYmxlL2FkZFRhYmxlVmlldy5jb2ZmZWUiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy90eXBlcy9pbWFnZS9pdGVtLnRtcGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbntcbiAgd2luZG93LmNvdW50ID0gZnVuY3Rpb24gKGFycilcbiAge1xuICAgIHJldHVybiBhcnIubGVuZ3RoO1xuICB9O1xuICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoJ3JlbmRlcicsIFtdLCBmYWN0b3J5KTtcbiAgfVxuICBlbHNlIHtcbiAgICB3aW5kb3cucmVuZGVyID0gZmFjdG9yeTtcbiAgfVxufSkoZnVuY3Rpb24gKGhhbmRsZUZuLCBub2RlKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgbm9kZU9iamVjdHMgPSBbXTtcblxuICBmdW5jdGlvbiBjbG9uZU9iamVjdChvYmosIGNhY2hlZEVsZW1lbnRzKVxuICB7XG4gICAgdmFyIGF0dHIsIGNvcHksIGVsZW0sIGksIGosIGxlbjtcbiAgICBpZiAodHlwZW9mIGNhY2hlZEVsZW1lbnRzID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY2FjaGVkRWxlbWVudHMgPSBbXTtcbiAgICB9XG4gICAgY29weSA9IG51bGw7XG4gICAgaWYgKG51bGwgPT09IG9iaiB8fCBcIm9iamVjdFwiICE9PSB0eXBlb2Ygb2JqKSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBpZiAob2JqIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgY29weSA9IG5ldyBEYXRlKCk7XG4gICAgICBjb3B5LnNldFRpbWUob2JqLmdldFRpbWUoKSk7XG4gICAgICByZXR1cm4gY29weTtcbiAgICB9XG4gICAgaWYgKChjYWNoZWRFbGVtZW50cy5pbmRleE9mKG9iaikpID09PSAtMSkge1xuICAgICAgY2FjaGVkRWxlbWVudHMucHVzaChvYmopO1xuICAgICAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgIGNvcHkgPSBbXTtcbiAgICAgICAgZm9yIChpID0gaiA9IDAsIGxlbiA9IG9iai5sZW5ndGg7IGogPCBsZW47IGkgPSArK2opIHtcbiAgICAgICAgICBlbGVtID0gb2JqW2ldO1xuICAgICAgICAgIGNvcHlbaV0gPSBjbG9uZU9iamVjdChlbGVtLCBjYWNoZWRFbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvcHk7XG4gICAgICB9XG4gICAgICBpZiAob2JqIGluc3RhbmNlb2YgT2JqZWN0KSB7XG4gICAgICAgIGNvcHkgPSB7fTtcbiAgICAgICAgZm9yIChpIGluIG9iaikge1xuICAgICAgICAgIGF0dHIgPSBvYmpbaV07XG4gICAgICAgICAgY29weVtpXSA9IGNsb25lT2JqZWN0KGF0dHIsIGNhY2hlZEVsZW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29weTtcbiAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGlzRXF1YWxBcnJheXMoc291cmNlQSwgc291cmNlQilcbiAge1xuICAgIC8vIGVhY2ggZmllbGRzIG9mIHNvdXJjZSBhcnJheSBhbmQgY2hlY2sgdGhlbSBhdCBkZXN0IGFycmF5XG4gICAgLy8gaWYgaXQgbm90IGV4aXN0cyBvciBub3QgZXF1YWxzIHRoZW4gcmV0dXJuIGZhbHNlXG4gICAgaWYgKCFpc0VxdWFsQXJyYXlzRm9yZWFjaChzb3VyY2VBLCBzb3VyY2VCKSkgcmV0dXJuIGZhbHNlO1xuXG4gICAgLy8gZG8gdGhlIHNhbWUgdGhpbmcgd2l0aCBkZXN0IGFycmF5XG4gICAgLy8gaWYgZGVzdCBmaWVsZCBub3QgZXhpc3RzIGluIHNvdXJjZSBhcnJheVxuICAgIC8vIG9yIG5vdCBlbXB0eSB0aGVuIHJldHVybiBmYWxzZVxuICAgIGlmICghaXNFcXVhbEFycmF5c0ZvcmVhY2goc291cmNlQiwgc291cmNlQSkpIHJldHVybiBmYWxzZTtcblxuICAgIC8vIGlmIGV2ZXJ5dGhpbmcgZmluZSByZXR1cm4gdHJ1ZVxuICAgIC8vIGFycmF5cyBhcmUgZXF1YWxzXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBpc0VxdWFsQXJyYXlzRm9yZWFjaChzb3VyY2VBLCBzb3VyY2VCKVxuICB7XG4gICAgdmFyIGtleSwgdmFsdWU7XG4gICAgZm9yIChrZXkgaW4gc291cmNlQSkge1xuICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoc291cmNlQSwga2V5KSkge1xuICAgICAgICBpZiAoa2V5ID09PSAnY2hpbGRzJykgY29udGludWU7XG4gICAgICAgIGlmICh0eXBlb2Ygc291cmNlQltrZXldID09PSAndW5kZWZpbmVkJykgcmV0dXJuIGZhbHNlO1xuICAgICAgICB2YWx1ZSA9IHNvdXJjZUFba2V5XTtcbiAgICAgICAgaWYgKFsnc3RyaW5nJywgJ2Jvb2xlYW4nLCAnbnVtYmVyJ10uaW5kZXhPZih0eXBlb2YgdmFsdWUpICE9PSAtMSkge1xuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gc291cmNlQltrZXldKSByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIGRpZmZSZXN1bHQgPSBpc0VxdWFsQXJyYXlzKHZhbHVlLCBzb3VyY2VCW2tleV0pO1xuICAgICAgICAgIGlmICghZGlmZlJlc3VsdCkgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIGFyckRpZmZlcmVuY2UgPSAoZnVuY3Rpb24gKClcbiAge1xuICAgIHZhciByZXM7XG4gICAgdmFyIGluZGV4QTtcbiAgICB2YXIgaW5kZXhCO1xuICAgIHZhciBidWZmZXI7XG4gICAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICB2YXIgaTtcblxuICAgIGZ1bmN0aW9uIHB1dEVsZW1lbnRJblJlc1dpdGhNYXJrKHJlcywgZWxlbWVudCwgbWFyaywgb3JpZ2luKVxuICAgIHtcbiAgICAgIGVsZW1lbnQgPSB7XG4gICAgICAgIG1hcms6IG1hcmssXG4gICAgICAgIGVsZW1lbnQ6IGVsZW1lbnRcbiAgICAgIH07XG4gICAgICBpZiAodHlwZW9mIG9yaWdpbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZWxlbWVudC5vcmlnaW4gPSBvcmlnaW47XG4gICAgICB9XG4gICAgICByZXMucHVzaChlbGVtZW50KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBwdXRCdWZmZXJFbGVtZW50c0luUmVzKGJ1ZmZlciwgcmVzLCBpbmRleCwgc291cmNlKVxuICAgIHtcbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgaW5kZXggPSAtaW5kZXggLSAxO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgaW5kZXg7IGkrKykge1xuICAgICAgICAgIHB1dEVsZW1lbnRJblJlc1dpdGhNYXJrKHJlcywgYnVmZmVyLmVsZW1lbnRzW2ldLCAnZWRpdCcsIHNvdXJjZVtidWZmZXIuaW5kZXhlc0JbaV1dKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSBpbmRleDsgaSA8IGJ1ZmZlci5pbmRleGVzQS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHB1dEVsZW1lbnRJblJlc1dpdGhNYXJrKHJlcywgc291cmNlW2J1ZmZlci5pbmRleGVzQVtpXV0sICdkZWxldGUnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBpbmRleDsgaSsrKSB7XG4gICAgICAgICAgcHV0RWxlbWVudEluUmVzV2l0aE1hcmsocmVzLCBidWZmZXIuZWxlbWVudHNbaV0sICdlZGl0Jywgc291cmNlW2J1ZmZlci5pbmRleGVzQVtpXV0pO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IGluZGV4OyBpIDwgYnVmZmVyLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgcHV0RWxlbWVudEluUmVzV2l0aE1hcmsocmVzLCBidWZmZXIuZWxlbWVudHNbaV0sICdhZGQnKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSBidWZmZXIuZWxlbWVudHMubGVuZ3RoOyBpIDwgYnVmZmVyLmluZGV4ZXNBLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgcHV0RWxlbWVudEluUmVzV2l0aE1hcmsocmVzLCBzb3VyY2VbYnVmZmVyLmluZGV4ZXNBW2ldXSwgJ2RlbGV0ZScpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBidWZmZXIuaW5kZXhlc0Euc3BsaWNlKDApO1xuICAgICAgYnVmZmVyLmluZGV4ZXNCLnNwbGljZSgwKTtcbiAgICAgIGJ1ZmZlci5lbGVtZW50cy5zcGxpY2UoMCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmluZFNvdXJjZUluZGV4SW5CdWZmZXIoaW5kZXhlcywgZWxlbWVudHMsIHNyY0VsZW1lbnQpXG4gICAge1xuICAgICAgZm9yIChpID0gMDsgaSA8IGluZGV4ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGlzRXF1YWxBcnJheXMoZWxlbWVudHNbaW5kZXhlc1tpXV0sIHNyY0VsZW1lbnQpKSB7XG4gICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKHNvdXJjZSwgZGVzdClcbiAgICB7XG4gICAgICBkZXN0IHx8IChkZXN0ID0gW10pO1xuICAgICAgcmVzID0gW107XG4gICAgICBpbmRleEEgPSAwO1xuICAgICAgaW5kZXhCID0gMDtcbiAgICAgIGJ1ZmZlciA9IHtcbiAgICAgICAgaW5kZXhlc0E6IFtdLFxuICAgICAgICBpbmRleGVzQjogW10sXG4gICAgICAgIGVsZW1lbnRzOiBbXVxuICAgICAgfTtcbiAgICAgIGlmICghc291cmNlLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QiA9IDA7IGluZGV4QiA8IGRlc3QubGVuZ3RoOyBpbmRleEIrKykge1xuICAgICAgICAgIHB1dEVsZW1lbnRJblJlc1dpdGhNYXJrKHJlcywgZGVzdFtpbmRleEJdLCAnYWRkJyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaW5kZXhBID0gMDsgaW5kZXhBIDwgc291cmNlLmxlbmd0aDsgaW5kZXhBKyspIHtcbiAgICAgICAgaWYgKHR5cGVvZiBkZXN0W2luZGV4Ql0gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgLy8gaXQgc2VlbXMgdGhhdCBzaXplIGFycmF5IG9mIHNvdXJjZSBpcyBiaWdnZXIgdGhhbiBzaXplIGFycmF5IG9mIGRlc3RcbiAgICAgICAgICAvLyBzbyBtYXJrIGN1cnJlbnQgc291cmNlIGl0ZW0gYXMgZGVsZXRlXG4gICAgICAgICAgaWYgKGJ1ZmZlci5pbmRleGVzQS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZpbmRlZEluZGV4QiA9IGZpbmRTb3VyY2VJbmRleEluQnVmZmVyKGJ1ZmZlci5pbmRleGVzQiwgZGVzdCwgc291cmNlW2luZGV4QV0pO1xuICAgICAgICAgICAgaWYgKGZpbmRlZEluZGV4QiAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgaW5kZXhCID0gYnVmZmVyLmluZGV4ZXNCW2ZpbmRlZEluZGV4Ql07XG4gICAgICAgICAgICAgIHB1dEJ1ZmZlckVsZW1lbnRzSW5SZXMoYnVmZmVyLCByZXMsIC1maW5kZWRJbmRleEIgLSAxLCBzb3VyY2UpO1xuICAgICAgICAgICAgICBwdXRFbGVtZW50SW5SZXNXaXRoTWFyayhyZXMsIGRlc3RbaW5kZXhCXSwgJ3NraXAnLCBzb3VyY2VbaW5kZXhBXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgYnVmZmVyLmluZGV4ZXNBLnB1c2goaW5kZXhBKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwdXRFbGVtZW50SW5SZXNXaXRoTWFyayhyZXMsIHNvdXJjZVtpbmRleEFdLCAnZGVsZXRlJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIC8vIGVsZW1lbnRzIGFyZSBub3QgZXF1YWxcbiAgICAgICAgICBpZiAoIWlzRXF1YWxBcnJheXMoc291cmNlW2luZGV4QV0sIGRlc3RbaW5kZXhCXSkpIHtcbiAgICAgICAgICAgIC8vIGFuZCBidWZmZXIgaXMgZW1wdHlcbiAgICAgICAgICAgIGlmICghYnVmZmVyLmluZGV4ZXNBLmxlbmd0aCkge1xuICAgICAgICAgICAgICAvLyBjcmVhdGUgYnVmZmVyIHdpdGggaW5kZXggYW5kIGVsZW1lbnQgb2YgZGVzdFxuICAgICAgICAgICAgICBidWZmZXIuaW5kZXhlc0Euc3BsaWNlKDApO1xuICAgICAgICAgICAgICBidWZmZXIuaW5kZXhlc0Iuc3BsaWNlKDApO1xuICAgICAgICAgICAgICBidWZmZXIuZWxlbWVudHMuc3BsaWNlKDApO1xuICAgICAgICAgICAgICBidWZmZXIuaW5kZXhlc0EucHVzaChpbmRleEEpO1xuICAgICAgICAgICAgICBidWZmZXIuaW5kZXhlc0IucHVzaChpbmRleEIpO1xuICAgICAgICAgICAgICBidWZmZXIuZWxlbWVudHMucHVzaChkZXN0W2luZGV4Ql0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gYnVmZmVyIGlzIG5vdCBlbXB0eVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIC8vIGlmIGVsZW1lbnQgb2YgZGVzdCBpcyBlcXVhbCBhbHJlYWR5IHNraXBlZCBlbGVtZW50IG9mIHNvdXJjZVxuICAgICAgICAgICAgICAvLyBmaW5kIGluZGV4IGFuZCBtYXJrIHRoZSBudW1iZXIgb2YgZWxlbWVudHMgbGlrZSBlZGl0XG4gICAgICAgICAgICAgIC8vIGFuZCBtYXJrIG90aGVyIGVsZW1lbnRzIGxpa2UgYWRkXG4gICAgICAgICAgICAgIGZpbmRlZEluZGV4QSA9IGZpbmRTb3VyY2VJbmRleEluQnVmZmVyKGJ1ZmZlci5pbmRleGVzQSwgc291cmNlLCBkZXN0W2luZGV4Ql0pO1xuICAgICAgICAgICAgICBmaW5kZWRJbmRleEIgPSBmaW5kU291cmNlSW5kZXhJbkJ1ZmZlcihidWZmZXIuaW5kZXhlc0IsIGRlc3QsIHNvdXJjZVtpbmRleEFdKTtcbiAgICAgICAgICAgICAgaWYgKGZpbmRlZEluZGV4QSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpbmRleEEgPSBidWZmZXIuaW5kZXhlc0FbZmluZGVkSW5kZXhBXTtcbiAgICAgICAgICAgICAgICBwdXRCdWZmZXJFbGVtZW50c0luUmVzKGJ1ZmZlciwgcmVzLCBmaW5kZWRJbmRleEEsIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgcHV0RWxlbWVudEluUmVzV2l0aE1hcmsocmVzLCBkZXN0W2luZGV4Ql0sICdza2lwJywgc291cmNlW2luZGV4QV0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2UgaWYgKGZpbmRlZEluZGV4QiAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICBpbmRleEIgPSBidWZmZXIuaW5kZXhlc0JbZmluZGVkSW5kZXhCXTtcbiAgICAgICAgICAgICAgICBpbmRleEEgPSBpbmRleEE7XG4gICAgICAgICAgICAgICAgcHV0QnVmZmVyRWxlbWVudHNJblJlcyhidWZmZXIsIHJlcywgLWZpbmRlZEluZGV4QiAtIDEsIHNvdXJjZSk7XG4gICAgICAgICAgICAgICAgcHV0RWxlbWVudEluUmVzV2l0aE1hcmsocmVzLCBkZXN0W2luZGV4Ql0sICdza2lwJywgc291cmNlW2luZGV4QV0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIC8vIGlmIGluZGV4IG5vdCBmb3VuZFxuICAgICAgICAgICAgICAvLyBhZGQgZGVzdCBlbGVtZW50IHRvIGJ1ZmZlciBlbGVtZW50XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5pbmRleGVzQS5wdXNoKGluZGV4QSk7XG4gICAgICAgICAgICAgICAgYnVmZmVyLmluZGV4ZXNCLnB1c2goaW5kZXhCKTtcbiAgICAgICAgICAgICAgICBidWZmZXIuZWxlbWVudHMucHVzaChkZXN0W2luZGV4Ql0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIGVsZW1lbnRzIGFyZSBlcXVhbFxuICAgICAgICAgIC8vIGNoZWNrIGJ1ZmZlciBhbmQgZG8gc29tZXRoaW5nIHdpdGggaXRcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGJ1ZmZlciBpcyBub3QgZW1wdHkgYW5kIGVxdWFsIGVsZW1lbnRzIGdldHNcbiAgICAgICAgICAgIC8vIG1hcmsgYnVmZmVyIGVsZW1lbnRzIGFzIGVkaXRcbiAgICAgICAgICAgIGlmIChidWZmZXIuaW5kZXhlc0EubGVuZ3RoKSB7XG4gICAgICAgICAgICAgIHB1dEJ1ZmZlckVsZW1lbnRzSW5SZXMoYnVmZmVyLCByZXMsIGJ1ZmZlci5pbmRleGVzQS5sZW5ndGgsIHNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwdXRFbGVtZW50SW5SZXNXaXRoTWFyayhyZXMsIGRlc3RbaW5kZXhCXSwgJ3NraXAnLCBzb3VyY2VbaW5kZXhBXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGluZGV4QisrO1xuICAgICAgICBpZiAoaW5kZXhBID09PSBzb3VyY2UubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIC8vIGVsZW1lbnRzIG9mIHNvdXJjZSBhcmUgZmV0Y2hlZFxuICAgICAgICAgIC8vIGJ1dCBlbGVtZW50cyBvZiBkZXN0IHN0aWxsIGV4aXN0c1xuICAgICAgICAgIC8vIGJlY2F1c2Ugc2l6ZSBhcnJheSBvZiBkZXN0IGlzIGJpZ2dlciB0aGFuIHNpemUgYXJyYXkgb2Ygc291cmNlXG4gICAgICAgICAgZmluZGVkSW5kZXhBID0gZmFsc2U7XG4gICAgICAgICAgaWYgKGluZGV4QiA8IGRlc3QubGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgZW1wdHkgYnVmZmVyXG4gICAgICAgICAgICBpZiAoIWJ1ZmZlci5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgYnVmZmVyLmluZGV4ZXNBLnNwbGljZSgwKTtcbiAgICAgICAgICAgICAgYnVmZmVyLmluZGV4ZXNCLnNwbGljZSgwKTtcbiAgICAgICAgICAgICAgYnVmZmVyLmVsZW1lbnRzLnNwbGljZSgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGFwcGVuZCByZXN0IG9mIGVsZW1lbnRzIG9mIGRlc3QgdG8gYnVmZmVyXG4gICAgICAgICAgICBmb3IgKDsgaW5kZXhCIDwgZGVzdC5sZW5ndGg7IGluZGV4QisrKSB7XG4gICAgICAgICAgICAgIGZpbmRlZEluZGV4QSA9IGZpbmRTb3VyY2VJbmRleEluQnVmZmVyKGJ1ZmZlci5pbmRleGVzQSwgc291cmNlLCBkZXN0W2luZGV4Ql0pO1xuICAgICAgICAgICAgICBpZiAoZmluZGVkSW5kZXhBICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5lbGVtZW50cy5wdXNoKGRlc3RbaW5kZXhCXSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gYXBwZW5kIGJ1ZmZlciBlbGVtZW50cyB0byByZXNcbiAgICAgICAgICAvLyBpZiBub3QgZm91bmQgZXF1YWwgZWxlbWVudCBhdCBzb3VyY2VzXG4gICAgICAgICAgaWYgKGJ1ZmZlci5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIC8vIGlmIGVxdWFsIGVsZW1lbnQgZm91bmQgaW4gc291cmNlc1xuICAgICAgICAgICAgaWYgKGZpbmRlZEluZGV4QSAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgLy8gZG8gdGhpcyBsb29wIG9uZSBtb3JlIHRpbWVcbiAgICAgICAgICAgICAgaW5kZXhBID0gYnVmZmVyLmluZGV4ZXNBW2ZpbmRlZEluZGV4QV0gLSAxO1xuICAgICAgICAgICAgICBwdXRCdWZmZXJFbGVtZW50c0luUmVzKGJ1ZmZlciwgcmVzLCBmaW5kZWRJbmRleEEsIHNvdXJjZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgcHV0QnVmZmVyRWxlbWVudHNJblJlcyhidWZmZXIsIHJlcywgYnVmZmVyLmluZGV4ZXNCLmxlbmd0aCwgc291cmNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiByZXM7XG4gICAgfTtcbiAgfSkoKTtcblxuICBmdW5jdGlvbiBnZXROb2RlQnlPYmplY3Qob2JqKVxuICB7XG4gICAgdmFyIGksIGxlbjtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBub2RlT2JqZWN0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKG5vZGVPYmplY3RzW2ldLm9iaiA9PT0gb2JqKSByZXR1cm4gbm9kZU9iamVjdHNbaV0ubm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVtZW1iZXJOb2RlQnlPYmplY3Qob2JqLCBub2RlKVxuICB7XG4gICAgaWYgKCFnZXROb2RlQnlPYmplY3Qob2JqKSkge1xuICAgICAgbm9kZU9iamVjdHMucHVzaCh7XG4gICAgICAgIG9iajogb2JqLFxuICAgICAgICBub2RlOiBub2RlXG4gICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICBmb3IgKGkgPSAwLCBsZW4gPSBub2RlT2JqZWN0cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAobm9kZU9iamVjdHNbaV0ub2JqID09PSBvYmopIHtcbiAgICAgICAgICBub2RlT2JqZWN0c1tpXS5ub2RlID0gbm9kZTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEF0dHJpYnV0ZXMobm9kZSlcbiAge1xuICAgIHZhciBhdHRycyA9IFtdO1xuICAgIHZhciBhdHRyTmFtZTtcbiAgICBmb3IgKGF0dHJOYW1lIGluIG5vZGUuYXR0cmlidXRlcykgaWYgKF9oYXNQcm9wLmNhbGwobm9kZS5hdHRyaWJ1dGVzLCBhdHRyTmFtZSkpIHtcbiAgICAgIGF0dHJOYW1lID0gbm9kZS5hdHRyaWJ1dGVzW2F0dHJOYW1lXS5uYW1lO1xuICAgICAgYXR0cnMucHVzaCh7XG4gICAgICAgIG5hbWU6IGF0dHJOYW1lLFxuICAgICAgICB2YWx1ZTogbm9kZS5nZXRBdHRyaWJ1dGUoYXR0ck5hbWUpXG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGF0dHJzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVPYmplY3RCeU5vZGUobm9kZSlcbiAge1xuICAgIHZhciBvYmogPSBbXTtcbiAgICB2YXIgbm9kZU9iajtcbiAgICB2YXIgY2hpbGRzID0gbm9kZS5jaGlsZE5vZGVzO1xuICAgIHZhciB2YWx1ZTtcbiAgICB2YXIgY2hpbGQ7XG4gICAgZm9yIChjaGlsZCBpbiBjaGlsZHMpIGlmIChfaGFzUHJvcC5jYWxsKGNoaWxkcywgY2hpbGQpKSB7XG4gICAgICBjaGlsZCA9IGNoaWxkc1tjaGlsZF07XG4gICAgICBzd2l0Y2ggKGNoaWxkLm5vZGVUeXBlKSB7XG4gICAgICAgIGNhc2UgMzogLy8gdGV4dCBub2RlXG4gICAgICAgICAgdmFsdWUgPSBjaGlsZC5ub2RlVmFsdWU7XG4gICAgICAgICAgaWYgKCF2YWx1ZS50cmltKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbm9kZU9iaiA9IHtcbiAgICAgICAgICAgIHR5cGU6ICd0ZXh0JyxcbiAgICAgICAgICAgIHRleHQ6IHZhbHVlXG4gICAgICAgICAgfTtcbiAgICAgICAgICBvYmoucHVzaChub2RlT2JqKTtcbiAgICAgICAgICByZW1lbWJlck5vZGVCeU9iamVjdChub2RlT2JqLCBjaGlsZCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMTogLy8gdGFnXG4gICAgICAgICAgbm9kZU9iaiA9IHtcbiAgICAgICAgICAgIGF0dHJzOiBnZXRBdHRyaWJ1dGVzKGNoaWxkKSxcbiAgICAgICAgICAgIG5hbWU6IGNoaWxkLm5vZGVOYW1lLnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICBjaGlsZHM6IGdlbmVyYXRlT2JqZWN0QnlOb2RlKGNoaWxkKSxcbiAgICAgICAgICAgIHR5cGU6ICdub2RlJ1xuICAgICAgICAgIH07XG4gICAgICAgICAgb2JqLnB1c2gobm9kZU9iaik7XG4gICAgICAgICAgcmVtZW1iZXJOb2RlQnlPYmplY3Qobm9kZU9iaiwgY2hpbGQpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIGNhY2hlT2JqID0gZ2VuZXJhdGVPYmplY3RCeU5vZGUobm9kZSk7XG5cbiAgdmFyIGdlbk9iajtcblxuICB2YXIgc2luZ2xlVGFncyA9IFsnaHInLCAnYnInLCAnYmFzZScsICdjb2wnLCAnZW1iZWQnLCAnaW1nJywgJ2FyZWEnLCAnc291cmNlJywgJ3RyYWNrJywgJ2lucHV0JywgJyFET0NUWVBFJywgJ2xpbmsnLCAnbWV0YSddO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNoaWxkcyhnZW5PYmosIGNhY2hlT2JqLCBwYXJlbnROb2RlKVxuICB7XG4gICAgdmFyIGRpZmZSZXN1bHQgPSBhcnJEaWZmZXJlbmNlKGNhY2hlT2JqLCBnZW5PYmopO1xuICAgIHZhciBwcmV2Tm9kZTtcbiAgICB2YXIgY3Vyck5vZGU7XG4gICAgdmFyIG5ld05vZGU7XG4gICAgdmFyIGRpZmZBdHRycztcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBjaGlsZHM7XG4gICAgdmFyIGF0dHJzO1xuICAgIGRpZmZSZXN1bHQuZm9yRWFjaChmdW5jdGlvbiAoaXRlbSlcbiAgICB7XG4gICAgICBzd2l0Y2ggKGl0ZW0ubWFyaykge1xuICAgICAgICBjYXNlICdhZGQnOlxuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdhZGQnKTtcbiAgICAgICAgICBuZXdOb2RlID0gY3JlYXRlTm9kZShpdGVtLmVsZW1lbnQpO1xuICAgICAgICAgIGNhY2hlT2JqLnNwbGljZShpbmRleCwgMCwgY2xvbmVPYmplY3QoaXRlbS5lbGVtZW50KSk7XG4gICAgICAgICAgcmVtZW1iZXJOb2RlQnlPYmplY3QoY2FjaGVPYmpbaW5kZXhdLCBuZXdOb2RlKTtcbiAgICAgICAgICBpZiAoaXRlbS5lbGVtZW50LnR5cGUgPT09ICdub2RlJykge1xuICAgICAgICAgICAgaWYgKCFjYWNoZU9ialtpbmRleF0uYXR0cnMpIGNhY2hlT2JqW2luZGV4XS5hdHRycyA9IFtdO1xuICAgICAgICAgICAgY2FjaGVPYmpbaW5kZXhdLmF0dHJzLnNwbGljZSgwKTtcbiAgICAgICAgICAgIGhhbmRsZUF0dHJzKGl0ZW0uZWxlbWVudC5hdHRycywgY2FjaGVPYmpbaW5kZXhdLmF0dHJzLCBuZXdOb2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHByZXZOb2RlKSB7XG4gICAgICAgICAgICBpZiAocHJldk5vZGUubmV4dFNpYmxpbmcpIHtcbiAgICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgcHJldk5vZGUubmV4dFNpYmxpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHBhcmVudE5vZGUuYXBwZW5kQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHBhcmVudE5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgICAgICAgICBwYXJlbnROb2RlLmluc2VydEJlZm9yZShuZXdOb2RlLCBwYXJlbnROb2RlLmZpcnN0Q2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgIHBhcmVudE5vZGUuYXBwZW5kQ2hpbGQobmV3Tm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHByZXZOb2RlID0gbmV3Tm9kZTtcbiAgICAgICAgICBpZiAoaXRlbS5lbGVtZW50LnR5cGUgPT09ICdub2RlJykge1xuICAgICAgICAgICAgY2FjaGVPYmpbaW5kZXhdLmNoaWxkcyA9IFtdO1xuICAgICAgICAgICAgaGFuZGxlQ2hpbGRzKGl0ZW0uZWxlbWVudC5jaGlsZHMsIGNhY2hlT2JqW2luZGV4XS5jaGlsZHMsIG5ld05vZGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnc2tpcCc6XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ3NraXAnKTtcbiAgICAgICAgICBwcmV2Tm9kZSA9IGdldE5vZGVCeU9iamVjdChpdGVtLm9yaWdpbik7XG4gICAgICAgICAgaWYgKGl0ZW0uZWxlbWVudC50eXBlID09PSAnbm9kZScpIHtcbiAgICAgICAgICAgIGhhbmRsZUNoaWxkcyhpdGVtLmVsZW1lbnQuY2hpbGRzLCBjYWNoZU9ialtpbmRleF0uY2hpbGRzLCBwcmV2Tm9kZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlICdlZGl0JzpcbiAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZWRpdCcpO1xuICAgICAgICAgIGN1cnJOb2RlID0gZ2V0Tm9kZUJ5T2JqZWN0KGl0ZW0ub3JpZ2luKTtcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBpdGVtLm9yaWdpbi50eXBlICE9PSBpdGVtLmVsZW1lbnQudHlwZSB8fFxuICAgICAgICAgICAgaXRlbS5vcmlnaW4ubmFtZSAhPT0gaXRlbS5lbGVtZW50Lm5hbWUgfHxcbiAgICAgICAgICAgIChpdGVtLm9yaWdpbi50eXBlID09PSAndGV4dCcgJiYgaXRlbS5vcmlnaW4udHlwZSA9PT0gaXRlbS5lbGVtZW50LnR5cGUpXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBjcmVhdGUgYSBuZXcgbm9kZVxuICAgICAgICAgICAgbmV3Tm9kZSA9IGNyZWF0ZU5vZGUoaXRlbS5lbGVtZW50KTtcblxuICAgICAgICAgICAgLy8gbW92ZSBhbGwgY2hpbGRzIHRvIG5ldyBub2RlXG4gICAgICAgICAgICBpZiAoaXRlbS5vcmlnaW4udHlwZSA9PT0gJ25vZGUnICYmIGl0ZW0uZWxlbWVudC50eXBlID09PSAnbm9kZScpIHtcbiAgICAgICAgICAgICAgbW92ZUNoaWxkcyhjdXJyTm9kZSwgbmV3Tm9kZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGFkZCB0byBET00gYSBuZXcgTm9kZVxuICAgICAgICAgICAgcGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUobmV3Tm9kZSwgY3Vyck5vZGUpO1xuXG4gICAgICAgICAgICAvLyByZW1vdmUgYW4gb2xkIE5vZGVcbiAgICAgICAgICAgIHBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoY3Vyck5vZGUpO1xuICAgICAgICAgICAgY3Vyck5vZGUgPSBuZXdOb2RlO1xuXG4gICAgICAgICAgICBjaGlsZHMgPSBjYWNoZU9ialtpbmRleF0uY2hpbGRzO1xuICAgICAgICAgICAgY2FjaGVPYmpbaW5kZXhdID0gY2xvbmVPYmplY3QoaXRlbS5lbGVtZW50KTtcbiAgICAgICAgICAgIGNhY2hlT2JqW2luZGV4XS5jaGlsZHMgPSBjaGlsZHM7XG5cbiAgICAgICAgICAgIC8vIHNhdmUgbGluayB0byBub2RlIGZyb20gb2JqZWN0XG4gICAgICAgICAgICByZW1lbWJlck5vZGVCeU9iamVjdChjYWNoZU9ialtpbmRleF0sIGN1cnJOb2RlKTtcblxuICAgICAgICAgICAgYXR0cnMgPSBjYWNoZU9ialtpbmRleF0uYXR0cnMgfHwgW107XG4gICAgICAgICAgICBhdHRycy5zcGxpY2UoMCk7XG4gICAgICAgICAgICBpZiAoaXRlbS5lbGVtZW50LnR5cGUgPT09ICdub2RlJyl7XG4gICAgICAgICAgICAgIGlmICghaXRlbS5lbGVtZW50LmF0dHJzKSBpdGVtLmVsZW1lbnQuYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgaGFuZGxlQXR0cnMoaXRlbS5lbGVtZW50LmF0dHJzLCBhdHRycywgY3Vyck5vZGUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGNhY2hlT2JqW2luZGV4XS5jaGlsZHMgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgIGNhY2hlT2JqW2luZGV4XS5jaGlsZHMgPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGhhbmRsZUNoaWxkcyhpdGVtLmVsZW1lbnQuY2hpbGRzLCBjYWNoZU9ialtpbmRleF0uY2hpbGRzLCBjdXJyTm9kZSk7XG5cbiAgICAgICAgICAgIG5ld05vZGUgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlXG5cbiAgICAgICAgICAvLyBjaGFuZ2UgYXR0cnMgYXQgY3VyciBub2RlXG4gICAgICAgICAgaWYgKGl0ZW0uZWxlbWVudC50eXBlID09PSAnbm9kZScpIHtcbiAgICAgICAgICAgIGF0dHJzID0gY2FjaGVPYmpbaW5kZXhdLmF0dHJzIHx8IFtdO1xuICAgICAgICAgICAgaGFuZGxlQXR0cnMoaXRlbS5lbGVtZW50LmF0dHJzLCBhdHRycywgY3Vyck5vZGUpO1xuXG4gICAgICAgICAgICBjaGlsZHMgPSBjYWNoZU9ialtpbmRleF0uY2hpbGRzIHx8IFtdO1xuICAgICAgICAgICAgaGFuZGxlQ2hpbGRzKGl0ZW0uZWxlbWVudC5jaGlsZHMsIGNoaWxkcywgY3Vyck5vZGUpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHByZXZOb2RlID0gY3Vyck5vZGU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RlbGV0ZSc6XG4gICAgICAgICAgLy8gY29uc29sZS5sb2coJ2RlbGV0ZScpO1xuICAgICAgICAgIGN1cnJOb2RlID0gZ2V0Tm9kZUJ5T2JqZWN0KGl0ZW0uZWxlbWVudCk7XG4gICAgICAgICAgcGFyZW50Tm9kZS5yZW1vdmVDaGlsZChjdXJyTm9kZSk7XG4gICAgICAgICAgY2FjaGVPYmouc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICBpbmRleC0tO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgaW5kZXgrKztcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdmVDaGlsZHMoc291cmNlTm9kZSwgZGVzdE5vZGUpXG4gIHtcbiAgICB2YXIgY2hpbGRzID0gc291cmNlTm9kZS5jaGlsZE5vZGVzO1xuICAgIHZhciBjaGlsZDtcbiAgICB3aGlsZSAoY2hpbGRzLmxlbmd0aCkgIHtcbiAgICAgIGZvciAoY2hpbGQgaW4gY2hpbGRzKSBpZiAoX2hhc1Byb3AuY2FsbChjaGlsZHMsIGNoaWxkKSkge1xuICAgICAgICBkZXN0Tm9kZS5hcHBlbmRDaGlsZChjaGlsZHNbY2hpbGRdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGNoaWxkID0gbnVsbDtcbiAgICBjaGlsZHMgPSBudWxsO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlTm9kZShpdGVtKVxuICB7XG4gICAgc3dpdGNoIChpdGVtLnR5cGUpIHtcbiAgICAgIGNhc2UgJ25vZGUnOlxuICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdGVtLm5hbWUpO1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpdGVtLnRleHQpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNvcnRBdHRycyhhLCBiKVxuICB7XG4gICAgcmV0dXJuIGEubmFtZSA+IGIubmFtZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUF0dHJzUHJlcGFyZShhdHRycylcbiAge1xuICAgIHZhciBvYmogPSB7fTtcbiAgICBhdHRycy5mb3JFYWNoKGZ1bmN0aW9uIChpdGVtKVxuICAgIHtcbiAgICAgIG9ialtpdGVtLm5hbWVdID0gaXRlbS52YWx1ZTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9XG5cbiAgdmFyIGxvZ2ljQXR0cnMgPSBbJ3JlYWRvbmx5JywgJ3NlbGVjdGVkJywgJ2NoZWNrZWQnLCAnZGlzYWJsZWQnLCAnYXV0b2ZvY3VzJywgJ3JlcXVpcmVkJywgJ211bHRpcGxlJywgJ2F1dG9wbGF5JywgJ2NvbnRyb2xzJywgJ2xvb3AnLCAnbXV0ZWQnXTtcblxuICBmdW5jdGlvbiBoYW5kbGVBdHRycyhlbGVtZW50QXR0cnMsIG9yaWdpbkF0dHJzLCBjdXJyTm9kZSlcbiAge1xuICAgIHZhciBkZXN0QXR0cnMgPSBoYW5kbGVBdHRyc1ByZXBhcmUoZWxlbWVudEF0dHJzKTtcbiAgICB2YXIgc291cmNlQXR0cnMgPSBoYW5kbGVBdHRyc1ByZXBhcmUob3JpZ2luQXR0cnMpO1xuICAgIG9yaWdpbkF0dHJzLnNwbGljZSgwKTtcbiAgICB2YXIgYXR0cjtcbiAgICBmb3IgKGF0dHIgaW4gZGVzdEF0dHJzKSB7XG4gICAgICBpZiAoX2hhc1Byb3AuY2FsbChkZXN0QXR0cnMsIGF0dHIpKSB7XG4gICAgICAgIGlmIChsb2dpY0F0dHJzLmluZGV4T2YoYXR0cikgIT09IC0xKSB7XG4gICAgICAgICAgY3Vyck5vZGVbYXR0cl0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGF0dHIgPT09ICd2YWx1ZScpIHtcbiAgICAgICAgICBpZiAoY3Vyck5vZGUubm9kZU5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ29wdGlvbicpIHtcbiAgICAgICAgICAgIGN1cnJOb2RlLnNldEF0dHJpYnV0ZSgndmFsdWUnLCBkZXN0QXR0cnNbYXR0cl0pO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIGlmIChjdXJyTm9kZS52YWx1ZSAhPSBkZXN0QXR0cnNbYXR0cl0pIHtcbiAgICAgICAgICAgIGN1cnJOb2RlLnZhbHVlID0gZGVzdEF0dHJzW2F0dHJdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBjdXJyTm9kZS5zZXRBdHRyaWJ1dGUoYXR0ciwgZGVzdEF0dHJzW2F0dHJdKTtcbiAgICAgICAgfVxuICAgICAgICBvcmlnaW5BdHRycy5wdXNoKHtcbiAgICAgICAgICBuYW1lOiBhdHRyLFxuICAgICAgICAgIHZhbHVlOiBkZXN0QXR0cnNbYXR0cl1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoYXR0ciBpbiBzb3VyY2VBdHRycykge1xuICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoc291cmNlQXR0cnMsIGF0dHIpKSB7XG4gICAgICAgIGlmICghZGVzdEF0dHJzW2F0dHJdKSB7XG4gICAgICAgICAgaWYgKGxvZ2ljQXR0cnMuaW5kZXhPZihhdHRyKSAhPT0gLTEpIHtcbiAgICAgICAgICAgIGN1cnJOb2RlW2F0dHJdID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGF0dHIgPT09ICd2YWx1ZScpIHtcbiAgICAgICAgICAgIGN1cnJOb2RlLnZhbHVlID0gJyc7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY3Vyck5vZGUucmVtb3ZlQXR0cmlidXRlKGF0dHIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBkZXN0QXR0cnMgPSBudWxsO1xuICAgIHNvdXJjZUF0dHJzID0gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICB7XG4gICAgZ2VuT2JqID0gaGFuZGxlRm4ob2JqKTtcbiAgICBoYW5kbGVDaGlsZHMoZ2VuT2JqLCBjYWNoZU9iaiwgbm9kZSk7XG4gIH07XG59KTtcbiIsIiQgPSByZXF1aXJlIFwianF1ZXJ5LXBsdWdpbnMuY29mZmVlXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcblxuQWRkTW9kZWwgPSByZXF1aXJlIFwiLi9hZGRNb2RlbC5jb2ZmZWVcIlxuYWRkTW9kZWwgPSBBZGRNb2RlbCgpXG5cbkFkZFZpZXcgPSByZXF1aXJlIFwiLi9hZGRWaWV3LmNvZmZlZVwiXG5cbmFkZFZpZXcgPSBBZGRWaWV3ICgkIFwiQGl0ZW0tYWRkLWZvcm1cIiksIGFkZE1vZGVsXG5cbmFkZFZpZXcub24gXCJzYXZlXCIsIChmaWVsZHMpIC0+XG4gIGNvbnNvbGUubG9nIGZpZWxkc1xuXG5tb2RlbHMgPVxuICBzdHJpbmc6IHJlcXVpcmUgXCJzdHJpbmcvYWRkU3RyaW5nTW9kZWwuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9hZGRUYWJsZU1vZGVsLmNvZmZlZVwiXG4gIGNoZWNrYm94OiByZXF1aXJlIFwiY2hlY2tib3gvYWRkQ2hlY2tib3hNb2RlbC5jb2ZmZWVcIlxuICByYWRpbzogcmVxdWlyZSBcInJhZGlvL2FkZFJhZGlvTW9kZWwuY29mZmVlXCJcbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9hZGRJbWFnZU1vZGVsLmNvZmZlZVwiXG5cbnZpZXdzID1cbiAgc3RyaW5nOiByZXF1aXJlIFwic3RyaW5nL2FkZFN0cmluZ1ZpZXcuY29mZmVlXCJcbiAgdGFibGU6IHJlcXVpcmUgXCJ0YWJsZS9hZGRUYWJsZVZpZXcuY29mZmVlXCJcbiAgY2hlY2tib3g6IHJlcXVpcmUgXCJjaGVja2JveC9hZGRDaGVja2JveFZpZXcuY29mZmVlXCJcbiAgcmFkaW86IHJlcXVpcmUgXCJyYWRpby9hZGRSYWRpb1ZpZXcuY29mZmVlXCJcbiAgaW1hZ2U6IHJlcXVpcmUgXCJpbWFnZS9hZGRJbWFnZVZpZXcuY29mZmVlXCJcblxuaHR0cEdldCBcIiN7d2luZG93LmxvY2F0aW9uLmhyZWZ9X19qc29uL1wiXG4udGhlbiAocmVzcG9uc2UpIC0+XG4gICRyb3dzID0gJCBcIkBpbnB1dC1jb250YWluXCJcbiAgaW5kZXggPSAwXG4gIGZvciBmaWVsZCBpbiByZXNwb25zZS5maWVsZHNcbiAgICBpZiBtb2RlbHNbZmllbGQudHlwZV0/XG4gICAgICBtb2RlbCA9IG1vZGVsc1tmaWVsZC50eXBlXSB7ZmllbGR9XG4gICAgICBtb2RlbC5zZXRTZXR0aW5ncz8gZmllbGQuc2V0dGluZ3NcbiAgICAgIHZpZXdzW2ZpZWxkLnR5cGVdICRyb3dzLmVxKGluZGV4KSwgbW9kZWxcbiAgICAgIGFkZE1vZGVsLmFkZCBmaWVsZC5hbGlhcywgbW9kZWxcbiAgICBpZiAhZmllbGQuc2V0dGluZ3MuaGlkZT8gfHwgKGZpZWxkLnNldHRpbmdzLmhpZGU/ICYmICFmaWVsZC5zZXR0aW5ncy5oaWRlKVxuICAgICAgaW5kZXgrK1xuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBpbml0aWFsU3RhdGU6IC0+XG4gICAgZmllbGRzOiBbXVxuXG4gIGFkZDogKG5hbWUsIG1vZGVsKSAtPlxuICAgIGZpZWxkcyA9IEBzdGF0ZS5maWVsZHMuc2xpY2UoKVxuICAgIGZpZWxkcy5wdXNoXG4gICAgICBtb2RlbDogbW9kZWxcbiAgICAgIG5hbWU6IG5hbWVcbiAgICBAc2V0IHtmaWVsZHN9XG5cbiAgZ2V0RmllbGRzOiAtPlxuICAgIHJlc3VsdCA9IHt9XG4gICAgQHN0YXRlLmZpZWxkcy5tYXAgKGl0ZW0pIC0+XG4gICAgICByZXN1bHRbaXRlbS5uYW1lXSA9IGl0ZW0ubW9kZWwuZ2V0KClcbiAgICByZXN1bHRcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwic3VibWl0OiBjb250YWluXCI6IChlKSAtPlxuICAgICAgQHRyaWdnZXIgXCJzYXZlXCIsIEBtb2RlbC5nZXRGaWVsZHMoKVxuICAgICAgcmV0dXJuIGZhbHNlXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFNldHRpbmdzOiAoc2V0dGluZ3MpIC0+XG4gICAgZGF0YSA9IFtdXG4gICAgZGF0YSA9IHNldHRpbmdzLmRlZmF1bHREYXRhLnNsaWNlKClcbiAgICBzZXR0aW5ncy5kZWZhdWx0RGF0YS5zbGljZSgpLm1hcCAoaXRlbSwgaW5kZXgpIC0+IGlmICh0eXBlb2YgaXRlbS5jaGVja2VkKSA9PSBcInN0cmluZ1wiIHRoZW4gZGF0YVtpbmRleF0gPSBpdGVtLmNoZWNrZWQgPT0gXCJ0cnVlXCIgZWxzZSBkYXRhW2luZGV4XSA9IGl0ZW0uY2hlY2tlZFxuICAgIEBzZXQge2RhdGF9XG5cbiAgdXBkYXRlOiAoaW5kZXgsIGNoZWNrZWQpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kYXRhLnNsaWNlKClcbiAgICBkYXRhW2luZGV4XSA9IGNoZWNrZWRcbiAgICBAc2V0IHtkYXRhfVxuXG4gIGdldDogLT4gQHN0YXRlLmRhdGFcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAY2hlY2tib3hcIjogKGUpIC0+XG4gICAgICAkaW5wdXQgPSAkIGUudGFyZ2V0XG4gICAgICBpbmRleCA9ICRpbnB1dC5kYXRhIFwiaW5kZXhcIlxuICAgICAgQG1vZGVsLnVwZGF0ZSBpbmRleCwgZS50YXJnZXQuY2hlY2tlZFxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRQcmV2aWV3OiAoaW5wdXQpIC0+IEBzZXQgZmlsZW5hbWU6IGlucHV0LmZpbGVzWzBdLm5hbWVcblxuICByZW1vdmVQcmV2aWV3OiAtPiBAc2V0IGZpbGVuYW1lOiBmYWxzZVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG50ZW1wbGF0ZSA9IHJlcXVpcmUgXCJ0eXBlcy9pbWFnZS9pdGVtLnRtcGwuanNcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlci5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBkZWJ1ZzogdHJ1ZVxuXG4gIGluaXRpYWw6IC0+XG4gICAgQHRlbXBsYXRlID0gUmVuZGVyIHRlbXBsYXRlLCBAY29udGFpblswXVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIGlmICFzdGF0ZS5maWVsZC5zZXR0aW5ncy5oaWRlXG4gICAgICBAdGVtcGxhdGUgc3RhdGVcblxuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBpbWFnZVwiOiAoZSkgLT4gQG1vZGVsLnNldFByZXZpZXcgZS50YXJnZXRcbiAgICBcImNsaWNrOiBAcmVtb3ZlXCI6IChlKSAtPiBAbW9kZWwucmVtb3ZlUHJldmlldygpXG4iLCJNb2RlbCA9IHJlcXVpcmUgXCJtb2RlbC5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIHNldFNldHRpbmdzOiAoc2V0dGluZ3MpIC0+XG4gICAgQHNldCB2YWx1ZTogKyBzZXR0aW5ncy5kZWZhdWx0VmFsdWVcblxuICB1cGRhdGU6ICh2YWx1ZSkgLT5cbiAgICBAc2V0IHZhbHVlOiArIHZhbHVlXG5cbiAgZ2V0OiAtPiBAc3RhdGUudmFsdWVcbiIsIlZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAcmFkaW9cIjogKGUpIC0+XG4gICAgICAkaW5wdXQgPSAkIGUudGFyZ2V0XG4gICAgICBAbW9kZWwudXBkYXRlICRpbnB1dC5kYXRhIFwiaW5kZXhcIlxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRTZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgIEBzZXQgdmFsdWU6IHNldHRpbmdzLmRlZmF1bHRWYWx1ZVxuXG4gIHVwZGF0ZTogKHZhbHVlKSAtPlxuICAgIEBzZXQge3ZhbHVlfVxuXG4gIGdldDogLT4gQHN0YXRlLnZhbHVlXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGV2ZW50czpcbiAgICBcImNoYW5nZTogQHN0cmluZ1wiOiAoZSkgLT4gQG1vZGVsLnVwZGF0ZSBlLnRhcmdldC52YWx1ZVxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBNb2RlbFxuICBzZXRTZXR0aW5nczogKHNldHRpbmdzKSAtPlxuICAgIEBzZXQgZGF0YTogc2V0dGluZ3MuZGVmYXVsdERhdGEuc2xpY2UoKVxuXG4gIHVwZGF0ZTogKHJvd0luZGV4LCBjb2x1bW5JbmRleCwgdmFsdWUpIC0+XG4gICAgZGF0YSA9IEBzdGF0ZS5kYXRhLnNsaWNlKClcbiAgICBkYXRhW3Jvd0luZGV4XVtjb2x1bW5JbmRleF0gPSB2YWx1ZVxuICAgIEBzZXQge2RhdGF9XG5cbiAgZ2V0OiAtPiBAc3RhdGUuZGF0YVxuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBjZWxsXCI6IChlKSAtPlxuICAgICAgJGlucHV0ID0gJCBlLnRhcmdldFxuICAgICAgcm93SW5kZXggPSArICRpbnB1dC5kYXRhIFwicm93XCJcbiAgICAgIGNvbHVtbkluZGV4ID0gKyAkaW5wdXQuZGF0YSBcImNvbHVtblwiXG4gICAgICBAbW9kZWwudXBkYXRlIHJvd0luZGV4LCBjb2x1bW5JbmRleCwgZS50YXJnZXQudmFsdWVcbiIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbntcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfVxuICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICB9XG4gIGVsc2Uge1xuICAgIHdpbmRvdy5pdGVtID0gZmFjdG9yeSgpO1xuICB9XG59KShmdW5jdGlvbiAoKVxue1xuICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICB9O1xuICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAge1xuICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgfTtcbiAgZnVuY3Rpb24gY291bnQoYXJyKVxuICB7XG4gICAgcmV0dXJuIGFyci5sZW5ndGg7XG4gIH1cbiAgZnVuY3Rpb24gbGVuZ3RoKHN0cilcbiAge1xuICAgIHJldHVybiBzdHIubGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgIH1cbiAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgIHZhciBub2RlO1xuICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgIHZhciBhdHRyO1xuICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgIH1cbiAgfVxuICB2YXIgY2FjaGVkVGVtcGxhdGVzID0ge307XG4gIGZ1bmN0aW9uIGNhY2hlUmVxdWlyZVRlbXBsYXRlKHBhdGgsIHJlcXVpcmVkKVxuICB7XG4gICAgY2FjaGVkVGVtcGxhdGVzW3BhdGhdID0gcmVxdWlyZWQ7XG4gIH1cbiAgZnVuY3Rpb24gcmVxdWlyZVRlbXBsYXRlKHBhdGgsIG9iailcbiAge1xuICAgIHJldHVybiBjYWNoZWRUZW1wbGF0ZXNbcGF0aF0ob2JqKTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAge1xuICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICB7XG4gICAgICB3aXRoIChvYmopIHtcbiAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2ZpbGUtd3JhcCc7XG4gICAgICAgICAgICBhdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICBpZiAoICEoISggdHlwZW9mIGZpbGVuYW1lICE9PSAndW5kZWZpbmVkJyA/IGZpbGVuYW1lIDogJycgKSkpIHtcbiAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2ZpbGUtY2xvc2UnO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9ICdyZW1vdmUnO1xuICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChjcmVhdGUoJ3NwYW4nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBhdHRycyA9IFtdO1xuICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgYXR0ciArPSAnZm9ybV9fZmlsZSc7XG4gICAgICAgICAgICAgICAgaWYgKCAhKCEoIHR5cGVvZiBmaWxlbmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyBmaWxlbmFtZSA6ICcnICkpKSB7XG4gICAgICAgICAgICAgICAgICBhdHRyICs9ICcgZm9ybV9fZmlsZS0tY2hvb3Nlbic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKCAhKCEoIHR5cGVvZiBmaWxlbmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyBmaWxlbmFtZSA6ICcnICkpKSB7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2Zvcm1fX2ZpbGUtZmlsZW5hbWUnO1xuICAgICAgICAgICAgICAgICAgICAgIGF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdzcGFuJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICBjaGlsZHMucHVzaChmaWxlbmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICB2YXIgYXR0cnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2ZpbGUnO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGZpZWxkWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnbmFtZScsIGF0dHJdKTtcbiAgICAgICAgICAgICAgICAgIH0pKCk7XG4gICAgICAgICAgICAgICAgICAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXR0ciA9ICcnO1xuICAgICAgICAgICAgICAgICAgICBhdHRyICs9IGZpZWxkWydhbGlhcyddO1xuICAgICAgICAgICAgICAgICAgICBhdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGF0dHIgPSAnJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3ZhbHVlJywgYXR0cl0pO1xuICAgICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhdHRyID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIGF0dHIgKz0gJ2ltYWdlJztcbiAgICAgICAgICAgICAgICAgICAgYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG4gICAgICAgICAgICAgICAgICB9KSgpO1xuICAgICAgICAgICAgICAgICAgY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4gICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfSkoKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0pKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KTsiXX0=
