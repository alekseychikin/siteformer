View = require "view.coffee"
Render = require "render"
itemTemplate = require "types/tags/item"

module.exports = View
  initial: ->
    @templateRender = Render itemTemplate, @contain[0]
    @input = @contain.find("[data-role='tags']")

  events:
    "change input keyup click: [data-role='tags']": (e) ->
      @model.setSelection @input[0].selectionStart, @input[0].selectionEnd

      if e.keyCode == 27 then @model.emptySearch() else @model.update e.target.value

    "click: [data-role='suggest-item']": (e) ->
      @model.setTag
        title: e.target.getAttribute "data-title"
        id: Number(e.target.getAttribute "data-id")

      setTimeout =>
        @input.focus()
      , 20

  render: (state) -> @templateRender state
