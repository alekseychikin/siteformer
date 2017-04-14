Render = require "render"
View = require "view.coffee"
menuTemplate = require "components/menu/menu-items.tmplt"

module.exports = class SectionsMenuView extends View
  constructor: (target, model) ->
    super target, model

    @menuTemplate = Render menuTemplate, @contain

  render: (state) -> @menuTemplate state
