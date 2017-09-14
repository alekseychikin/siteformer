View = require "libs/view.coffee"
Render = require "libs/render"
itemTemplate = require "dist/types/tags/item.tmplt"

module.exports = class TagsDataView extends View
  constructor: (target, model) ->
    super target, model

    @templateRender = Render itemTemplate, @contain
    @input = @contain.querySelector "[data-role='tags']"


  events:
    "change input keyup click: [data-role='tags']": (e) ->
      @model.setSelection @input.selectionStart, @input.selectionEnd

      if e.keyCode == 27 then @model.emptySearch() else @model.update e.target.value

    "click: [data-role='suggest-item']": (e) ->
      @model.setTag
        title: e.target.getAttribute "data-title"
        id: Number e.target.getAttribute "data-id"

      setTimeout =>
        @input.focus()
      , 20

  render: (state) -> @templateRender state
