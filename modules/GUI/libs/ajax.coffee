Promise = require "promise"

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

logicConsts = ["false", "true"]

prepareJsonResponse = (response) ->
  for key of response
    response[key] = !!(logicConsts.indexOf response[key]) if ~logicConsts.indexOf response[key]
    response[key] = parseInt(response[key], 10) if response[key].match? && response[key].match /^\d+$/
    response[key] = prepareJsonResponse response[key] if typeof response[key] == "object"
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

httpGet = (url, data = null) ->
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

httpPost = (url, data) ->
  new Promise (resolve, reject) ->
    req = createXMLHTTPObject()
    req.open "POST", url, true
    req.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    req.setRequestHeader "Accept", "application/json"
    req.setRequestHeader "Content-type", "application/x-www-form-urlencoded; charset=UTF-8"
    req.onreadystatechange = readyStateChange req, resolve, reject
    req.send parsePostData data

httpFile = (url, data) ->
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
    req.setRequestHeader "Accept", "application/json, text/javascript, */*; q=0.01"
    req.onreadystatechange = readyStateChange req, resolve, reject
    req.send formData

parsePostData = (postData, name = "") ->
  str = ''
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

module.exports =
  httpGet: httpGet
  httpPost: httpPost
  httpFile: httpFile
