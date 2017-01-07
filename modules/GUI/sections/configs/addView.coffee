$ = require "jquery-plugins.coffee"
View = require "view.coffee"
Render = require "render"
Popup = require "popup"
configsAddTemplate = require "sections/configs/configs-add"
$body = $ document.body

createDuplicateRow = ($rowRaw) ->
  $fakeRow = $ "<div class='form-table__row-fake'></div>"
  @position = $rowRaw.offset()
  @fakeRowHeight = $rowRaw.height()
  $tdsRaw = $rowRaw.find ".form-table__cell"

  $tdsRaw.each ->
    $tdRaw = $ @
    $tdChildsRaw = $ @childNodes
    $fakeCell = $ "<div class='form-table__cell-fake'></div>"
    $fakeCell.css
      width: "#{$tdRaw.width()}px"
      height: "#{$tdRaw.height()}px"

    $tdChildsRaw.each ->
      $clone = $ @cloneNode true
      $fakeCell.append $clone

    $fakeRow.append $fakeCell

  $fakeRow.css
    left: "#{@position.left}px"
    top: "#{@position.top}px"
  $body.append $fakeRow
  @fakeRow = $fakeRow

createLine = ->
  @line = $ "<div class='form-table__line'></div>"
  $body.append @line

module.exports = View
  initial: ->
    @dragging = false
    @fakeRow = null
    @fakeRowHeight = null
    @coords = null
    @line = null
    @position = null
    @rowOffsets = []
    console.log @contain
    @configsAddRender = Render configsAddTemplate, @contain[0]

  events:
    "click: @btn-remove-field": (e) -> @model.removeField @getRowIndex e
    "click: @btn-add-field": (e) ->
      @model.addEmptyField()

      setTimeout =>
        @contain.find("@row-module-fields:last-child @field-title").focus()
      , 50
    "input change keypress: @field-title": (e) -> @model.updateFieldTitle (@getRowIndex e), e.target.value
    "input change keypress: @field-alias": (e) -> @model.updateFieldAlias (@getRowIndex e), e.target.value
    "change: @field-type": (e) -> @model.updateFieldType (@getRowIndex e), e.target.value
    "change: [data-role='field-required']": (e) -> @model.updateFieldRequired (@getRowIndex e), Number e.target.checked
    "input change keypress: @configs-add-title": (e) -> @model.updateTitle e.target.value
    "input change keypress: @configs-add-alias": (e) -> @model.updateAlias e.target.value
    "change: @configs-add-module": (e) -> @model.updateModule e.target.value
    "click: @btn-config-field": "clickBtnConfigField"
    "submit: @configs-add-form": "submitConfigsAddForm"
    "mousedown: @btn-move-row": "mousedownBtnMoveRow"
    "mousemove: document.body": "mousemoveDocumentBody"
    "mouseup: document.body": "mouseupDocumentBody"
    "click: [data-role='delete']": -> @model.remove()

  render: (state) -> @configsAddRender state

  mousedownBtnMoveRow: (e) ->
    $btn = $ e.target
    @$row = $btn.closest "@row-module-fields"

    @currentRowIndex = parseInt @$row.data("key"), 10

    createDuplicateRow.call @, @$row

    @dragging = true
    @rowOffsets = []
    $rows = @contain.find "@row-module-fields"

    $rows.each (index, element) =>
      $rowItem = $ element
      @rowOffsets.push $rowItem.offset().top

    @$row.css display: "none"

    lastIndex = @rowOffsets.length - 1

    @coords =
      left: e.pageX
      top: e.pageY

    createLine.call @, @$row
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

    @line.css
      top: "#{top}px"

  mousemoveDocumentBody: (e) ->
    if @dragging
      index = @getIndexByCoords e
      index = @rowOffsets.length if index == Infinity

      @drawLineByIndex index

      @fakeRow.css
        left: "#{@position.left + (e.pageX - @coords.left)}px"
        top: "#{@position.top + (e.pageY - @coords.top)}px"

  mouseupDocumentBody: (e) ->
    if @dragging
      index = @getIndexByCoords e
      index = @rowOffsets.length if index == Infinity

      @$row.css display: ""
      @fakeRow.remove()
      @line.remove()

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
    $parent = ($ e.target).closest "[data-key]"

    Number($parent.data "key")

  clickBtnConfigField: (e) ->
    @trigger "open-configs-modal",
      @getRowIndex e
      @model.getFieldByIndex @getRowIndex e
      @model.getFields()

  submitConfigsAddForm: (e) ->
    @model.save()
    e.preventDefault()
    return false
