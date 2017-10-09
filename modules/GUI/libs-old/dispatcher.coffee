class Dispatcher
  constructor: ->
    @listeners = {}

  on: (event, handler) ->
    @listeners[event] = [] if !@listeners[event]
    @listeners[event].push handler

  action: (event, action) ->
    if @listeners[event]
      for handler in @listeners[event]
        handler action

module.exports = new Dispatcher
