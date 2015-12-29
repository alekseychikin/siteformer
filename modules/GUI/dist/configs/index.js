(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IndexModel, IndexView, SectionsMenuView, indexModel;

IndexModel = require("./indexModel.coffee");

indexModel = IndexModel();

IndexView = require("./indexView.coffee");

SectionsMenuView = require("./sectionsMenuView.coffee");

IndexView($("@sections"), indexModel);

SectionsMenuView($("@sections-menu"), indexModel);


},{"./indexModel.coffee":2,"./indexView.coffee":3,"./sectionsMenuView.coffee":4}],2:[function(require,module,exports){
var Model, httpGet, httpPost;

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model({
  initialState: function() {
    return httpGet(window.location.pathname + "__json/");
  },
  setCheck: function(index, checked) {
    var sections;
    index = parseInt(index, 10);
    sections = this.state.sections.slice();
    sections[index].checked = checked;
    return this.set({
      sections: sections
    });
  },
  checkAll: function(checked) {
    var i, len, section, sections;
    sections = this.state.sections.slice();
    for (i = 0, len = sections.length; i < len; i++) {
      section = sections[i];
      section.checked = checked;
    }
    return this.set({
      sections: sections
    });
  },
  removeSubmit: function() {
    var deleteSections, i, len, section, sections, sourceSections;
    sourceSections = this.state.sections.slice();
    sections = [];
    deleteSections = [];
    for (i = 0, len = sourceSections.length; i < len; i++) {
      section = sourceSections[i];
      if ((section.checked == null) || !section.checked) {
        sections.push(section);
      } else {
        deleteSections.push(section.id);
      }
    }
    httpPost(window.location.pathname + "action_delete/__json/", {
      deleteSections: deleteSections
    })["catch"]((function(_this) {
      return function(response) {
        console.error(response.error);
        return _this.set({
          sections: sourceSections
        });
      };
    })(this));
    return this.set({
      sections: sections
    });
  }
});


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],3:[function(require,module,exports){
var Render, View, sectionsTemplate;

View = require("view.coffee");

sectionsTemplate = require("sections/configs/table-sections-list.tmpl.js");

Render = require("render");

module.exports = View({
  initial: function() {
    return this.templateList = Render(sectionsTemplate, this.contain[0]);
  },
  events: {
    "change: @check-item": function(e) {
      return this.model.setCheck(($(e.target)).closest("@section-row").attr("data-id"), e.target.checked);
    },
    "change: @cbeck-all": function(e) {
      return this.model.checkAll(e.target.checked);
    },
    "submit: @bottom-form": function(e) {
      this.model.removeSubmit();
      return false;
    }
  },
  render: function(state) {
    return this.templateList(state);
  }
});


},{"render":"render","sections/configs/table-sections-list.tmpl.js":6,"view.coffee":"view.coffee"}],4:[function(require,module,exports){
var Render, View, menuTemplate;

Render = require("render");

View = require("view.coffee");

menuTemplate = require("components/menu/menu-items.tmpl.js");

module.exports = View({
  initial: function() {
    return this.menuTemplate = Render(menuTemplate, this.contain[0]);
  },
  render: function(state) {
    return this.menuTemplate(state);
  }
});


},{"components/menu/menu-items.tmpl.js":5,"render":"render","view.coffee":"view.coffee"}],5:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.menuItems = factory();
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
        {with (obj) {var arr0 = sections; for (sectionsItem in arr0) if (_hasProp.call(arr0, sectionsItem)) {
sectionsItem = arr0[sectionsItem];
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'menu__item';
if ( section == sectionsItem['alias']) {
attr += ' menu__item--active';
}
attrs.push(['class', attr]);
})();
childs.push(create('li', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '/cms/';
attr += sectionsItem['alias'];
attr += '/';
attrs.push(['href', attr]);
})();
(function () {
var attr = '';
attr += 'menu__link';
attrs.push(['class', attr]);
})();
childs.push(create('a', attrs, function (childs) {
childs.push(sectionsItem['title'])
}));
})();
}));
})();
}}})};
    });
},{}],6:[function(require,module,exports){
(function (factory)
    {
      if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        module.exports = factory();
      }
      else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
        define('first-try', [], factory());
      }
      else {
        window.tableSectionsList = factory();
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
attr += 'section__row';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '/cms/configs/add/';
attrs.push(['href', attr]);
})();
(function () {
var attr = '';
attr += 'form__btn';
attrs.push(['class', attr]);
})();
childs.push(create('a', attrs, function (childs) {
childs.push('Добавить раздел');
}));
})();
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'section__row';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'section-list';
attrs.push(['role', attr]);
})();
childs.push(create('div', attrs, function (childs) {
checkedItems = 0;(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'table';
attrs.push(['class', attr]);
})();
childs.push(create('table', attrs, function (childs) {
(function () {
var attrs = [];
childs.push(create('colgroup', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '20';
attrs.push(['width', attr]);
})();
childs.push(create('col', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '*';
attrs.push(['width', attr]);
})();
childs.push(create('col', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '*';
attrs.push(['width', attr]);
})();
childs.push(create('col', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '*';
attrs.push(['width', attr]);
})();
childs.push(create('col', attrs, function (childs) {
}));
})();
}));
})();
(function () {
var attrs = [];
childs.push(create('thead', attrs, function (childs) {
(function () {
var attrs = [];
childs.push(create('tr', attrs, function (childs) {
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'checkbox';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'checkall';
attrs.push(['id', attr]);
})();
(function () {
var attr = '';
attr += 'cbeck-all';
attrs.push(['role', attr]);
})();
childs.push(create('input', attrs, function (childs) {
}));
})();
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'checkall';
attrs.push(['for', attr]);
})();
childs.push(create('label', attrs, function (childs) {
}));
})();
}));
})();
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
childs.push('Название');
}));
})();
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
childs.push('Веб-имя');
}));
})();
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
childs.push('Модуль');
}));
})();
}));
})();
}));
})();
(function () {
var attrs = [];
childs.push(create('tbody', attrs, function (childs) {
var arr4 = sections; for (i in arr4) if (_hasProp.call(arr4, i)) {
sectionsItem = arr4[i];
if ( ( typeof sectionsItem['checked'] != 'undefined' ? sectionsItem['checked'] : '') && (sectionsItem['checked'] == "true" || sectionsItem['checked'] == true)) {
checkedItems = checkedItems + 1;}
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'table__link';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'section-row';
attrs.push(['role', attr]);
})();
(function () {
var attr = '';
attr += i;
attrs.push(['data-id', attr]);
})();
childs.push(create('tr', attrs, function (childs) {
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'checkbox';
attrs.push(['type', attr]);
})();
(function () {
var attr = '';
attr += 'check';
attr += sectionsItem['id'];
attrs.push(['id', attr]);
})();
(function () {
var attr = '';
attr += 'check-item';
attrs.push(['role', attr]);
})();
if ( ( typeof sectionsItem['checked'] != 'undefined' ? sectionsItem['checked'] : '') && (sectionsItem['checked'] == "true" || sectionsItem['checked'] == true)) {
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
attr += 'check';
attr += sectionsItem['id'];
attrs.push(['for', attr]);
})();
childs.push(create('label', attrs, function (childs) {
}));
})();
}));
})();
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '/cms/configs/';
attr += sectionsItem['alias'];
attr += '/';
attrs.push(['href', attr]);
})();
childs.push(create('a', attrs, function (childs) {
childs.push(sectionsItem['title'])
}));
})();
}));
})();
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '/cms/configs/';
attr += sectionsItem['alias'];
attr += '/';
attrs.push(['href', attr]);
})();
childs.push(create('a', attrs, function (childs) {
childs.push(sectionsItem['alias'])
}));
})();
}));
})();
(function () {
var attrs = [];
childs.push(create('td', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '/cms/configs/';
attr += sectionsItem['alias'];
attr += '/';
attrs.push(['href', attr]);
})();
childs.push(create('a', attrs, function (childs) {
childs.push(sectionsItem['module'])
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
attr += 'section__row';
attrs.push(['class', attr]);
})();
childs.push(create('div', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attrs.push(['action', attr]);
})();
(function () {
var attr = '';
attr += 'bottom-form';
attrs.push(['role', attr]);
})();
childs.push(create('form', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += 'form__btn';
attrs.push(['class', attr]);
})();
(function () {
var attr = '';
attr += 'submit';
attrs.push(['type', attr]);
})();
if ( checkedItems == 0) {
(function () {
var attr = '';
attrs.push(['disabled', attr]);
})();
}
childs.push(create('button', attrs, function (childs) {
childs.push('Удалить');
}));
})();
}));
})();
}));
})();
}})};
    });
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvaW5kZXhNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL3NlY3Rpb25zTWVudVZpZXcuY29mZmVlIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvY29tcG9uZW50cy9tZW51L21lbnUtaXRlbXMudG1wbC5qcyIsInRlbXAvbW9kdWxlcy9HVUkvLmNvbXBpbGVfdGVtcGxhdGVzL3NlY3Rpb25zL2NvbmZpZ3MvdGFibGUtc2VjdGlvbnMtbGlzdC50bXBsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBQTs7QUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLHFCQUFSOztBQUNiLFVBQUEsR0FBYSxVQUFBLENBQUE7O0FBQ2IsU0FBQSxHQUFZLE9BQUEsQ0FBUSxvQkFBUjs7QUFDWixnQkFBQSxHQUFtQixPQUFBLENBQVEsMkJBQVI7O0FBRW5CLFNBQUEsQ0FBVyxDQUFBLENBQUUsV0FBRixDQUFYLEVBQTJCLFVBQTNCOztBQUNBLGdCQUFBLENBQWtCLENBQUEsQ0FBRSxnQkFBRixDQUFsQixFQUF1QyxVQUF2Qzs7OztBQ05BLElBQUE7O0FBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxjQUFSOztBQUNSLE9BQUEsR0FBVSxDQUFDLE9BQUEsQ0FBUSxhQUFSLENBQUQsQ0FBdUIsQ0FBQzs7QUFDbEMsUUFBQSxHQUFXLENBQUMsT0FBQSxDQUFRLGFBQVIsQ0FBRCxDQUF1QixDQUFDOztBQUVuQyxNQUFNLENBQUMsT0FBUCxHQUFpQixLQUFBLENBQ2Y7RUFBQSxZQUFB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJJbmRleE1vZGVsID0gcmVxdWlyZSBcIi4vaW5kZXhNb2RlbC5jb2ZmZWVcIlxuaW5kZXhNb2RlbCA9IEluZGV4TW9kZWwoKVxuSW5kZXhWaWV3ID0gcmVxdWlyZSBcIi4vaW5kZXhWaWV3LmNvZmZlZVwiXG5TZWN0aW9uc01lbnVWaWV3ID0gcmVxdWlyZSBcIi4vc2VjdGlvbnNNZW51Vmlldy5jb2ZmZWVcIlxuXG5JbmRleFZpZXcgKCQgXCJAc2VjdGlvbnNcIiksIGluZGV4TW9kZWxcblNlY3Rpb25zTWVudVZpZXcgKCQgXCJAc2VjdGlvbnMtbWVudVwiKSwgaW5kZXhNb2RlbFxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcbmh0dHBQb3N0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwUG9zdFxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIGluaXRpYWxTdGF0ZTogLT5cbiAgICBodHRwR2V0IFwiI3t3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9X19qc29uL1wiXG5cbiAgc2V0Q2hlY2s6IChpbmRleCwgY2hlY2tlZCkgLT5cbiAgICBpbmRleCA9IHBhcnNlSW50IGluZGV4LCAxMFxuICAgIHNlY3Rpb25zID0gQHN0YXRlLnNlY3Rpb25zLnNsaWNlKClcbiAgICBzZWN0aW9uc1tpbmRleF0uY2hlY2tlZCA9IGNoZWNrZWRcbiAgICBAc2V0IHNlY3Rpb25zOiBzZWN0aW9uc1xuXG4gIGNoZWNrQWxsOiAoY2hlY2tlZCkgLT5cbiAgICBzZWN0aW9ucyA9IEBzdGF0ZS5zZWN0aW9ucy5zbGljZSgpXG4gICAgZm9yIHNlY3Rpb24gaW4gc2VjdGlvbnNcbiAgICAgIHNlY3Rpb24uY2hlY2tlZCA9IGNoZWNrZWRcbiAgICBAc2V0IHNlY3Rpb25zOiBzZWN0aW9uc1xuXG4gIHJlbW92ZVN1Ym1pdDogLT5cbiAgICBzb3VyY2VTZWN0aW9ucyA9IEBzdGF0ZS5zZWN0aW9ucy5zbGljZSgpXG4gICAgc2VjdGlvbnMgPSBbXVxuICAgIGRlbGV0ZVNlY3Rpb25zID0gW11cbiAgICBmb3Igc2VjdGlvbiBpbiBzb3VyY2VTZWN0aW9uc1xuICAgICAgaWYgIXNlY3Rpb24uY2hlY2tlZD8gfHwgIXNlY3Rpb24uY2hlY2tlZFxuICAgICAgICBzZWN0aW9ucy5wdXNoIHNlY3Rpb25cbiAgICAgIGVsc2VcbiAgICAgICAgZGVsZXRlU2VjdGlvbnMucHVzaCBzZWN0aW9uLmlkXG4gICAgaHR0cFBvc3QgXCIje3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZX1hY3Rpb25fZGVsZXRlL19fanNvbi9cIiwge2RlbGV0ZVNlY3Rpb25zfVxuICAgIC5jYXRjaCAocmVzcG9uc2UpID0+XG4gICAgICBjb25zb2xlLmVycm9yIHJlc3BvbnNlLmVycm9yXG4gICAgICBAc2V0IHNlY3Rpb25zOiBzb3VyY2VTZWN0aW9uc1xuICAgIEBzZXQgc2VjdGlvbnM6IHNlY3Rpb25zXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcbnNlY3Rpb25zVGVtcGxhdGUgPSByZXF1aXJlIFwic2VjdGlvbnMvY29uZmlncy90YWJsZS1zZWN0aW9ucy1saXN0LnRtcGwuanNcIlxuUmVuZGVyID0gcmVxdWlyZSBcInJlbmRlclwiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBpbml0aWFsOiAtPlxuICAgIEB0ZW1wbGF0ZUxpc3QgPSBSZW5kZXIgc2VjdGlvbnNUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cblxuICBldmVudHM6XG4gICAgXCJjaGFuZ2U6IEBjaGVjay1pdGVtXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLnNldENoZWNrICgkIGUudGFyZ2V0KS5jbG9zZXN0KFwiQHNlY3Rpb24tcm93XCIpLmF0dHIoXCJkYXRhLWlkXCIpLCBlLnRhcmdldC5jaGVja2VkXG4gICAgXCJjaGFuZ2U6IEBjYmVjay1hbGxcIjogKGUpIC0+XG4gICAgICBAbW9kZWwuY2hlY2tBbGwgZS50YXJnZXQuY2hlY2tlZFxuICAgIFwic3VibWl0OiBAYm90dG9tLWZvcm1cIjogKGUpIC0+XG4gICAgICBAbW9kZWwucmVtb3ZlU3VibWl0KClcbiAgICAgIGZhbHNlXG5cbiAgcmVuZGVyOiAoc3RhdGUpIC0+IEB0ZW1wbGF0ZUxpc3Qgc3RhdGVcbiIsIlJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxuVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5tZW51VGVtcGxhdGUgPSByZXF1aXJlIFwiY29tcG9uZW50cy9tZW51L21lbnUtaXRlbXMudG1wbC5qc1wiXG5cbm1vZHVsZS5leHBvcnRzID0gVmlld1xuICBpbml0aWFsOiAtPiBAbWVudVRlbXBsYXRlID0gUmVuZGVyIG1lbnVUZW1wbGF0ZSwgQGNvbnRhaW5bMF1cbiAgcmVuZGVyOiAoc3RhdGUpIC0+IEBtZW51VGVtcGxhdGUgc3RhdGVcbiIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbiAgICB7XG4gICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy5tZW51SXRlbXMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfSkoZnVuY3Rpb24gKClcbiAgICB7XG4gICAgICB2YXIgX2hhc1Byb3AgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuICAgICAgdmFyIF9jckVsID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ25vZGUnLCBuYW1lOiBub2RlLCBhdHRyczogW10sIGNoaWxkczogW119O1xuICAgICAgfTtcbiAgICAgIHZhciBfY3JUTiA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICd0ZXh0JywgdGV4dDogbm9kZX07XG4gICAgICB9O1xuICAgICAgZnVuY3Rpb24gY3JlYXRlKClcbiAgICAgIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICB2YXIgcm9vdE5vZGVzID0gW107XG4gICAgICAgICAgYXJndW1lbnRzWzBdKHJvb3ROb2Rlcyk7XG4gICAgICAgICAgaWYgKHJvb3ROb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIHJvb3ROb2Rlcykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChyb290Tm9kZXMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgICByb290Tm9kZXNbaW5kZXhBdHRyXSA9IF9jclROKHJvb3ROb2Rlc1tpbmRleEF0dHJdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHJvb3ROb2RlcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgdmFyIG5vZGVzID0gW107XG4gICAgICAgICAgdmFyIHBhcmVudE5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4Tm9kZTtcbiAgICAgICAgICB2YXIgbm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhBdHRyO1xuICAgICAgICAgIHZhciBhdHRyO1xuICAgICAgICAgIHZhciBhdHRycyA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgICBhcmd1bWVudHNbMl0obm9kZXMpO1xuICAgICAgICAgIHBhcmVudE5vZGUgPSBfY3JFbChhcmd1bWVudHNbMF0pO1xuICAgICAgICAgIGlmIChhdHRycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAoaW5kZXhBdHRyIGluIGF0dHJzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKGF0dHJzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgYXR0ciA9IGF0dHJzW2luZGV4QXR0cl07XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5hdHRycy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgIG5hbWU6IGF0dHJbMF0sXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogYXR0clsxXVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGZvciAoaW5kZXhOb2RlIGluIG5vZGVzKSB7XG4gICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChub2RlcywgaW5kZXhOb2RlKSkge1xuICAgICAgICAgICAgICBub2RlID0gbm9kZXNbaW5kZXhOb2RlXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBub2RlID09PSAnc3RyaW5nJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiBub2RlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2goX2NyVE4obm9kZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuY2hpbGRzLnB1c2gobm9kZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHBhcmVudE5vZGU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiAob2JqKVxuICAgICAge1xuICAgICAgICByZXR1cm4gY3JlYXRlKGZ1bmN0aW9uIChjaGlsZHMpXG4gICAgICAgIHt3aXRoIChvYmopIHt2YXIgYXJyMCA9IHNlY3Rpb25zOyBmb3IgKHNlY3Rpb25zSXRlbSBpbiBhcnIwKSBpZiAoX2hhc1Byb3AuY2FsbChhcnIwLCBzZWN0aW9uc0l0ZW0pKSB7XG5zZWN0aW9uc0l0ZW0gPSBhcnIwW3NlY3Rpb25zSXRlbV07XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ21lbnVfX2l0ZW0nO1xuaWYgKCBzZWN0aW9uID09IHNlY3Rpb25zSXRlbVsnYWxpYXMnXSkge1xuYXR0ciArPSAnIG1lbnVfX2l0ZW0tLWFjdGl2ZSc7XG59XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsaScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJy9jbXMvJztcbmF0dHIgKz0gc2VjdGlvbnNJdGVtWydhbGlhcyddO1xuYXR0ciArPSAnLyc7XG5hdHRycy5wdXNoKFsnaHJlZicsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ21lbnVfX2xpbmsnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaChzZWN0aW9uc0l0ZW1bJ3RpdGxlJ10pXG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19fSl9O1xuICAgIH0pOyIsIihmdW5jdGlvbiAoZmFjdG9yeSlcbiAgICB7XG4gICAgICBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIG1vZHVsZS5leHBvcnRzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBkZWZpbmUuYW1kICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWZpbmUoJ2ZpcnN0LXRyeScsIFtdLCBmYWN0b3J5KCkpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHdpbmRvdy50YWJsZVNlY3Rpb25zTGlzdCA9IGZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICB9KShmdW5jdGlvbiAoKVxuICAgIHtcbiAgICAgIHZhciBfaGFzUHJvcCA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gICAgICB2YXIgX2NyRWwgPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAnbm9kZScsIG5hbWU6IG5vZGUsIGF0dHJzOiBbXSwgY2hpbGRzOiBbXX07XG4gICAgICB9O1xuICAgICAgdmFyIF9jclROID0gZnVuY3Rpb24gKG5vZGUpXG4gICAgICB7XG4gICAgICAgIHJldHVybiB7dHlwZTogJ3RleHQnLCB0ZXh0OiBub2RlfTtcbiAgICAgIH07XG4gICAgICBmdW5jdGlvbiBjcmVhdGUoKVxuICAgICAge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgIHZhciByb290Tm9kZXMgPSBbXTtcbiAgICAgICAgICBhcmd1bWVudHNbMF0ocm9vdE5vZGVzKTtcbiAgICAgICAgICBpZiAocm9vdE5vZGVzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gcm9vdE5vZGVzKSB7XG4gICAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKHJvb3ROb2RlcywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygcm9vdE5vZGVzW2luZGV4QXR0cl0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ2Jvb2xlYW4nIHx8IHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICAgIHJvb3ROb2Rlc1tpbmRleEF0dHJdID0gX2NyVE4ocm9vdE5vZGVzW2luZGV4QXR0cl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcm9vdE5vZGVzO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDMpIHtcbiAgICAgICAgICB2YXIgbm9kZXMgPSBbXTtcbiAgICAgICAgICB2YXIgcGFyZW50Tm9kZTtcbiAgICAgICAgICB2YXIgaW5kZXhOb2RlO1xuICAgICAgICAgIHZhciBub2RlO1xuICAgICAgICAgIHZhciBpbmRleEF0dHI7XG4gICAgICAgICAgdmFyIGF0dHI7XG4gICAgICAgICAgdmFyIGF0dHJzID0gYXJndW1lbnRzWzFdO1xuICAgICAgICAgIGFyZ3VtZW50c1syXShub2Rlcyk7XG4gICAgICAgICAgcGFyZW50Tm9kZSA9IF9jckVsKGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgaWYgKGF0dHJzLmxlbmd0aCkge1xuICAgICAgICAgICAgZm9yIChpbmRleEF0dHIgaW4gYXR0cnMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwoYXR0cnMsIGluZGV4QXR0cikpIHtcbiAgICAgICAgICAgICAgICBhdHRyID0gYXR0cnNbaW5kZXhBdHRyXTtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmF0dHJzLnB1c2goe1xuICAgICAgICAgICAgICAgICAgbmFtZTogYXR0clswXSxcbiAgICAgICAgICAgICAgICAgIHZhbHVlOiBhdHRyWzFdXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgZm9yIChpbmRleE5vZGUgaW4gbm9kZXMpIHtcbiAgICAgICAgICAgIGlmIChfaGFzUHJvcC5jYWxsKG5vZGVzLCBpbmRleE5vZGUpKSB7XG4gICAgICAgICAgICAgIG5vZGUgPSBub2Rlc1tpbmRleE5vZGVdO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIG5vZGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBub2RlID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIG5vZGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChfY3JUTihub2RlKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyZW50Tm9kZS5jaGlsZHMucHVzaChub2RlKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyZW50Tm9kZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChvYmopXG4gICAgICB7XG4gICAgICAgIHJldHVybiBjcmVhdGUoZnVuY3Rpb24gKGNoaWxkcylcbiAgICAgICAge3dpdGggKG9iaikgeyhmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnc2VjdGlvbl9fcm93JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJy9jbXMvY29uZmlncy9hZGQvJztcbmF0dHJzLnB1c2goWydocmVmJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2EnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9CU0L7QsdCw0LLQuNGC0Ywg0YDQsNC30LTQtdC7Jyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnc2VjdGlvbl9fcm93JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3NlY3Rpb24tbGlzdCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGVja2VkSXRlbXMgPSAwOyhmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFibGUnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGFibGUnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdjb2xncm91cCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJzIwJztcbmF0dHJzLnB1c2goWyd3aWR0aCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICcqJztcbmF0dHJzLnB1c2goWyd3aWR0aCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICcqJztcbmF0dHJzLnB1c2goWyd3aWR0aCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICcqJztcbmF0dHJzLnB1c2goWyd3aWR0aCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2NvbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGhlYWQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0cicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY2hlY2tib3gnO1xuYXR0cnMucHVzaChbJ3R5cGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjaGVja2FsbCc7XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjYmVjay1hbGwnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjaGVja2FsbCc7XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQndCw0LfQstCw0L3QuNC1Jyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JLQtdCxLdC40LzRjycpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cc0L7QtNGD0LvRjCcpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0Ym9keScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG52YXIgYXJyNCA9IHNlY3Rpb25zOyBmb3IgKGkgaW4gYXJyNCkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyNCwgaSkpIHtcbnNlY3Rpb25zSXRlbSA9IGFycjRbaV07XG5pZiAoICggdHlwZW9mIHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddICE9ICd1bmRlZmluZWQnID8gc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gOiAnJykgJiYgKHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IFwidHJ1ZVwiIHx8IHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IHRydWUpKSB7XG5jaGVja2VkSXRlbXMgPSBjaGVja2VkSXRlbXMgKyAxO31cbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAndGFibGVfX2xpbmsnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnc2VjdGlvbi1yb3cnO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9IGk7XG5hdHRycy5wdXNoKFsnZGF0YS1pZCcsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RyJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjaGVja2JveCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NoZWNrJztcbmF0dHIgKz0gc2VjdGlvbnNJdGVtWydpZCddO1xuYXR0cnMucHVzaChbJ2lkJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY2hlY2staXRlbSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoICggdHlwZW9mIHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddICE9ICd1bmRlZmluZWQnID8gc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gOiAnJykgJiYgKHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IFwidHJ1ZVwiIHx8IHNlY3Rpb25zSXRlbVsnY2hlY2tlZCddID09IHRydWUpKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydjaGVja2VkJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY2hlY2snO1xuYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2lkJ107XG5hdHRycy5wdXNoKFsnZm9yJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnL2Ntcy9jb25maWdzLyc7XG5hdHRyICs9IHNlY3Rpb25zSXRlbVsnYWxpYXMnXTtcbmF0dHIgKz0gJy8nO1xuYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKHNlY3Rpb25zSXRlbVsndGl0bGUnXSlcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJy9jbXMvY29uZmlncy8nO1xuYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2FsaWFzJ107XG5hdHRyICs9ICcvJztcbmF0dHJzLnB1c2goWydocmVmJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaChzZWN0aW9uc0l0ZW1bJ2FsaWFzJ10pXG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICcvY21zL2NvbmZpZ3MvJztcbmF0dHIgKz0gc2VjdGlvbnNJdGVtWydhbGlhcyddO1xuYXR0ciArPSAnLyc7XG5hdHRycy5wdXNoKFsnaHJlZicsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2EnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goc2VjdGlvbnNJdGVtWydtb2R1bGUnXSlcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3NlY3Rpb25fX3Jvdyc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRycy5wdXNoKFsnYWN0aW9uJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnYm90dG9tLWZvcm0nO1xuYXR0cnMucHVzaChbJ3JvbGUnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdmb3JtJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnZm9ybV9fYnRuJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ3N1Ym1pdCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG5pZiAoIGNoZWNrZWRJdGVtcyA9PSAwKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydkaXNhYmxlZCcsIGF0dHJdKTtcbn0pKCk7XG59XG5jaGlsZHMucHVzaChjcmVhdGUoJ2J1dHRvbicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0KPQtNCw0LvQuNGC0YwnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn19KX07XG4gICAgfSk7Il19
