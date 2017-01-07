timeout = {}
ModelPrototype =
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

  set: (params, currentState = @state) ->
    for key, value of params
      if typeof value is "object" && !(value instanceof Array)
        @set value, @state[key]
      else if value != @state[key]
        currentState[key] = value

      @triggerUpdate key if currentState == @state

  replace: (params) ->
    @state = {}
    for key, value of params
      @state[key] = value
      @triggerUpdate key

Model = ->
  if @ !instanceof Model
    return new Model(arguments...)

  params = arguments[0]

  return (state) ->
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
        if typeof @defaultState == "function"
          @state = @__validateState @defaultState(), response
        else
          @state = response

        @initializedState = true
        @trigger "initialState", @state
    else
      if typeof @defaultState == "function"
        @state = @__validateState @defaultState(), result
      else
        @state = result

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
