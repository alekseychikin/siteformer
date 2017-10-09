timeout = {}

class Model
  constructor: (state = {}) ->
    @events = {}
    @views = []
    @state = state

  on: (eventName, callback) ->
    @events[eventName] = [] if !@events[eventName]?
    @events[eventName].push callback

  addRenderListener: (view) ->
    @views.push view

  triggerUpdate: (elementPath) ->
    if timeout[elementPath]
      clearTimeout timeout[elementPath]
      delete timeout[elementPath]
    timeout[elementPath] = setTimeout =>
      @trigger elementPath, @state[elementPath]
    , 1

  render: ->
    for view in @views
      if typeof view.render == "function"
        view.render.call view, @state

  trigger: (eventName, values...) ->
    @render()

    if @events[eventName]
      for event in @events[eventName]
        event.apply null, values

  set: (params, currentState = @state) ->
    for key, value of params
      if typeof value is "object" && !(value instanceof Array)
        @set value, @state[key]
      else if value != @state[key]
        currentState[key] = value

      @triggerUpdate key if currentState == @state

  replace: (params) ->
    @state = Object.assign {}, params

    @triggerUpdate "state"

module.exports = Model
