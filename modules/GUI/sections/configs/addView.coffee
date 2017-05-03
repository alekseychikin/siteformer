View = require "libs/view.coffee"
Render = require "libs/render"
configsAddTemplate = require "dist/sections/configs/configs-add.tmplt"

createDuplicateRow = (rowRaw) ->
  fakeRow = document.createElement "div"
  fakeRow.className = "form-table__row-fake"
  @position =
    top: rowRaw.getBoundingClientRect().top
    left: rowRaw.getBoundingClientRect().left
  scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0
  @position.top += scrollTop
  @fakeRowHeight = rowRaw.offsetHeight
  tdsRaw = Array.from rowRaw.querySelectorAll ".form-table__cell"

  tdsRaw.forEach (tdRaw) ->
    tdChildsRaw = Array.from tdRaw.childNodes
    fakeCell = document.createElement "div"
    fakeCell.className = "form-table__cell-fake"
    fakeCell.style.width = "#{tdRaw.offsetWidth}px"
    fakeCell.style.height = "#{tdRaw.offsetHeight}px"

    tdChildsRaw.forEach (child) -> fakeCell.appendChild child.cloneNode true

    fakeRow.appendChild fakeCell

  fakeRow.style.left = "#{@position.left}px"
  fakeRow.style.top = "#{@position.top}px"
  document.body.appendChild fakeRow
  @fakeRow = fakeRow

createLine = ->
  @line = document.createElement "div"
  @line.className = "form-table__line"
  document.body.appendChild @line

module.exports = class AddConfigsView extends View
  constructor: (target, model) ->
    super target, model

    @dragging = false
    @fakeRow = null
    @fakeRowHeight = null
    @coords = null
    @line = null
    @position = null
    @rowOffsets = []
    @configsAddRender = Render configsAddTemplate, @contain

  events:
    "click: [data-role='btn-remove-field']": (e) -> @model.removeField @getRowIndex e
    "click: [data-role='btn-add-field']": (e) ->
      @model.addEmptyField()

      setTimeout =>
        @contain.querySelector("[data-role='row-module-fields']:last-child [data-role='field-title']").focus()
      , 50
    "input change keypress: [data-role='field-title']": (e) -> @model.updateFieldTitle (@getRowIndex e), e.target.value
    "input change keypress: [data-role='field-alias']": (e) -> @model.updateFieldAlias (@getRowIndex e), e.target.value
    "change: [data-role='field-type']": (e) -> @model.updateFieldType (@getRowIndex e), e.target.value
    "change: [data-role='field-required']": (e) -> @model.updateFieldRequired (@getRowIndex e), e.target.checked
    "input change keypress: [data-role='configs-add-title']": (e) -> @model.updateTitle e.target.value
    "input change keypress: [data-role='configs-add-alias']": (e) -> @model.updateAlias e.target.value
    "change: [data-role='configs-add-module']": (e) -> @model.updateModule e.target.value
    "click: [data-role='btn-config-field']": "clickBtnConfigField"
    "submit: [data-role='configs-add-form']": "submitConfigsAddForm"
    "mousedown: [data-role='btn-move-row']": "mousedownBtnMoveRow"
    "mousemove: document.body": "mousemoveDocumentBody"
    "mouseup: document.body": "mouseupDocumentBody"
    "click: [data-role='delete']": -> @model.remove()

  render: (state) -> @configsAddRender state

  mousedownBtnMoveRow: (e) ->
    @row = e.target.closest "[data-role='row-module-fields']"

    @currentRowIndex = Number @row.getAttribute "data-key"

    createDuplicateRow.call @, @row

    @dragging = true
    @rowOffsets = []
    rows = Array.from @contain.querySelectorAll "[data-role='row-module-fields']"

    scrollTop = document.body.scrollTop || document.documentElement.scrollTop || 0
    rows.forEach (rowItem) =>
      @rowOffsets.push rowItem.getBoundingClientRect().top + scrollTop

    @row.style.display = "none"

    lastIndex = @rowOffsets.length - 1

    @coords =
      left: e.pageX
      top: e.pageY

    createLine.call @, @row
    @drawLineByIndex @currentRowIndex

  getIndexByCoords: (e) ->
    for offset, index in @rowOffsets
      diff = Math.abs @position.top + (e.pageY - @coords.top) - offset

      if diff <= @fakeRowHeight / 2
        return index

    if @position.top + (e.pageY - @coords.top) - @fakeRowHeight / 2 > offset
      return Infinity
    else
      return 0

  drawLineByIndex: (index) ->
    top = 0

    top = @rowOffsets[index] if index != Infinity

    @line.style.top = "#{top}px"

  mousemoveDocumentBody: (e) ->
    if @dragging
      index = @getIndexByCoords e
      index = @rowOffsets.length if index == Infinity

      @drawLineByIndex index

      @fakeRow.style.left = "#{@position.left + (e.pageX - @coords.left)}px"
      @fakeRow.style.top = "#{@position.top + (e.pageY - @coords.top)}px"

  mouseupDocumentBody: (e) ->
    if @dragging
      index = @getIndexByCoords e
      index = @rowOffsets.length if index == Infinity

      @row.style.display = ""
      @fakeRow.parentNode.removeChild @fakeRow
      @line.parentNode.removeChild @line

      @model.updatePosition @currentRowIndex, index

      @currentRowIndex = null
      @dragging = false
      @fakeRow = null
      @coords = null
      @line = null
      @position = null
      @fakeRowHeight = null
      @rowOffsets.splice(0)

  getRowIndex: (e) ->
    parent = e.target.closest "[data-key]"

    Number parent.getAttribute "data-key"

  clickBtnConfigField: (e) ->
    @trigger "open-configs-modal",
      @getRowIndex e
      @model.getFieldByIndex @getRowIndex e
      @model.getFields()

  submitConfigsAddForm: (e) ->
    @model.save()
    e.preventDefault()
    return false
