getElement = (root, params) ->
  i = 0
  value = params
  elementPath = null
  while typeof value == "object" || value instanceof Array && i < 10
    for key, value of value
      console.log "key", key
      console.log "value", value
      break
    if !elementPath
      elementPath = key
    root = root[key]
    i++
  [root, value, elementPath]
  # elementPath = elementPath.split /[\.\[\]]/
  # .filter (value) ->
  #   value.length
  # element = root
  # lastPath = elementPath.pop()
  # for path in elementPath
  #   element = element[path]
  # elementPath.push lastPath if !elementPath.length
  # [element, lastPath, elementPath]
  # [false, false]

timeout = {}
modelPrototype =
  triggerInitialTriggers: ->
    for event in @initialTriggers
      params = [event.eventName]
      for value in event.values
        params.push value
      @trigger.apply @, params

  trigger: (eventName, values...) ->
    if @doRecordInitialTriggers
      @initialTriggers.push
        eventName: eventName
        values: values
    else
      upperEventName = "render#{(eventName.substr 0, 1).toUpperCase()}"
      upperEventName += eventName.substr 1
      for view in @views
        if typeof view[upperEventName] == "function"
          view[upperEventName].call view, @state
      if @events[eventName]
        for event in @events[eventName]
          event.apply view, values

  on: (eventName, callback) ->
    @events[eventName] = [] if !@events[eventName]?
    @events[eventName].push callback

  addRenderListener: (view) ->
    @views.push view

  triggerUpdate: (elementPath) ->
    # elementPath = elementPath[0]
    if timeout[elementPath]
      clearTimeout timeout[elementPath]
      delete timeout[elementPath]
    timeout[elementPath] = setTimeout =>
      @trigger elementPath, @state[elementPath]
    , 1

  set: (params) ->
    # [element, lastPath, elementPath] = getElement @, params
    # console.log element
    for key, value of params
      @state[key] = value
      @triggerUpdate key

  clone: (value) ->
    delete value.__renderCache
    value.__renderCache = SF.clone value
    return SF.clone value

model = (params) ->
  if @ !instanceof model
    return new model(params)
  @doRecordInitialTriggers = false
  @initialTriggers = []
  @events = {}
  @views = []
  @state = {}
  for field, item of params
    do (field, item) =>
      @[field] = item
  if @initial && (!@autoInit? || @autoInit == true)
    @doRecordInitialTriggers = true
    @initial.call @
    @doRecordInitialTriggers = false
    @trigger "initial"
  if typeof @initialState == "function"
    result = @initialState()
    if typeof result.then == "function"
      result.then (response) =>
        @state = response
        @trigger "initialState", @state
    else
      @state = result
      @trigger "initialState", @state
  return @

model.prototype = modelPrototype

module.exports = model
