View = require "view.coffee"
itemTemplate = require "types/url/item"
Render = require "render"

module.exports = View
  initial: -> @itemRender = Render itemTemplate, @contain[0]

  events:
    "input keypress change: [data-role='url']": (e) -> @model.update e.target.value

  render: (state) -> @itemRender state
