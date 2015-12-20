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

cachedModels = {}

timeout = {}
modelPrototype =
  clone: (obj, cachedElements = []) ->
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
          copy[i] = @clone elem, cachedElements
        return copy

      if obj instanceof Object
        copy = {}
        for i, attr of obj
          copy[i] = @clone attr, cachedElements
        return copy
    else
      return "*RECURSION*"

    throw new Error "Unable to copy obj! Its type isn't supported."

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
      for view in @views
        if typeof view.render == "function"
          view.render.call view, @state
      if @events[eventName]
        for event in @events[eventName]
          event.apply null, values

  on: (eventName, callback) ->
    @events[eventName] = [] if !@events[eventName]?
    @events[eventName].push callback

  addRenderListener: (view) -> @views.push view

  triggerUpdate: (elementPath) ->
    if timeout[elementPath]
      clearTimeout timeout[elementPath]
      delete timeout[elementPath]
    timeout[elementPath] = setTimeout =>
      @trigger elementPath, @state[elementPath]
    , 1

  set: (params) ->
    for key, value of params
      @state[key] = value
      @triggerUpdate key
  replace: (params) ->
    @state = {}
    for key, value of params
      @state[key] = value
      @triggerUpdate key

  bind: (state) ->
    @state = state
    @trigger "initialState", @state

model = ->
  if @ !instanceof model
    return new model(arguments...)

  modelName = null
  if arguments.length == 1
    params = arguments[0]
  else if arguments.length > 1
    modelName = arguments[0]
    params = arguments[1]

  if modelName && cachedModels[modelName]
    return cachedModels[modelName]

  if modelName then @_name = modelName

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
  if modelName then cachedModels[modelName] = @
  return @

model.prototype = modelPrototype

module.exports = model
