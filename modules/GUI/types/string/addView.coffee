View = require "view.coffee"
itemTemplate = require "types/string/item"
Render = require "render"

module.exports = View
  initial: -> @itemRender = Render itemTemplate, @contain[0]

  events:
    "input keypress change: [data-role='string']": (e) -> @model.update e.target.value

  render: (state) -> @itemRender state
