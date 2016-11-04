View = require "view.coffee"
template = require "types/image/item"
Render = require "render"

module.exports = View
  debug: true

  initial: ->
    @template = Render template, @contain[0]
    @model.setInput @contain.find("@image")[0]

  render: (state) ->
    if !state.field.settings.hide
      @template state

  events:
    "change: @image": (e) -> @model.setPreview e.target
    "click: @remove": (e) -> @model.removePreview()
