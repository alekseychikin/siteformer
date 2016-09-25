(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var sectionsItem;
var _arr0 = data['sections'];
for (data['sectionsItem'] in _arr0) {
data['sectionsItem'] = _arr0[data['sectionsItem']];
_childs.push(create('\n  '));
var _params1 = {};
(function () {
  var _attrValue2 = '';
_attrValue2 += 'menu__item';
if (data['section'] == data['sectionsItem']["alias"]) {
_attrValue2 += ' menu__item--active';
}
_params1['class'] = _attrValue2;
_attrValue2 = '';
})();
_childs.push(create('li', _params1, function (_childs) {
var _params3 = {};
(function () {
  var _attrValue4 = '';
_attrValue4 += '/cms/';
_attrValue4 += data['sectionsItem']["alias"];
_attrValue4 += '/';
_params3['href'] = _attrValue4;
_attrValue4 = '';
})();
(function () {
  var _attrValue5 = '';
_attrValue5 += 'menu__link';
_params3['class'] = _attrValue5;
_attrValue5 = '';
})();
_childs.push(create('a', _params3, function (_childs) {
_childs.push(create(data['sectionsItem']["title"]));
}));
}));
_childs.push(create('\n'));
}    return _childs;
  };
});
},{}],2:[function(require,module,exports){
(function (factory) {
  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = factory();
  } else if (typeof define !== 'undefined' && typeof define.amd !== 'undefined') {
    define([], factory());
  }
})(function () {
  var MKARR_OPEN = 2 << 1;
  var MKARR_CLOSE = 1 << 1;
  function mkArr(start, end, flag) {
    var arr = [], i;
    if (flag & MKARR_OPEN) {
      if (start <= end) {
        for (i = start; i < end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i > end; i--) {
          arr.push(i);
        }
      }
    } else if (flag & MKARR_CLOSE) {
      if (start <= end) {
        for (i = start; i <= end; i++) {
          arr.push(i);
        }
      } else {
        for (i = start; i >= end; i--) {
          arr.push(i);
        }
      }
    }
    return arr;
  }
  function str(str, len, sprtr) {
    if (!len) len = 0;
    if (typeof str.toString === 'function') str = str.toString();
    if (!sprtr) sprtr = '.';
    if (~str.indexOf('.')) {
      if (len > 0) {
        str = str.substr(0, str.indexOf('.') + len + 1);
      } else {
        str = str.substr(0, str.indexOf('.') + len);
      }
    } else {
      str = str_pad(str + '.', str.length + 1 + len, '0');
    }
    return str.replace('.', sprtr);
  }
  function str_replace(str, src, rep) {
    while (~str.indexOf(src)) {
      str = str.replace(src, rep);
    }
    return str;
  }
  var STRPADRIGHT = 1 << 1;
  var STRPADLEFT = 2 << 1;
  var STRPADBOTH = 4 << 1;
  function __str_pad_repeater(str, len) {
    var collect = '', i;
    while(collect.length < len) collect += str;
    collect = collect.substr(0, len);
    return collect;
  }
  function str_pad(str, len, sub, type) {
    if (typeof type === 'undefined') type = STRPADRIGHT;
    var half = '', pad_to_go;
    if ((pad_to_go = len - str.length) > 0) {
      if (type & STRPADLEFT) { str = __str_pad_repeater(sub, pad_to_go) + str; }
      else if (type & STRPADRIGHT) {str = str + __str_pad_repeater(sub, pad_to_go); }
      else if (type & STRPADBOTH) {
        half = __str_pad_repeater(sub, Math.ceil(pad_to_go/2));
        str = half + str + half;
        str = str.substr(0, len);
      }
    }
    return str;
  }
  function str_htmlescape(html) {
    return html.replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  }
  function str_upfirst(str) {
    return str.split(/[\s\n\t]+/).map(function (item) {
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join(' ');
  }
  function str_camel(str) {
    return str.split(/[\s\n\t]+/).map(function (item, index) {
      if (!index) return item;
      return item.substr(0, 1).toUpperCase() + item.substr(1).toLowerCase();
    }).join('');
  }
  function str_kebab(str) {
    return str.split(/[\s\n\t]+/).join('-');
  }
  function arr_values(obj) {
    var values = [], i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) values.push(obj[i]);
    return values;
  }
  function arr_contain(obj, value) {
    if(typeof obj.indexOf === 'function') return obj.indexOf(value) !== -1;
    var i;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) if (obj[i] === value) return true;
    return false;
  }
  function arr_len(obj) {
    if(typeof obj.length !== 'undefined') return obj.length;
    var i, length = 0;
    for(i in obj) if (Object.prototype.hasOwnProperty.call(obj, i)) length++;
    return length;
  }
  function arr_push(arr, value) {
    arr.push(value);
    return '';
  }
  function arr_unshift(arr, value) {
    arr.unshift(value);
    return '';
  }
  function arr_rand(arr, value) {
    var keys = Object.keys(arr);
    return arr[keys[parseInt(Math.random() * arr_len(arr) - 1)]];
  }
  function arr_splice(arr, st, en, els) {
    var prms = [st];
    if (typeof en !== 'undefined') prms.push(en);
    return Array.prototype.splice.apply(arr, prms.concat(els));
  }
  function arr_pad(src, len, el) {
    var i, arr = src.slice(0);
    if(len > 0) for(i = arr_len(arr);i < len;i++) arr.push(el);
    if(len < 0) for(i = arr_len(arr);i < -len;i++) arr.unshift(el);
    return arr;
  }
  function arr_reverse(src) {
    var arr = src.slice(0);
    arr.reverse();
    return arr;
  }
  function arr_sort(src) {
    var arr = src.slice(0);
    arr.sort();
    return arr;
  }
  function arr_sort_reverse(src) {
    var arr = src.slice(0);
    arr.sort();
    arr.reverse();
    return arr;
  }
  function arr_unique(src) {
    var i, arr = [];
    for(i in src) if (Object.prototype.hasOwnProperty.call(src, i)) if (!~arr.indexOf(src[i])) arr.push(src[i]);
    return arr;
  }
  function arr_key(arr, value) {
    var i;
    for(i in arr) if (Object.prototype.hasOwnProperty.call(arr, i)) if (value == arr[i]) return i;
    return -1;
  }
  function create(name, attrs, cb) {
    if (typeof name === 'object') return name;
    var childs = [];
    if (typeof cb === 'function') cb(childs);
    if (attrs) {
      return {
        type: 'node',
        name: name,
        attrs: attrs,
        childs: childs.filter(function (_child) { return _child !== null; })
      };
    }
    if (typeof name.toString === 'function') name = name.toString();
    return {
      type: 'text',
      text: name
    };
  }
  return function (data, childs) {
    var _childs = [];
var i;
var _params0 = {};
(function () {
  var _attrValue1 = '';
_attrValue1 += 'section__row';
_params0['class'] = _attrValue1;
_attrValue1 = '';
})();
_childs.push(create('div', _params0, function (_childs) {
_childs.push(create('\n  '));
var _params2 = {};
(function () {
  var _attrValue3 = '';
_attrValue3 += '/cms/configs/add/';
_params2['href'] = _attrValue3;
_attrValue3 = '';
})();
(function () {
  var _attrValue4 = '';
_attrValue4 += 'form__btn';
_params2['class'] = _attrValue4;
_attrValue4 = '';
})();
_childs.push(create('a', _params2, function (_childs) {
_childs.push(create('Добавить раздел'));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));
var _params5 = {};
(function () {
  var _attrValue6 = '';
_attrValue6 += 'section__row';
_params5['class'] = _attrValue6;
_attrValue6 = '';
})();
(function () {
  var _attrValue7 = '';
_attrValue7 += 'section-list';
_params5['role'] = _attrValue7;
_attrValue7 = '';
})();
_childs.push(create('div', _params5, function (_childs) {
_childs.push(create('\n  '));
data['checkedItems'] = 0;
_childs.push(create('\n  '));
var _params8 = {};
(function () {
  var _attrValue9 = '';
_attrValue9 += 'table';
_params8['class'] = _attrValue9;
_attrValue9 = '';
})();
_childs.push(create('table', _params8, function (_childs) {
_childs.push(create('\n    '));
var _params10 = {};
_childs.push(create('colgroup', _params10, function (_childs) {
_childs.push(create('\n      '));
var _params11 = {};
(function () {
  var _attrValue12 = '';
_attrValue12 += '20';
_params11['width'] = _attrValue12;
_attrValue12 = '';
})();
_childs.push(create('col', _params11));
_childs.push(create('\n      '));
var _params13 = {};
(function () {
  var _attrValue14 = '';
_attrValue14 += '*';
_params13['width'] = _attrValue14;
_attrValue14 = '';
})();
_childs.push(create('col', _params13));
_childs.push(create('\n      '));
var _params15 = {};
(function () {
  var _attrValue16 = '';
_attrValue16 += '*';
_params15['width'] = _attrValue16;
_attrValue16 = '';
})();
_childs.push(create('col', _params15));
_childs.push(create('\n      '));
var _params17 = {};
(function () {
  var _attrValue18 = '';
_attrValue18 += '*';
_params17['width'] = _attrValue18;
_attrValue18 = '';
})();
_childs.push(create('col', _params17));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
var _params19 = {};
_childs.push(create('thead', _params19, function (_childs) {
_childs.push(create('\n      '));
var _params20 = {};
_childs.push(create('tr', _params20, function (_childs) {
_childs.push(create('\n        '));
var _params21 = {};
_childs.push(create('td', _params21, function (_childs) {
_childs.push(create('\n          '));
var _params22 = {};
(function () {
  var _attrValue23 = '';
_attrValue23 += 'form__checkbox';
_params22['class'] = _attrValue23;
_attrValue23 = '';
})();
(function () {
  var _attrValue24 = '';
_attrValue24 += 'checkbox';
_params22['type'] = _attrValue24;
_attrValue24 = '';
})();
(function () {
  var _attrValue25 = '';
_attrValue25 += 'checkall';
_params22['id'] = _attrValue25;
_attrValue25 = '';
})();
(function () {
  var _attrValue26 = '';
_attrValue26 += 'cbeck-all';
_params22['role'] = _attrValue26;
_attrValue26 = '';
})();
_childs.push(create('input', _params22));
_childs.push(create('\n          '));
var _params27 = {};
(function () {
  var _attrValue28 = '';
_attrValue28 += 'form__checkbox-label';
_params27['class'] = _attrValue28;
_attrValue28 = '';
})();
(function () {
  var _attrValue29 = '';
_attrValue29 += 'checkall';
_params27['for'] = _attrValue29;
_attrValue29 = '';
})();
_childs.push(create('label', _params27, function (_childs) {
}));
_childs.push(create('\n        '));
}));
_childs.push(create('\n        '));
var _params30 = {};
_childs.push(create('td', _params30, function (_childs) {
_childs.push(create('Название'));
}));
_childs.push(create('\n        '));
var _params31 = {};
_childs.push(create('td', _params31, function (_childs) {
_childs.push(create('Веб-имя'));
}));
_childs.push(create('\n        '));
var _params32 = {};
_childs.push(create('td', _params32, function (_childs) {
_childs.push(create('Модуль'));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n    '));
}));
_childs.push(create('\n    '));
var _params33 = {};
_childs.push(create('tbody', _params33, function (_childs) {
_childs.push(create('\n      '));
var _arr34 = data['sections'];
for (data['i'] in _arr34) {
data['sectionsItem'] = _arr34[data['i']];
_childs.push(create('\n        '));
data['isChecked'] = (typeof data['sectionsItem']["checked"] !== 'undefined' ? data['sectionsItem']["checked"] : '') && (data['sectionsItem']["checked"] == true);
_childs.push(create('\n        '));
if (data['isChecked']) {
_childs.push(create('\n          '));
data['checkedItems'] = data['checkedItems'] + 1;
_childs.push(create('\n        '));
}
_childs.push(create('\n      '));
var _params35 = {};
(function () {
  var _attrValue36 = '';
_attrValue36 += 'table__link';
_params35['class'] = _attrValue36;
_attrValue36 = '';
})();
(function () {
  var _attrValue37 = '';
_attrValue37 += 'section-row';
_params35['role'] = _attrValue37;
_attrValue37 = '';
})();
(function () {
  var _attrValue38 = '';
_attrValue38 += data['i'];
_params35['data-id'] = _attrValue38;
_attrValue38 = '';
})();
_childs.push(create('tr', _params35, function (_childs) {
_childs.push(create('\n        '));
var _params39 = {};
_childs.push(create('td', _params39, function (_childs) {
_childs.push(create('\n          '));
var _params40 = {};
(function () {
  var _attrValue41 = '';
_attrValue41 += 'form__checkbox';
_params40['class'] = _attrValue41;
_attrValue41 = '';
})();
(function () {
  var _attrValue42 = '';
_attrValue42 += 'checkbox';
_params40['type'] = _attrValue42;
_attrValue42 = '';
})();
(function () {
  var _attrValue43 = '';
_attrValue43 += 'check';
_attrValue43 += data['sectionsItem']["id"];
_params40['id'] = _attrValue43;
_attrValue43 = '';
})();
(function () {
  var _attrValue44 = '';
_attrValue44 += 'check-item';
_params40['role'] = _attrValue44;
_attrValue44 = '';
})();
(function () {
  var _attrValue45 = '';
if (data['isChecked']) {
_params40['checked'] = _attrValue45;
_attrValue45 = '';
}
})();
_childs.push(create('input', _params40));
_childs.push(create('\n          '));
var _params46 = {};
(function () {
  var _attrValue47 = '';
_attrValue47 += 'form__checkbox-label';
_params46['class'] = _attrValue47;
_attrValue47 = '';
})();
(function () {
  var _attrValue48 = '';
_attrValue48 += 'check';
_attrValue48 += data['sectionsItem']["id"];
_params46['for'] = _attrValue48;
_attrValue48 = '';
})();
_childs.push(create('label', _params46, function (_childs) {
}));
_childs.push(create('\n        '));
}));
_childs.push(create('\n        '));
var _params49 = {};
_childs.push(create('td', _params49, function (_childs) {
var _params50 = {};
(function () {
  var _attrValue51 = '';
_attrValue51 += '/cms/configs/';
_attrValue51 += data['sectionsItem']["alias"];
_attrValue51 += '/';
_params50['href'] = _attrValue51;
_attrValue51 = '';
})();
_childs.push(create('a', _params50, function (_childs) {
_childs.push(create(data['sectionsItem']["title"]));
}));
}));
_childs.push(create('\n        '));
var _params52 = {};
_childs.push(create('td', _params52, function (_childs) {
var _params53 = {};
(function () {
  var _attrValue54 = '';
_attrValue54 += '/cms/configs/';
_attrValue54 += data['sectionsItem']["alias"];
_attrValue54 += '/';
_params53['href'] = _attrValue54;
_attrValue54 = '';
})();
_childs.push(create('a', _params53, function (_childs) {
_childs.push(create(data['sectionsItem']["alias"]));
}));
}));
_childs.push(create('\n        '));
var _params55 = {};
_childs.push(create('td', _params55, function (_childs) {
var _params56 = {};
(function () {
  var _attrValue57 = '';
_attrValue57 += '/cms/configs/';
_attrValue57 += data['sectionsItem']["alias"];
_attrValue57 += '/';
_params56['href'] = _attrValue57;
_attrValue57 = '';
})();
_childs.push(create('a', _params56, function (_childs) {
_childs.push(create(data['sectionsItem']["module"]));
}));
}));
_childs.push(create('\n      '));
}));
_childs.push(create('\n      '));
}
_childs.push(create('\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));
var _params58 = {};
(function () {
  var _attrValue59 = '';
_attrValue59 += 'section__row';
_params58['class'] = _attrValue59;
_attrValue59 = '';
})();
_childs.push(create('div', _params58, function (_childs) {
_childs.push(create('\n  '));
var _params60 = {};
(function () {
  var _attrValue61 = '';
_params60['action'] = _attrValue61;
_attrValue61 = '';
})();
(function () {
  var _attrValue62 = '';
_attrValue62 += 'bottom-form';
_params60['role'] = _attrValue62;
_attrValue62 = '';
})();
_childs.push(create('form', _params60, function (_childs) {
_childs.push(create('\n    '));
var _params63 = {};
(function () {
  var _attrValue64 = '';
_attrValue64 += 'form__btn';
_params63['class'] = _attrValue64;
_attrValue64 = '';
})();
(function () {
  var _attrValue65 = '';
_attrValue65 += 'submit';
_params63['type'] = _attrValue65;
_attrValue65 = '';
})();
(function () {
  var _attrValue66 = '';
if (data['checkedItems'] == 0) {
_params63['disabled'] = _attrValue66;
_attrValue66 = '';
}
})();
_childs.push(create('button', _params63, function (_childs) {
_childs.push(create('\n      Удалить\n    '));
}));
_childs.push(create('\n  '));
}));
_childs.push(create('\n'));
}));
_childs.push(create('\n'));    return _childs;
  };
});
},{}],3:[function(require,module,exports){
var IndexModel, IndexView, SectionsMenuView, indexModel;

IndexModel = require("./indexModel.coffee");

indexModel = IndexModel();

IndexView = require("./indexView.coffee");

SectionsMenuView = require("./sectionsMenuView.coffee");

IndexView($("@sections"), indexModel);

SectionsMenuView($("@sections-menu"), indexModel);


},{"./indexModel.coffee":4,"./indexView.coffee":5,"./sectionsMenuView.coffee":6}],4:[function(require,module,exports){
var Model, httpGet, httpPost;

Model = require("model.coffee");

httpGet = (require("ajax.coffee")).httpGet;

httpPost = (require("ajax.coffee")).httpPost;

module.exports = Model({
  initialState: function() {
    return httpGet(window.location.pathname);
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
    httpPost(window.location.pathname + "action_delete/", {
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


},{"ajax.coffee":"ajax.coffee","model.coffee":"model.coffee"}],5:[function(require,module,exports){
var Render, View, sectionsTemplate;

View = require("view.coffee");

sectionsTemplate = require("sections/configs/table-sections-list");

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


},{"render":"render","sections/configs/table-sections-list":2,"view.coffee":"view.coffee"}],6:[function(require,module,exports){
var Render, View, menuTemplate;

Render = require("render");

View = require("view.coffee");

menuTemplate = require("components/menu/menu-items");

module.exports = View({
  initial: function() {
    return this.menuTemplate = Render(menuTemplate, this.contain[0]);
  },
  render: function(state) {
    return this.menuTemplate(state);
  }
});


},{"components/menu/menu-items":1,"render":"render","view.coffee":"view.coffee"}]},{},[3])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJtb2R1bGVzL0dVSS9kaXN0L2NvbXBvbmVudHMvbWVudS9tZW51LWl0ZW1zLmpzIiwibW9kdWxlcy9HVUkvZGlzdC9zZWN0aW9ucy9jb25maWdzL3RhYmxlLXNlY3Rpb25zLWxpc3QuanMiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4LmNvZmZlZSIsIm1vZHVsZXMvR1VJL3NlY3Rpb25zL2NvbmZpZ3MvaW5kZXhNb2RlbC5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL2luZGV4Vmlldy5jb2ZmZWUiLCJtb2R1bGVzL0dVSS9zZWN0aW9ucy9jb25maWdzL3NlY3Rpb25zTWVudVZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QWhCLEVBQXNFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBL0U7SUFEcUIsQ0FBdkI7SUFFQSxvQkFBQSxFQUFzQixTQUFDLENBQUQ7YUFDcEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxRQUFQLENBQWdCLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBekI7SUFEb0IsQ0FGdEI7SUFJQSxzQkFBQSxFQUF3QixTQUFDLENBQUQ7TUFDdEIsSUFBQyxDQUFBLEtBQUssQ0FBQyxZQUFQLENBQUE7YUFDQTtJQUZzQixDQUp4QjtHQUpGO0VBWUEsTUFBQSxFQUFRLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxZQUFELENBQWMsS0FBZDtFQUFYLENBWlI7Q0FEZTs7OztBQ0pqQixJQUFBOztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsUUFBUjs7QUFDVCxJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVI7O0FBQ1AsWUFBQSxHQUFlLE9BQUEsQ0FBUSw0QkFBUjs7QUFFZixNQUFNLENBQUMsT0FBUCxHQUFpQixJQUFBLENBQ2Y7RUFBQSxPQUFBLEVBQVMsU0FBQTtXQUFHLElBQUMsQ0FBQSxZQUFELEdBQWdCLE1BQUEsQ0FBTyxZQUFQLEVBQXFCLElBQUMsQ0FBQSxPQUFRLENBQUEsQ0FBQSxDQUE5QjtFQUFuQixDQUFUO0VBQ0EsTUFBQSxFQUFRLFNBQUMsS0FBRDtXQUFXLElBQUMsQ0FBQSxZQUFELENBQWMsS0FBZDtFQUFYLENBRFI7Q0FEZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkoKSk7XG4gIH1cbn0pKGZ1bmN0aW9uICgpIHtcbiAgdmFyIE1LQVJSX09QRU4gPSAyIDw8IDE7XG4gIHZhciBNS0FSUl9DTE9TRSA9IDEgPDwgMTtcbiAgZnVuY3Rpb24gbWtBcnIoc3RhcnQsIGVuZCwgZmxhZykge1xuICAgIHZhciBhcnIgPSBbXSwgaTtcbiAgICBpZiAoZmxhZyAmIE1LQVJSX09QRU4pIHtcbiAgICAgIGlmIChzdGFydCA8PSBlbmQpIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+IGVuZDsgaS0tKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZsYWcgJiBNS0FSUl9DTE9TRSkge1xuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+PSBlbmQ7IGktLSkge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gc3RyKHN0ciwgbGVuLCBzcHJ0cikge1xuICAgIGlmICghbGVuKSBsZW4gPSAwO1xuICAgIGlmICh0eXBlb2Ygc3RyLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSBzdHIgPSBzdHIudG9TdHJpbmcoKTtcbiAgICBpZiAoIXNwcnRyKSBzcHJ0ciA9ICcuJztcbiAgICBpZiAofnN0ci5pbmRleE9mKCcuJykpIHtcbiAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgc3RyLmluZGV4T2YoJy4nKSArIGxlbiArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBzdHIuaW5kZXhPZignLicpICsgbGVuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gc3RyX3BhZChzdHIgKyAnLicsIHN0ci5sZW5ndGggKyAxICsgbGVuLCAnMCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoJy4nLCBzcHJ0cik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3JlcGxhY2Uoc3RyLCBzcmMsIHJlcCkge1xuICAgIHdoaWxlICh+c3RyLmluZGV4T2Yoc3JjKSkge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2Uoc3JjLCByZXApO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIHZhciBTVFJQQURSSUdIVCA9IDEgPDwgMTtcbiAgdmFyIFNUUlBBRExFRlQgPSAyIDw8IDE7XG4gIHZhciBTVFJQQURCT1RIID0gNCA8PCAxO1xuICBmdW5jdGlvbiBfX3N0cl9wYWRfcmVwZWF0ZXIoc3RyLCBsZW4pIHtcbiAgICB2YXIgY29sbGVjdCA9ICcnLCBpO1xuICAgIHdoaWxlKGNvbGxlY3QubGVuZ3RoIDwgbGVuKSBjb2xsZWN0ICs9IHN0cjtcbiAgICBjb2xsZWN0ID0gY29sbGVjdC5zdWJzdHIoMCwgbGVuKTtcbiAgICByZXR1cm4gY29sbGVjdDtcbiAgfVxuICBmdW5jdGlvbiBzdHJfcGFkKHN0ciwgbGVuLCBzdWIsIHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICd1bmRlZmluZWQnKSB0eXBlID0gU1RSUEFEUklHSFQ7XG4gICAgdmFyIGhhbGYgPSAnJywgcGFkX3RvX2dvO1xuICAgIGlmICgocGFkX3RvX2dvID0gbGVuIC0gc3RyLmxlbmd0aCkgPiAwKSB7XG4gICAgICBpZiAodHlwZSAmIFNUUlBBRExFRlQpIHsgc3RyID0gX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKSArIHN0cjsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBRFJJR0hUKSB7c3RyID0gc3RyICsgX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKTsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBREJPVEgpIHtcbiAgICAgICAgaGFsZiA9IF9fc3RyX3BhZF9yZXBlYXRlcihzdWIsIE1hdGguY2VpbChwYWRfdG9fZ28vMikpO1xuICAgICAgICBzdHIgPSBoYWxmICsgc3RyICsgaGFsZjtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBsZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9odG1sZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3VwZmlyc3Qoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIGl0ZW0uc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSkuam9pbignICcpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9jYW1lbChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICBpZiAoIWluZGV4KSByZXR1cm4gaXRlbTtcbiAgICAgIHJldHVybiBpdGVtLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgaXRlbS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfa2ViYWIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykuam9pbignLScpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl92YWx1ZXMob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLCBpO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB2YWx1ZXMucHVzaChvYmpbaV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2NvbnRhaW4ob2JqLCB2YWx1ZSkge1xuICAgIGlmKHR5cGVvZiBvYmouaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGlmIChvYmpbaV0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2xlbihvYmopIHtcbiAgICBpZih0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiBvYmoubGVuZ3RoO1xuICAgIHZhciBpLCBsZW5ndGggPSAwO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBsZW5ndGgrKztcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wdXNoKGFyciwgdmFsdWUpIHtcbiAgICBhcnIucHVzaCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bnNoaWZ0KGFyciwgdmFsdWUpIHtcbiAgICBhcnIudW5zaGlmdCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9yYW5kKGFyciwgdmFsdWUpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gICAgcmV0dXJuIGFycltrZXlzW3BhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBhcnJfbGVuKGFycikgLSAxKV1dO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9zcGxpY2UoYXJyLCBzdCwgZW4sIGVscykge1xuICAgIHZhciBwcm1zID0gW3N0XTtcbiAgICBpZiAodHlwZW9mIGVuICE9PSAndW5kZWZpbmVkJykgcHJtcy5wdXNoKGVuKTtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShhcnIsIHBybXMuY29uY2F0KGVscykpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wYWQoc3JjLCBsZW4sIGVsKSB7XG4gICAgdmFyIGksIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBpZihsZW4gPiAwKSBmb3IoaSA9IGFycl9sZW4oYXJyKTtpIDwgbGVuO2krKykgYXJyLnB1c2goZWwpO1xuICAgIGlmKGxlbiA8IDApIGZvcihpID0gYXJyX2xlbihhcnIpO2kgPCAtbGVuO2krKykgYXJyLnVuc2hpZnQoZWwpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3JldmVyc2Uoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIucmV2ZXJzZSgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnQoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIuc29ydCgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnRfcmV2ZXJzZShzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5zb3J0KCk7XG4gICAgYXJyLnJldmVyc2UoKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bmlxdWUoc3JjKSB7XG4gICAgdmFyIGksIGFyciA9IFtdO1xuICAgIGZvcihpIGluIHNyYykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzcmMsIGkpKSBpZiAoIX5hcnIuaW5kZXhPZihzcmNbaV0pKSBhcnIucHVzaChzcmNbaV0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2tleShhcnIsIHZhbHVlKSB7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gYXJyKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyciwgaSkpIGlmICh2YWx1ZSA9PSBhcnJbaV0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGUobmFtZSwgYXR0cnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0JykgcmV0dXJuIG5hbWU7XG4gICAgdmFyIGNoaWxkcyA9IFtdO1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKGNoaWxkcyk7XG4gICAgaWYgKGF0dHJzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnbm9kZScsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGF0dHJzOiBhdHRycyxcbiAgICAgICAgY2hpbGRzOiBjaGlsZHMuZmlsdGVyKGZ1bmN0aW9uIChfY2hpbGQpIHsgcmV0dXJuIF9jaGlsZCAhPT0gbnVsbDsgfSlcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgbmFtZSA9IG5hbWUudG9TdHJpbmcoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgdGV4dDogbmFtZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCBjaGlsZHMpIHtcbiAgICB2YXIgX2NoaWxkcyA9IFtdO1xudmFyIHNlY3Rpb25zSXRlbTtcbnZhciBfYXJyMCA9IGRhdGFbJ3NlY3Rpb25zJ107XG5mb3IgKGRhdGFbJ3NlY3Rpb25zSXRlbSddIGluIF9hcnIwKSB7XG5kYXRhWydzZWN0aW9uc0l0ZW0nXSA9IF9hcnIwW2RhdGFbJ3NlY3Rpb25zSXRlbSddXTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXMxID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTIgPSAnJztcbl9hdHRyVmFsdWUyICs9ICdtZW51X19pdGVtJztcbmlmIChkYXRhWydzZWN0aW9uJ10gPT0gZGF0YVsnc2VjdGlvbnNJdGVtJ11bXCJhbGlhc1wiXSkge1xuX2F0dHJWYWx1ZTIgKz0gJyBtZW51X19pdGVtLS1hY3RpdmUnO1xufVxuX3BhcmFtczFbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMjtcbl9hdHRyVmFsdWUyID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGknLCBfcGFyYW1zMSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbnZhciBfcGFyYW1zMyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0ID0gJyc7XG5fYXR0clZhbHVlNCArPSAnL2Ntcy8nO1xuX2F0dHJWYWx1ZTQgKz0gZGF0YVsnc2VjdGlvbnNJdGVtJ11bXCJhbGlhc1wiXTtcbl9hdHRyVmFsdWU0ICs9ICcvJztcbl9wYXJhbXMzWydocmVmJ10gPSBfYXR0clZhbHVlNDtcbl9hdHRyVmFsdWU0ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1ID0gJyc7XG5fYXR0clZhbHVlNSArPSAnbWVudV9fbGluayc7XG5fcGFyYW1zM1snY2xhc3MnXSA9IF9hdHRyVmFsdWU1O1xuX2F0dHJWYWx1ZTUgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgX3BhcmFtczMsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKGRhdGFbJ3NlY3Rpb25zSXRlbSddW1widGl0bGVcIl0pKTtcbn0pKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbn0gICAgcmV0dXJuIF9jaGlsZHM7XG4gIH07XG59KTsiLCIoZnVuY3Rpb24gKGZhY3RvcnkpIHtcbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcbiAgfSBlbHNlIGlmICh0eXBlb2YgZGVmaW5lICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBkZWZpbmUoW10sIGZhY3RvcnkoKSk7XG4gIH1cbn0pKGZ1bmN0aW9uICgpIHtcbiAgdmFyIE1LQVJSX09QRU4gPSAyIDw8IDE7XG4gIHZhciBNS0FSUl9DTE9TRSA9IDEgPDwgMTtcbiAgZnVuY3Rpb24gbWtBcnIoc3RhcnQsIGVuZCwgZmxhZykge1xuICAgIHZhciBhcnIgPSBbXSwgaTtcbiAgICBpZiAoZmxhZyAmIE1LQVJSX09QRU4pIHtcbiAgICAgIGlmIChzdGFydCA8PSBlbmQpIHtcbiAgICAgICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+IGVuZDsgaS0tKSB7XG4gICAgICAgICAgYXJyLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGZsYWcgJiBNS0FSUl9DTE9TRSkge1xuICAgICAgaWYgKHN0YXJ0IDw9IGVuZCkge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA8PSBlbmQ7IGkrKykge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKGkgPSBzdGFydDsgaSA+PSBlbmQ7IGktLSkge1xuICAgICAgICAgIGFyci5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gc3RyKHN0ciwgbGVuLCBzcHJ0cikge1xuICAgIGlmICghbGVuKSBsZW4gPSAwO1xuICAgIGlmICh0eXBlb2Ygc3RyLnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSBzdHIgPSBzdHIudG9TdHJpbmcoKTtcbiAgICBpZiAoIXNwcnRyKSBzcHJ0ciA9ICcuJztcbiAgICBpZiAofnN0ci5pbmRleE9mKCcuJykpIHtcbiAgICAgIGlmIChsZW4gPiAwKSB7XG4gICAgICAgIHN0ciA9IHN0ci5zdWJzdHIoMCwgc3RyLmluZGV4T2YoJy4nKSArIGxlbiArIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBzdHIuaW5kZXhPZignLicpICsgbGVuKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgc3RyID0gc3RyX3BhZChzdHIgKyAnLicsIHN0ci5sZW5ndGggKyAxICsgbGVuLCAnMCcpO1xuICAgIH1cbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoJy4nLCBzcHJ0cik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3JlcGxhY2Uoc3RyLCBzcmMsIHJlcCkge1xuICAgIHdoaWxlICh+c3RyLmluZGV4T2Yoc3JjKSkge1xuICAgICAgc3RyID0gc3RyLnJlcGxhY2Uoc3JjLCByZXApO1xuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIHZhciBTVFJQQURSSUdIVCA9IDEgPDwgMTtcbiAgdmFyIFNUUlBBRExFRlQgPSAyIDw8IDE7XG4gIHZhciBTVFJQQURCT1RIID0gNCA8PCAxO1xuICBmdW5jdGlvbiBfX3N0cl9wYWRfcmVwZWF0ZXIoc3RyLCBsZW4pIHtcbiAgICB2YXIgY29sbGVjdCA9ICcnLCBpO1xuICAgIHdoaWxlKGNvbGxlY3QubGVuZ3RoIDwgbGVuKSBjb2xsZWN0ICs9IHN0cjtcbiAgICBjb2xsZWN0ID0gY29sbGVjdC5zdWJzdHIoMCwgbGVuKTtcbiAgICByZXR1cm4gY29sbGVjdDtcbiAgfVxuICBmdW5jdGlvbiBzdHJfcGFkKHN0ciwgbGVuLCBzdWIsIHR5cGUpIHtcbiAgICBpZiAodHlwZW9mIHR5cGUgPT09ICd1bmRlZmluZWQnKSB0eXBlID0gU1RSUEFEUklHSFQ7XG4gICAgdmFyIGhhbGYgPSAnJywgcGFkX3RvX2dvO1xuICAgIGlmICgocGFkX3RvX2dvID0gbGVuIC0gc3RyLmxlbmd0aCkgPiAwKSB7XG4gICAgICBpZiAodHlwZSAmIFNUUlBBRExFRlQpIHsgc3RyID0gX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKSArIHN0cjsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBRFJJR0hUKSB7c3RyID0gc3RyICsgX19zdHJfcGFkX3JlcGVhdGVyKHN1YiwgcGFkX3RvX2dvKTsgfVxuICAgICAgZWxzZSBpZiAodHlwZSAmIFNUUlBBREJPVEgpIHtcbiAgICAgICAgaGFsZiA9IF9fc3RyX3BhZF9yZXBlYXRlcihzdWIsIE1hdGguY2VpbChwYWRfdG9fZ28vMikpO1xuICAgICAgICBzdHIgPSBoYWxmICsgc3RyICsgaGFsZjtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigwLCBsZW4pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gc3RyO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9odG1sZXNjYXBlKGh0bWwpIHtcbiAgICByZXR1cm4gaHRtbC5yZXBsYWNlKC8mL2csIFwiJmFtcDtcIilcbiAgICAucmVwbGFjZSgvPC9nLCBcIiZsdDtcIilcbiAgICAucmVwbGFjZSgvPi9nLCBcIiZndDtcIilcbiAgICAucmVwbGFjZSgvXCIvZywgXCImcXVvdDtcIik7XG4gIH1cbiAgZnVuY3Rpb24gc3RyX3VwZmlyc3Qoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICByZXR1cm4gaXRlbS5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIGl0ZW0uc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XG4gICAgfSkuam9pbignICcpO1xuICB9XG4gIGZ1bmN0aW9uIHN0cl9jYW1lbChzdHIpIHtcbiAgICByZXR1cm4gc3RyLnNwbGl0KC9bXFxzXFxuXFx0XSsvKS5tYXAoZnVuY3Rpb24gKGl0ZW0sIGluZGV4KSB7XG4gICAgICBpZiAoIWluZGV4KSByZXR1cm4gaXRlbTtcbiAgICAgIHJldHVybiBpdGVtLnN1YnN0cigwLCAxKS50b1VwcGVyQ2FzZSgpICsgaXRlbS5zdWJzdHIoMSkudG9Mb3dlckNhc2UoKTtcbiAgICB9KS5qb2luKCcnKTtcbiAgfVxuICBmdW5jdGlvbiBzdHJfa2ViYWIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zcGxpdCgvW1xcc1xcblxcdF0rLykuam9pbignLScpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl92YWx1ZXMob2JqKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLCBpO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSB2YWx1ZXMucHVzaChvYmpbaV0pO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2NvbnRhaW4ob2JqLCB2YWx1ZSkge1xuICAgIGlmKHR5cGVvZiBvYmouaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykgcmV0dXJuIG9iai5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gb2JqKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgaSkpIGlmIChvYmpbaV0gPT09IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2xlbihvYmopIHtcbiAgICBpZih0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ3VuZGVmaW5lZCcpIHJldHVybiBvYmoubGVuZ3RoO1xuICAgIHZhciBpLCBsZW5ndGggPSAwO1xuICAgIGZvcihpIGluIG9iaikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGkpKSBsZW5ndGgrKztcbiAgICByZXR1cm4gbGVuZ3RoO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wdXNoKGFyciwgdmFsdWUpIHtcbiAgICBhcnIucHVzaCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bnNoaWZ0KGFyciwgdmFsdWUpIHtcbiAgICBhcnIudW5zaGlmdCh2YWx1ZSk7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9yYW5kKGFyciwgdmFsdWUpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGFycik7XG4gICAgcmV0dXJuIGFycltrZXlzW3BhcnNlSW50KE1hdGgucmFuZG9tKCkgKiBhcnJfbGVuKGFycikgLSAxKV1dO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9zcGxpY2UoYXJyLCBzdCwgZW4sIGVscykge1xuICAgIHZhciBwcm1zID0gW3N0XTtcbiAgICBpZiAodHlwZW9mIGVuICE9PSAndW5kZWZpbmVkJykgcHJtcy5wdXNoKGVuKTtcbiAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnNwbGljZS5hcHBseShhcnIsIHBybXMuY29uY2F0KGVscykpO1xuICB9XG4gIGZ1bmN0aW9uIGFycl9wYWQoc3JjLCBsZW4sIGVsKSB7XG4gICAgdmFyIGksIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBpZihsZW4gPiAwKSBmb3IoaSA9IGFycl9sZW4oYXJyKTtpIDwgbGVuO2krKykgYXJyLnB1c2goZWwpO1xuICAgIGlmKGxlbiA8IDApIGZvcihpID0gYXJyX2xlbihhcnIpO2kgPCAtbGVuO2krKykgYXJyLnVuc2hpZnQoZWwpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3JldmVyc2Uoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIucmV2ZXJzZSgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnQoc3JjKSB7XG4gICAgdmFyIGFyciA9IHNyYy5zbGljZSgwKTtcbiAgICBhcnIuc29ydCgpO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX3NvcnRfcmV2ZXJzZShzcmMpIHtcbiAgICB2YXIgYXJyID0gc3JjLnNsaWNlKDApO1xuICAgIGFyci5zb3J0KCk7XG4gICAgYXJyLnJldmVyc2UoKTtcbiAgICByZXR1cm4gYXJyO1xuICB9XG4gIGZ1bmN0aW9uIGFycl91bmlxdWUoc3JjKSB7XG4gICAgdmFyIGksIGFyciA9IFtdO1xuICAgIGZvcihpIGluIHNyYykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzcmMsIGkpKSBpZiAoIX5hcnIuaW5kZXhPZihzcmNbaV0pKSBhcnIucHVzaChzcmNbaV0pO1xuICAgIHJldHVybiBhcnI7XG4gIH1cbiAgZnVuY3Rpb24gYXJyX2tleShhcnIsIHZhbHVlKSB7XG4gICAgdmFyIGk7XG4gICAgZm9yKGkgaW4gYXJyKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGFyciwgaSkpIGlmICh2YWx1ZSA9PSBhcnJbaV0pIHJldHVybiBpO1xuICAgIHJldHVybiAtMTtcbiAgfVxuICBmdW5jdGlvbiBjcmVhdGUobmFtZSwgYXR0cnMsIGNiKSB7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0JykgcmV0dXJuIG5hbWU7XG4gICAgdmFyIGNoaWxkcyA9IFtdO1xuICAgIGlmICh0eXBlb2YgY2IgPT09ICdmdW5jdGlvbicpIGNiKGNoaWxkcyk7XG4gICAgaWYgKGF0dHJzKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiAnbm9kZScsXG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIGF0dHJzOiBhdHRycyxcbiAgICAgICAgY2hpbGRzOiBjaGlsZHMuZmlsdGVyKGZ1bmN0aW9uIChfY2hpbGQpIHsgcmV0dXJuIF9jaGlsZCAhPT0gbnVsbDsgfSlcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0eXBlb2YgbmFtZS50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykgbmFtZSA9IG5hbWUudG9TdHJpbmcoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ3RleHQnLFxuICAgICAgdGV4dDogbmFtZVxuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uIChkYXRhLCBjaGlsZHMpIHtcbiAgICB2YXIgX2NoaWxkcyA9IFtdO1xudmFyIGk7XG52YXIgX3BhcmFtczAgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMSA9ICcnO1xuX2F0dHJWYWx1ZTEgKz0gJ3NlY3Rpb25fX3Jvdyc7XG5fcGFyYW1zMFsnY2xhc3MnXSA9IF9hdHRyVmFsdWUxO1xuX2F0dHJWYWx1ZTEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zMCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgJykpO1xudmFyIF9wYXJhbXMyID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTMgPSAnJztcbl9hdHRyVmFsdWUzICs9ICcvY21zL2NvbmZpZ3MvYWRkLyc7XG5fcGFyYW1zMlsnaHJlZiddID0gX2F0dHJWYWx1ZTM7XG5fYXR0clZhbHVlMyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNCA9ICcnO1xuX2F0dHJWYWx1ZTQgKz0gJ2Zvcm1fX2J0bic7XG5fcGFyYW1zMlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU0O1xuX2F0dHJWYWx1ZTQgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgX3BhcmFtczIsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQlNC+0LHQsNCy0LjRgtGMINGA0LDQt9C00LXQuycpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbnZhciBfcGFyYW1zNSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU2ID0gJyc7XG5fYXR0clZhbHVlNiArPSAnc2VjdGlvbl9fcm93Jztcbl9wYXJhbXM1WydjbGFzcyddID0gX2F0dHJWYWx1ZTY7XG5fYXR0clZhbHVlNiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNyA9ICcnO1xuX2F0dHJWYWx1ZTcgKz0gJ3NlY3Rpb24tbGlzdCc7XG5fcGFyYW1zNVsncm9sZSddID0gX2F0dHJWYWx1ZTc7XG5fYXR0clZhbHVlNyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2RpdicsIF9wYXJhbXM1LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG5kYXRhWydjaGVja2VkSXRlbXMnXSA9IDA7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zOCA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU5ID0gJyc7XG5fYXR0clZhbHVlOSArPSAndGFibGUnO1xuX3BhcmFtczhbJ2NsYXNzJ10gPSBfYXR0clZhbHVlOTtcbl9hdHRyVmFsdWU5ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndGFibGUnLCBfcGFyYW1zOCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczEwID0ge307XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdjb2xncm91cCcsIF9wYXJhbXMxMCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfcGFyYW1zMTEgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMTIgPSAnJztcbl9hdHRyVmFsdWUxMiArPSAnMjAnO1xuX3BhcmFtczExWyd3aWR0aCddID0gX2F0dHJWYWx1ZTEyO1xuX2F0dHJWYWx1ZTEyID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnY29sJywgX3BhcmFtczExKSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczEzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE0ID0gJyc7XG5fYXR0clZhbHVlMTQgKz0gJyonO1xuX3BhcmFtczEzWyd3aWR0aCddID0gX2F0dHJWYWx1ZTE0O1xuX2F0dHJWYWx1ZTE0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnY29sJywgX3BhcmFtczEzKSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczE1ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE2ID0gJyc7XG5fYXR0clZhbHVlMTYgKz0gJyonO1xuX3BhcmFtczE1Wyd3aWR0aCddID0gX2F0dHJWYWx1ZTE2O1xuX2F0dHJWYWx1ZTE2ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnY29sJywgX3BhcmFtczE1KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG52YXIgX3BhcmFtczE3ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTE4ID0gJyc7XG5fYXR0clZhbHVlMTggKz0gJyonO1xuX3BhcmFtczE3Wyd3aWR0aCddID0gX2F0dHJWYWx1ZTE4O1xuX2F0dHJWYWx1ZTE4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnY29sJywgX3BhcmFtczE3KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbnZhciBfcGFyYW1zMTkgPSB7fTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3RoZWFkJywgX3BhcmFtczE5LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMyMCA9IHt9O1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBfcGFyYW1zMjAsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMjEgPSB7fTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgX3BhcmFtczIxLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zMjIgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjMgPSAnJztcbl9hdHRyVmFsdWUyMyArPSAnZm9ybV9fY2hlY2tib3gnO1xuX3BhcmFtczIyWydjbGFzcyddID0gX2F0dHJWYWx1ZTIzO1xuX2F0dHJWYWx1ZTIzID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyNCA9ICcnO1xuX2F0dHJWYWx1ZTI0ICs9ICdjaGVja2JveCc7XG5fcGFyYW1zMjJbJ3R5cGUnXSA9IF9hdHRyVmFsdWUyNDtcbl9hdHRyVmFsdWUyNCA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjUgPSAnJztcbl9hdHRyVmFsdWUyNSArPSAnY2hlY2thbGwnO1xuX3BhcmFtczIyWydpZCddID0gX2F0dHJWYWx1ZTI1O1xuX2F0dHJWYWx1ZTI1ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyNiA9ICcnO1xuX2F0dHJWYWx1ZTI2ICs9ICdjYmVjay1hbGwnO1xuX3BhcmFtczIyWydyb2xlJ10gPSBfYXR0clZhbHVlMjY7XG5fYXR0clZhbHVlMjYgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdpbnB1dCcsIF9wYXJhbXMyMikpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zMjcgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlMjggPSAnJztcbl9hdHRyVmFsdWUyOCArPSAnZm9ybV9fY2hlY2tib3gtbGFiZWwnO1xuX3BhcmFtczI3WydjbGFzcyddID0gX2F0dHJWYWx1ZTI4O1xuX2F0dHJWYWx1ZTI4ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUyOSA9ICcnO1xuX2F0dHJWYWx1ZTI5ICs9ICdjaGVja2FsbCc7XG5fcGFyYW1zMjdbJ2ZvciddID0gX2F0dHJWYWx1ZTI5O1xuX2F0dHJWYWx1ZTI5ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zMjcsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXMzMCA9IHt9O1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBfcGFyYW1zMzAsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCfQndCw0LfQstCw0L3QuNC1JykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczMxID0ge307XG5fY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIF9wYXJhbXMzMSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ9CS0LXQsS3QuNC80Y8nKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMzIgPSB7fTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgX3BhcmFtczMyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgn0JzQvtC00YPQu9GMJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczMzID0ge307XG5fY2hpbGRzLnB1c2goY3JlYXRlKCd0Ym9keScsIF9wYXJhbXMzMywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICcpKTtcbnZhciBfYXJyMzQgPSBkYXRhWydzZWN0aW9ucyddO1xuZm9yIChkYXRhWydpJ10gaW4gX2FycjM0KSB7XG5kYXRhWydzZWN0aW9uc0l0ZW0nXSA9IF9hcnIzNFtkYXRhWydpJ11dO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG5kYXRhWydpc0NoZWNrZWQnXSA9ICh0eXBlb2YgZGF0YVsnc2VjdGlvbnNJdGVtJ11bXCJjaGVja2VkXCJdICE9PSAndW5kZWZpbmVkJyA/IGRhdGFbJ3NlY3Rpb25zSXRlbSddW1wiY2hlY2tlZFwiXSA6ICcnKSAmJiAoZGF0YVsnc2VjdGlvbnNJdGVtJ11bXCJjaGVja2VkXCJdID09IHRydWUpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG5pZiAoZGF0YVsnaXNDaGVja2VkJ10pIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG5kYXRhWydjaGVja2VkSXRlbXMnXSA9IGRhdGFbJ2NoZWNrZWRJdGVtcyddICsgMTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xufVxuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgJykpO1xudmFyIF9wYXJhbXMzNSA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzNiA9ICcnO1xuX2F0dHJWYWx1ZTM2ICs9ICd0YWJsZV9fbGluayc7XG5fcGFyYW1zMzVbJ2NsYXNzJ10gPSBfYXR0clZhbHVlMzY7XG5fYXR0clZhbHVlMzYgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTM3ID0gJyc7XG5fYXR0clZhbHVlMzcgKz0gJ3NlY3Rpb24tcm93Jztcbl9wYXJhbXMzNVsncm9sZSddID0gX2F0dHJWYWx1ZTM3O1xuX2F0dHJWYWx1ZTM3ID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWUzOCA9ICcnO1xuX2F0dHJWYWx1ZTM4ICs9IGRhdGFbJ2knXTtcbl9wYXJhbXMzNVsnZGF0YS1pZCddID0gX2F0dHJWYWx1ZTM4O1xuX2F0dHJWYWx1ZTM4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndHInLCBfcGFyYW1zMzUsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zMzkgPSB7fTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgX3BhcmFtczM5LCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAgICcpKTtcbnZhciBfcGFyYW1zNDAgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDEgPSAnJztcbl9hdHRyVmFsdWU0MSArPSAnZm9ybV9fY2hlY2tib3gnO1xuX3BhcmFtczQwWydjbGFzcyddID0gX2F0dHJWYWx1ZTQxO1xuX2F0dHJWYWx1ZTQxID0gJyc7XG59KSgpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU0MiA9ICcnO1xuX2F0dHJWYWx1ZTQyICs9ICdjaGVja2JveCc7XG5fcGFyYW1zNDBbJ3R5cGUnXSA9IF9hdHRyVmFsdWU0Mjtcbl9hdHRyVmFsdWU0MiA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDMgPSAnJztcbl9hdHRyVmFsdWU0MyArPSAnY2hlY2snO1xuX2F0dHJWYWx1ZTQzICs9IGRhdGFbJ3NlY3Rpb25zSXRlbSddW1wiaWRcIl07XG5fcGFyYW1zNDBbJ2lkJ10gPSBfYXR0clZhbHVlNDM7XG5fYXR0clZhbHVlNDMgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ0ID0gJyc7XG5fYXR0clZhbHVlNDQgKz0gJ2NoZWNrLWl0ZW0nO1xuX3BhcmFtczQwWydyb2xlJ10gPSBfYXR0clZhbHVlNDQ7XG5fYXR0clZhbHVlNDQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ1ID0gJyc7XG5pZiAoZGF0YVsnaXNDaGVja2VkJ10pIHtcbl9wYXJhbXM0MFsnY2hlY2tlZCddID0gX2F0dHJWYWx1ZTQ1O1xuX2F0dHJWYWx1ZTQ1ID0gJyc7XG59XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnaW5wdXQnLCBfcGFyYW1zNDApKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgICAnKSk7XG52YXIgX3BhcmFtczQ2ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTQ3ID0gJyc7XG5fYXR0clZhbHVlNDcgKz0gJ2Zvcm1fX2NoZWNrYm94LWxhYmVsJztcbl9wYXJhbXM0NlsnY2xhc3MnXSA9IF9hdHRyVmFsdWU0Nztcbl9hdHRyVmFsdWU0NyA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNDggPSAnJztcbl9hdHRyVmFsdWU0OCArPSAnY2hlY2snO1xuX2F0dHJWYWx1ZTQ4ICs9IGRhdGFbJ3NlY3Rpb25zSXRlbSddW1wiaWRcIl07XG5fcGFyYW1zNDZbJ2ZvciddID0gX2F0dHJWYWx1ZTQ4O1xuX2F0dHJWYWx1ZTQ4ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnbGFiZWwnLCBfcGFyYW1zNDYsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAgICAgJykpO1xudmFyIF9wYXJhbXM0OSA9IHt9O1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgndGQnLCBfcGFyYW1zNDksIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG52YXIgX3BhcmFtczUwID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTUxID0gJyc7XG5fYXR0clZhbHVlNTEgKz0gJy9jbXMvY29uZmlncy8nO1xuX2F0dHJWYWx1ZTUxICs9IGRhdGFbJ3NlY3Rpb25zSXRlbSddW1wiYWxpYXNcIl07XG5fYXR0clZhbHVlNTEgKz0gJy8nO1xuX3BhcmFtczUwWydocmVmJ10gPSBfYXR0clZhbHVlNTE7XG5fYXR0clZhbHVlNTEgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdhJywgX3BhcmFtczUwLCBmdW5jdGlvbiAoX2NoaWxkcykge1xuX2NoaWxkcy5wdXNoKGNyZWF0ZShkYXRhWydzZWN0aW9uc0l0ZW0nXVtcInRpdGxlXCJdKSk7XG59KSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAgICcpKTtcbnZhciBfcGFyYW1zNTIgPSB7fTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ3RkJywgX3BhcmFtczUyLCBmdW5jdGlvbiAoX2NoaWxkcykge1xudmFyIF9wYXJhbXM1MyA9IHt9O1xuKGZ1bmN0aW9uICgpIHtcbiAgdmFyIF9hdHRyVmFsdWU1NCA9ICcnO1xuX2F0dHJWYWx1ZTU0ICs9ICcvY21zL2NvbmZpZ3MvJztcbl9hdHRyVmFsdWU1NCArPSBkYXRhWydzZWN0aW9uc0l0ZW0nXVtcImFsaWFzXCJdO1xuX2F0dHJWYWx1ZTU0ICs9ICcvJztcbl9wYXJhbXM1M1snaHJlZiddID0gX2F0dHJWYWx1ZTU0O1xuX2F0dHJWYWx1ZTU0ID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnYScsIF9wYXJhbXM1MywgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoZGF0YVsnc2VjdGlvbnNJdGVtJ11bXCJhbGlhc1wiXSkpO1xufSkpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAgICAgICAnKSk7XG52YXIgX3BhcmFtczU1ID0ge307XG5fY2hpbGRzLnB1c2goY3JlYXRlKCd0ZCcsIF9wYXJhbXM1NSwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbnZhciBfcGFyYW1zNTYgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNTcgPSAnJztcbl9hdHRyVmFsdWU1NyArPSAnL2Ntcy9jb25maWdzLyc7XG5fYXR0clZhbHVlNTcgKz0gZGF0YVsnc2VjdGlvbnNJdGVtJ11bXCJhbGlhc1wiXTtcbl9hdHRyVmFsdWU1NyArPSAnLyc7XG5fcGFyYW1zNTZbJ2hyZWYnXSA9IF9hdHRyVmFsdWU1Nztcbl9hdHRyVmFsdWU1NyA9ICcnO1xufSkoKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ2EnLCBfcGFyYW1zNTYsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKGRhdGFbJ3NlY3Rpb25zSXRlbSddW1wibW9kdWxlXCJdKSk7XG59KSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICAnKSk7XG59XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgJykpO1xufSkpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnXFxuICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4nKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4nKSk7XG52YXIgX3BhcmFtczU4ID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTU5ID0gJyc7XG5fYXR0clZhbHVlNTkgKz0gJ3NlY3Rpb25fX3Jvdyc7XG5fcGFyYW1zNThbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNTk7XG5fYXR0clZhbHVlNTkgPSAnJztcbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdkaXYnLCBfcGFyYW1zNTgsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbnZhciBfcGFyYW1zNjAgPSB7fTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjEgPSAnJztcbl9wYXJhbXM2MFsnYWN0aW9uJ10gPSBfYXR0clZhbHVlNjE7XG5fYXR0clZhbHVlNjEgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTYyID0gJyc7XG5fYXR0clZhbHVlNjIgKz0gJ2JvdHRvbS1mb3JtJztcbl9wYXJhbXM2MFsncm9sZSddID0gX2F0dHJWYWx1ZTYyO1xuX2F0dHJWYWx1ZTYyID0gJyc7XG59KSgpO1xuX2NoaWxkcy5wdXNoKGNyZWF0ZSgnZm9ybScsIF9wYXJhbXM2MCwgZnVuY3Rpb24gKF9jaGlsZHMpIHtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbiAgICAnKSk7XG52YXIgX3BhcmFtczYzID0ge307XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTY0ID0gJyc7XG5fYXR0clZhbHVlNjQgKz0gJ2Zvcm1fX2J0bic7XG5fcGFyYW1zNjNbJ2NsYXNzJ10gPSBfYXR0clZhbHVlNjQ7XG5fYXR0clZhbHVlNjQgPSAnJztcbn0pKCk7XG4oZnVuY3Rpb24gKCkge1xuICB2YXIgX2F0dHJWYWx1ZTY1ID0gJyc7XG5fYXR0clZhbHVlNjUgKz0gJ3N1Ym1pdCc7XG5fcGFyYW1zNjNbJ3R5cGUnXSA9IF9hdHRyVmFsdWU2NTtcbl9hdHRyVmFsdWU2NSA9ICcnO1xufSkoKTtcbihmdW5jdGlvbiAoKSB7XG4gIHZhciBfYXR0clZhbHVlNjYgPSAnJztcbmlmIChkYXRhWydjaGVja2VkSXRlbXMnXSA9PSAwKSB7XG5fcGFyYW1zNjNbJ2Rpc2FibGVkJ10gPSBfYXR0clZhbHVlNjY7XG5fYXR0clZhbHVlNjYgPSAnJztcbn1cbn0pKCk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdidXR0b24nLCBfcGFyYW1zNjMsIGZ1bmN0aW9uIChfY2hpbGRzKSB7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICAgICDQo9C00LDQu9C40YLRjFxcbiAgICAnKSk7XG59KSk7XG5fY2hpbGRzLnB1c2goY3JlYXRlKCdcXG4gICcpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTtcbn0pKTtcbl9jaGlsZHMucHVzaChjcmVhdGUoJ1xcbicpKTsgICAgcmV0dXJuIF9jaGlsZHM7XG4gIH07XG59KTsiLCJJbmRleE1vZGVsID0gcmVxdWlyZSBcIi4vaW5kZXhNb2RlbC5jb2ZmZWVcIlxuaW5kZXhNb2RlbCA9IEluZGV4TW9kZWwoKVxuSW5kZXhWaWV3ID0gcmVxdWlyZSBcIi4vaW5kZXhWaWV3LmNvZmZlZVwiXG5TZWN0aW9uc01lbnVWaWV3ID0gcmVxdWlyZSBcIi4vc2VjdGlvbnNNZW51Vmlldy5jb2ZmZWVcIlxuXG5JbmRleFZpZXcgKCQgXCJAc2VjdGlvbnNcIiksIGluZGV4TW9kZWxcblNlY3Rpb25zTWVudVZpZXcgKCQgXCJAc2VjdGlvbnMtbWVudVwiKSwgaW5kZXhNb2RlbFxuIiwiTW9kZWwgPSByZXF1aXJlIFwibW9kZWwuY29mZmVlXCJcbmh0dHBHZXQgPSAocmVxdWlyZSBcImFqYXguY29mZmVlXCIpLmh0dHBHZXRcbmh0dHBQb3N0ID0gKHJlcXVpcmUgXCJhamF4LmNvZmZlZVwiKS5odHRwUG9zdFxuXG5tb2R1bGUuZXhwb3J0cyA9IE1vZGVsXG4gIGluaXRpYWxTdGF0ZTogLT5cbiAgICBodHRwR2V0IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZVxuXG4gIHNldENoZWNrOiAoaW5kZXgsIGNoZWNrZWQpIC0+XG4gICAgaW5kZXggPSBwYXJzZUludCBpbmRleCwgMTBcbiAgICBzZWN0aW9ucyA9IEBzdGF0ZS5zZWN0aW9ucy5zbGljZSgpXG4gICAgc2VjdGlvbnNbaW5kZXhdLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICBjaGVja0FsbDogKGNoZWNrZWQpIC0+XG4gICAgc2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIGZvciBzZWN0aW9uIGluIHNlY3Rpb25zXG4gICAgICBzZWN0aW9uLmNoZWNrZWQgPSBjaGVja2VkXG4gICAgQHNldCBzZWN0aW9uczogc2VjdGlvbnNcblxuICByZW1vdmVTdWJtaXQ6IC0+XG4gICAgc291cmNlU2VjdGlvbnMgPSBAc3RhdGUuc2VjdGlvbnMuc2xpY2UoKVxuICAgIHNlY3Rpb25zID0gW11cbiAgICBkZWxldGVTZWN0aW9ucyA9IFtdXG4gICAgZm9yIHNlY3Rpb24gaW4gc291cmNlU2VjdGlvbnNcbiAgICAgIGlmICFzZWN0aW9uLmNoZWNrZWQ/IHx8ICFzZWN0aW9uLmNoZWNrZWRcbiAgICAgICAgc2VjdGlvbnMucHVzaCBzZWN0aW9uXG4gICAgICBlbHNlXG4gICAgICAgIGRlbGV0ZVNlY3Rpb25zLnB1c2ggc2VjdGlvbi5pZFxuICAgIGh0dHBQb3N0IFwiI3t3aW5kb3cubG9jYXRpb24ucGF0aG5hbWV9YWN0aW9uX2RlbGV0ZS9cIiwge2RlbGV0ZVNlY3Rpb25zfVxuICAgIC5jYXRjaCAocmVzcG9uc2UpID0+XG4gICAgICBjb25zb2xlLmVycm9yIHJlc3BvbnNlLmVycm9yXG4gICAgICBAc2V0IHNlY3Rpb25zOiBzb3VyY2VTZWN0aW9uc1xuICAgIEBzZXQgc2VjdGlvbnM6IHNlY3Rpb25zXG4iLCJWaWV3ID0gcmVxdWlyZSBcInZpZXcuY29mZmVlXCJcbnNlY3Rpb25zVGVtcGxhdGUgPSByZXF1aXJlIFwic2VjdGlvbnMvY29uZmlncy90YWJsZS1zZWN0aW9ucy1saXN0XCJcblJlbmRlciA9IHJlcXVpcmUgXCJyZW5kZXJcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IFZpZXdcbiAgaW5pdGlhbDogLT5cbiAgICBAdGVtcGxhdGVMaXN0ID0gUmVuZGVyIHNlY3Rpb25zVGVtcGxhdGUsIEBjb250YWluWzBdXG5cbiAgZXZlbnRzOlxuICAgIFwiY2hhbmdlOiBAY2hlY2staXRlbVwiOiAoZSkgLT5cbiAgICAgIEBtb2RlbC5zZXRDaGVjayAoJCBlLnRhcmdldCkuY2xvc2VzdChcIkBzZWN0aW9uLXJvd1wiKS5hdHRyKFwiZGF0YS1pZFwiKSwgZS50YXJnZXQuY2hlY2tlZFxuICAgIFwiY2hhbmdlOiBAY2JlY2stYWxsXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLmNoZWNrQWxsIGUudGFyZ2V0LmNoZWNrZWRcbiAgICBcInN1Ym1pdDogQGJvdHRvbS1mb3JtXCI6IChlKSAtPlxuICAgICAgQG1vZGVsLnJlbW92ZVN1Ym1pdCgpXG4gICAgICBmYWxzZVxuXG4gIHJlbmRlcjogKHN0YXRlKSAtPiBAdGVtcGxhdGVMaXN0IHN0YXRlXG4iLCJSZW5kZXIgPSByZXF1aXJlIFwicmVuZGVyXCJcblZpZXcgPSByZXF1aXJlIFwidmlldy5jb2ZmZWVcIlxubWVudVRlbXBsYXRlID0gcmVxdWlyZSBcImNvbXBvbmVudHMvbWVudS9tZW51LWl0ZW1zXCJcblxubW9kdWxlLmV4cG9ydHMgPSBWaWV3XG4gIGluaXRpYWw6IC0+IEBtZW51VGVtcGxhdGUgPSBSZW5kZXIgbWVudVRlbXBsYXRlLCBAY29udGFpblswXVxuICByZW5kZXI6IChzdGF0ZSkgLT4gQG1lbnVUZW1wbGF0ZSBzdGF0ZVxuIl19
