$ = require "jquery-plugins.coffee"
$window = ($ window)
$body = ($ document.body)
$document = ($ document)

pathTimeout = null

ViewPrototype =
  debug: false

  destroy: ->
    if @events && @contain
      for item in @cachedEvents
        if item.selector
          @contain.off item.event, item.selector, item.callback
        else if item.target
          item.target.off item.event, item.callback

  generateEvent: (event, selector, cb, target = null) ->
    self = @
    ->
      console.log "Event `#{event}` at `#{selector}`" if self.debug
      if target
        arguments[0].target = target
      else
        arguments[0].target = this
      cb.apply self, arguments

  cacheEvent: (event, selector, cb, target = null) ->
    callback = @generateEvent event, selector, cb, target
    element =
      event: event,
      callback: callback
    if target then element.target = target else element.selector = selector
    @cachedEvents.push element
    callback

  addEvent: (selector, event, cb)->
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
      console.log "Add event `#{event}` at `#{selector}` (#{(@contain.find selector).length} selectors)" if @debug
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

  frequency: (time, cb) ->
    if pathTimeout
      clearTimeout pathTimeout
      pathTimeout = null
    else
      cb.call @
    pathTimeout = setTimeout =>
      cb.call @
      pathTimeout = null
    , time


View = ->
  if @ !instanceof View
    return new View(arguments...)

  params = arguments[0]

  if params.contain
    return new ViewItem params, params.contain, params.model
  return (target, model) ->
    return new ViewItem params, target, model

ViewItem = (params, target, model) ->
  if @ !instanceof ViewItem
    return new ViewItem(arguments...)

  @cachedEvents = []
  @contain = target
  @model = model
  for field, item of params
    do (field, item) =>
      @[field] = item

  @__initial()
  self = @
  console.error "There are watchers without contain" if @watchers && !@model && @debug
  @extEvents = []
  if @model
    @model.addRenderListener @
    @model.triggerInitialTriggers()
  return @

ViewItem.prototype = ViewPrototype

module.exports = View
