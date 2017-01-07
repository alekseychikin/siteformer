View = require "view.coffee"
itemTemplate = require "types/string/item"
Render = require "render"

module.exports = View
  initial: -> @itemRender = Render itemTemplate, @contain[0]

  events:
    "input keypress change: @string": (e) -> @model.update e.target.value

  render: (state) -> @itemRender state
