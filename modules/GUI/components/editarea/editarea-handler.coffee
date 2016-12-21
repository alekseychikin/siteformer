emmitEvent = require("helpers.coffee").emmitEvent

editAreaSelector = ".editarea"

cachedEditAreas = []

class EditArea
  constructor: (element) ->
    @element = element
    @area = @element.querySelector ".editarea__input"
    @buttons = Array.from @element.querySelectorAll ".editarea__button"
    @buttonClickHandlerCtx = @buttonClickHandler.bind @
    @buttons.forEach @bindButtonClick, @

  bindButtonClick: (button) ->
    button.addEventListener "click", @buttonClickHandlerCtx

  unbindButtonClick: (button) ->
    button.removeEventListener "click", @buttonClickHandlerCtx

  buttonClickHandler: (event) ->
    @["#{event.target.dataset.handler}Handler"](event)
    emmitEvent "change", @area

  header2Handler: -> @pasteDoubleTag "h2"

  header3Handler: -> @pasteDoubleTag "h3"

  boldHandler: -> @pasteDoubleTag "b"

  italicHandler: -> @pasteDoubleTag "i"

  spanHandler: -> @pasteDoubleTag "span"

  paragraphHandler: -> @pasteDoubleTag "p"

  abbrHandler: -> @pasteDoubleTag "abbr"

  cutHandler: -> @pasteSingleTag "cut"

  ulHandler: -> @pasteDoubleTag "ul"

  olHandler: -> @pasteDoubleTag "ol"

  liHandler: -> @pasteDoubleTag "li"

  linkHandler: -> @pasteDoubleTag "a", href: ""

  imgHandler: -> @pasteSingleTag "img", {src: "", alt: ""}

  typographHandler: ->
    console.log "Add typograph!"

  pasteSingleTag: (tagName, attrs = {}) ->
    value = @area.value
    preText = value.substr 0, @area.selectionStart
    postText = value.substr @area.selectionEnd
    attrsString = @prepareAttrs attrs
    @area.value = "#{preText}<#{tagName}#{attrsString} />#{postText}"
    @focus preText.length + attrsString.length + tagName.length + 4

  pasteDoubleTag: (tagName, attrs = {}) ->
    value = @area.value
    preText = value.substr 0, @area.selectionStart
    middleText = value.substring @area.selectionStart, @area.selectionEnd
    postText = value.substr @area.selectionEnd
    attrsString = @prepareAttrs attrs
    @area.value = "#{preText}<#{tagName}#{attrsString}>#{middleText}</#{tagName}>#{postText}"
    @focus preText.length + attrsString.length + tagName.length + middleText.length + 2

  prepareAttrs: (attrs = {}) ->
    attrsArr = []
    attrsArr.push " #{name}=\"#{value}\"" for name, value of attrs
    attrsArr.join ""

  focus: (length) ->
    @area.selectionStart = length
    @area.selectionEnd = @area.selectionStart
    @area.focus()

  destroy: ->
    @buttons.forEach @unbindButtonClick, @
    @element = null
    @area = null
    @buttons = null
    @buttonClickHandlerCtx = null

createEditAreaInstanse = (element) ->
  inst = new EditArea element

  cachedEditAreas.push inst: inst, element: element

destroyEditArea = (element) ->
  index = -1
  cachedEditAreas.filter (inst, i) -> index = i if inst.element == element

  if ~index
    cachedEditAreas[index].inst.destroy()
    cachedEditAreas.splice index, 1

elements = Array.from document.querySelectorAll editAreaSelector
elements.forEach createEditAreaInstanse

observer = new MutationObserver (mutations) ->
  mutations.forEach (mutation) ->
    if mutation.type == "childList"
      mutation.addedNodes.forEach (element) ->
        if element.nodeType == 1 && element.matches editAreaSelector
          setTimeout (createEditAreaInstanse element), 100
      mutation.removedNodes.forEach (element) ->
        if element.nodeType == 1 && element.matches editAreaSelector
          setTimeout (destroyEditArea element), 100

config = attributes: true, childList: true, characterData: true, subtree: true

observer.observe document.body, config
