View = require "view.coffee"
template = require "types/image/item.tmpl.js"
Render = require "render.js"

module.exports = View
  debug: true

  initial: ->
    @template = Render template, @contain[0]

  render: (state) ->
    if !state.field.settings.hide
      @template state

  events:
    "change: @image": (e) -> @model.setPreview e.target
    "click: @remove": (e) -> @model.removePreview()
