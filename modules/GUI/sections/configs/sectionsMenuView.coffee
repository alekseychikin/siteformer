Render = require "render"
View = require "view.coffee"
menuTemplate = require "components/menu/menu-items"

module.exports = class SectionsMenuView extends View
  constructor: (target, model) ->
    super target, model

    @menuTemplate = Render menuTemplate, @contain[0]

  render: (state) -> @menuTemplate state
