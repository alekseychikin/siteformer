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
