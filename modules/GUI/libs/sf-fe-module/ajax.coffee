Q = require "q"

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

httpGet = (url) ->
  Q.Promise (resolve, reject) ->
    req = createXMLHTTPObject()
    req.open "GET", url, true
    req.setRequestHeader "X-Requested-With", "XMLHttpRequest"
    req.setRequestHeader "Accept", "application/json, text/javascript, */*; q=0.01"
    req.onreadystatechange = ->
      if req.readyState != 4 then return false
      result = false
      try
        if req.responseText.length
          result = JSON.parse req.responseText
      catch e
        result = req.responseText
      if req.status != 200 && req.status != 304
        reject result
      else
        resolve result
      req = null
    req.send()

parsePostData = (postData, name) ->
  str = ''
  if typeof postData in ["string", "number", "boolean"]
    return "#{name}=#{postData}"
  else if postData instanceof Array
    data = []
    for i in postData
      if !(Object.prototype.hasOwnProperty.call postData, i) then continue
      data.push parsePostData postData[i], if name then name + "[#{i}]" else i
    return data.join "&"
  else if typeof postData == "object"
    data = []
    for i in postData
      if !(Object.prototype.hasOwnProperty.call postData, i) then continue
      data.push parsePostData postData[i], if name then name + "[#{i}]" else i
    return data.join "&"

module.exports =
  httpGet: httpGet
