View = require "view.coffee"
template = require "types/image/item"
Render = require "render"

module.exports = View
  initial: ->
    @template = Render template, @contain[0]
    @model.setInput @contain.find("[data-role='image']")[0]

  render: (state) ->
    if !state.field.settings.hide
      @template state

  events:
    "change: [data-role='image']": (e) -> @model.setPreview e.target
    "click: [data-role='remove']": -> @model.removePreview()
