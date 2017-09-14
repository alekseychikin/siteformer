View = require "libs/view.coffee"
template = require "dist/types/image/item.tmplt"
Render = require "libs/render"

module.exports = class ImageDataView extends View
  constructor: (target, model) ->
    super target, model

    @template = Render template, @contain
    @model.setInput @contain.querySelector "[data-role='image']"

  render: (state) ->
    if !state.settings.hide
      @template state

  events:
    "change: [data-role='image']": (e) -> @model.setPreview e.target
    "click: [data-role='remove']": -> @model.removePreview()
