View = require "libs/view.coffee"
itemTemplate = require "dist/types/string/item.gutt"
Render = require "libs/render"

module.exports = class StringDataView extends View
  constructor: (target, model) ->
    super target, model

    @itemRender = Render itemTemplate, @contain

  events:
    "input keypress change: [data-role='string']": (e) -> @model.update e.target.value

  render: (state) -> @itemRender state
