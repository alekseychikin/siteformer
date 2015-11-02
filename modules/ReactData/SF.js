;(function (root)
{
  var insertEvents = [];
  var updateEvents = [];
  var removeEvents = [];
  var _urls = [];
  var _urlsParams = {};
  var lastEvent = 0;

  function parsePostData (postData, name)
  {
    var str = '';
    var i;
    var data = [];
    if (typeof postData == 'string' ||
        typeof postData == 'number' ||
        typeof postData == 'boolean') {
      return (name ? name : '') + '=' + postData;
    }
    else if (postData instanceof Array) {
      for (i in postData) {
        if (!Object.prototype.hasOwnProperty.call(postData, i)) continue;
        data.push(parsePostData(postData[i], (name ? name + '[' + i + ']' : i)));
      }
      return data.join('&');
    }
    else if (typeof postData == 'object') {
      for (i in postData) {
        if (!Object.prototype.hasOwnProperty.call(postData, i)) continue;
        if (i == '__renderCache' || i == '__renderElement') continue;
        data.push(parsePostData(postData[i], (name ? name + '[' + i + ']' : i)));
      }
      return data.join('&');
    }
  }

  function createXMLHTTPObject ()
  {
    var XMLHttpFactories = [
        function () {return new XMLHttpRequest();},
        function () {return new ActiveXObject("Msxml2.XMLHTTP");},
        function () {return new ActiveXObject("Msxml3.XMLHTTP");},
        function () {return new ActiveXObject("Microsoft.XMLHTTP");}
    ];
    var xmlhttp = false;
    for (var i = 0; i < XMLHttpFactories.length;i++) {
      try {
        xmlhttp = XMLHttpFactories[i]();
      }
      catch (e) {
        continue;
      }
      break;
    }
    return xmlhttp;
  }

  function template ()
  {
    var cache = {};
    var id;
    var el;

    return function (str, data)
    {
      if (str.substring(0, 9) == 'template_') {
        try {
          if (!document.getElementById(str)) {
            throw 'Template "' + str + '" not found';
          }
          id = str;
          el = document.getElementById(str);
          str = el.innerHTML;
        }
        catch (e)
        {
          console.error(e);/*RemoveLogging:skip*/
          return undefined;
        }
      }
      var fn = !/\W/.test(str) ?
        cache[str] = cache[str] || str :
        new Function("obj",
          "obj=obj||{};obj.__renderCache=obj.__renderCache||{};for(var i in obj){if(i=='__renderCache' || i=='__renderElement')continue;obj.__renderCache[i]=obj[i]};var p=[],print=function(){p.push.apply(p,arguments);};" +
          "with(obj){p.push('" +
          str
            .replace(/[\r\t\n]/g, " ")
            .split("<%").join("\t")
            .replace(/((^|%>)[^\t]*)'/g, "$1\r")
            .replace(/\t=(.*?)%>/g, "',$1,'")
            .split("\t").join("');")
            .split("%>").join("p.push('")
            .split("\r").join("\\'")
        + "');}return p.join('');");
      fn.data = function (attr)
      {
        return (el ? el.getAttribute('data-' + attr) : 'undefined');
      };
      fn.toString = function ()
      {
        console.warn('You should run template with data');/*RemoveLogging:skip*/
        return fn({});
      };
      return data ? fn( data ) : fn;
    };
  }

  function request (url, postData, success, error)
  {
    var req = createXMLHTTPObject();
    if (!req) return false;
    if (typeof postData == 'function') {
      if (typeof success == 'function') {
        error = success;
      }
      success = postData;
      postData = false;
    }
    var method = (postData) ? 'POST' : 'GET';
    var data = parsePostData(postData).replace(/&&/img, '&');
    // console.log(data);
    req.open(method, url, true);
    req.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    req.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
    if (data) {
      req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
    }
    req.onreadystatechange = function ()
    {
      if (req.readyState != 4) return;
      var result = false;
      try {
        if (req.responseText.length) {
          result = JSON.parse(req.responseText);
        }
      }
      catch (e) {
        result = req.responseText;
      }
      // console.log(result);
      if (req.status != 200 && req.status != 304) {
        if (typeof request.__defaultError == 'function') {
          request.__defaultError(req, result);
        }
        if (typeof error == 'function') {
          error(req, result);
        }
        req = null;
        return;
      }
      // if (!result) {
      // 	console.warn(req.responseText);
      // }
      if (typeof success == 'function') {
        success(result, req);
      }
      req = null;
    };
    req.send(data);
    return req;
  }

  request.addDefaultError = function (cb)
  {
    request.__defaultError = cb;
  };

  function prepareCheckEvents (result)
  {
    var extendresult = {};
    for (var item in result) {
      if (item == 'result') continue;
      extendresult[item] = result[item];
    }
    var resultRows, action, eventsOfResults, ev, i, j;
    var hasOwn = Object.prototype.hasOwnProperty;
    if (result._getLastState && result.result && result._getLastState > lastEvent) {
      for (action in result.result) {
        if (!hasOwn.call(result.result, action)) continue;
        eventsOfResults = result.result[action];
        for (ev in eventsOfResults) {
          if (!hasOwn.call(eventsOfResults, ev)) continue;
          switch (ev) {
            case 'insert':
              for (i = 0, max = insertEvents.length; i < max; i += 1) {
                if (action == insertEvents[i].url) {
                  for (j = 0, may = eventsOfResults[ev].length; j < may; j += 1) {
                    insertEvents[i].callback(eventsOfResults[ev][j].data, eventsOfResults[ev][j].params, extendresult);
                  }
                }
              }
              break;
            case 'update':
              for (i = 0, max = updateEvents.length; i < max; i += 1) {
                if (action == updateEvents[i].url) {
                  for (j = 0, may = eventsOfResults[ev].length; j < may; j += 1) {
                    updateEvents[i].callback(eventsOfResults[ev][j].data, eventsOfResults[ev][j].params, extendresult);
                  }
                }
              }
              break;
            case 'delete':
              for (i = 0, max = removeEvents.length; i < max; i += 1) {
                if (action == removeEvents[i].url) {
                  for (j = 0, may = eventsOfResults[ev].length; j < may; j += 1) {
                    removeEvents[i].callback(eventsOfResults[ev][j].data, eventsOfResults[ev][j].params, extendresult);
                  }
                }
              }
              break;
          }
        }
      }
      if (result._getLastState) {
        lastEvent = result._getLastState;
      }
    }
  }

  function send (url)
  {
    var data;
    return {
      data: function (_data)
      {
        data = _data;
        return this;
      },
      execute: function (callback)
      {
        var arrUrl;
        data.__actions = _urls;
        data.__last_event = lastEvent;
        request(url, data, function (error, result)
        {
          prepareCheckEvents(error, result);
          if (typeof callback !== 'function') return;
          callback.apply(root, (result.result ? result.result : result), error);
        });
      }
    };
  }

  function listen (url)
  {
    if (!url) {
      console.error("url is not defined");
      return false;
    }
    if (_urls.indexOf(url) == -1) {
      _urls.push(url);
    }
    return {
      params: function (ps)
      {
        _urlsParams[url] = ps;
        return this;
      },
      on: function (event, callback)
      {
        switch (event)
        {
        case 'insert':
          insertEvents.push({
            url: url,
            callback: callback
          });
          break;
        case 'update':
          updateEvents.push({
            url: url,
            callback: callback
          });
          break;
        case 'delete':
          removeEvents.push({
            url: url,
            callback: callback
          });
          break;
        }
        return this;
      }
    };
  }

  var lastTimeOut = 0;
  var checkDataProgressing = false;
  var lastRequest;
  var timeout = 500;
  var requestTimestamp;

  request('/__reactdata/', {get_last_event: true}, function (result)
  {
    lastEvent = result._getLastState;
    // console.log(lastEvent);
    checkData();
  });

  function stopUpdates ()
  {
    if (lastRequest) {
      lastRequest.abort();
    }
    checkDataProgressing = false;
  }

  function checkData (withDrop)
  {
    withDrop || (withDrop = false);
    clearTimeout(lastTimeOut);
    if (withDrop) {
      lastRequest.abort();
      checkDataProgressing = false;
    }
    var url, i, param;
    if ((insertEvents.length || updateEvents.length || removeEvents.length) && !checkDataProgressing) {
      checkDataProgressing = true;
      var arrUrl;
      var data = {check_data: true, __params: {}};
      var hasOwn = Object.prototype.hasOwnProperty;
      for (i in _urls) {
        if (hasOwn.call(_urls, i)) {
          data.__params[_urls[i]] || (data.__params[_urls[i]] = {});
          for (url in _urlsParams) {
            if (hasOwn.call(_urlsParams, url)) {
              for (param in _urlsParams[url]) {
                if (hasOwn.call(_urlsParams[url], param)) {
                  if (typeof _urlsParams[url][param] == 'function') {
                    data.__params[_urls[i]][param] = _urlsParams[url][param]();
                  }
                  else {
                    data.__params[_urls[i]][param] = _urlsParams[url][param];
                  }
                }
              }
            }
          }
        }
      }
      data.__actions = _urls;
      data.__last_event = lastEvent;
      requestTimestamp = new Date().getTime();
      lastRequest = request('/__reactdata/', data, function (result)
      {
        prepareCheckEvents(result);
        checkDataProgressing = false;
        if (new Date().getTime() - requestTimestamp < 3000) {
          timeout = 5000;
        }
        else {
          timeout = 500;
          checkData();
        }
      }, function (response)
      {
        checkDataProgressing = false;
        timeout = 5000;
      });
    }
    lastTimeOut = setTimeout(function ()
    {
      checkData();
    }, timeout);
  }

  function param ($field)
  {
    return document.getElementById('url_param_' + $field).value;
  }

  function clone (obj)
  {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null === obj || "object" !== typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = clone(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  var SF = {
    template: template(),
    request: request,
    send: send,
    listen: listen,
    checkData: checkData,
    param: param,
    clone: clone,
    stopUpdates: stopUpdates
  };

  window.int = function (value)
  {
    value = parseInt(value, 10);
    if (isNaN(value)) {
      value = 0;
    }
    return value;
  };

  window.float = function (value)
  {
    value = parseFloat(value.replace(',', '.'));
    if (isNaN(value)) {
      value = 0;
    }
    return value;
  };

  window.str = function (value)
  {
    if (typeof value.toString === 'function') {
      value = value.toString();
    }
    return value;
  };

  window.length = function (arr)
  {
    return arr && arr.length ? arr.length : 0;
  };

  window.substr = function (value, start, length)
  {
    value = str(value);
    if (!length) {
      return value.substr(start);
    }
    else {
      return value.substr(start, length);
    }
  };

  window.escapeHtml = function(text)
  {
    if (typeof text.toString == 'function') {
      text = text.toString();
    }
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  if (typeof define === 'function' && define.amd) {
    define('SF', [], function ()
    {
      return SF;
    });
  }
  else {
    window.SF = SF;
  }
})(this);
