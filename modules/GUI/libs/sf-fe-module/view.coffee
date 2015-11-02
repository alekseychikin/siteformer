$ = require "../jquery-plugins.coffee"
$window = ($ window)
$body = ($ document.body)
$document = ($ document)
viewPrototype =
  hasChanges: (element, field) ->
    if !element.__renderCache? then element.__renderCache = {}

    if element.__renderCache[field] != element[field]
      element.__renderCache[field] = element[field]
      console.log "Field `#{field}` has changes: `#{element[field]}`" if @debug
      return true
    return false

  renderArray: (data, template, contain, updatecb) ->
    if data.__deletedElements?
      for item in data.__deletedElements
        if item.__renderElement
          ($ item.__renderElement).remove()
      data.__deletedElements.splice 0
    prevElement = false
    contain = (@contain.find contain)
    for item in data
      if !item.__renderElement
        item.__renderElement = $ SF.template template, item
        if !prevElement
          contain.prepend item.__renderElement
        else
          item.__renderElement.insertAfter prevElement
        prevElement = item.__renderElement
      else
        prevElement = item.__renderElement
        if typeof updatecb == "function"
          updatecb item

  bind: ($target, params...) ->
    @contain = $target
    @__initial params
    if @model?
      @model.initial.apply @model, params
  unbind: ->
    if @events && @contain
      for event, cb of @events
        do (event, cb) =>
          event = event.split ":"
          selector = event[1].replace /\s*(.*)\s*/g, "$1"
          event = event[0].replace /\s*(.*)\s*/g, "$1"
          @contain.off event, selector
  debug: false
  __initial: (params = null) ->
    self = @
    console.error "There are events without contain" if @events && !@contain && @debug
    if @events && @contain
      for event, cb of @events
        do (event, cb) =>
          event = event.split ":"
          selector = event[1].replace /\s*(.*)\s*/g, "$1"
          event = event[0].replace /\s*(.*)\s*/g, "$1"
          if !self[cb]
            console.error "#{cb} does not exists at", self
          else
            if selector == "window"
              console.log "Add event `#{event}` at `window`" if @debug
              $window.on event, ->
                arguments[0].target = window
                self[cb].apply self, arguments
            else if selector == "document.body"
              console.log "Add event `#{event}` at `document.body`" if @debug
              $body.on event, ->
                arguments[0].target = document.body
                self[cb].apply self, arguments
            else if selector == "document"
              console.log "Add event `#{event}` at `document`" if @debug
              $document.on event, ->
                arguments[0].target = document
                self[cb].apply self, arguments
            else
              if (selector.indexOf "@@") != -1
                console.log "Add event `#{event}` at `#{selector.substr(1)}`" if @debug
                console.log "Selector not found" if @debug and !(@contain.find selector.substr(1)).length
                (@contain.find selector.substr(1)).on event, ->
                  arguments[0].target = this
                  self[cb].apply self, arguments
              else
                console.log "Add event `#{event}` at `#{selector}` (#{(@contain.find selector).length} selectors)" if @debug
                console.log "Selector not found" if @debug && !@contain.length
                @contain.on event, selector, ->
                  console.log "Event `#{event}` at `#{selector}`" if self.debug
                  arguments[0].target = this
                  self[cb].apply self, arguments
    console.error "There are elements without contain" if @elements && !@contain && @debug
    if @elements && @contain
      for $element in @elements
        selector = $element
        .split /[^a-zA-Z0-9]/
        .filter (value) -> value.length
        .map (value, index) ->
          if index then (value.substr 0, 1).toUpperCase() + (value.substr 1) else value
        .join ""
        @[selector] = @contain.find $element
        console.log "Cached selector `#{$element}` (#{@[selector].length} items)" if @debug
    console.error "There is initial without contain" if @initial && !@contain && @debug
    if @initial && @contain
      @initial.apply @, params


view = (params) ->
  if @ !instanceof view
    return new view(params)
  for field, item of params
    do (field, item) =>
      @[field] = item
  # if @events && !@contain
  #   console.error "There is events and no contain"
  #   return false
  # if @watchers && !@model
  #   console.error "There is watchers and no model"
  #   return false
  @__initial()
  self = @
  console.error "There are watchers without contain" if @watchers && !@model && @debug
  if @model
    @model.addRenderListener @
    @model.triggerInitialTriggers()
  if @watchers && @model
    for event, cb of @watchers
      do (event, cb) =>
        if typeof cb != "function" && typeof self[cb] == "undefined"
          console.error "#{cb} does not exists at", self
        else
          @model.on event, =>
            if typeof cb == "function"
              cb.apply @, arguments
            else
              self[cb].apply @, arguments
    @model.triggerInitialTriggers()
  return @

view.prototype = viewPrototype

module.exports = view
