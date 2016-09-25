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
ModelPrototype =
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

  addRenderListener: (view) ->
    @views.push view
    if @initializedState
      @trigger "initialState", @state

  triggerUpdate: (elementPath) ->
    if timeout[elementPath]
      clearTimeout timeout[elementPath]
      delete timeout[elementPath]
    timeout[elementPath] = setTimeout =>
      @trigger elementPath, @state[elementPath]
    , 1

  __validateState: (defaultState, state) ->
    for key of defaultState
      state[key] = defaultState[key] unless state[key]?

    state

  set: (params) ->
    for key, value of params
      if typeof value is not 'object' || value != @state[key]
        @state[key] = value
        @triggerUpdate key

  replace: (params) ->
    @state = {}
    for key, value of params
      @state[key] = value
      @triggerUpdate key

Model = ->
  if @ !instanceof Model
    return new Model(arguments...)

  params = arguments[0]

  return (state) =>
    return new ModelItem params, state

ModelItem = (params, state) ->
  if @ !instanceof ModelItem
    return new ModelItem(arguments...)

  @doRecordInitialTriggers = false
  @initialTriggers = []
  @events = {}
  @views = []
  @state = {}
  @initializedState = false

  for field, item of params
    do (field, item) =>
      @[field] = item

  if state?
    @state = if typeof @defaultState == "function" then (@__validateState @defaultState(), state) else state
    @initializedState = true
    @trigger "initialState", @state
  else if typeof @initialState == "function"
    result = @initialState()
    if typeof result.then == "function"
      result.then (response) =>
        @state = if typeof @defaultState == "function" then (@__validateState @defaultState(), response) else response
        @initializedState = true
        @trigger "initialState", @state
    else
      @state = if typeof @defaultState == "function" then (@__validateState @defaultState(), result) else result
      @initializedState = true
      @trigger "initialState", @state

  if @initial && (!@autoInit? || @autoInit == true)
    @doRecordInitialTriggers = true
    @initial.call @
    @doRecordInitialTriggers = false
    @trigger "initial"
  return @


ModelItem.prototype = ModelPrototype

module.exports = Model
