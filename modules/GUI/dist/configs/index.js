(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var IndexModel, IndexView, SectionsMenuView;

IndexModel = require("./indexModel.coffee");

IndexView = require("./indexView.coffee");

SectionsMenuView = require("./sectionsMenuView.coffee");


},{"./indexModel.coffee":2,"./indexView.coffee":3,"./sectionsMenuView.coffee":4}],2:[function(require,module,exports){
var Model, httpGet, httpPost;

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model("indexModel", {
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
var Render, View, indexModel, sectionsTemplate;

View = require("view.coffee");

indexModel = require("./indexModel.coffee");

sectionsTemplate = require("sections/configs/table-sections-list.tmpl.js");

Render = require("render");

module.exports = View("indexView", {
  contain: $("@sections"),
  model: indexModel,
  initial: function() {
    return this.templateList = Render(sectionsTemplate, this.contain[0]);
  },
  events: {
    "change: @check-item": function(e) {
      return indexModel.setCheck(($(e.target)).closest("@section-row").attr("data-id"), e.target.checked);
    },
    "change: @cbeck-all": function(e) {
      return indexModel.checkAll(e.target.checked);
    },
    "submit: @bottom-form": function(e) {
      indexModel.removeSubmit();
      return false;
    }
  },
  render: function(state) {
    return this.templateList(state);
  }
});


},{"./indexModel.coffee":2,"render":"render","sections/configs/table-sections-list.tmpl.js":6,"view.coffee":"view.coffee"}],4:[function(require,module,exports){
var IndexModel, Render, View, menuTemplate;

Render = require("render");

View = require("view.coffee");

IndexModel = require("./indexModel.coffee");

menuTemplate = require("components/menu/menu-items.tmpl.js");

module.exports = View("sectioneMenuView", {
  contain: $("@sections-menu"),
  initial: function() {
    return this.menuTemplate = Render(menuTemplate, this.contain[0]);
  },
  model: IndexModel,
  render: function(state) {
    return this.menuTemplate(state);
  }
});


},{"./indexModel.coffee":2,"components/menu/menu-items.tmpl.js":5,"render":"render","view.coffee":"view.coffee"}],5:[function(require,module,exports){
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
attrs.push(['class', attr]);
})();
childs.push(create('li', attrs, function (childs) {
(function () {
var attrs = [];
(function () {
var attr = '';
attr += '/cms/sections/';
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
var arr0 = sections; for (i in arr0) if (_hasProp.call(arr0, i)) {
sectionsItem = arr0[i];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvaW5kZXguY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4TW9kZWwuY29mZmVlIiwiL1VzZXJzL21ha2luZ29mZi9Qcm9qZWN0cy9zYXJhbnNrdG9kYXktbmV3L3NmLWVuZ2luZS9tb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4Vmlldy5jb2ZmZWUiLCIvVXNlcnMvbWFraW5nb2ZmL1Byb2plY3RzL3NhcmFuc2t0b2RheS1uZXcvc2YtZW5naW5lL21vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3Mvc2VjdGlvbnNNZW51Vmlldy5jb2ZmZWUiLCJ0ZW1wL21vZHVsZXMvR1VJLy5jb21waWxlX3RlbXBsYXRlcy9jb21wb25lbnRzL21lbnUvbWVudS1pdGVtcy50bXBsLmpzIiwidGVtcC9tb2R1bGVzL0dVSS8uY29tcGlsZV90ZW1wbGF0ZXMvc2VjdGlvbnMvY29uZmlncy90YWJsZS1zZWN0aW9ucy1saXN0LnRtcGwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQSxJQUFBOztBQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEscUJBQVI7O0FBQ2IsU0FBQSxHQUFZLE9BQUEsQ0FBUSxvQkFBUjs7QUFDWixnQkFBQSxHQUFtQixPQUFBLENBQVEsMkJBQVI7Ozs7QUNGbkIsSUFBQTs7QUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLGNBQVI7O0FBQ1IsT0FBQSxHQUFVLENBQUMsT0FBQSxDQUFRLGFBQVIsQ0FBRCxDQUF1QixDQUFDOztBQUNsQyxRQUFBLEdB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJJbmRleE1vZGVsID0gcmVxdWlyZSBcIi4vaW5kZXhNb2RlbC5jb2ZmZWVcIlxuSW5kZXhWaWV3ID0gcmVxdWlyZSBcIi4vaW5kZXhWaWV3LmNvZmZlZVwiXG5TZWN0aW9uc01lbnVWaWV3ID0gcmVxdWlyZSBcIi4vc2VjdGlvbnNNZW51Vmlldy5jb2ZmZWVcIlxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcbmh0dHBQb3N0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwUG9zdFxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsIFwiaW5kZXhNb2RlbFwiLFxuICBpbml0aWFsU3RhdGU6IC0+XG4gICAgaHR0cEdldCBcIiN7d2luZG93LmxvY2F0aW9uLnBhdGhuYW1lfV9fanNvbi9cIlxuXG4gIHNldENoZWNrOiAoaW5kZXgsIGNoZWNrZWQpIC0+XG4gICAgaW5kZXggPSBwYXJzZUludCBpbmRleCwgMTBcbiAgICBzZWN0aW9ucyA9IEBzdGF0ZS5zZWN0aW9ucy5zbGljZSgpXG4gICAgc2VjdGlvbnNbaW5kZXhdLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICBjaGVja0FsbDogKGNoZWNrZWQpIC0+XG4gICAgc2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIGZvciBzZWN0aW9uIGluIHNlY3Rpb25zXG4gICAgICBzZWN0aW9uLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICByZW1vdmVTdWJtaXQ6IC0+XG4gICAgc291cmNlU2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIHNlY3Rpb25zID0gW11cbiAgICBkZWxldGVTZWN0aW9ucyA9IFtdXG4gICAgZm9yIHNlY3Rpb24gaW4gc291cmNlU2VjdGlvbnNcbiAgICAgIGlmICFzZWN0aW9uLmNoZWNrZWQ/IHx8ICFzZWN0aW9uLmNoZWNrZWRcbiAgICAgICAgc2VjdGlvbnMucHVzaCBzZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIGRlbGV0ZVNlY3Rpb25zLnB1c2ggc2VjdGlvbi5pZFxuICAgIGh0dHBQb3N0IFwiI3t3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9YWN0aW9uX2RlbGV0ZS9fX2pzb24vXCIsIHtkZWxldGVTZWN0aW9uc31cbiAgICAuY2F0Y2ggKHJlc3BvbnNlKSA9PlxuICAgICAgY29uc29sZS5lcnJvciByZXNwb25zZS5lcnJvclxuICAgICAgQHNldCBzZWN0aW9uczogc291cmNlU2VjdGlvbnNcbiAgICBAc2V0IHNlY3Rpb25zOiBzZWN0aW9uc1xuIiwiVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5pbmRleE1vZGVsID0gcmVxdWlyZSBcIi4vaW5kZXhNb2RlbC5jb2ZmZWVcIlxuc2VjdGlvbnNUZW1wbGF0ZSA9IHJlcXVpcmUgXCJzZWN0aW9ucy9jb25maWdzL3RhYmxlLXNlY3Rpb25zLWxpc3QudG1wbC5qc1wiXG5SZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3IFwiaW5kZXhWaWV3XCIsXG4gIGNvbnRhaW46ICgkIFwiQHNlY3Rpb25zXCIpXG4gIG1vZGVsOiBpbmRleE1vZGVsXG5cbiAgaW5pdGlhbDogLT5cbiAgICBAdGVtcGxhdGVMaXN0ID0gUmVuZGVyIHNlY3Rpb25zVGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAY2hlY2staXRlbVwiOiAoZSkgLT5cbiAgICAgIGluZGV4TW9kZWwuc2V0Q2hlY2sgKCQgZS50YXJnZXQpLmNsb3Nlc3QoXCJAc2VjdGlvbi1yb3dcIikuYXR0cihcImRhdGEtaWRcIiksIGUudGFyZ2V0LmNoZWNrZWRcbiAgICBcImNoYW5nZTogQGNiZWNrLWFsbFwiOiAoZSkgLT5cbiAgICAgIGluZGV4TW9kZWwuY2hlY2tBbGwgZS50YXJnZXQuY2hlY2tlZFxuICAgIFwic3VibWl0OiBAYm90dG9tLWZvcm1cIjogKGUpIC0+XG4gICAgICBpbmRleE1vZGVsLnJlbW92ZVN1Ym1pdCgpXG4gICAgICBmYWxzZVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPlxuICAgIEB0ZW1wbGF0ZUxpc3Qgc3RhdGVcbiIsIlJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxuVmlldyA9IHJlcXVpcmUgXCJ2aWV3LmNvZmZlZVwiXG5JbmRleE1vZGVsID0gcmVxdWlyZSBcIi4vaW5kZXhNb2RlbC5jb2ZmZWVcIlxubWVudVRlbXBsYXRlID0gcmVxdWlyZSBcImNvbXBvbmVudHMvbWVudS9tZW51LWl0ZW1zLnRtcGwuanNcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXcgXCJzZWN0aW9uZU1lbnVWaWV3XCIsXG4gIGNvbnRhaW46ICQgXCJAc2VjdGlvbnMtbWVudVwiXG4gIGluaXRpYWw6IC0+XG4gICAgQG1lbnVUZW1wbGF0ZSA9IFJlbmRlciBtZW51VGVtcGxhdGUsIEBjb250YWluWzBdXG4gIG1vZGVsOiBJbmRleE1vZGVsXG4gIHJlbmRlcjogKHN0YXRlKSAtPiBAbWVudVRlbXBsYXRlIHN0YXRlXG4iLCIoZnVuY3Rpb24gKGZhY3RvcnkpXG4gICAge1xuICAgICAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG4gICAgICB9XG4gICAgICBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVmaW5lKCdmaXJzdC10cnknLCBbXSwgZmFjdG9yeSgpKTtcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICB3aW5kb3cubWVudUl0ZW1zID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgIH0pKGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgICAgIH07XG4gICAgICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICAgICAgfTtcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gICAgICB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgICAgICB7d2l0aCAob2JqKSB7dmFyIGFycjAgPSBzZWN0aW9uczsgZm9yIChzZWN0aW9uc0l0ZW0gaW4gYXJyMCkgaWYgKF9oYXNQcm9wLmNhbGwoYXJyMCwgc2VjdGlvbnNJdGVtKSkge1xuc2VjdGlvbnNJdGVtID0gYXJyMFtzZWN0aW9uc0l0ZW1dO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdtZW51X19pdGVtJztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2xpJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnL2Ntcy9zZWN0aW9ucy8nO1xuYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2FsaWFzJ107XG5hdHRyICs9ICcvJztcbmF0dHJzLnB1c2goWydocmVmJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnbWVudV9fbGluayc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKHNlY3Rpb25zSXRlbVsndGl0bGUnXSlcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX19KX07XG4gICAgfSk7IiwiKGZ1bmN0aW9uIChmYWN0b3J5KVxuICAgIHtcbiAgICAgIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgbW9kdWxlLmV4cG9ydHMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodHlwZW9mIGRlZmluZSAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIGRlZmluZS5hbWQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlZmluZSgnZmlyc3QtdHJ5JywgW10sIGZhY3RvcnkoKSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgd2luZG93LnRhYmxlU2VjdGlvbnNMaXN0ID0gZmFjdG9yeSgpO1xuICAgICAgfVxuICAgIH0pKGZ1bmN0aW9uICgpXG4gICAge1xuICAgICAgdmFyIF9oYXNQcm9wID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgICAgIHZhciBfY3JFbCA9IGZ1bmN0aW9uIChub2RlKVxuICAgICAge1xuICAgICAgICByZXR1cm4ge3R5cGU6ICdub2RlJywgbmFtZTogbm9kZSwgYXR0cnM6IFtdLCBjaGlsZHM6IFtdfTtcbiAgICAgIH07XG4gICAgICB2YXIgX2NyVE4gPSBmdW5jdGlvbiAobm9kZSlcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIHt0eXBlOiAndGV4dCcsIHRleHQ6IG5vZGV9O1xuICAgICAgfTtcbiAgICAgIGZ1bmN0aW9uIGNyZWF0ZSgpXG4gICAgICB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgdmFyIHJvb3ROb2RlcyA9IFtdO1xuICAgICAgICAgIGFyZ3VtZW50c1swXShyb290Tm9kZXMpO1xuICAgICAgICAgIGlmIChyb290Tm9kZXMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiByb290Tm9kZXMpIHtcbiAgICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwocm9vdE5vZGVzLCBpbmRleEF0dHIpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiByb290Tm9kZXNbaW5kZXhBdHRyXSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnYm9vbGVhbicgfHwgdHlwZW9mIHJvb3ROb2Rlc1tpbmRleEF0dHJdID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgICAgcm9vdE5vZGVzW2luZGV4QXR0cl0gPSBfY3JUTihyb290Tm9kZXNbaW5kZXhBdHRyXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByb290Tm9kZXM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgIHZhciBub2RlcyA9IFtdO1xuICAgICAgICAgIHZhciBwYXJlbnROb2RlO1xuICAgICAgICAgIHZhciBpbmRleE5vZGU7XG4gICAgICAgICAgdmFyIG5vZGU7XG4gICAgICAgICAgdmFyIGluZGV4QXR0cjtcbiAgICAgICAgICB2YXIgYXR0cjtcbiAgICAgICAgICB2YXIgYXR0cnMgPSBhcmd1bWVudHNbMV07XG4gICAgICAgICAgYXJndW1lbnRzWzJdKG5vZGVzKTtcbiAgICAgICAgICBwYXJlbnROb2RlID0gX2NyRWwoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICBpZiAoYXR0cnMubGVuZ3RoKSB7XG4gICAgICAgICAgICBmb3IgKGluZGV4QXR0ciBpbiBhdHRycykge1xuICAgICAgICAgICAgICBpZiAoX2hhc1Byb3AuY2FsbChhdHRycywgaW5kZXhBdHRyKSkge1xuICAgICAgICAgICAgICAgIGF0dHIgPSBhdHRyc1tpbmRleEF0dHJdO1xuICAgICAgICAgICAgICAgIHBhcmVudE5vZGUuYXR0cnMucHVzaCh7XG4gICAgICAgICAgICAgICAgICBuYW1lOiBhdHRyWzBdLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IGF0dHJbMV1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBmb3IgKGluZGV4Tm9kZSBpbiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKF9oYXNQcm9wLmNhbGwobm9kZXMsIGluZGV4Tm9kZSkpIHtcbiAgICAgICAgICAgICAgbm9kZSA9IG5vZGVzW2luZGV4Tm9kZV07XG4gICAgICAgICAgICAgIGlmICh0eXBlb2Ygbm9kZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIG5vZGUgPT09ICdib29sZWFuJyB8fCB0eXBlb2Ygbm9kZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKF9jclROKG5vZGUpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJlbnROb2RlLmNoaWxkcy5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBwYXJlbnROb2RlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKG9iailcbiAgICAgIHtcbiAgICAgICAgcmV0dXJuIGNyZWF0ZShmdW5jdGlvbiAoY2hpbGRzKVxuICAgICAgICB7d2l0aCAob2JqKSB7KGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdzZWN0aW9uX19yb3cnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnL2Ntcy9jb25maWdzL2FkZC8nO1xuYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JTQvtCx0LDQstC40YLRjCDRgNCw0LfQtNC10LsnKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdzZWN0aW9uX19yb3cnO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnc2VjdGlvbi1saXN0JztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnZGl2JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoZWNrZWRJdGVtcyA9IDA7KGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJsZSc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0YWJsZScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ2NvbGdyb3VwJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnMjAnO1xuYXR0cnMucHVzaChbJ3dpZHRoJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnY29sJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJyonO1xuYXR0cnMucHVzaChbJ3dpZHRoJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnY29sJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJyonO1xuYXR0cnMucHVzaChbJ3dpZHRoJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnY29sJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJyonO1xuYXR0cnMucHVzaChbJ3dpZHRoJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnY29sJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0aGVhZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RyJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjaGVja2JveCc7XG5hdHRycy5wdXNoKFsndHlwZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NoZWNrYWxsJztcbmF0dHJzLnB1c2goWydpZCcsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NiZWNrLWFsbCc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2lucHV0JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NoZWNrYWxsJztcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goJ9Cd0LDQt9Cy0LDQvdC40LUnKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQktC10LEt0LjQvNGPJyk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaCgn0JzQvtC00YPQu9GMJyk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3Rib2R5JywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbnZhciBhcnIwID0gc2VjdGlvbnM7IGZvciAoaSBpbiBhcnIwKSBpZiAoX2hhc1Byb3AuY2FsbChhcnIwLCBpKSkge1xuc2VjdGlvbnNJdGVtID0gYXJyMFtpXTtcbmlmICggKCB0eXBlb2Ygc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gIT0gJ3VuZGVmaW5lZCcgPyBzZWN0aW9uc0l0ZW1bJ2NoZWNrZWQnXSA6ICcnKSAmJiAoc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gPT0gXCJ0cnVlXCIgfHwgc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gPT0gdHJ1ZSkpIHtcbmNoZWNrZWRJdGVtcyA9IGNoZWNrZWRJdGVtcyArIDE7fVxuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICd0YWJsZV9fbGluayc7XG5hdHRycy5wdXNoKFsnY2xhc3MnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdzZWN0aW9uLXJvdyc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gaTtcbmF0dHJzLnB1c2goWydkYXRhLWlkJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJ2NoZWNrYm94JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnY2hlY2snO1xuYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2lkJ107XG5hdHRycy5wdXNoKFsnaWQnLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjaGVjay1pdGVtJztcbmF0dHJzLnB1c2goWydyb2xlJywgYXR0cl0pO1xufSkoKTtcbmlmICggKCB0eXBlb2Ygc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gIT0gJ3VuZGVmaW5lZCcgPyBzZWN0aW9uc0l0ZW1bJ2NoZWNrZWQnXSA6ICcnKSAmJiAoc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gPT0gXCJ0cnVlXCIgfHwgc2VjdGlvbnNJdGVtWydjaGVja2VkJ10gPT0gdHJ1ZSkpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2NoZWNrZWQnLCBhdHRyXSk7XG59KSgpO1xufVxuY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdjaGVjayc7XG5hdHRyICs9IHNlY3Rpb25zSXRlbVsnaWQnXTtcbmF0dHJzLnB1c2goWydmb3InLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdsYWJlbCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICcvY21zL2NvbmZpZ3MvJztcbmF0dHIgKz0gc2VjdGlvbnNJdGVtWydhbGlhcyddO1xuYXR0ciArPSAnLyc7XG5hdHRycy5wdXNoKFsnaHJlZicsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2EnLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuY2hpbGRzLnB1c2goc2VjdGlvbnNJdGVtWyd0aXRsZSddKVxufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG5jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnL2Ntcy9jb25maWdzLyc7XG5hdHRyICs9IHNlY3Rpb25zSXRlbVsnYWxpYXMnXTtcbmF0dHIgKz0gJy8nO1xuYXR0cnMucHVzaChbJ2hyZWYnLCBhdHRyXSk7XG59KSgpO1xuY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKHNlY3Rpb25zSXRlbVsnYWxpYXMnXSlcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHIgKz0gJy9jbXMvY29uZmlncy8nO1xuYXR0ciArPSBzZWN0aW9uc0l0ZW1bJ2FsaWFzJ107XG5hdHRyICs9ICcvJztcbmF0dHJzLnB1c2goWydocmVmJywgYXR0cl0pO1xufSkoKTtcbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYScsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG5jaGlsZHMucHVzaChzZWN0aW9uc0l0ZW1bJ21vZHVsZSddKVxufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufSkpO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0cnMgPSBbXTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnc2VjdGlvbl9fcm93JztcbmF0dHJzLnB1c2goWydjbGFzcycsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIGF0dHJzLCBmdW5jdGlvbiAoY2hpbGRzKSB7XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHJzID0gW107XG4oZnVuY3Rpb24gKCkge1xudmFyIGF0dHIgPSAnJztcbmF0dHJzLnB1c2goWydhY3Rpb24nLCBhdHRyXSk7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdib3R0b20tZm9ybSc7XG5hdHRycy5wdXNoKFsncm9sZScsIGF0dHJdKTtcbn0pKCk7XG5jaGlsZHMucHVzaChjcmVhdGUoJ2Zvcm0nLCBhdHRycywgZnVuY3Rpb24gKGNoaWxkcykge1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRycyA9IFtdO1xuKGZ1bmN0aW9uICgpIHtcbnZhciBhdHRyID0gJyc7XG5hdHRyICs9ICdmb3JtX19idG4nO1xuYXR0cnMucHVzaChbJ2NsYXNzJywgYXR0cl0pO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0ciArPSAnc3VibWl0JztcbmF0dHJzLnB1c2goWyd0eXBlJywgYXR0cl0pO1xufSkoKTtcbmlmICggY2hlY2tlZEl0ZW1zID09IDApIHtcbihmdW5jdGlvbiAoKSB7XG52YXIgYXR0ciA9ICcnO1xuYXR0cnMucHVzaChbJ2Rpc2FibGVkJywgYXR0cl0pO1xufSkoKTtcbn1cbmNoaWxkcy5wdXNoKGNyZWF0ZSgnYnV0dG9uJywgYXR0cnMsIGZ1bmN0aW9uIChjaGlsZHMpIHtcbmNoaWxkcy5wdXNoKCfQo9C00LDQu9C40YLRjCcpO1xufSkpO1xufSkoKTtcbn0pKTtcbn0pKCk7XG59KSk7XG59KSgpO1xufX0pfTtcbiAgICB9KTsiXX0=
