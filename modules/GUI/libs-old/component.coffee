module.exports = class Component
  constructor: ->
    @bindedLiveEventsHandler = @liveEventsHandler.bind @
    @lclEvents = {}
    @lclLiveEvents = {}

    if @events
      for event, cb of @events
        do (event, cb) =>
          event = event.split ":"
          selector = event[1].replace /\s*(.*)\s*/g, "$1"
          event = event[0].replace /\s*(.*)\s*/g, "$1"
          events = event.split " "

          @addEvent selector, events, cb

  addEvent: (selector, events, handler) ->
    target = null

    switch selector
      when "window" then target = window
      when "document.body" then target = document.body
      when "document" then target = document

    bindedHandler = handler.bind @

    if target
      console.log "Add event `#{event}` at `#{selector}`" if @debug
      @lclEvents[selector] = [] if !@lclEvents[selector]
      @lclEvents[selector].push
        events: events
        element: target
        handler: bindedHandler
      for event in events
        target.addEventListener event, bindedHandler
    else if selector == "contain"
      for event in events
        document.body.addEventListener event, @bindedLiveEventsHandler if !@lclLiveEvents[event]
        @lclLiveEvents[event] = [] if !@lclLiveEvents[event]
        @lclLiveEvents[event].push
          selector: @selector
          handler: bindedHandler
        console.log @lclLiveEvents
    else
      for event in events
        document.body.addEventListener event, @bindedLiveEventsHandler if !@lclLiveEvents[event]
        @lclLiveEvents[event] = [] if !@lclLiveEvents[event]
        @lclLiveEvents[event].push
          selector: "#{@selector} #{selector}"
          handler: bindedHandler

  liveEventsHandler: (e) ->
    for event in @lclLiveEvents[e.type]
      if (e.target.matches event.selector) || (e.target.closest event.selector)
        e.selectorTarget = if e.target.matches event.selector then e.target else e.target.closest event.selector
        event.handler e
