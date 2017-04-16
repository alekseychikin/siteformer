pathTimeout = null

module.exports = class View
  constructor: (target, model) ->
    @cachedEvents = []
    @contain = target
    @model = model

    @extEvents = []
    @lclEvents = {}
    @lclLiveEvents = {}
    @bindedLiveEventsHandler = @liveEventsHandler.bind @

    if @events && @contain
      for event, cb of @events
        do (event, cb) =>
          event = event.split ":"
          selector = event[1].replace /\s*(.*)\s*/g, "$1"
          event = event[0].replace /\s*(.*)\s*/g, "$1"
          events = event.split " "
          if typeof cb != "function" && !@[cb]
            console.error "#{cb} does not exists at", @
            cb = null
          if typeof cb != "function" && typeof @[cb] == "function"
            cb = @[cb]
          if cb
            @addEvent selector, events, cb

    @model.addRenderListener @ if @model

  destroy: ->
    for selector, items of @lclEvents
      for item in items
        for event in item.events
          item.element.removeEventListener event, item.handler
    for event, items of @lclLiveEvents
      @contain.removeEventListener event, @bindedLiveEventsHandler

    @lclLiveEvents = null
    @lclEvents = null
    @extEvents = null

  addEvent: (selector, events, handler) ->
    target = null

    switch selector
      when "window" then target = window
      when "document.body" then target = document.body
      when "document" then target = document
      when "contain" then target = @contain

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
    else
      if @debug
        console.log "Add event `#{event}` at `#{selector}` (#{(@contain.querySelectorAll selector).length} selectors)"

      for event in events
        @contain.addEventListener event, @bindedLiveEventsHandler if !@lclLiveEvents[event]
        @lclLiveEvents[event] = [] if !@lclLiveEvents[event]
        @lclLiveEvents[event].push
          selector: selector
          handler: bindedHandler

  liveEventsHandler: (e) ->
    for event in @lclLiveEvents[e.type]
      if e.target.matches event.selector || e.target.closest event.selector
        event.handler e

  on: (eventName, callback) ->
    @extEvents[eventName] = [] if !@extEvents[eventName]?
    @extEvents[eventName].push callback

  trigger: (eventName, values...) ->
    if @extEvents[eventName]
      for event in @extEvents[eventName]
        event.apply @, values

  throttling: (time, cb) ->
    if pathTimeout
      clearTimeout pathTimeout
      pathTimeout = null
    else
      cb.call @
    pathTimeout = setTimeout =>
      cb.call @
      pathTimeout = null
    , time
