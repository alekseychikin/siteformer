View = require "view.coffee"
template = require "types/image/item.tmplt"
Render = require "render"

module.exports = class ImageDataView extends View
  constructor: (target, model) ->
    super target, model

    @template = Render template, @contain
    @model.setInput @contain.querySelector "[data-role='image']"

  render: (state) ->
    if !state.field.settings.hide
      @template state

  events:
    "change: [data-role='image']": (e) -> @model.setPreview e.target
    "click: [data-role='remove']": -> @model.removePreview()
