Render = require "render"
View = require "view.coffee"
menuTemplate = require "components/menu/menu-items"

module.exports = View
  initial: -> @menuTemplate = Render menuTemplate, @contain[0]
  render: (state) -> @menuTemplate state
