module.exports.skipEmptyQuery = (value) -> new Promise (resolve, reject) ->
  resolve value if value
  reject() if !value

lastQueries = {}
throttleTimeout = false
throttleTimeoutResolve = false

module.exports.skipLastQuery = (collection) -> (query) -> new Promise (resolve, reject) ->
  lastQueries[collection] = "" if !lastQueries[collection]?

  if lastQueries[collection] != query
    lastQueries[collection] = query
    resolve query

timeoutHandler = (resolve, query) ->
  ->
    clearTimeout throttleTimeout
    throttleTimeout = false
    resolve query

module.exports.throttle = (timeout) -> (query) -> new Promise (resolve, reject) ->
  resolve query if !throttleTimeoutResolve
  clearTimeout throttleTimeoutResolve if throttleTimeoutResolve

  if !throttleTimeout
    throttleTimeout = setTimeout timeoutHandler(resolve, query), timeout
  throttleTimeoutResolve = setTimeout timeoutHandler(resolve, query), timeout

module.exports.emmitEvent = (eventName, element, params = {}) ->
  event = document.createEvent "Event"
  event.initEvent eventName, true, true
  event[index] = value for index, value of params
  element.dispatchEvent event

cloneObject = (obj, cachedElements = []) ->
  copy = null

  if null == obj || "object" != typeof obj
    return obj

  if obj instanceof Date
    copy = new Date()
    copy.setTime obj.getTime()
    return copy

  if (cachedElements.indexOf obj) == -1
    cachedElements.push obj
    if obj instanceof Array
      copy = []
      for elem, i in obj
        copy[i] = cloneObject elem, cachedElements
      return copy

    if obj instanceof Object
      copy = {}
      for i, attr of obj
        copy[i] = cloneObject attr, cachedElements
      return copy
  else
    return "*RECURSION*"

  throw new Error "Unable to copy obj! Its type isn't supported."

module.exports.cloneObject = cloneObject

logicConsts = ["false", "true"]

prepareJsonResponse = (response, isFirst = true) ->
  return {} if response instanceof Array and !response.length and isFirst

  for key of response
    if response[key]
      response[key] = !!(logicConsts.indexOf response[key]) if ~logicConsts.indexOf response[key]
      response[key] = parseInt(response[key], 10) if response[key].match? && response[key].match /^\d+$/
      response[key] = prepareJsonResponse response[key], false if typeof response[key] == "object"
  response

readyStateChange = (req, resolve, reject) ->
  ->
    if req.readyState != 4 then return false

    result = false

    try
      if req.responseText.length
        result = prepareJsonResponse JSON.parse req.responseText
    catch e
      result = req.responseText
    if req.status != 200 && req.status != 304
      reject result
    else
      resolve result
    req = null

module.exports.httpGet = (url, data = null) ->
  new Promise (resolve, reject) ->
    req = createXMLHTTPObject()
    if data?
      url += "?" + parsePostData data
    req.open "GET", url, true
    req.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    req.setRequestHeader "Accept", "application/json"
    req.setRequestHeader "Content-type", "application/x-www-form-urlencoded; charset=UTF-8"
    req.onreadystatechange = readyStateChange req, resolve, reject
    req.send()

module.exports.httpPost = (url, data) ->
  new Promise (resolve, reject) ->
    req = createXMLHTTPObject()
    req.open "POST", url, true
    req.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    req.setRequestHeader "Accept", "application/json"
    req.setRequestHeader "Content-type", "application/x-www-form-urlencoded; charset=UTF-8"
    req.onreadystatechange = readyStateChange req, resolve, reject
    req.send parsePostData data

module.exports.httpFile = (url, data) ->
  new Promise (resolve, reject) ->
    if window.FormData
      formData = new FormData()
      for field, input of data
        if input.getAttribute("type").toLowerCase() == "file"
          for file, i in input.files
            formData.append "#{field}[#{i}]", file
    else
      console.error "not supporting FormData"

    req = createXMLHTTPObject()
    req.open "POST", url, true
    req.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    req.setRequestHeader "Accept", "application/json"
    req.onreadystatechange = readyStateChange req, resolve, reject
    req.send formData

parsePostData = (postData, name = "") ->
  str = ""

  if typeof postData in ["string", "number", "boolean"]
    return "#{name}=#{encodeURIComponent postData}"
  else if postData instanceof Array
    data = []
    for attr, i in postData
      data.push parsePostData attr, (if name.length then "#{name}[#{i}]" else i)
    return data.join "&"
  else if typeof postData == "object"
    data = []
    for i, attr of postData
      if !(Object.prototype.hasOwnProperty.call postData, i) then continue
      data.push parsePostData attr, (if name.length then "#{name}[#{i}]" else i)
    return data.join "&"

createXMLHTTPObject = ->
  XMLHttpFactories = [
    -> new XMLHttpRequest()
    -> new ActiveXObject "Msxml2.XMLHTTP"
    -> new ActiveXObject "Msxml3.XMLHTTP"
    -> new ActiveXObject "Microsoft.XMLHTTP"
  ]
  xmlhttp = false
  for i in [0..XMLHttpFactories.length]
    try
      xmlhttp = XMLHttpFactories[i]()
    catch e
      continue
    break
  xmlhttp

class Graph
  constructor: ->
    @type = "get"
    @getData = {}
    @postData = {}

  get: (data) ->
    @getData = data
    @

  post: (data) ->
    @postData = data
    @type = "post"
    @

  send: ->
    url = "/index.php?graph=#{encodeURIComponent(JSON.stringify(@getData))}"

    if @type == "get"
      module.exports.httpFile url
    else if @type == "post"
      params = {}

      for model of @postData
        params[model] = JSON.stringify @postData[model]
      module.exports.httpPost url, params

module.exports.graph =
  get: (data) ->
    xhr = new Graph
    xhr.get data
    xhr
  post: (data) ->
    xhr = new Graph
    xhr.post data
    xhr
