View = require "view.coffee"
itemTemplate = require "types/url/item.tmplt"
Render = require "render"

module.exports = class UrlDataView extends View
  constructor: (target, model) ->
    super target, model

    @itemRender = Render itemTemplate, @contain

  events:
    "input keypress change: [data-role='url']": (e) -> @model.update e.target.value

  render: (state) -> @itemRender state
