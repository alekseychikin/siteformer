View = require "libs/view.coffee"
itemTemplate = require "dist/types/url/item.gutt"
Render = require "libs/render"

module.exports = class UrlDataView extends View
  constructor: (target, model) ->
    super target, model

    @itemRender = Render itemTemplate, @contain

  events:
    "input keypress change: [data-role='url']": (e) -> @model.update e.target.value

  render: (state) -> @itemRender state
