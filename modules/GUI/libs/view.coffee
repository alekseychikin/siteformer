$ = require "jquery-plugins.coffee"
$window = ($ window)
$body = ($ document.body)
$document = ($ document)

pathTimeout = null

module.exports = class View
  constructor: (target, model) ->
    @cachedEvents = []
    @contain = target
    @model = model

    @__initial()
    self = @
    @extEvents = []

    if @model
      @model.addRenderListener @

  destroy: ->
    if @events && @contain
      for item in @cachedEvents
        if item.selector
          @contain.off item.event, item.selector, item.callback
        else if item.target
          item.target.off item.event, item.callback

      @cachedEvents.splice(0)

  generateEvent: (event, selector, cb, target = null) ->
    self = @
    ->
      console.log "Event `#{event}` at `#{selector}`" if self.debug
      if target
        arguments[0].target = target
      else
        arguments[0].target = @
      cb.apply self, arguments

  cacheEvent: (event, selector, cb, target = null) ->
    callback = @generateEvent event, selector, cb, target
    element =
      event: event,
      callback: callback
    if target then element.target = target else element.selector = selector
    @cachedEvents.push element
    callback

  addEvent: (selector, event, cb) ->
    target = null
    switch selector
      when "window" then target = window
      when "document.body" then target = document.body
      when "document" then target = document
      when "contain" then target = @contain
    if target
      console.log "Add event `#{event}` at `#{selector}`" if @debug
      callback = @cacheEvent event, selector, cb, target
      $(target).on event, callback
    else
      if @debug
        console.log "Add event `#{event}` at `#{selector}` (#{(@contain.find selector).length} selectors)"

      callback = @cacheEvent event, selector, cb
      @contain.on event, selector, callback

  __initial: (params = null) ->
    self = @
    console.error "There are events without contain" if @events && !@contain && @debug
    if @events && @contain
      for event, cb of @events
        do (event, cb) =>
          event = event.split ":"
          selector = event[1].replace /\s*(.*)\s*/g, "$1"
          event = event[0].replace /\s*(.*)\s*/g, "$1"
          if typeof cb != "function" && !@[cb]
            console.error "#{cb} does not exists at", @
            cb = null
          if typeof cb != "function" && typeof @[cb] == "function"
            cb = @[cb]
          if cb
            @addEvent selector, event, cb
    console.warn "There is initial without contain" if @initial && !@contain && @debug
    if @initial && @contain
      @initial.apply @, params

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
